import React, { useEffect, useState } from 'react';
import { Button, Modal, TextInput, Table, Notification, Select } from '@mantine/core';
import { JSX } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { IconX, IconCheck } from '@tabler/icons-react';
import { empresaService } from '../services/EmpresaService';
import { empresa } from '../types/types';

const Empresas: React.FC = () => {
  const [empresas, setEmpresas] = useState<empresa[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [editingEmpresa, setEditingEmpresa] = useState<Partial<empresa>>({});
  const [notification, setNotification] = useState<{ message: string; color: string; icon: JSX.Element | null } | null>(null);

  const loadEmpresas = async () => {
    try {
      const data = await empresaService.findAll();
      setEmpresas(data);
    } catch (error) {
      setNotification({ message: 'Error al cargar las empresas', color: 'red', icon: <IconX size={20} /> });
    }
  };

  useEffect(() => {
    loadEmpresas();
  }, []);

  const openNew = () => {
    setEditingEmpresa({});
    open();
  };

  const saveEmpresa = async () => {
    try {
      if (editingEmpresa.id_empresa) {
        await empresaService.update(editingEmpresa.id_empresa, editingEmpresa);
        setNotification({ message: 'Empresa actualizada correctamente', color: 'teal', icon: <IconCheck size={20} /> });
      } else {
        // Asignar la fecha de creación automáticamente
        const newEmpresa = { ...editingEmpresa, fecha_creacion: new Date().toISOString() };
        await empresaService.create(newEmpresa);
        setNotification({ message: 'Empresa creada correctamente', color: 'teal', icon: <IconCheck size={20} /> });
      }
      close();
      loadEmpresas();
    } catch (error) {
      setNotification({ message: 'Error al guardar la empresa', color: 'red', icon: <IconX size={20} /> });
    }
  };

  const deleteEmpresa = async (emp: empresa) => {
    try {
      if (emp.id_empresa) {
        console.log("Eliminando empresa con ID:", emp.id_empresa);
        await empresaService.remove(emp.id_empresa);
        setNotification({ message: 'Empresa eliminada correctamente', color: 'teal', icon: <IconCheck size={20} /> });
        loadEmpresas();
      } else {
        setNotification({ message: 'ID de empresa no válido', color: 'red', icon: <IconX size={20} /> });
      }
    } catch (error) {
      console.error("Error al eliminar la empresa:", error);
      setNotification({ message: 'Error al eliminar la empresa', color: 'red', icon: <IconX size={20} /> });
    }
  };

  return (
    <div>
      {notification && (
        <Notification icon={notification.icon} color={notification.color}>
          {notification.message}
        </Notification>
      )}
      <h2>Gestión de Empresas</h2>
      <Button onClick={openNew}>Nueva Empresa</Button>
      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>RUC</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Sector</th>
            <th>Fecha de Creación</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empresas.map((emp) => (
            <tr key={emp.id_empresa}>
              <td>{emp.id_empresa}</td>
              <td>{emp.nombre}</td>
              <td>{emp.ruc}</td>
              <td>{emp.direccion}</td>
              <td>{emp.telefono}</td>
              <td>{emp.email_contacto}</td>
              <td>{emp.sector}</td>
              <td>{emp.fecha_creacion ? new Date(emp.fecha_creacion).toLocaleDateString() : ''}</td>
              <td>{emp.estado}</td>
              <td>
                <Button onClick={() => { setEditingEmpresa(emp); open(); }}>Editar</Button>
                <Button color="red" onClick={() => deleteEmpresa(emp)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal opened={opened} onClose={close} title={editingEmpresa.id_empresa ? 'Editar Empresa' : 'Nueva Empresa'}>
        <TextInput
          label="Nombre"
          value={editingEmpresa.nombre || ''}
          onChange={(e) => setEditingEmpresa({ ...editingEmpresa, nombre: e.target.value })}
        />
        <TextInput
          label="RUC"
          value={editingEmpresa.ruc || ''}
          onChange={(e) => setEditingEmpresa({ ...editingEmpresa, ruc: Number(e.target.value) })}
        />
        <TextInput
          label="Dirección"
          value={editingEmpresa.direccion || ''}
          onChange={(e) => setEditingEmpresa({ ...editingEmpresa, direccion: e.target.value })}
        />
        <TextInput
          label="Teléfono"
          value={editingEmpresa.telefono || ''}
          onChange={(e) => setEditingEmpresa({ ...editingEmpresa, telefono: e.target.value })}
        />
        <TextInput
          label="Email"
          value={editingEmpresa.email_contacto || ''}
          onChange={(e) => setEditingEmpresa({ ...editingEmpresa, email_contacto: e.target.value })}
        />
        <TextInput
          label="Sector"
          value={editingEmpresa.sector || ''}
          onChange={(e) => setEditingEmpresa({ ...editingEmpresa, sector: e.target.value })}
        />
        {/* Cambié a Select para estado */}
        <Select
          label="Estado"
          value={editingEmpresa.estado || ''}
          onChange={(value) => setEditingEmpresa({ ...editingEmpresa, estado: value || undefined })}
          data={[
            { value: 'Activo', label: 'Activo' },
            { value: 'Inactivo', label: 'Inactivo' },
          ]}
        />
        {/* Fecha de creación ya no es editable */}
        <TextInput
          label="Fecha de Creación"
          value={editingEmpresa.fecha_creacion || new Date().toLocaleDateString()}
          readOnly
        />
        <Button onClick={saveEmpresa} mt="md">Guardar</Button>
      </Modal>
    </div>
  );
};

export default Empresas;
