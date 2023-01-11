import { useEffect, useState } from 'react';
import { Form, Input, Button } from 'antd';
import { useApolloClient, useMutation } from '@apollo/client';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { auth } from 'lib/apollo/mutations/authMutation';
import styles from '@styles/login.module.scss';
import { useRouter } from 'next/router';
import HeaderAuth from '@container/Header/HeaderAuth';

const initialState = {
  username: '',
  password: '',
};

export const LoginForm = () => {
  const [formStates, setFormStates] = useState(initialState);
  const [onLogin] = useMutation(auth.loginMutation);
  const router = useRouter();
  const { resetStore, clearStore } = useApolloClient();

  useEffect(() => {
    // const token = Cookies.get('token');
    // const refreshToken = Cookies.get('refreshToken');
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    if (token && refreshToken) {
      router.push('/');
    }
  }, []);

  const onFinish = async () => {
    try {
      const data = await onLogin({
        variables: {
          username: formStates.username,
          password: formStates.password,
        },
      });
      const token = data?.data?.login?.access_token;
      const refresh_token = data?.data?.login?.refresh_token;
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refresh_token);
      // Cookies.set('token', token);
      // Cookies.set('refreshToken', refresh_token);
      router.push('/');
      await resetStore();
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormStates({ ...formStates, [e.target.name]: e.target.value });
  };

  return (
    <>
      <HeaderAuth />
      <div className={styles.loginWrapper}>
        <Form
          name="basic"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}>
            <Input
              prefix={<UserOutlined />}
              placeholder="Email"
              name="username"
              value={formStates.username}
              onChange={e => handleChange(e)}
            />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}>
            <Input.Password
              name="password"
              prefix={<LockOutlined />}
              value={formStates.password}
              onChange={e => handleChange(e)}
            />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default LoginForm;
