// src/services/reporteService.ts
import { Reporte } from '../types/types';
import { fetchAPI } from './api';

export const reporteService = {
  findAll: async (): Promise<Reporte[]> => {
    return await fetchAPI('/reporte');
  },
  findOne: async (id: number): Promise<Reporte> => {
    return await fetchAPI(`/reporte/${id}`);
  },
  create: async (data: Partial<Reporte>): Promise<Reporte> => {
    const { id_empresa, fecha_generacion, tipo, archivo_pdf, id_usuario } = data;
    return await fetchAPI('/reporte', {
      method: 'POST',
      body: JSON.stringify({ id_empresa, fecha_generacion, tipo, archivo_pdf, id_usuario }),
    });
  },
  update: async (id: number, changes: Partial<Reporte>): Promise<Reporte> => {
    return await fetchAPI(`/reporte/${id}`, {
      method: 'PUT',
      body: JSON.stringify(changes),
    });
  },
  remove: async (id: number): Promise<void> => {
    return await fetchAPI(`/reporte/${id}`, {
      method: 'DELETE',
    });
  },
};
