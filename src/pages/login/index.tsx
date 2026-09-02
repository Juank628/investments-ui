import {
  Button,
  Container,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
  Center,
} from '@mantine/core';

import styles from './styles.module.css';

const Login = () => {
  return (
    <Center h="100vh" w="100%">
      <Container size={420} mb={100}>
        <Title ta="center" className={styles.title}>
          Welcome back!
        </Title>

        <Text className={styles.subtitle}>Please add your credentials</Text>

        <Paper w="400px" withBorder shadow="sm" p={22} mt={15} radius="md">
          <TextInput label="Email" placeholder="you@mantine.dev" required radius="md" />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            radius="md"
          />
          <Button fullWidth mt="xl" radius="md">
            Sign in
          </Button>
        </Paper>
      </Container>
    </Center>
  );
};

export default Login;
