import { Request, Response } from 'express';
import PostModel from '../models/PostModel';
import { AuthenticatedRequest } from '../types/auth';

// POST: crear un descubrimiento
export const createPost = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
        // Verificar que el usuario existe
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    // Solo admin puede crear
    if (req.user.role !== 'ADMIN') {
      res.status(403).json({ success: false, message: 'Forbidden: Only admin can create Descubrimientos' });
      return;
    }
    const discoverData: CreatePostDto = req.body;

    const discover = await PostModel.create({
      ...discoverData,
      status: PostStatus.DRAFT,
      publishedDate: new Date()
    });

    const response: ApiResponse<IPostResponse> = {
      success: true,
      data: discover.toJSON() as IPostResponse,
      message: 'Descubrimiento created successfully'
    };

    res.status(201).json(response);

  } catch (error: any) {
    console.error('Error creating discovery:', error);

    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map((e: any) => e.message);
      res.status(400).json({
        success: false,
        message: 'Validation error',
        error: validationErrors.join(', ')
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating discovery',
      error: error.message
    });
  }
};

// GET: obtener todos los descubrimientos
export const getPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const discovers = await PostModel.findAll();
    const response: ApiResponse<IPostResponse[]> = {
      success: true,
      data: discovers.map(d => d.toJSON() as IPostResponse),
      message: 'Descubrimientos fetched successfully'
    };
    res.status(200).json(response);

  } catch (error: any) {
    console.error('Error fetching Descubrimientos:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching Descubrimientos',
      error: error.message
    });
  }
};

// GET ONE: obtener un descubrimiento por ID
export const getPostById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const discover = await PostModel.findByPk(id);

    if (!discover) {
      res.status(404).json({
        success: false,
        message: 'Descubrimiento not found'
      });
      return;
    }

    const response: ApiResponse<IPostResponse> = {
      success: true,
      data: discover.toJSON() as IPostResponse,
      message: 'Descubrimiento fetched successfully'
    };

    res.status(200).json(response);

  } catch (error: any) {
    console.error('Error fetching discovery:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching discovery',
      error: error.message
    });
  }
};

//DELETE
export const deletePost = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try{
        const { id } = req.params;

        if (!req.user) {
            res.status(401).json({ success: false, message: 'Unauthorized'});
            return;
        }

        if (req.user.role !== 'ADMIN') {
            res.status(403).json({ success: false, message: 'Forbidden: Only admin can delete Descubrimientos'});
            return;
        }
        //Buscar el descubrimietno por ID en mySQL
        const discover = await PostModel.findByPk(id);

        if (!discover) {
            res.status(404).json({ success: false, message: 'Descubrimiento not found'});
            return;
        }

        await discover.destroy();

        const response: ApiResponse<null> = {
            success: true,
            data: null,
            message: 'Descubrimiento deleted successfully',
        };

        res.status(200).json(response);

    } catch (error: any) {
        console.error('Error deleting discovery:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting discovery',
            error: error.message 
        });
    }
};
//PUT
export const updatePost = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    //Verificamos que el usuario existe
    if(!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized '});
      return;
    }
    //Solo admin puede editar
    if(req.user.role !== 'ADMIN') {
      res.status(403).json({ success: false, message: 'Forbidden: Only admin can update Descubrimientos'})
      return;
    }
    //Buscar el descubrimiento por ID
    const discover = await PostModel.findByPk(id);

    if (!discover) {
      res.status(404).json({ success: false, message: 'Descubrimiento not found'});
      return;
    }

    //Obtener los datos para actualizar del body
    const updateData: Partial<CreatePostDto> = req.body;

    //Actualizar en descubrimiento
    await discover.update(updateData);

    const response: ApiResponse<IPostResponse> = {
      success: true,
      data: discover.toJSON() as IPostResponse,
      message: 'Descubrimiento updated successfully'
    };

    res.status(200).json(response);

  } catch (error: any) {
    console.error('Error updating discovery:', error);

    if (error.name === 'SequelizeValidationError') {
      const validationsErrors = error.errors.map((e: any) => e.message);
      res.status(400).json({
        success: false,
        message: 'Validation error',
        error: validationsErrors.join(', ')
      });
      return;
    }
    res.status(500).json({
      success: false,
      message: 'Server error while updating discovery',
      error: error.message
    });
  }


}
