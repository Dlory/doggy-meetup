/** Dog API service */
import api from './api';
import { Dog, DogCreate, DogUpdate } from '@/types/dog';

export const dogsService = {
  async getMyDogs() {
    return api.get<Dog[]>('/dogs');
  },

  async getDog(id: string) {
    return api.get<Dog>(`/dogs/${id}`);
  },

  async createDog(data: DogCreate) {
    return api.post<Dog>('/dogs', data);
  },

  async updateDog(id: string, data: DogUpdate) {
    return api.put<Dog>(`/dogs/${id}`, data);
  },

  async deleteDog(id: string) {
    return api.delete(`/dogs/${id}`);
  },
};
