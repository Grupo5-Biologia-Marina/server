export interface PostCreateInput {
  userId: number;
  title: string;
  content: string;
  credits?: string;
  categories?: number[];
  images?: string [];
}

export interface PostOutput {
  id: number;
  userId: number;
  title: string;
  content: string;
  credits?: string;
  categories?: string[];
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  error?: string;
}
