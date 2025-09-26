import { Request, Response } from 'express';
import { DiscoverModel } from '../models/DiscoverModel';
import { CreateDiscoverDto, IDiscoverResponse, ApiResponse, DiscoverStatus } from '../types/types';

// POST: crear un descubrimiento
export const createDiscover = async (req: Request, res: Response): Promise<void> => {
  try {
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