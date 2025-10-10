// src/controllers/CategoryController.ts
import { Request, Response } from 'express';
import CategoryModel from '../models/CategoryModel';
import { AuthenticatedRequest } from '../types/auth';
import { ApiResponse } from '../types/posts';

// GET: obtener todas las categorías
export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await CategoryModel.findAll();
    const response: ApiResponse<CategoryModel[]> = {
      success: true,
      data: categories,
      message: 'Categories fetched successfully'
    };
    res.status(200).json(response);
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching categories',
      error: error.message
    });
  }
};

// POST: crear una categoría
export const createCategory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    if (req.user.role !== 'ADMIN') {
      res.status(403).json({ success: false, message: 'Forbidden: Only admin can create categories' });
      return;
    }

    const { name, description } = req.body;

    const category = await CategoryModel.create({ name, description });

    const response: ApiResponse<CategoryModel> = {
      success: true,
      data: category,
      message: 'Category created successfully'
    };

    res.status(201).json(response);

  } catch (error: any) {
    console.error('Error creating category:', error);

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
      message: 'Server error while creating category',
      error: error.message
    });
  }
};

// PUT: actualizar categoría
export const updateCategory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    if (req.user.role !== 'ADMIN') {
      res.status(403).json({ success: false, message: 'Forbidden: Only admin can update categories' });
      return;
    }

    const { id } = req.params;
    const { name, description } = req.body;

    const category = await CategoryModel.findByPk(id);

    if (!category) {
      res.status(404).json({ success: false, message: 'Category not found' });
      return;
    }

    await category.update({ name, description });

    const response: ApiResponse<CategoryModel> = {
      success: true,
      data: category,
      message: 'Category updated successfully'
    };

    res.status(200).json(response);

  } catch (error: any) {
    console.error('Error updating category:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating category',
      error: error.message
    });
  }
};

// DELETE: eliminar categoría
export const deleteCategory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    if (req.user.role !== 'ADMIN') {
      res.status(403).json({ success: false, message: 'Forbidden: Only admin can delete categories' });
      return;
    }

    const { id } = req.params;

    const category = await CategoryModel.findByPk(id);

    if (!category) {
      res.status(404).json({ success: false, message: 'Category not found' });
      return;
    }

    await category.destroy();

    const response: ApiResponse<null> = {
      success: true,
      data: null,
      message: 'Category deleted successfully'
    };

    res.status(200).json(response);

  } catch (error: any) {
    console.error('Error deleting category:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting category',
      error: error.message
    });
  }
};
