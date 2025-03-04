import React, { useEffect, useState } from 'react';
import { Button, Modal, TextInput, Table, Notification } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconX, IconCheck } from '@tabler/icons-react';
import { rolService } from '../services/rolService';
import { Rol } from '../types/types';

const Roles: React.FC = () => {
  const [roles, setRoles] = useState<Rol[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [editingRol, setEditingRol] = useState<Partial<Rol>>({});
  const [notification, setNotification] = useState<{ message: string; color: string; icon: JSX.Element | null } | null>(null);

  const loadRoles = async () => {
    try {
      const data = await rolService.findAll();
      setRoles(data);
    } catch (error) {
      setNotification({ message: 'Error al cargar los roles', color: 'red', icon: <IconX size={20} /> });
    }
  };

  useEffect(() => {
    loadRoles();
  }, []);

  const openNew = () => {
    setEditingRol({});
    open();
  };

  const saveRol = async () => {
    try {
      if (editingRol.id) {
        await rolService.update(editingRol.id, editingRol);
        setNotification({ message: 'Rol actualizado correctamente', color: 'teal', icon: <IconCheck size={20} /> });
      } else {
        await rolService.create(editingRol);
        setNotification({ message: 'Rol creado correctamente', color: 'teal', icon: <IconCheck size={20} /> });
      }
      close();
      loadRoles();
    } catch (error) {
      setNotification({ message: 'Error al guardar el rol', color: 'red', icon: <IconX size={20} /> });
    }
  };

  const deleteRol = async (rol: Rol) => {
    try {
      if (rol.id) {
        await rolService.remove(rol.id);
        setNotification({ message: 'Rol eliminado correctamente', color: 'teal', icon: <IconCheck size={20} /> });
        loadRoles();
      }
    } catch (error) {
      setNotification({ message: 'Error al eliminar el rol', color: 'red', icon: <IconX size={20} /> });
    }
  };

  return (
    <div>
      {notification && (
        <Notification icon={notification.icon} color={notification.color}>
          {notification.message}
        </Notification>
      )}
      <h2>Gestión de Roles</h2>
      <Button onClick={openNew}>Nuevo Rol</Button>
      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((rol) => (
            <tr key={rol.id}>
              <td>{rol.id}</td>
              <td>{rol.nombre}</td>
              <td>{rol.descripcion}</td>
              <td>
                <Button onClick={() => { setEditingRol(rol); open(); }}>Editar</Button>
                <Button color="red" onClick={() => deleteRol(rol)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal opened={opened} onClose={close} title={editingRol.id ? 'Editar Rol' : 'Nuevo Rol'}>
        <TextInput
          label="Nombre"
          value={editingRol.nombre || ''}
          onChange={(e) => setEditingRol({ ...editingRol, nombre: e.target.value })}
        />
        <TextInput
          label="Descripción"
          value={editingRol.descripcion || ''}
          onChange={(e) => setEditingRol({ ...editingRol, descripcion: e.target.value })}
        />
        <Button onClick={saveRol} mt="md">Guardar</Button>
      </Modal>
    </div>
  );
};

export default Roles;