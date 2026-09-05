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
import { useLogin } from './useLogin';

const Login = () => {
  const { loginCredentials, onCredentialsChange, errorMsg, isLoading, handleSignIn } = useLogin();

  return (
    <Center h="100vh" w="100%">
      <Container size={420} mb={100}>
        <Title ta="center" className={styles.title}>
          Welcome back!
        </Title>

        <Text className={styles.subtitle}>Please add your credentials</Text>

        <Paper w="400px" withBorder shadow="sm" p={22} mt={15} radius="md">
          <TextInput
            label="Email"
            required
            name="email"
            value={loginCredentials.email}
            onChange={onCredentialsChange}
          />
          <PasswordInput
            label="Password"
            required
            mt="md"
            name="password"
            value={loginCredentials.password}
            onChange={onCredentialsChange}
          />
          {errorMsg && (
            <Text c="red" size="sm" mt="md">
              {errorMsg}
            </Text>
          )}
          <Button fullWidth mt="sm" radius="md" loading={isLoading} onClick={handleSignIn}>
            Sign in
          </Button>
        </Paper>
      </Container>
    </Center>
  );
};

export default Login;
