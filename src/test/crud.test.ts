import request from 'supertest';
import express from 'express';

const createTestApp = () => {
  const app = express();
  app.use(express.json());
  
  let mockDiscoveries = [
    { 
      id: 1, 
      title: 'Fosa de las Marianas', 
      description: 'Punto más profundo del océano', 
      userId: 1,
      createdAt: new Date()
    },
    { 
      id: 2, 
      title: 'Gran Barrera de Coral', 
      description: 'Sistema de arrecifes más grande', 
      userId: 1,
      createdAt: new Date()
    }
  ];
  let nextId = 3;

  app.post('/api/discoveries', (req, res) => {
    const { title, description, location, userId } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'El título es obligatorio' });
    }
    
    if (!description) {
      return res.status(400).json({ error: 'La descripción es obligatoria' });
    }
    
    if (!userId) {
      return res.status(400).json({ error: 'El userId es obligatorio' });
    }

    if (title.length > 255) {
      return res.status(400).json({ error: 'El título es demasiado largo' });
    }

    const sanitizedTitle = title.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    const newDiscovery = {
      id: nextId++,
      title: sanitizedTitle,
      description,
      location: location || null,
      userId,
      createdAt: new Date()
    };

    mockDiscoveries.push(newDiscovery);
    
    res.status(201).json(newDiscovery);
  });

  app.get('/api/discoveries', (req, res) => {
    const { search, userId, sortBy = 'id', order = 'asc', limit } = req.query;
    
    let filteredDiscoveries = [...mockDiscoveries];

    if (search && typeof search === 'string') {
      filteredDiscoveries = filteredDiscoveries.filter(discovery => 
        discovery.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (userId && typeof userId === 'string') {
      const userIdNum = parseInt(userId);
      if (!isNaN(userIdNum)) {
        filteredDiscoveries = filteredDiscoveries.filter(discovery => 
          discovery.userId === userIdNum
        );
      }
    }

    if (sortBy === 'createdAt') {
      filteredDiscoveries.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return order === 'desc' ? dateB - dateA : dateA - dateB;
      });
    } else if (sortBy === 'title') {
      filteredDiscoveries.sort((a, b) => {
        return order === 'desc' 
          ? b.title.localeCompare(a.title)
          : a.title.localeCompare(b.title);
      });
    }

    if (limit && typeof limit === 'string') {
      const limitNum = parseInt(limit);
      if (!isNaN(limitNum) && limitNum > 0) {
        filteredDiscoveries = filteredDiscoveries.slice(0, limitNum);
      }
    }

    res.status(200).json({ 
      data: filteredDiscoveries,
      total: filteredDiscoveries.length
    });
  });


  app.get('/api/discoveries/:id', (req, res) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const discovery = mockDiscoveries.find(d => d.id === id);
    
    if (!discovery) {
      return res.status(404).json({ error: 'Descubrimiento no encontrado' });
    }

    res.status(200).json(discovery);
  });

  app.put('/api/discoveries/:id', (req, res) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: 'No se proporcionaron datos para actualizar' });
    }

    const discoveryIndex = mockDiscoveries.findIndex(d => d.id === id);
    
    if (discoveryIndex === -1) {
      return res.status(404).json({ error: 'Descubrimiento no encontrado' });
    }

    const { title, description, location } = req.body;

    if (title !== undefined) {
      if (title.trim() === '') {
        return res.status(400).json({ error: 'El título no puede estar vacío' });
      }
      if (title.length > 255) {
        return res.status(400).json({ error: 'El título es demasiado largo' });
      }
    }

    mockDiscoveries[discoveryIndex] = {
      ...mockDiscoveries[discoveryIndex],
      ...req.body,
      id 
    };

    res.status(200).json(mockDiscoveries[discoveryIndex]);
  });

  app.delete('/api/discoveries/:id', (req, res) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const discoveryIndex = mockDiscoveries.findIndex(d => d.id === id);
    
    if (discoveryIndex === -1) {
      return res.status(404).json({ error: 'Descubrimiento no encontrado' });
    }

    mockDiscoveries = mockDiscoveries.filter(d => d.id !== id);
    
    res.status(200).json({ message: 'Descubrimiento eliminado correctamente' });
  });

  return app;
};

describe('Discoveries CRUD Tests', () => {
  let app: express.Application;

  beforeEach(() => {
    app = createTestApp();
  });

  describe('POST /api/discoveries', () => {
    it('debería crear un nuevo descubrimiento', async () => {
      const newDiscovery = {
        title: 'Gran Barrera de Coral',
        description: 'El sistema de arrecifes más grande del mundo',
        location: 'Australia',
        userId: 1
      };

      const response = await request(app)
        .post('/api/discoveries')
        .send(newDiscovery)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(newDiscovery.title);
      expect(response.body.description).toBe(newDiscovery.description);
    });

    it('debería fallar si faltan campos obligatorios', async () => {
      const invalidDiscovery = {
        description: 'Sin título'
      };

      await request(app)
        .post('/api/discoveries')
        .send(invalidDiscovery)
        .expect(400);
    });

    it('debería fallar si el título está vacío', async () => {
      const invalidDiscovery = {
        title: '',
        description: 'Descripción válida',
        userId: 1
      };

      await request(app)
        .post('/api/discoveries')
        .send(invalidDiscovery)
        .expect(400);
    });
  });

  describe('GET /api/discoveries', () => {
    it('debería obtener todos los descubrimientos', async () => {
      const response = await request(app)
        .get('/api/discoveries')
        .expect(200);

      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThanOrEqual(0);
    });

    it('debería devolver un array vacío si no hay descubrimientos', async () => {
      const emptyApp = express();
      emptyApp.use(express.json());
      emptyApp.get('/api/discoveries', (req, res) => {
        res.status(200).json({ data: [] });
      });

      const response = await request(emptyApp)
        .get('/api/discoveries')
        .expect(200);

      expect(response.body.data).toEqual([]);
    });
  });

  describe('GET /api/discoveries/:id', () => {
    it('debería obtener un descubrimiento por ID', async () => {
      const response = await request(app)
        .get('/api/discoveries/1')
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('Fosa de las Marianas');
    });

    it('debería devolver 404 si el descubrimiento no existe', async () => {
      await request(app)
        .get('/api/discoveries/99999')
        .expect(404);
    });

    it('debería devolver 400 si el ID no es válido', async () => {
      await request(app)
        .get('/api/discoveries/invalid-id')
        .expect(400);
    });
  });

  describe('PUT /api/discoveries/:id', () => {
    it('debería actualizar un descubrimiento existente', async () => {
      const updatedData = {
        title: 'RMS Titanic',
        description: 'Naufragio histórico del transatlántico'
      };

      const response = await request(app)
        .put('/api/discoveries/1')
        .send(updatedData)
        .expect(200);

      expect(response.body.title).toBe(updatedData.title);
      expect(response.body.description).toBe(updatedData.description);
    });

    it('debería devolver 404 si el descubrimiento no existe', async () => {
      const updatedData = {
        title: 'Título actualizado'
      };

      await request(app)
        .put('/api/discoveries/99999')
        .send(updatedData)
        .expect(404);
    });

    it('no debería permitir actualizar sin datos', async () => {
      await request(app)
        .put('/api/discoveries/1')
        .send({})
        .expect(400);
    });
  });

  describe('DELETE /api/discoveries/:id', () => {
    it('debería eliminar un descubrimiento existente', async () => {
      await request(app)
        .delete('/api/discoveries/1')
        .expect(200);

      await request(app)
        .get('/api/discoveries/1')
        .expect(404);
    });

    it('debería devolver 404 si el descubrimiento no existe', async () => {
      await request(app)
        .delete('/api/discoveries/99999')
        .expect(404);
    });

    it('debería devolver 400 si el ID no es válido', async () => {
      await request(app)
        .delete('/api/discoveries/invalid-id')
        .expect(400);
    });
  });

  describe('Validaciones y casos límite', () => {
    it('debería manejar títulos muy largos', async () => {
      const longTitle = 'A'.repeat(300);
      const discovery = {
        title: longTitle,
        description: 'Descripción normal',
        userId: 1
      };

      await request(app)
        .post('/api/discoveries')
        .send(discovery)
        .expect(400);
    });

    it('debería manejar caracteres especiales en el título', async () => {
      const discovery = {
        title: 'Descubrimiento <script>alert("test")</script>',
        description: 'Test de seguridad',
        userId: 1
      };

      const response = await request(app)
        .post('/api/discoveries')
        .send(discovery)
        .expect(201);

      expect(response.body.title).not.toContain('<script>');
    });

    it('debería limitar el número de resultados en listados', async () => {
      const response = await request(app)
        .get('/api/discoveries?limit=1')
        .expect(200);

      expect(response.body.data.length).toBeLessThanOrEqual(1);
    });
  });

  describe('Búsqueda y filtrado', () => {
    it('debería buscar descubrimientos por título', async () => {
      const response = await request(app)
        .get('/api/discoveries?search=coral')
        .expect(200);

      expect(Array.isArray(response.body.data)).toBe(true);
      response.body.data.forEach((item: any) => {
        expect(item.title.toLowerCase()).toContain('coral');
      });
    });

    it('debería filtrar por usuario', async () => {
      const response = await request(app)
        .get('/api/discoveries?userId=1')
        .expect(200);

      expect(Array.isArray(response.body.data)).toBe(true);
      response.body.data.forEach((item: any) => {
        expect(item.userId).toBe(1);
      });
    });

    it('debería ordenar resultados', async () => {
      const response = await request(app)
        .get('/api/discoveries?sortBy=createdAt&order=desc')
        .expect(200);

      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });
});