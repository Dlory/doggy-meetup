/** Common types */
export interface ApiResponse<T> {
  data: T;
}

export interface ApiError {
  error: string;
  detail?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
