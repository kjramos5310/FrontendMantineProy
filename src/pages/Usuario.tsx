import React, { useEffect, useState } from 'react';
import { Button, Modal, TextInput, Table, Notification } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconX, IconCheck } from '@tabler/icons-react';
import { usuarioService } from '../services/usuarioService';
import { Usuario } from '../types/types';

const Usuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [editingUsuario, setEditingUsuario] = useState<Partial<Usuario>>({});
  const [notification, setNotification] = useState<{ message: string; color: string; icon: JSX.Element | null } | null>(null);

  const loadUsuarios = async () => {
    try {
      const data = await usuarioService.findAll();
      setUsuarios(data);
    } catch (error) {
      setNotification({ message: 'Error al cargar los usuarios', color: 'red', icon: <IconX size={20} /> });
    }
  };

  useEffect(() => {
    loadUsuarios();
  }, []);

  const openNew = () => {
    setEditingUsuario({});
    open();
  };

  const saveUsuario = async () => {
    try {
      if (editingUsuario.id) {
        await usuarioService.update(editingUsuario.id, editingUsuario);
        setNotification({ message: 'Usuario actualizado correctamente', color: 'teal', icon: <IconCheck size={20} /> });
      } else {
        await usuarioService.create(editingUsuario);
        setNotification({ message: 'Usuario creado correctamente', color: 'teal', icon: <IconCheck size={20} /> });
      }
      close();
      loadUsuarios();
    } catch (error) {
      setNotification({ message: 'Error al guardar el usuario', color: 'red', icon: <IconX size={20} /> });
    }
  };

  const deleteUsuario = async (usuario: Usuario) => {
    try {
      if (usuario.id) {
        await usuarioService.remove(usuario.id);
        setNotification({ message: 'Usuario eliminado correctamente', color: 'teal', icon: <IconCheck size={20} /> });
        loadUsuarios();
      }
    } catch (error) {
      setNotification({ message: 'Error al eliminar el usuario', color: 'red', icon: <IconX size={20} /> });
    }
  };

  return (
    <div>
      {notification && (
        <Notification icon={notification.icon} color={notification.color}>
          {notification.message}
        </Notification>
      )}
      <h2>Gestión de Usuarios</h2>
      <Button onClick={openNew}>Nuevo Usuario</Button>
      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre Completo</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Estado</th>
            <th>Fecha de Creación</th>
            <th>Última Conexión</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.id}</td>
              <td>{usuario.nombre_completo}</td>
              <td>{usuario.email}</td>
              <td>{usuario.telefono}</td>
              <td>{usuario.estado}</td>
              <td>{usuario.fecha_creacion ? new Date(usuario.fecha_creacion).toLocaleDateString() : ''}</td>
              <td>{usuario.ultima_conexion ? new Date(usuario.ultima_conexion).toLocaleDateString() : ''}</td>
              <td>
                <Button onClick={() => { setEditingUsuario(usuario); open(); }}>Editar</Button>
                <Button color="red" onClick={() => deleteUsuario(usuario)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal opened={opened} onClose={close} title={editingUsuario.id ? 'Editar Usuario' : 'Nuevo Usuario'}>
        <TextInput
          label="Nombre Completo"
          value={editingUsuario.nombre_completo || ''}
          onChange={(e) => setEditingUsuario({ ...editingUsuario, nombre_completo: e.target.value })}
        />
        <TextInput
          label="Email"
          value={editingUsuario.email || ''}
          onChange={(e) => setEditingUsuario({ ...editingUsuario, email: e.target.value })}
        />
        <TextInput
          label="Teléfono"
          value={editingUsuario.telefono || ''}
          onChange={(e) => setEditingUsuario({ ...editingUsuario, telefono: e.target.value })}
        />
        <TextInput
          label="Estado"
          value={editingUsuario.estado || ''}
          onChange={(e) => setEditingUsuario({ ...editingUsuario, estado: e.target.value })}
        />
        <TextInput
          label="Contraseña"
          type="password"
          value={editingUsuario.password || ''}
          onChange={(e) => setEditingUsuario({ ...editingUsuario, password: e.target.value })}
        />
        <Button onClick={saveUsuario} mt="md">Guardar</Button>
      </Modal>
    </div>
  );
};

export default Usuarios;