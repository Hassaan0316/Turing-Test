import React, { useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import jwtDecode from 'jwt-decode'
import { Button } from 'antd'
import { useApolloClient, useMutation } from '@apollo/client'
import moment, { min } from 'moment';
import AuthHook from 'utils/AuthHook'
import styles from '@styles/header.module.scss'
import { auth } from 'lib/apollo/mutations/authMutation'

interface IJwtInterface {
  name: string;
  exp: number;
  iat: number,
  username: string
}

const Header = () => {
  const router = useRouter();
  let interval: any = null;
  const [trigger] = useMutation(auth.refreshMutation);

  const updateRefreshToken = () => {
    const refreshToken = localStorage.getItem('refreshToken');
    refreshToken && localStorage.setItem('token', refreshToken);
    if (refreshToken) {
      trigger().then((res) => {
        const token = res.data.refreshTokenV2.access_token;
        const newRefreshToken = res.data.refreshTokenV2.refresh_token;
        localStorage.setItem('token', token)
        localStorage.setItem('token', newRefreshToken)
      }).catch((err) => {
        console.log(err)
      });
    }
  }

  const handleRefetchToken = async () => {
    interval = setInterval(() => {
      updateRefreshToken()
    }, 550000)
  }

  useEffect(() => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      handleRefetchToken()
    }
    return () => {
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: IJwtInterface = jwtDecode(token);
      const expTime = moment.unix(decoded.exp);
      const currentTime = moment();
      if (expTime.diff(currentTime, 'minutes') < 5 && expTime.diff(currentTime, 'minutes') > 0) {
        updateRefreshToken()
      }else if(expTime.diff(currentTime, 'minutes') <= 0 || expTime.diff(currentTime, 'minutes') > 10) {
        handleLogout()
      }
    }
  }, [])

  const handleLogout = async () => {
    localStorage.setItem('token', '');
    console.log('logging out');
    localStorage.setItem('refreshToken', '');
    router.push('/Login');
    clearInterval(interval)
    // await clearStore();
  }

  return (
    <div className={styles.headerWrapper}>
      <div className={styles.headerWrapper__content}>
        {/* <Image
          src={'/Assets/img/TLogo.png'}
          width={200}
          height={24}
          alt="logo"
        /> */}
        <Button type="primary" onClick={() => handleLogout()}>
          Logout
        </Button>
      </div>
    </div>
  )
}

export default AuthHook(Header);
