/** Auth API service */
import api from './api';
import { User } from '@/types/user';

export interface LoginRequest {
  phone: string;
  code: string;
}

export interface RegisterRequest {
  phone: string;
  nickname: string;
  code: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export const authService = {
  async sendCode(phone: string) {
    return api.post('/auth/send-code', { phone });
  },

  async login(data: LoginRequest) {
    return api.post<TokenResponse>('/auth/login', data);
  },

  async register(data: RegisterRequest) {
    return api.post<TokenResponse>('/auth/register', data);
  },

  async getCurrentUser() {
    return api.get<User>('/auth/me');
  },
};
