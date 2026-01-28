/** Local storage utilities */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types/user';

const KEYS = {
  ACCESS_TOKEN: 'access_token',
  USER: 'user',
};

export const storage = {
  async getToken(): Promise<string | null> {
    return AsyncStorage.getItem(KEYS.ACCESS_TOKEN);
  },

  async setToken(token: string): Promise<void> {
    await AsyncStorage.setItem(KEYS.ACCESS_TOKEN, token);
  },

  async removeToken(): Promise<void> {
    await AsyncStorage.removeItem(KEYS.ACCESS_TOKEN);
  },

  async getUser(): Promise<User | null> {
    const data = await AsyncStorage.getItem(KEYS.USER);
    return data ? JSON.parse(data) : null;
  },

  async setUser(user: User): Promise<void> {
    await AsyncStorage.setItem(KEYS.USER, JSON.stringify(user));
  },

  async removeUser(): Promise<void> {
    await AsyncStorage.removeItem(KEYS.USER);
  },

  async clear(): Promise<void> {
    await AsyncStorage.multiRemove([KEYS.ACCESS_TOKEN, KEYS.USER]);
  },
};
