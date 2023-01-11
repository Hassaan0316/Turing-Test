import React from 'react'
import Image from 'next/image'
import styles from '@styles/header.module.scss'

const HeaderAuth = () => {
  return (
    <div className={styles.headerWrapper}>
      <div className={styles.headerWrapper__content}>
        <Image
          src={'/Assets/img/TLogo.png'}
          width={200}
          height={24}
          alt="logo"
        />
      </div>
    </div>
  )
}

export default HeaderAuth;
