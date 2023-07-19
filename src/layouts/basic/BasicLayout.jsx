import React from 'react'
import { DefaultNavbar } from '../../components/DefaultNavbar';

export const BasicLayout = ({children}) => {
  return (
    <>
      <DefaultNavbar />
      <main className="main-content mt-0 ps">
        { children }
      </main>
    </>
  )
}

export default BasicLayout;