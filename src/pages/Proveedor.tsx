import React, { useEffect, useState, JSX } from 'react';
import { Button, Modal, TextInput, Table, Notification } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconX, IconCheck } from '@tabler/icons-react';
import { proveedorService } from '../services/ProveedorService';
import { proveedor } from '../types/types';

const Proveedores: React.FC = () => {
  // El type espera "id", pero el backend retorna "id_proveedor". 
  // Se hará un mapeo para convertir "id_proveedor" a "id".
  const [proveedores, setProveedores] = useState<proveedor[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [editingProveedor, setEditingProveedor] = useState<Partial<proveedor>>({});
  const [notification, setNotification] = useState<{ message: string; color: string; icon: JSX.Element | null } | null>(null);

  const loadProveedores = async () => {
    try {
      const data = await proveedorService.findAll();
      // Se mapea cada objeto para asignar el valor de id_proveedor a id
      const mappedData = data.map((prov: any) => ({
        ...prov,
        id: prov.id_proveedor || prov.id,
      }));
      setProveedores(mappedData);
    } catch (error) {
      setNotification({
        message: 'Error al cargar los proveedores',
        color: 'red',
        icon: <IconX size={20} />,
      });
    }
  };

  useEffect(() => {
    loadProveedores();
  }, []);

  const openNew = () => {
    setEditingProveedor({});
    open();
  };

  const saveProveedor = async () => {
    try {
      if (editingProveedor.id) {
        // Actualización: usa el id que ya viene mapeado
        await proveedorService.update(editingProveedor.id, editingProveedor);
        setNotification({
          message: 'Proveedor actualizado correctamente',
          color: 'teal',
          icon: <IconCheck size={20} />,
        });
      } else {
        // Creación: asigna fecha de creación y crea el proveedor
        const newProveedor = {
          ...editingProveedor,
          fecha_creacion: new Date().toISOString(),
        };
        await proveedorService.create(newProveedor);
        setNotification({
          message: 'Proveedor creado correctamente',
          color: 'teal',
          icon: <IconCheck size={20} />,
        });
      }
      close();
      loadProveedores();
    } catch (error) {
      setNotification({
        message: 'Error al guardar el proveedor',
        color: 'red',
        icon: <IconX size={20} />,
      });
    }
  };

  const deleteProveedor = async (prov: proveedor) => {
    try {
      if (prov.id) {
        await proveedorService.remove(prov.id);
        setNotification({
          message: 'Proveedor eliminado correctamente',
          color: 'teal',
          icon: <IconCheck size={20} />,
        });
        loadProveedores();
      } else {
        setNotification({
          message: 'ID de proveedor no válido',
          color: 'red',
          icon: <IconX size={20} />,
        });
      }
    } catch (error) {
      console.error("Error al eliminar proveedor:", error);
      setNotification({
        message: 'Error al eliminar el proveedor',
        color: 'red',
        icon: <IconX size={20} />,
      });
    }
  };

  return (
    <div>
      {notification && (
        <Notification icon={notification.icon} color={notification.color}>
          {notification.message}
        </Notification>
      )}
      <h2>Gestión de Proveedores</h2>
      <Button onClick={openNew}>Nuevo Proveedor</Button>
      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Contacto</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Fecha de Creación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {proveedores.map((prov, index) => (
            <tr key={prov.id ? prov.id : index}>
              <td>{prov.id}</td>
              <td>{prov.nombre}</td>
              <td>{prov.contacto}</td>
              <td>{prov.direccion}</td>
              <td>{prov.telefono}</td>
              <td>{prov.email}</td>
              <td>
                {prov.fecha_creacion ? new Date(prov.fecha_creacion).toLocaleDateString() : ''}
              </td>
              <td>
                <Button onClick={() => { setEditingProveedor(prov); open(); }}>
                  Editar
                </Button>
                <Button color="red" onClick={() => deleteProveedor(prov)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal opened={opened} onClose={close} title={editingProveedor.id ? 'Editar Proveedor' : 'Nuevo Proveedor'}>
        <TextInput
          label="Nombre"
          value={editingProveedor.nombre || ''}
          onChange={(e) => setEditingProveedor({ ...editingProveedor, nombre: e.target.value })}
        />
        <TextInput
          label="Contacto"
          value={editingProveedor.contacto || ''}
          onChange={(e) => setEditingProveedor({ ...editingProveedor, contacto: e.target.value })}
        />
        <TextInput
          label="Dirección"
          value={editingProveedor.direccion || ''}
          onChange={(e) => setEditingProveedor({ ...editingProveedor, direccion: e.target.value })}
        />
        <TextInput
          label="Teléfono"
          value={editingProveedor.telefono || ''}
          onChange={(e) => setEditingProveedor({ ...editingProveedor, telefono: e.target.value })}
        />
        <TextInput
          label="Email"
          value={editingProveedor.email || ''}
          onChange={(e) => setEditingProveedor({ ...editingProveedor, email: e.target.value })}
        />
        <Button onClick={saveProveedor} mt="md">
          Guardar
        </Button>
      </Modal>
    </div>
  );
};

export default Proveedores;
