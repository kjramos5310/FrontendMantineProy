// src/services/empresaService.ts
import { empresa } from '../types/types';
import { fetchAPI } from './api';

export const empresaService = {
  findAll: async (): Promise<empresa[]> => {
    return await fetchAPI('/empresa');
  },
  findOne: async (id: number): Promise<empresa> => {
    return await fetchAPI(`/empresa/${id}`);
  },
  create: async (data: Partial<empresa>): Promise<empresa> => {
    return await fetchAPI('/empresa', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  update: async (id: number, changes: Partial<empresa>): Promise<empresa> => {
    return await fetchAPI(`/empresa/${id}`, {
      method: 'PUT',
      body: JSON.stringify(changes),
    });
  },
  remove: async (id: number): Promise<void> => {
    return await fetchAPI(`/empresa/${id}`, {
      method: 'DELETE',
    });
  },
};
