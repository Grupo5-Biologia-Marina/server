export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
  error?: string;
}

export interface CreateDiscoverDto {
  title: string;
  content: string;
  authorId?: string;
  status?: DiscoverStatus | string;
  publishedDate?: Date;
}

export enum DiscoverStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED"
}

export interface DiscoverAttributes {
  id: number;
  title: string;
  content: string;
  status: DiscoverStatus | string;
  publishedDate: Date;
  authorId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IDiscoverResponse {
  id: number | string;
  title: string;
  content: string;
  status: DiscoverStatus | string;
  publishedDate: Date;
  authorId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}