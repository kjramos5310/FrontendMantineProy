import { IconReceiptOff, IconFileCode, IconCircleDotted, IconFlame } from '@tabler/icons-react';
import { Button, Grid, SimpleGrid, Text, ThemeIcon, Title } from '@mantine/core';
import classes from './FeaturesTitle.module.css';

const features = [
  {
    icon: IconReceiptOff,
    title: 'Proyecto de Gestión de Inventarios en PYMEs',
    description:
      'Este sistema PWA está diseñado para mejorar la gestión de inventarios en Pequeñas y Medianas Empresas (PYMEs), permitiendo un control eficiente de productos, movimientos y reportes.',
  },
  {
    icon: IconFileCode,
    title: 'Desarrollo con React.js y Mantine',
    description:
      'La aplicación está construida utilizando React.js como framework principal y Mantine como biblioteca de componentes UI, optimizando la accesibilidad y la usabilidad.',
  },
  {
    icon: IconCircleDotted,
    title: 'Interfaz amigable y accesible',
    description:
      'La interfaz de usuario ha sido diseñada para ser intuitiva y fácil de usar, lo que permite una navegación fluida incluso para usuarios con pocos conocimientos técnicos.',
  },
  {
    icon: IconFlame,
    title: 'Funciones principales',
    description:
      'Gestión de productos, registro de movimientos de inventario, generación de reportes y manejo de usuarios con roles diferenciados.',
  },
];

function FeaturesTitle() {
  const items = features.map((feature) => (
    <div key={feature.title}>
      <ThemeIcon
        size={44}
        radius="md"
        variant="gradient"
        gradient={{ deg: 133, from: 'blue', to: 'cyan' }}
      >
        <feature.icon size={26} stroke={1.5} />
      </ThemeIcon>
      <Text fz="lg" mt="sm" fw={500}>
        {feature.title}
      </Text>
      <Text c="dimmed" fz="sm">
        {feature.description}
      </Text>
    </div>
  ));

  return (
    <div className={classes.wrapper}>
      <Grid gutter={80}>
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Title className={classes.title} order={2}>
            Sistema de Gestión de Inventarios para PYMEs
          </Title>
          <Text c="dimmed">
            El sistema de gestión de inventarios en PYMEs está diseñado para optimizar las operaciones de pequeñas y medianas empresas mediante una interfaz accesible y amigable. Esta PWA tiene como objetivo mejorar la eficiencia operativa y facilitar la toma de decisiones basada en datos precisos y actualizados.
          </Text>

          <Button
            variant="gradient"
            gradient={{ deg: 133, from: 'blue', to: 'cyan' }}
            size="lg"
            radius="md"
            mt="xl"
          >
            Comienza Ahora
          </Button>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 7 }}>
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing={30}>
            {items}
          </SimpleGrid>
        </Grid.Col>
      </Grid>
    </div>
  );
}

export default FeaturesTitle;
