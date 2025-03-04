import React, { useEffect, useState } from 'react';
import { Button, Modal, TextInput, Table, Notification, NumberInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconX, IconCheck } from '@tabler/icons-react';
import { detallePedidoService } from '../services/detallePedidoService';
import { DetallePedido } from '../types/types';

const DetallePedidos: React.FC = () => {
  const [detalles, setDetalles] = useState<DetallePedido[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [editingDetalle, setEditingDetalle] = useState<Partial<DetallePedido>>({});
  const [notification, setNotification] = useState<{ message: string; color: string; icon: JSX.Element | null } | null>(null);

  const loadDetalles = async () => {
    try {
      const data = await detallePedidoService.findAll();
      setDetalles(data);
    } catch (error) {
      setNotification({ message: 'Error al cargar los detalles de pedido', color: 'red', icon: <IconX size={20} /> });
    }
  };

  useEffect(() => {
    loadDetalles();
  }, []);

  const openNew = () => {
    setEditingDetalle({});
    open();
  };

  const saveDetalle = async () => {
    try {
      if (editingDetalle.id) {
        await detallePedidoService.update(editingDetalle.id, editingDetalle);
        setNotification({ message: 'Detalle de pedido actualizado correctamente', color: 'teal', icon: <IconCheck size={20} /> });
      } else {
        await detallePedidoService.create(editingDetalle);
        setNotification({ message: 'Detalle de pedido creado correctamente', color: 'teal', icon: <IconCheck size={20} /> });
      }
      close();
      loadDetalles();
    } catch (error) {
      setNotification({ message: 'Error al guardar el detalle de pedido', color: 'red', icon: <IconX size={20} /> });
    }
  };

  const deleteDetalle = async (detalle: DetallePedido) => {
    try {
      if (detalle.id) {
        await detallePedidoService.remove(detalle.id);
        setNotification({ message: 'Detalle de pedido eliminado correctamente', color: 'teal', icon: <IconCheck size={20} /> });
        loadDetalles();
      }
    } catch (error) {
      setNotification({ message: 'Error al eliminar el detalle de pedido', color: 'red', icon: <IconX size={20} /> });
    }
  };

  return (
    <div>
      {notification && (
        <Notification icon={notification.icon} color={notification.color}>
          {notification.message}
        </Notification>
      )}
      <h2>Gestión de Detalles de Pedido</h2>
      <Button onClick={openNew}>Nuevo Detalle</Button>
      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>ID Pedido</th>
            <th>ID Producto</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {detalles.map((detalle) => (
            <tr key={detalle.id}>
              <td>{detalle.id}</td>
              <td>{detalle.id_pedido}</td>
              <td>{detalle.id_producto}</td>
              <td>{detalle.cantidad}</td>
              <td>{detalle.preciounitario}</td>
              <td>
                <Button onClick={() => { setEditingDetalle(detalle); open(); }}>Editar</Button>
                <Button color="red" onClick={() => deleteDetalle(detalle)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal opened={opened} onClose={close} title={editingDetalle.id ? 'Editar Detalle' : 'Nuevo Detalle'}>
        <NumberInput
          label="ID Pedido"
          value={editingDetalle.id_pedido || 0}
          onChange={(value) => setEditingDetalle({ ...editingDetalle, id_pedido: value ?? 0 })}
          required
        />
        <NumberInput
          label="ID Producto"
          value={editingDetalle.id_producto || 0}
          onChange={(value) => setEditingDetalle({ ...editingDetalle, id_producto: value ?? 0 })}
          required
        />
        <NumberInput
          label="Cantidad"
          value={editingDetalle.cantidad || 0}
          onChange={(value) => setEditingDetalle({ ...editingDetalle, cantidad: value ?? 0 })}
          required
        />
        <NumberInput
          label="Precio Unitario"
          value={editingDetalle.preciounitario || 0}
          onChange={(value) => setEditingDetalle({ ...editingDetalle, preciounitario: value ?? 0 })}
          precision={2}
          formatter={(value) => `$ ${value}`}
          parser={(value) => value?.replace(/\$\s?|(,*)/g, '') || ''}
        />
        <Button onClick={saveDetalle} mt="md">Guardar</Button>
      </Modal>
    </div>
  );
};

export default DetallePedidos;