export interface PostCreateInput {
  userId: number;
  content: string;
}

export interface PostOutput {
  id: number;
  userId: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  error?: string;
}