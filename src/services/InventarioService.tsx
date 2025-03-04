// src/services/inventarioService.ts
import { inventario } from '../types/types';
import { fetchAPI } from './api';

export const inventarioService = {
  findAll: async (): Promise<inventario[]> => {
    return await fetchAPI('/inventario');
  },
  findOne: async (id: number): Promise<inventario> => {
    return await fetchAPI(`/inventario/${id}`);
  },
  create: async (data: Partial<inventario>): Promise<inventario> => {
    const { id_empresa, fechaActualizacion } = data;
    return await fetchAPI('/inventario', {
      method: 'POST',
      body: JSON.stringify({ id_empresa, fechaActualizacion }),
    });
  },
  update: async (id: number, changes: Partial<inventario>): Promise<inventario> => {
    const { id_empresa, fechaActualizacion } = changes;
    return await fetchAPI(`/inventario/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ id_empresa, fechaActualizacion }),
    });
  },
  remove: async (id: number): Promise<void> => {
    return await fetchAPI(`/inventario/${id}`, {
      method: 'DELETE',
    });
  },
};
