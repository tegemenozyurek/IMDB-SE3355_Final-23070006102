export interface User {
  id: number;
  username: string;
  email: string;
  name?: string;
  surname?: string;
  country?: string;
  city?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  surname: string;
  email: string;
  password: string;
  repassword: string;
  country: string;
  city: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Country {
  code: string;
  name: string;
  cities: string[];
} 