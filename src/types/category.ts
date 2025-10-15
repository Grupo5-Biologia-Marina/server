import CategoryModel from '../models/CategoryModel';

export interface CategoryApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  error?: string;
}