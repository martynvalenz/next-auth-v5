'use client';

import { signOut } from 'next-auth/react';
import React from 'react'

interface Props {
  children?: React.ReactNode;
}

const LogoutButton = ({children}:Props) => {
  const singOutUser = () => {
    signOut();
  }
  
  return (
    <span onClick={singOutUser} className="cursor-pointer">
      {children}
    </span>
  )
}

export default LogoutButton