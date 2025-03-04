import { IconGauge, IconUser, IconCookie } from '@tabler/icons-react';
import {
  Avatar,
  Badge,
  Card,
  Container,
  Group,
  SimpleGrid,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { ActionIcon, Menu } from '@mantine/core';
import { IconDots, IconMessages, IconNote, IconReportAnalytics, IconTrash } from '@tabler/icons-react';
import classes from './FeaturesCards.module.css';

const data = [
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png',
    name: 'Kris Olalla',
    job: 'Engineer',
    email: 'ksolalla@espe.edu.ec',
    rate: 5,
  },
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-5.png',
    name: 'Melany Vinueza',
    job: 'Engineer',
    email: 'mvinueza@espe.edu.ec',
    rate: 5,
  },
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-3.png',
    name: 'Kevin Ramos',
    job: 'Engineer',
    email: 'kjramosespe.edu.ec',
    rate: 5,
  },
];

function FeaturesCards() {
  const theme = useMantineTheme();

  const features = data.map((user) => (
    <Card key={user.name} shadow="md" radius="md" className={classes.card} padding="xl">
      <Avatar size={50} src={user.avatar} radius={50} mx="auto" />
      <Text fz="lg" fw={500} className={classes.cardTitle} mt="md" ta="center">
        {user.name}
      </Text>
      <Text fz="sm" c="dimmed" ta="center">
        {user.job}
      </Text>

      <Text fz="sm" c="dimmed" ta="center" mt="md">
        {user.email}
      </Text>

      {/* Menú para opciones adicionales */}
      <Group position="center" mt="md">
        <Menu transitionProps={{ transition: 'pop' }} withArrow position="bottom-end" withinPortal>
          <Menu.Target>
            <ActionIcon variant="subtle" color="gray">
              <IconDots size={16} stroke={1.5} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item leftSection={<IconMessages size={16} stroke={1.5} />}>
              Send message
            </Menu.Item>
            <Menu.Item leftSection={<IconNote size={16} stroke={1.5} />}>Add note</Menu.Item>
            <Menu.Item leftSection={<IconReportAnalytics size={16} stroke={1.5} />}>
              Analytics
            </Menu.Item>
            <Menu.Item leftSection={<IconTrash size={16} stroke={1.5} />} color="red">
              Terminate contract
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Card>
  ));

  return (
    <Container size="lg" py="xl">
      <Group justify="center">
        <Badge variant="filled" size="lg">
          Equipo de Trabajo
        </Badge>
      </Group>

      <Title order={2} className={classes.title} ta="center" mt="sm">
        Conoce a nuestra plantilla
      </Title>

      <Text c="dimmed" className={classes.description} ta="center" mt="md">
      Somos un equipo de profesionales dedicados a brindar resultados de alta calidad.
      </Text>

      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl" mt={50}>
        {features}
      </SimpleGrid>
    </Container>
  );
}

export default FeaturesCards;
