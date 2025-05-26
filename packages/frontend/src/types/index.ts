export interface Shop {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  average_rating: number;
  brands: string[];
  description: string;
}

export interface Review {
  id: number;
  shop_id: number;
  user_name: string;
  rating: number;
  comment: string;
  brands: string[];
  description: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  expires_at: string;
} 