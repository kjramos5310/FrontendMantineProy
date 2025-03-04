// src/services/pedidoService.ts
import { Pedido } from '../types/types';
import { fetchAPI } from './api';

export const pedidoService = {
  findAll: async (): Promise<Pedido[]> => {
    return await fetchAPI('/pedido');
  },
  findOne: async (id: number): Promise<Pedido> => {
    return await fetchAPI(`/pedido/${id}`);
  },
  create: async (data: Partial<Pedido>): Promise<Pedido> => {
    const { id_empresa, fecha_solicitud, fecha_entrega, estado, detalles } = data;
    return await fetchAPI('/pedido', {
      method: 'POST',
      body: JSON.stringify({ id_empresa, fecha_solicitud, fecha_entrega, estado, detalles }),
    });
  },
  update: async (id: number, changes: Partial<Pedido>): Promise<Pedido> => {
    const { id_empresa, fecha_solicitud, fecha_entrega, estado, detalles } = changes;
    return await fetchAPI(`/pedido/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ id_empresa, fecha_solicitud, fecha_entrega, estado, detalles }),
    });
  },
  remove: async (id: number): Promise<void> => {
    return await fetchAPI(`/pedido/${id}`, {
      method: 'DELETE',
    });
  },
};
