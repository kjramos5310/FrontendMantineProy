import React, { useEffect, useState } from 'react';
import { Button, Modal, TextInput, Table, Notification } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconX, IconCheck } from '@tabler/icons-react';
import { movimientoInventarioService } from '../services/movimientoInventarioService';
import { MovimientoInventario } from '../types/types';

const MovimientosInventario: React.FC = () => {
  const [movimientos, setMovimientos] = useState<MovimientoInventario[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [editingMovimiento, setEditingMovimiento] = useState<Partial<MovimientoInventario>>({});
  const [notification, setNotification] = useState<{ message: string; color: string; icon: JSX.Element | null } | null>(null);

  const loadMovimientos = async () => {
    try {
      const data = await movimientoInventarioService.findAll();
      setMovimientos(data);
    } catch (error) {
      setNotification({ message: 'Error al cargar los movimientos', color: 'red', icon: <IconX size={20} /> });
    }
  };

  useEffect(() => {
    loadMovimientos();
  }, []);

  const openNew = () => {
    setEditingMovimiento({});
    open();
  };

  const saveMovimiento = async () => {
    try {
      if (editingMovimiento.id) {
        await movimientoInventarioService.update(editingMovimiento.id, editingMovimiento);
        setNotification({ message: 'Movimiento actualizado correctamente', color: 'teal', icon: <IconCheck size={20} /> });
      } else {
        await movimientoInventarioService.create(editingMovimiento);
        setNotification({ message: 'Movimiento creado correctamente', color: 'teal', icon: <IconCheck size={20} /> });
      }
      close();
      loadMovimientos();
    } catch (error) {
      setNotification({ message: 'Error al guardar el movimiento', color: 'red', icon: <IconX size={20} /> });
    }
  };

  const deleteMovimiento = async (movimiento: MovimientoInventario) => {
    try {
      if (movimiento.id) {
        await movimientoInventarioService.remove(movimiento.id);
        setNotification({ message: 'Movimiento eliminado correctamente', color: 'teal', icon: <IconCheck size={20} /> });
        loadMovimientos();
      }
    } catch (error) {
      setNotification({ message: 'Error al eliminar el movimiento', color: 'red', icon: <IconX size={20} /> });
    }
  };

  return (
    <div>
      {notification && (
        <Notification icon={notification.icon} color={notification.color}>
          {notification.message}
        </Notification>
      )}
      <h2>Gestión de Movimientos de Inventario</h2>
      <Button onClick={openNew}>Nuevo Movimiento</Button>
      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>ID Producto</th>
            <th>Tipo Movimiento</th>
            <th>Cantidad</th>
            <th>Fecha Movimiento</th>
            <th>Motivo</th>
            <th>ID Usuario</th>
            <th>Costo Unitario</th>
            <th>Ubicación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {movimientos.map((movimiento) => (
            <tr key={movimiento.id}>
              <td>{movimiento.id}</td>
              <td>{movimiento.id_producto}</td>
              <td>{movimiento.tipo_movimiento}</td>
              <td>{movimiento.cantidad}</td>
              <td>{movimiento.fechaMovimiento ? new Date(movimiento.fechaMovimiento).toLocaleDateString() : ''}</td>
              <td>{movimiento.motivo}</td>
              <td>{movimiento.id_usuario}</td>
              <td>{movimiento.costo_unitario}</td>
              <td>{movimiento.ubicacion}</td>
              <td>
                <Button onClick={() => { setEditingMovimiento(movimiento); open(); }}>Editar</Button>
                <Button color="red" onClick={() => deleteMovimiento(movimiento)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal opened={opened} onClose={close} title={editingMovimiento.id ? 'Editar Movimiento' : 'Nuevo Movimiento'}>
        <TextInput
          label="Tipo de Movimiento"
          value={editingMovimiento.tipo_movimiento || ''}
          onChange={(e) => setEditingMovimiento({ ...editingMovimiento, tipo_movimiento: e.target.value })}
        />
        <TextInput
          label="Cantidad"
          type="number"
          value={editingMovimiento.cantidad?.toString() || ''}
          onChange={(e) => setEditingMovimiento({ ...editingMovimiento, cantidad: Number(e.target.value) })}
        />
        <TextInput
          label="Motivo"
          value={editingMovimiento.motivo || ''}
          onChange={(e) => setEditingMovimiento({ ...editingMovimiento, motivo: e.target.value })}
        />
        <Button onClick={saveMovimiento} mt="md">Guardar</Button>
      </Modal>
    </div>
  );
};

export default MovimientosInventario;