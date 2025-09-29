import { Request, Response } from 'express';
import DiscoverModel from '../models/DiscoverModel';
import { CreateDiscoverDto, IDiscoverResponse, ApiResponse, DiscoverStatus } from '../types/types';
import { AuthenticatedRequest } from '../types/auth';

// POST: crear un descubrimiento
export const createDiscover = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
        // Verificar que el usuario existe
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    // Solo admin puede crear
    if (req.user.role !== 'ADMIN') {
      res.status(403).json({ success: false, message: 'Forbidden: Only admin can create discoveries' });
      return;
    }
    const discoverData: CreateDiscoverDto = req.body;

    const discover = await DiscoverModel.create({
      ...discoverData,
      status: DiscoverStatus.DRAFT,
      publishedDate: new Date()
    });

    const response: ApiResponse<IDiscoverResponse> = {
      success: true,
      data: discover.toJSON() as IDiscoverResponse,
      message: 'Discovery created successfully'
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
export const getDiscovers = async (req: Request, res: Response): Promise<void> => {
  try {
    const discovers = await DiscoverModel.findAll();
    const response: ApiResponse<IDiscoverResponse[]> = {
      success: true,
      data: discovers.map(d => d.toJSON() as IDiscoverResponse),
      message: 'Discoveries fetched successfully'
    };
    res.status(200).json(response);

  } catch (error: any) {
    console.error('Error fetching discoveries:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching discoveries',
      error: error.message
    });
  }
};

// GET ONE: obtener un descubrimiento por ID
export const getDiscoverById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const discover = await DiscoverModel.findByPk(id);

    if (!discover) {
      res.status(404).json({
        success: false,
        message: 'Discovery not found'
      });
      return;
    }

    const response: ApiResponse<IDiscoverResponse> = {
      success: true,
      data: discover.toJSON() as IDiscoverResponse,
      message: 'Discovery fetched successfully'
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
export const deleteDiscover = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try{
        const { id } = req.params;

        if (!req.user) {
            res.status(401).json({ success: false, message: 'Unauthorized'});
            return;
        }

        if (req.user.role !== 'ADMIN') {
            res.status(403).json({ success: false, message: 'Forbidden: Only admin can delete discoveries'});
            return;
        }
        //Buscar el descubrimietno por ID en mySQL
        const discover = await DiscoverModel.findByPk(id);

        if (!discover) {
            res.status(404).json({ success: false, message: 'Discovery not found'});
            return;
        }

        await discover.destroy();

        const response: ApiResponse<null> = {
            success: true,
            data: null,
            message: 'Discovery deleted successfully',
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
export const updateDiscover = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    //Verificamos que el usuario existe
    if(!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized '});
      return;
    }
    //Solo admin puede editar
    if(req.user.role !== 'ADMIN') {
      res.status(403).json({ success: false, message: 'Forbidden: Only admin can update discoveries'})
      return;
    }
    //Buscar el descubrimiento por ID
    const discover = await DiscoverModel.findByPk(id);

    if (!discover) {
      res.status(404).json({ success: false, message: 'Discovery not found'});
      return;
    }

    //Obtener los datos para actualizar del body
    const updateData: Partial<CreateDiscoverDto> = req.body;

    //Actualizar en descubrimiento
    await discover.update(updateData);

    const response: ApiResponse<IDiscoverResponse> = {
      success: true,
      data: discover.toJSON() as IDiscoverResponse,
      message: 'Discovery updated successfully'
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
