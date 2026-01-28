/** Dog store with Zustand */
import { create } from 'zustand';
import { Dog, DogCreate, DogUpdate } from '@/types/dog';
import { dogsService } from '@/services/dogs';

interface DogState {
  dogs: Dog[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchDogs: () => Promise<void>;
  createDog: (data: DogCreate) => Promise<void>;
  updateDog: (id: string, data: DogUpdate) => Promise<void>;
  deleteDog: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useDogStore = create<DogState>()((set, get) => ({
  dogs: [],
  loading: false,
  error: null,

  fetchDogs: async () => {
    set({ loading: true, error: null });
    try {
      const res = await dogsService.getMyDogs();
      set({ dogs: res.data, loading: false });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch dogs',
      });
    }
  },

  createDog: async (data: DogCreate) => {
    set({ loading: true, error: null });
    try {
      await dogsService.createDog(data);
      await get().fetchDogs();
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to create dog',
      });
      throw error;
    }
  },

  updateDog: async (id: string, data: DogUpdate) => {
    set({ loading: true, error: null });
    try {
      await dogsService.updateDog(id, data);
      await get().fetchDogs();
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to update dog',
      });
      throw error;
    }
  },

  deleteDog: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await dogsService.deleteDog(id);
      await get().fetchDogs();
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to delete dog',
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
