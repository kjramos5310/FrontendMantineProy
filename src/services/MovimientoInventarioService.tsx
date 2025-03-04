// src/services/movimientoInventarioService.ts
import { MovimientoInventario } from '../types/types';
import { fetchAPI } from './api';

export const movimientoInventarioService = {
  findAll: async (): Promise<MovimientoInventario[]> => {
    return await fetchAPI('/movimiento-inventario');
  },
  findOne: async (id: number): Promise<MovimientoInventario> => {
    return await fetchAPI(`/movimiento-inventario/${id}`);
  },
  create: async (data: Partial<MovimientoInventario>): Promise<MovimientoInventario> => {
    return await fetchAPI('/movimiento-inventario', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  update: async (id: number, changes: Partial<MovimientoInventario>): Promise<MovimientoInventario> => {
    return await fetchAPI(`/movimiento-inventario/${id}`, {
      method: 'PUT',
      body: JSON.stringify(changes),
    });
  },
  remove: async (id: number): Promise<void> => {
    return await fetchAPI(`/movimiento-inventario/${id}`, {
      method: 'DELETE',
    });
  },
};
