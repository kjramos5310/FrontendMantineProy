export interface categoria {
    id_categoria?: number;
    nombre: string;
    descripcion?: string;
    fecha_creacion?: string;
  }
  
  export interface detalle_pedido {
    id?: number;
    id_pedido: number;
    id_producto: number;
    cantidad: number;
    preciounitario: number;
  }
  
  export interface empresa {
    id_empresa?: number; // Asegúrate de que `id_empresa` esté consistente
    nombre: string;
    ruc: number;
    direccion: string;
    telefono: string;
    email_contacto: string;
    sector: string;
    fecha_creacion?: string; // Cambié a `fecha_creacion` para hacerlo consistente
    estado?: string;
    productos?: producto[];
    inventarios?: inventario[];
    pedidos?: pedido[];
    reportes?: reporte[];
  }
  
  export interface inventario {
    id: number;
    id_empresa: number; // Debe ser `id_empresa` si usas ese nombre en la entidad
    fecha_actualizacion: string;
  }
  
  export interface movimiento_inventario {
    id?: number;
    id_producto?: number;
    tipo_movimiento?: string;
    cantidad: number;
    fecha_movimiento: string;
    motivo?: string;
    id_usuario?: number;
    costo_unitario?: number;
    ubicacion?: string;
  }
  
  export interface pedido {
    id?: number;
    id_empresa: number;
    fecha_solicitud: string;
    fecha_entrega: string;
    estado: string;
    detalles?: detalle_pedido[];
  }
  
  export interface producto {
    id?: number;
    codigo_barras: string;
    nombre: string;
    descripcion: string;
    id_categoria: number;
    precio_compra: number;
    precio_venta: number;
    stock_minimo: number;
    stock_maximo: number;
    id_empresa: number;
    id_proveedor: number;
    fecha_creacion?: string; // Cambié a `fecha_creacion`
    ultima_actualizacion?: string;
    detalles?: detalle_pedido[];
    movimientos?: movimiento_inventario[];
  }
  
  export interface proveedor {
    id?: number;
    nombre: string;
    contacto: string;
    direccion: string;
    telefono: string;
    email: string;
    fecha_creacion?: string;
  }
  
  export interface reporte {
    id?: number;
    id_empresa: number;
    fecha_generacion: string;
    tipo: string;
    archivo_pdf: string;
    id_usuario: number; // En la entidad está como `usuario`, pero el campo es correcto en el tipo
  }
  
  export interface rol {
    id: number;
    nombre: string;
    descripcion: string;
  }
  
  export interface usuario {
    id?: number;
    nombre_completo: string;
    email: string;
    telefono: string;
    estado: string;
    fecha_creacion: string;
    ultima_conexion?: string;
    password: string;
    password_hash: string;
    id_empresa: number; // En la entidad está como `empresa`, pero el nombre es correcto
    movimientos: movimiento_inventario[];
    reportes: reporte[];
  }
  
  export interface UsuarioRol {
    id?: number;
    id_usuario: number;
    id_rol: number; // En la entidad está como `rol`, pero es correcto en el tipo
    fecha_asignacion: string;
  }
  