import type { ChangeEvent } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

import { useLoginMutation } from '../../services/endpoints/user';
import type { ILoginRequestBody } from '../../services/endpoints/user/types';
import { getErrorMessage } from '../../services/helpers';

export const useLogin = () => {
  const [loginCredentials, setLoginCredentials] = useState<ILoginRequestBody>({
    email: '',
    password: '',
  });
  const [errorMsg, setErrorMsg] = useState('');

  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();

  const onCredentialsChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    setLoginCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignIn = async () => {
    setErrorMsg('');
    const result = await login(loginCredentials);

    if (!result.error) {
      navigate('/');
      return;
    }
    setErrorMsg(getErrorMessage(result.error));
  };

  return {
    loginCredentials,
    errorMsg,
    isLoading,
    handleSignIn,
    onCredentialsChange,
  };
};
