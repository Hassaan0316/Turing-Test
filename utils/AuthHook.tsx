import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { LoadingOutlined } from '@ant-design/icons';

function AuthHook(Component: any) {
  return function requireAuth(props: any) {
    const router = useRouter();
    const [token, setToken] = useState<any>();
    const [loading, setLoading] = useState(true);

    const logout = () => {
      localStorage.setItem('token', '');
      router.push('/Login')
    }

    useEffect(() => {
      const tokenFromCookie = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refreshToken');
      if (tokenFromCookie && refreshToken) {
        setToken(tokenFromCookie)
      } else { logout() }
    }, []);

    useEffect(() => {
      if (token) {
        setLoading(false);
      }
    }, [token]);

    if (loading)
      return (
        <div
          style={{
            background: '#FFF',
            zIndex: 1111,
            alignItems: 'center',
            display: 'flex',
            position: 'fixed',
            height: '100vh',
            width: '100%',
            justifyContent: 'center',
          }}>
          <LoadingOutlined style={{ fontSize: 24 }} spin />
        </div>
      );

    return  <Component {...props} />
  };
}

export default AuthHook;
