import '@mantine/core/styles.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { useEffect, useState } from 'react';
import HeaderTabs from './components/HeaderTabs';
import Categorias from './pages/Categoria';
import Empresa from './pages/Empresa';
import InventarioPage from './pages/Inventario';
import Pedidos from './pages/Pedido';
import Productos from './pages/Producto';
import Proveedores from './pages/Proveedor';
import Reportes from './pages/Reporte';
import Roles from './pages/Rol';
import Usuarios from './pages/Usuario';
import MovimientosInventario from './pages/Movimiento_Inventario';
import DetallePedidos from './pages/detalle_pedido';
import AuthenticationTitle from './components/Login';
import FeaturesCards from './components/UserInfoAction';
import FeaturesTitle from './components/inicio';

function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
    setUser(storedUser);
  }, []);

  return (
    <MantineProvider>
      <Router>
        {user ? <HeaderTabs setUser={setUser} /> : null}
        <div style={{ padding: '20px' }}>
          <Routes>
            {!user ? (
              <Route path="*" element={<AuthenticationTitle setUser={setUser} />} />
            ) : (
              <>
                <Route path="/inicio" element={<FeaturesTitle />} />
                <Route path="/categoria" element={<Categorias />} />
                <Route path="/empresa" element={<Empresa />} />
                <Route path="/inventario" element={<InventarioPage />} />
                <Route path="/pedido" element={<Pedidos />} />
                <Route path="/producto" element={<Productos />} />
                <Route path="/proveedor" element={<Proveedores />} />
                <Route path="/reporte" element={<Reportes />} />
                <Route path="/rol" element={<Roles />} />
                <Route path="/usuario" element={<Usuarios />} />
                <Route path="/movimiento-inventario" element={<MovimientosInventario />} />
                <Route path="/detalle-pedido" element={<DetallePedidos />} />
                <Route path="/AboutUs" element={<FeaturesCards />} />
              </>
            )}
          </Routes>
        </div>
      </Router>
    </MantineProvider>
  );
}

export default App;
