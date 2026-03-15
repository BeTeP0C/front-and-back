export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface Product {
  id: string;
  title: string;
  category: string;
  description?: string;
  price: number;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface TokensResponse {
  accessToken: string;
  refreshToken: string;
}

export interface CreateProductPayload {
  title: string;
  category: string;
  description?: string;
  price: number;
  image?: string;
}

export interface UpdateProductPayload extends Partial<CreateProductPayload> {}
