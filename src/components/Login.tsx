
import {
  Button,
  Checkbox,
  Container,
  Group,
  Paper,
  PasswordInput,
  TextInput,
  Title,
} from '@mantine/core';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classes from './login.module.css';

interface Usuario {
  nombre_completo: string;
  email: string;
  telefono: string;
  estado: string;
  fecha_creacion: string;
  ultima_conexion?: string;
  password: string;
  password_hash: string;
  id_empresa: number;
}

async function loginUser(username: string, password: string) {
  try {
    const response = await fetch('http://localhost:3000/usuario');
    if (!response.ok) throw new Error('Error en la API: ' + response.statusText);
    
    const users = await response.json();
    return users.find((user: any) => user.nombre_completo === username && user.password_hash === password);
  } catch (error) {
    console.error('Error en login:', error);
    return null;
  }
}

async function registerUser(userData: Usuario) {
  try {
    const response = await fetch('http://localhost:3000/usuario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    if (!response.ok) throw new Error('Error en el registro');
    return await response.json();
  } catch (error) {
    console.error('Error en registro:', error);
    return null;
  }
}

function AuthenticationTitle({ setUser }: { setUser: (user: any) => void }) {
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [idEmpresa, setIdEmpresa] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    const user = await loginUser(nombreCompleto, password);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      navigate('/inicio');
    } else {
      alert('Credenciales incorrectas');
    }
  };

  const handleRegister = async () => {
    if (!nombreCompleto || !email || !telefono || !password || !idEmpresa) {
      alert('Por favor, llena todos los campos');
      return;
    }

    const newUser: Usuario = {
      nombre_completo: nombreCompleto,
      email,
      telefono,
      estado: 'activo',
      fecha_creacion: new Date().toISOString(),
      ultima_conexion: null,
      password,
      password_hash: password, // Aquí deberías encriptar antes de enviarlo al backend
      id_empresa: Number(idEmpresa),
    };

    const response = await registerUser(newUser);
    if (response) {
      alert('Usuario registrado correctamente');
      setIsRegistering(false);
    } else {
      alert('Error al registrar usuario');
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center" className={classes.title}>
        {isRegistering ? 'Crear Cuenta' : 'Bienvenido'}
      </Title>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <TextInput
          label="Nombre Completo"
          placeholder="Juan Pérez"
          value={nombreCompleto}
          onChange={(e) => setNombreCompleto(e.target.value)}
          required
        />
        {isRegistering && (
          <>
            <TextInput
              label="Correo Electrónico"
              placeholder="correo@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              mt="md"
            />
            <TextInput
              label="Teléfono"
              placeholder="123456789"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              required
              mt="md"
            />
            <TextInput
              label="ID Empresa"
              placeholder="1"
              value={idEmpresa}
              onChange={(e) => setIdEmpresa(e.target.value)}
              required
              mt="md"
            />
          </>
        )}
        <PasswordInput
          label="Contraseña"
          placeholder="Tu contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          mt="md"
        />
        <Group justify="space-between" mt="lg">
          <Checkbox label="Recordarme" />
        </Group>
        {isRegistering ? (
          <Button fullWidth mt="xl" onClick={handleRegister}>Registrarse</Button>
        ) : (
          <Button fullWidth mt="xl" onClick={handleLogin}>Iniciar sesión</Button>
        )}
        <Button variant="subtle" fullWidth mt="md" onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? 'Ya tengo cuenta' : 'Crear una cuenta'}
        </Button>
      </Paper>
    </Container>
  );
}

export default AuthenticationTitle;
