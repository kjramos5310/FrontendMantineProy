// src/services/productoService.ts
import { producto } from '../types/types';
import { fetchAPI } from './api';

export const productoService = {
  findAll: async (): Promise<Producto[]> => {
    return await fetchAPI('/producto');
  },
  findOne: async (id: number): Promise<Producto> => {
    return await fetchAPI(`/producto/${id}`);
  },
  create: async (data: Partial<Producto>): Promise<Producto> => {
    return await fetchAPI('/producto', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  update: async (id: number, changes: Partial<Producto>): Promise<Producto> => {
    return await fetchAPI(`/producto/${id}`, {
      method: 'PUT',
      body: JSON.stringify(changes),
    });
  },
  remove: async (id: number): Promise<void> => {
    return await fetchAPI(`/producto/${id}`, {
      method: 'DELETE',
    });
  },
};
