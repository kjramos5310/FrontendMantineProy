import React, { useEffect, useState } from 'react';
import { Button, Modal, TextInput, Table, Notification } from '@mantine/core';
import { JSX } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { IconX, IconCheck } from '@tabler/icons-react';
import { categoriaService } from '../services/CategoriaService';
import { categoria } from '../types/types';

const Categorias: React.FC = () => {
  const [categorias, setCategorias] = useState<categoria[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [editingCategoria, setEditingCategoria] = useState<Partial<categoria>>({});
  const [notification, setNotification] = useState<{ message: string; color: string; icon: JSX.Element | null } | null>(null);

  const loadCategorias = async () => {
    try {
      const data = await categoriaService.findAll();
      setCategorias(data);
    } catch (error) {
      setNotification({ message: 'Error al cargar las categorías', color: 'red', icon: <IconX size={20} /> });
    }
  };

  useEffect(() => {
    loadCategorias();
  }, []);

  const openNew = () => {
    setEditingCategoria({});
    open();
  };

  const saveCategoria = async () => {
    try {
      if (editingCategoria.id_categoria) {
        await categoriaService.update(editingCategoria.id_categoria, editingCategoria);
        setNotification({ message: 'Categoría actualizada correctamente', color: 'teal', icon: <IconCheck size={20} /> });
      } else {
        await categoriaService.create(editingCategoria);
        setNotification({ message: 'Categoría creada correctamente', color: 'teal', icon: <IconCheck size={20} /> });
      }
      close();
      loadCategorias();
    } catch (error) {
      setNotification({ message: 'Error al guardar la categoría', color: 'red', icon: <IconX size={20} /> });
    }
  };

  const deleteCategoria = async (categoria: categoria) => {
    try {
      if (categoria.id_categoria) {
        console.log("Eliminando categoría con ID:", categoria.id_categoria);
        await categoriaService.remove(categoria.id_categoria);

        setNotification({ message: 'Categoría eliminada correctamente', color: 'teal', icon: <IconCheck size={20} /> });
        loadCategorias(); // Recargar la lista de categorías
      } else {
        setNotification({ message: 'ID de categoría no válido', color: 'red', icon: <IconX size={20} /> });
      }
    } catch (error) {
      console.error("Error al eliminar la categoría:", error);
      setNotification({ message: 'Error al eliminar la categoría', color: 'red', icon: <IconX size={20} /> });
    }
  };

  return (
    <div>
      {notification && <Notification icon={notification.icon} color={notification.color}>{notification.message}</Notification>}
      <h2>Gestión de Categorías</h2>
      <Button onClick={openNew}>Nueva Categoría</Button>
      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Fecha de Creación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map((categoria) => (
            <tr key={categoria.id_categoria}>
              <td>{categoria.id_categoria}</td>
              <td>{categoria.nombre}</td>
              <td>{categoria.descripcion}</td>
              <td>{categoria.fecha_creacion ? new Date(categoria.fecha_creacion).toLocaleDateString() : ''}</td>
              <td>
                <Button onClick={() => { setEditingCategoria(categoria); open(); }}>Editar</Button>
                <Button color="red" onClick={() => deleteCategoria(categoria)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal opened={opened} onClose={close} title={editingCategoria.id_categoria ? 'Editar Categoría' : 'Nueva Categoría'}>
        <TextInput
          label="Nombre"
          value={editingCategoria.nombre || ''}
          onChange={(e) => setEditingCategoria({ ...editingCategoria, nombre: e.target.value })}
        />
        <TextInput
          label="Descripción"
          value={editingCategoria.descripcion || ''}
          onChange={(e) => setEditingCategoria({ ...editingCategoria, descripcion: e.target.value })}
        />
        <Button onClick={saveCategoria} mt="md">Guardar</Button>
      </Modal>
    </div>
  );
};

export default Categorias;
