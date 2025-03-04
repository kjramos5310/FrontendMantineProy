import React, { useEffect, useState, JSX } from 'react';
import { Button, Modal, TextInput, Table, Notification, Select } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconX, IconCheck } from '@tabler/icons-react';
import { inventarioService } from '../services/InventarioService';
import { empresaService } from '../services/EmpresaService';
import { inventario, empresa } from '../types/types';

// Creamos un tipo auxiliar para inventario que permite que id_empresa sea number o empresa
type InventarioWithEmpresa = inventario & { id_empresa: number | empresa };

const InventarioPage: React.FC = () => {
  const [inventarios, setInventarios] = useState<InventarioWithEmpresa[]>([]);
  const [empresas, setEmpresas] = useState<empresa[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [editingInventario, setEditingInventario] = useState<Partial<InventarioWithEmpresa>>({});
  const [notification, setNotification] = useState<{ message: string; color: string; icon: JSX.Element | null } | null>(null);

  // Cargar inventarios y empresas
  const loadData = async () => {
    try {
      const dataInventarios = await inventarioService.findAll();
      // Mapeamos la respuesta para asignar id a partir de id_inventario y conservar id_empresa tal cual
      const mappedInventarios: InventarioWithEmpresa[] = dataInventarios.map((inv: any) => ({
        ...inv,
        id: inv.id_inventario,
        id_empresa: inv.id_empresa, // Puede venir como número o como objeto Empresa
      }));
      setInventarios(mappedInventarios);

      const dataEmpresas = await empresaService.findAll();
      setEmpresas(dataEmpresas);
    } catch (error) {
      setNotification({ message: 'Error al cargar datos', color: 'red', icon: <IconX size={20} /> });
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openNew = () => {
    setEditingInventario({
      // Al crear un nuevo registro, se asigna la fecha actual automáticamente
      fecha_actualizacion: new Date().toISOString(),
      id_empresa: undefined,
    });
    open();
  };

  const saveInventario = async () => {
    try {
      const newInventario = {
        ...editingInventario,
        // Se actualiza la fecha en cada operación
        fecha_actualizacion: new Date().toISOString(),
      };
      if (editingInventario.id) {
        await inventarioService.update(editingInventario.id, newInventario);
        setNotification({ message: 'Inventario actualizado correctamente', color: 'teal', icon: <IconCheck size={20} /> });
      } else {
        await inventarioService.create(newInventario);
        setNotification({ message: 'Inventario creado correctamente', color: 'teal', icon: <IconCheck size={20} /> });
      }
      close();
      loadData();
    } catch (error) {
      setNotification({ message: 'Error al guardar el inventario', color: 'red', icon: <IconX size={20} /> });
    }
  };

  const deleteInventario = async (inv: InventarioWithEmpresa) => {
    try {
      if (inv.id) {
        await inventarioService.remove(inv.id);
        setNotification({ message: 'Inventario eliminado correctamente', color: 'teal', icon: <IconCheck size={20} /> });
        loadData();
      }
    } catch (error) {
      setNotification({ message: 'Error al eliminar el inventario', color: 'red', icon: <IconX size={20} /> });
    }
  };

  return (
    <div>
      {notification && (
        <Notification icon={notification.icon} color={notification.color}>
          {notification.message}
        </Notification>
      )}
      <h2>Gestión de Inventario</h2>
      <Button onClick={openNew}>Nuevo Registro</Button>
      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Empresa</th>
            <th>Fecha de Actualización</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {inventarios.map((inv, index) => {
            let empresaNombre = 'No disponible';
            // Si id_empresa es un objeto y tiene la propiedad nombre, se usa esa
            if (inv.id_empresa && typeof inv.id_empresa === 'object') {
              empresaNombre = (inv.id_empresa as empresa).nombre;
            } else {
              // Si id_empresa es un número, se busca en la lista de empresas
              const found = empresas.find((emp) => emp.id_empresa === inv.id_empresa);
              empresaNombre = found ? found.nombre : 'No disponible';
            }
            return (
              <tr key={inv.id ? inv.id : index}>
                <td>{inv.id}</td>
                <td>{empresaNombre}</td>
                <td>{inv.fecha_actualizacion ? new Date(inv.fecha_actualizacion).toLocaleDateString('en-CA') : ''}</td>
                <td>
                  <Button onClick={() => { setEditingInventario(inv); open(); }}>Editar</Button>
                  <Button color="red" onClick={() => deleteInventario(inv)}>Eliminar</Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      <Modal opened={opened} onClose={close} title={editingInventario.id ? 'Editar Inventario' : 'Nuevo Registro'}>
        <Select
          label="Empresa"
          value={editingInventario.id_empresa ? editingInventario.id_empresa.toString() : ''}
          onChange={(value) =>
            setEditingInventario({ ...editingInventario, id_empresa: value ? parseInt(value) : undefined })
          }
          data={empresas
            .filter((emp) => emp.id_empresa !== undefined)
            .map((emp) => ({ value: emp.id_empresa!.toString(), label: emp.nombre }))}
        />
        <TextInput
          label="Fecha de Actualización"
          type="date"
          value={
            editingInventario.fecha_actualizacion
              ? new Date(editingInventario.fecha_actualizacion).toISOString().split('T')[0]
              : new Date().toISOString().split('T')[0]
          }
          readOnly
        />
        <Button onClick={saveInventario} mt="md">
          Guardar
        </Button>
      </Modal>
    </div>
  );
};

export default InventarioPage;
