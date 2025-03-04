import React, { useEffect, useState } from 'react';
import { Button, Modal, TextInput, Table, Notification } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconX, IconCheck } from '@tabler/icons-react';
import { reporteService } from '../services/reporteService';
import { Reporte } from '../types/types';

const Reportes: React.FC = () => {
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [editingReporte, setEditingReporte] = useState<Partial<Reporte>>({});
  const [notification, setNotification] = useState<{ message: string; color: string; icon: JSX.Element | null } | null>(null);

  const loadReportes = async () => {
    try {
      const data = await reporteService.findAll();
      setReportes(data);
    } catch (error) {
      setNotification({ message: 'Error al cargar los reportes', color: 'red', icon: <IconX size={20} /> });
    }
  };

  useEffect(() => {
    loadReportes();
  }, []);

  const openNew = () => {
    setEditingReporte({});
    open();
  };

  const saveReporte = async () => {
    try {
      if (editingReporte.id) {
        await reporteService.update(editingReporte.id, editingReporte);
        setNotification({ message: 'Reporte actualizado correctamente', color: 'teal', icon: <IconCheck size={20} /> });
      } else {
        await reporteService.create(editingReporte);
        setNotification({ message: 'Reporte creado correctamente', color: 'teal', icon: <IconCheck size={20} /> });
      }
      close();
      loadReportes();
    } catch (error) {
      setNotification({ message: 'Error al guardar el reporte', color: 'red', icon: <IconX size={20} /> });
    }
  };

  const deleteReporte = async (reporte: Reporte) => {
    try {
      if (reporte.id) {
        await reporteService.remove(reporte.id);
        setNotification({ message: 'Reporte eliminado correctamente', color: 'teal', icon: <IconCheck size={20} /> });
        loadReportes();
      }
    } catch (error) {
      setNotification({ message: 'Error al eliminar el reporte', color: 'red', icon: <IconX size={20} /> });
    }
  };

  return (
    <div>
      {notification && (
        <Notification icon={notification.icon} color={notification.color}>
          {notification.message}
        </Notification>
      )}
      <h2>Gestión de Reportes</h2>
      <Button onClick={openNew}>Nuevo Reporte</Button>
      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>ID Empresa</th>
            <th>Fecha de Generación</th>
            <th>Tipo</th>
            <th>Archivo PDF</th>
            <th>ID Usuario</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {reportes.map((reporte) => (
            <tr key={reporte.id}>
              <td>{reporte.id}</td>
              <td>{reporte.id_empresa}</td>
              <td>{reporte.fecha_generacion}</td>
              <td>{reporte.tipo}</td>
              <td>{reporte.archivo_pdf}</td>
              <td>{reporte.id_usuario}</td>
              <td>
                <Button onClick={() => { setEditingReporte(reporte); open(); }}>Editar</Button>
                <Button color="red" onClick={() => deleteReporte(reporte)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal opened={opened} onClose={close} title={editingReporte.id ? 'Editar Reporte' : 'Nuevo Reporte'}>
        <TextInput
          label="ID Empresa"
          value={editingReporte.id_empresa?.toString() || ''}
          onChange={(e) => setEditingReporte({ ...editingReporte, id_empresa: Number(e.target.value) })}
        />
        <TextInput
          label="Fecha de Generación"
          type="date"
          value={editingReporte.fecha_generacion || ''}
          onChange={(e) => setEditingReporte({ ...editingReporte, fecha_generacion: e.target.value })}
        />
        <TextInput
          label="Tipo"
          value={editingReporte.tipo || ''}
          onChange={(e) => setEditingReporte({ ...editingReporte, tipo: e.target.value })}
        />
        <TextInput
          label="Archivo PDF"
          value={editingReporte.archivo_pdf || ''}
          onChange={(e) => setEditingReporte({ ...editingReporte, archivo_pdf: e.target.value })}
        />
        <TextInput
          label="ID Usuario"
          value={editingReporte.id_usuario?.toString() || ''}
          onChange={(e) => setEditingReporte({ ...editingReporte, id_usuario: Number(e.target.value) })}
        />
        <Button onClick={saveReporte} mt="md">Guardar</Button>
      </Modal>
    </div>
  );
};

export default Reportes;