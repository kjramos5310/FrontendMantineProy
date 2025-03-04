// src/services/categoriaService.ts
import { categoria } from '../types/types';
import { fetchAPI } from './api';

export const categoriaService = {
  
  findAll: async (): Promise<categoria[]> => {
    const data = await fetchAPI('/categoria');
    console.log("Datos recibidos desde la API:", data); // 👀 Depuración
    return data.map((item: any) => ({
      id_categoria: item.id_categoria, // Debería ser `id_categoria`, no `id`
      nombre: item.nombre,
      descripcion: item.descripcion,
      fecha_creacion: item.fecha_creacion,
    }));
  },
  
  
  
    
  findOne: async (id: number): Promise<categoria> => {
    return await fetchAPI(`/categoria/${id}`);
  },
  create: async (data: Partial<categoria>): Promise<categoria> => {
    const { nombre, descripcion } = data;
    return await fetchAPI('/categoria', {
      method: 'POST',
      body: JSON.stringify({ nombre, descripcion }),
    });
  },
  update: async (id: number, changes: Partial<categoria>): Promise<categoria> => {
    const { nombre, descripcion } = changes;
    return await fetchAPI(`/categoria/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ nombre, descripcion }),
    });
  },
  remove: async (id: number): Promise<void> => {
    return await fetchAPI(`/categoria/${id}`, {
      method: 'DELETE',
    });
  },
};
