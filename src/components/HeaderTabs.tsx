import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Avatar,
  Burger,
  Container,
  Group,
  Menu,
  Tabs,
  Text,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronDown, IconLogout } from '@tabler/icons-react';
import { MantineLogo } from '@mantinex/mantine-logo';
import classes from './HeaderTabs.module.css';

const defaultTabs = [
  { name: 'Inicio', path: '/inicio' },
  { name: 'Categoria', path: '/categoria' },
  { name: 'Empresa', path: '/empresa' },
  { name: 'Proveedor', path: '/proveedor' },
  { name: 'AcercaDe', path: '/AboutUs' },
];

const adminTabs = [
  { name: 'Inicio', path: '/inicio' },
  { name: 'Inventario', path: '/inventario' },
  { name: 'Pedido', path: '/pedido' },
  { name: 'Producto', path: '/producto' },
  { name: 'Reporte', path: '/reporte' },
  { name: 'Rol', path: '/rol' },
  { name: 'Usuario', path: '/usuario' },
  { name: 'Movimiento Inventario', path: '/movimiento-inventario' },
  { name: 'Detalle Pedido', path: '/detalle-pedido' },
  { name: 'AcercaDe', path: '/AboutUs' },
];

function HeaderTabs({ setUser }: { setUser: (user: null) => void }) {
  const theme = useMantineTheme();
  const [opened, { toggle }] = useDisclosure(false);
  const navigate = useNavigate();
  const [user, setUserState] = useState<any>(JSON.parse(localStorage.getItem('user') || '{}'));
  const [tabs, setTabs] = useState(defaultTabs);

  useEffect(() => {
    if (user?.nombre_completo) {
      // Compara directamente el nombre completo con 'admin'
      if (user.nombre_completo === 'admin') {
        setTabs([...defaultTabs, ...adminTabs]); // Mostrar todas las pestañas de Admin
      } else {
        setTabs(defaultTabs); // Solo las pestañas por defecto
      }
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUserState(null);
    setUser(null);
    navigate('/');
  };

  return (
    <div className={classes.header}>
      <Container className={classes.mainSection} size="md">
        <Group justify="space-between">
          <MantineLogo size={28} />
          <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
          <Menu width={200} position="bottom-end" onClose={toggle} withinPortal>
            <Menu.Target>
              <UnstyledButton className={classes.user}>
                <Group gap={7}>
                  <Avatar src={user.image || ''} alt={user.name || 'Usuario'} radius="xl" size={20} />
                  <Text fw={500} size="sm">{user.name || 'Usuario'}</Text>
                  <IconChevronDown size={12} stroke={1.5} />
                </Group>
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item leftSection={<IconLogout size={16} stroke={1.5} />} onClick={handleLogout}>
                Cerrar sesión
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Container>

      <Container size="md">
        <Tabs defaultValue="Home" variant="outline">
          <Tabs.List>
            {tabs.map((tab) => (
              <Tabs.Tab key={tab.name} value={tab.name} component={Link} to={tab.path}>
                {tab.name}
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </Tabs>
      </Container>
    </div>
  );
}

export default HeaderTabs;
