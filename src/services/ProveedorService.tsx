// src/services/proveedorService.ts
import { Proveedor } from '../types/types';
import { fetchAPI } from './api';

export const proveedorService = {
  findAll: async (): Promise<Proveedor[]> => {
    return await fetchAPI('/proveedor');
  },
  findOne: async (id: number): Promise<Proveedor> => {
    return await fetchAPI(`/proveedor/${id}`);
  },
  create: async (data: Partial<Proveedor>): Promise<Proveedor> => {
    const { nombre, contacto, direccion, telefono, email } = data;
    return await fetchAPI('/proveedor', {
      method: 'POST',
      body: JSON.stringify({ nombre, contacto, direccion, telefono, email }),
    });
  },
  update: async (id: number, changes: Partial<Proveedor>): Promise<Proveedor> => {
    return await fetchAPI(`/proveedor/${id}`, {
      method: 'PUT',
      body: JSON.stringify(changes),
    });
  },
  remove: async (id: number): Promise<void> => {
    return await fetchAPI(`/proveedor/${id}`, {
      method: 'DELETE',
    });
  },
};
