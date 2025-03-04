// src/services/usuarioService.ts
import { Usuario } from '../types/types';
import { fetchAPI } from './api';

export const usuarioService = {
  findAll: async (): Promise<Usuario[]> => {
    return await fetchAPI('/usuario');
  },
  findOne: async (id: number): Promise<Usuario> => {
    return await fetchAPI(`/usuario/${id}`);
  },
  create: async (data: Partial<Usuario>): Promise<Usuario> => {
    const { nombre_completo, email, telefono, estado, password, password_hash, id_empresa } = data;
    return await fetchAPI('/usuario', {
      method: 'POST',
      body: JSON.stringify({ nombre_completo, email, telefono, estado, password, password_hash, id_empresa }),
    });
  },
  update: async (id: number, changes: Partial<Usuario>): Promise<Usuario> => {
    const { nombre_completo, email, telefono, estado, password, password_hash, id_empresa } = changes;
    return await fetchAPI(`/usuario/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ nombre_completo, email, telefono, estado, password, password_hash, id_empresa }),
    });
  },
  remove: async (id: number): Promise<void> => {
    return await fetchAPI(`/usuario/${id}`, {
      method: 'DELETE',
    });
  },
};
