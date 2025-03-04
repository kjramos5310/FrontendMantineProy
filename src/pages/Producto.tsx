import React, { useEffect, useState, JSX } from 'react';
import { Button, Modal, TextInput, Table, Notification, Select } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconX, IconCheck } from '@tabler/icons-react';
import { productoService } from '../services/ProductoService';
import { producto, empresa, categoria, proveedor } from '../types/types';
import { empresaService } from '../services/EmpresaService';
import { categoriaService } from '../services/CategoriaService';
import { proveedorService } from '../services/ProveedorService';

const Producto: React.FC = () => {
  const [productos, setProductos] = useState<producto[]>([]);
  const [empresas, setEmpresas] = useState<empresa[]>([]);
  const [categorias, setCategorias] = useState<categoria[]>([]);
  const [proveedores, setProveedores] = useState<proveedor[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [editingProducto, setEditingProducto] = useState<Partial<producto>>({});
  const [notification, setNotification] = useState<{ message: string; color: string; icon: JSX.Element | null } | null>(null);

  const loadProductos = async () => {
    try {
      const data = await productoService.findAll();
      console.log('Productos recibidos desde la API:', data);
      setProductos(data);
    } catch (error) {
      setNotification({ message: 'Error al cargar los productos', color: 'red', icon: <IconX size={20} /> });
    }
  };

  const loadEmpresas = async () => {
    try {
      const data = await empresaService.findAll();
      setEmpresas(data);
    } catch (error) {
      setNotification({ message: 'Error al cargar las empresas', color: 'red', icon: <IconX size={20} /> });
    }
  };

  const loadCategorias = async () => {
    try {
      const data = await categoriaService.findAll();
      setCategorias(data);
    } catch (error) {
      setNotification({ message: 'Error al cargar las categorías', color: 'red', icon: <IconX size={20} /> });
    }
  };

  const loadProveedores = async () => {
    try {
      const data = await proveedorService.findAll();
      setProveedores(data);
    } catch (error) {
      setNotification({ message: 'Error al cargar los proveedores', color: 'red', icon: <IconX size={20} /> });
    }
  };

  useEffect(() => {
    loadProductos();
    loadEmpresas();
    loadCategorias();
    loadProveedores();
  }, []);

  const openNew = () => {
    setEditingProducto({});
    open();
  };

  const saveProducto = async () => {
    try {
      // Asegurarse de que todos los valores numéricos sean correctos antes de enviarlos
      const productoData = {
        ...editingProducto,
        id_empresa: Number(editingProducto.id_empresa),
        id_categoria: Number(editingProducto.id_categoria),
        id_proveedor: Number(editingProducto.id_proveedor),
        precio_compra: parseFloat(editingProducto.precio_compra?.toString() || '0'),
        precio_venta: parseFloat(editingProducto.precio_venta?.toString() || '0'),
        stock_minimo: parseInt(editingProducto.stock_minimo?.toString() || '0'),
        stock_maximo: parseInt(editingProducto.stock_maximo?.toString() || '0'),
      };

      if (productoData.id) {
        await productoService.update(productoData.id, productoData);
        setNotification({
          message: 'Producto actualizado correctamente',
          color: 'teal',
          icon: <IconCheck size={20} />,
        });
      } else {
        await productoService.create(productoData);
        setNotification({
          message: 'Producto creado correctamente',
          color: 'teal',
          icon: <IconCheck size={20} />,
        });
      }
      close();
      loadProductos();
    } catch (error) {
      setNotification({
        message: 'Error al guardar el producto',
        color: 'red',
        icon: <IconX size={20} />,
      });
    }
  };

  const deleteProducto = async (producto: producto) => {
    try {
      // Asegúrate de que el ID esté presente y sea válido antes de eliminar
      if (producto.id && producto.id > 0) {
        await productoService.remove(producto.id);
        setNotification({
          message: 'Producto eliminado correctamente',
          color: 'teal',
          icon: <IconCheck size={20} />,
        });
        loadProductos();
      } else {
        setNotification({
          message: 'ID del producto no encontrado o no válido',
          color: 'red',
          icon: <IconX size={20} />,
        });
      }
    } catch (error) {
      setNotification({
        message: 'Error al eliminar el producto',
        color: 'red',
        icon: <IconX size={20} />,
      });
    }
  };

  return (
    <div>
      {notification && (
        <Notification icon={notification.icon} color={notification.color} onClose={() => setNotification(null)}>
          {notification.message}
        </Notification>
      )}
      <h2>Gestión de Productos</h2>
      <Button onClick={openNew}>Nuevo Producto</Button>
      <Table striped highlightOnHover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Código de Barras</th>
            <th>Descripción</th>
            <th>Precio Compra</th>
            <th>Precio Venta</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.length === 0 ? (
            <tr>
              <td colSpan={7}>No hay productos disponibles.</td>
            </tr>
          ) : (
            productos.map((producto) => (
              <tr key={producto.id || `${producto.nombre}-${Math.random()}`}>

                <td>{producto.id || 'Sin ID'}</td>
                <td>{producto.nombre}</td>
                <td>{producto.codigo_barras}</td>
                <td>{producto.descripcion}</td>
                <td>{producto.precio_compra}</td>
                <td>{producto.precio_venta}</td>
                <td>
                  <Button size="xs" onClick={() => { setEditingProducto(producto); open(); }}>
                    Editar
                  </Button>
                  <Button size="xs" color="red" ml={5} onClick={() => deleteProducto(producto)}>
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      <Modal opened={opened} onClose={close} title={editingProducto.id ? 'Editar Producto' : 'Nuevo Producto'} size="lg">
        <TextInput
          label="Nombre"
          value={editingProducto.nombre || ''}
          onChange={(e) => setEditingProducto({ ...editingProducto, nombre: e.target.value })}
          required
        />
        <TextInput
          label="Código de Barras"
          value={editingProducto.codigo_barras || ''}
          onChange={(e) => setEditingProducto({ ...editingProducto, codigo_barras: e.target.value })}
          required
        />
        <TextInput
          label="Descripción"
          value={editingProducto.descripcion || ''}
          onChange={(e) => setEditingProducto({ ...editingProducto, descripcion: e.target.value })}
        />
        <TextInput
          label="Precio de Compra"
          value={editingProducto.precio_compra || ''}
          onChange={(e) => setEditingProducto({ ...editingProducto, precio_compra: parseFloat(e.target.value) })}
          type="number"
          required
        />
        <TextInput
          label="Precio de Venta"
          value={editingProducto.precio_venta || ''}
          onChange={(e) => setEditingProducto({ ...editingProducto, precio_venta: parseFloat(e.target.value) })}
          type="number"
          required
        />
        <TextInput
          label="Stock Mínimo"
          value={editingProducto.stock_minimo || ''}
          onChange={(e) => setEditingProducto({ ...editingProducto, stock_minimo: Number(e.target.value) })}
          type="number"
          required
        />
        <TextInput
          label="Stock Máximo"
          value={editingProducto.stock_maximo || ''}
          onChange={(e) => setEditingProducto({ ...editingProducto, stock_maximo: Number(e.target.value) })}
          type="number"
          required
        />

        <Select
          label="Empresa"
          data={empresas.map((emp) => ({ value: emp.id_empresa?.toString() || '', label: emp.nombre }))}
          value={editingProducto.id_empresa?.toString() || ''}
          onChange={(value) => setEditingProducto({ ...editingProducto, id_empresa: Number(value) })}
          required
        />

        <Select
          label="Categoría"
          data={categorias.map((cat) => ({ value: cat.id_categoria?.toString() || '', label: cat.nombre }))}
          value={editingProducto.id_categoria?.toString() || ''}
          onChange={(value) => setEditingProducto({ ...editingProducto, id_categoria: Number(value) })}
          required
        />

        <Select
          label="Proveedor"
          data={proveedores.map((prov) => ({ value: prov.id?.toString() || '', label: prov.nombre }))}
          value={editingProducto.id_proveedor?.toString() || ''}
          onChange={(value) => setEditingProducto({ ...editingProducto, id_proveedor: Number(value) })}
          required
        />

        <Button onClick={saveProducto} mt="md" fullWidth>
          Guardar
        </Button>
      </Modal>
    </div>
  );
};

export default Producto;