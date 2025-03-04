import React, { useEffect, useState, JSX } from 'react';
import { Button, Modal, TextInput, Table, Notification, Select } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconX, IconCheck } from '@tabler/icons-react';
import { pedidoService } from '../services/PedidoService';
import { empresaService } from '../services/EmpresaService';
import { pedido, empresa } from '../types/types';

// Definimos un tipo auxiliar para que la propiedad id_empresa pueda ser número o un objeto empresa
type PedidoWithEmpresa = pedido & { id_empresa: number | empresa };

const PedidosPage: React.FC = () => {
  const [pedidos, setPedidos] = useState<PedidoWithEmpresa[]>([]);
  const [empresas, setEmpresas] = useState<empresa[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [editingPedido, setEditingPedido] = useState<Partial<PedidoWithEmpresa>>({});
  const [notification, setNotification] = useState<{ message: string; color: string; icon: JSX.Element | null } | null>(null);

  // Carga pedidos y empresas
  const loadData = async () => {
    try {
      const dataPedidos = await pedidoService.findAll();
      // Mapeamos la respuesta: asignamos id a partir de id_pedido (o id) y conservamos id_empresa tal cual
      const mappedPedidos: PedidoWithEmpresa[] = dataPedidos.map((ped: any) => ({
        ...ped,
        id: ped.id_pedido || ped.id,
        id_empresa: ped.id_empresa, // Puede venir como número o como objeto Empresa
      }));
      setPedidos(mappedPedidos);

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
    setEditingPedido({
      // Al crear un nuevo pedido se asignan valores por defecto
      fecha_solicitud: new Date().toISOString(),
      fecha_entrega: new Date().toISOString(),
      estado: '',
      id_empresa: undefined,
    });
    open();
  };

  const savePedido = async () => {
    try {
      const newPedido = {
        ...editingPedido,
        // Aseguramos que las fechas tengan un valor; podrían venir en ISO y se guardan igual
        fecha_solicitud: editingPedido.fecha_solicitud || new Date().toISOString(),
        fecha_entrega: editingPedido.fecha_entrega || new Date().toISOString(),
      };
      if (editingPedido.id) {
        await pedidoService.update(editingPedido.id, newPedido);
        setNotification({ message: 'Pedido actualizado correctamente', color: 'teal', icon: <IconCheck size={20} /> });
      } else {
        await pedidoService.create(newPedido);
        setNotification({ message: 'Pedido creado correctamente', color: 'teal', icon: <IconCheck size={20} /> });
      }
      close();
      loadData();
    } catch (error) {
      setNotification({ message: 'Error al guardar el pedido', color: 'red', icon: <IconX size={20} /> });
    }
  };

  const deletePedido = async (ped: PedidoWithEmpresa) => {
    try {
      if (ped.id) {
        await pedidoService.remove(ped.id);
        setNotification({ message: 'Pedido eliminado correctamente', color: 'teal', icon: <IconCheck size={20} /> });
        loadData();
      }
    } catch (error) {
      setNotification({ message: 'Error al eliminar el pedido', color: 'red', icon: <IconX size={20} /> });
    }
  };

  return (
    <div>
      {notification && (
        <Notification icon={notification.icon} color={notification.color}>
          {notification.message}
        </Notification>
      )}
      <h2>Gestión de Pedidos</h2>
      <Button onClick={openNew}>Nuevo Pedido</Button>
      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Empresa</th>
            <th>Fecha Solicitud</th>
            <th>Fecha Entrega</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((ped, index) => {
            let empresaNombre = 'No disponible';
            if (ped.id_empresa && typeof ped.id_empresa === 'object') {
              empresaNombre = (ped.id_empresa as empresa).nombre;
            } else {
              const found = empresas.find((emp) => emp.id_empresa === ped.id_empresa);
              empresaNombre = found ? found.nombre : 'No disponible';
            }
            return (
              <tr key={ped.id ? ped.id : index}>
                <td>{ped.id}</td>
                <td>{empresaNombre}</td>
                <td>{ped.fecha_solicitud ? new Date(ped.fecha_solicitud).toLocaleDateString('en-CA') : ''}</td>
                <td>{ped.fecha_entrega ? new Date(ped.fecha_entrega).toLocaleDateString('en-CA') : ''}</td>
                <td>{ped.estado}</td>
                <td>
                  <Button onClick={() => { setEditingPedido(ped); open(); }}>Editar</Button>
                  <Button color="red" onClick={() => deletePedido(ped)}>Eliminar</Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      <Modal opened={opened} onClose={close} title={editingPedido.id ? 'Editar Pedido' : 'Nuevo Pedido'}>
        <Select
          label="Empresa"
          value={editingPedido.id_empresa ? editingPedido.id_empresa.toString() : ''}
          onChange={(value) =>
            setEditingPedido({ ...editingPedido, id_empresa: value ? parseInt(value) : undefined })
          }
          data={empresas
            .filter((emp) => emp.id_empresa !== undefined)
            .map((emp) => ({ value: emp.id_empresa!.toString(), label: emp.nombre }))}
        />
        <TextInput
          label="Fecha de Solicitud"
          type="date"
          value={
            editingPedido.fecha_solicitud
              ? new Date(editingPedido.fecha_solicitud).toISOString().split('T')[0]
              : new Date().toISOString().split('T')[0]
          }
          onChange={(e) => setEditingPedido({ ...editingPedido, fecha_solicitud: e.target.value })}
        />
        <TextInput
          label="Fecha de Entrega"
          type="date"
          value={
            editingPedido.fecha_entrega
              ? new Date(editingPedido.fecha_entrega).toISOString().split('T')[0]
              : new Date().toISOString().split('T')[0]
          }
          onChange={(e) => setEditingPedido({ ...editingPedido, fecha_entrega: e.target.value })}
        />
        <Select
          label="Estado"
          value={editingPedido.estado || ''}
          onChange={(value) => setEditingPedido({ ...editingPedido, estado: value || '' })}
          data={[
            { value: 'Activo', label: 'Activo' },
            { value: 'Inactivo', label: 'Inactivo' },
          ]}
        />
        <Button onClick={savePedido} mt="md">
          Guardar
        </Button>
      </Modal>
    </div>
  );
};

export default PedidosPage;
