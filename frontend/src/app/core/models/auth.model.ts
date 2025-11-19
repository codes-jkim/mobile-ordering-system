export interface AuthResponse {
  _id: string;
  username: string;
  email: string;
  password: string;
  token: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
}
