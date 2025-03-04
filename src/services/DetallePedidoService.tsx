// src/services/detallePedidoService.ts
import { DetallePedido } from '../types/types';
import { fetchAPI } from './api';

export const detallePedidoService = {
  findAll: async (): Promise<DetallePedido[]> => {
    return await fetchAPI('/detalle_pedido');
  },
  findOne: async (id: number): Promise<DetallePedido> => {
    return await fetchAPI(`/detalle_pedido/${id}`);
  },
  create: async (data: Partial<DetallePedido>): Promise<DetallePedido> => {
    const { id_pedido, id_producto, cantidad, preciounitario } = data;
    return await fetchAPI('/detalle_pedido', {
      method: 'POST',
      body: JSON.stringify({ id_pedido, id_producto, cantidad, preciounitario }),
    });
  },
  update: async (id: number, changes: Partial<DetallePedido>): Promise<DetallePedido> => {
    const { id_pedido, id_producto, cantidad, preciounitario } = changes;
    return await fetchAPI(`/detalle_pedido/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ id_pedido, id_producto, cantidad, preciounitario }),
    });
  },
  remove: async (id: number): Promise<void> => {
    return await fetchAPI(`/detalle_pedido/${id}`, {
      method: 'DELETE',
    });
  },
};
