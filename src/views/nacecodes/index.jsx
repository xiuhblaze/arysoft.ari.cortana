import React from 'react'
import { DashboardLayout } from '../../layouts/dashboard'
import { Navigate, Route, Routes } from 'react-router-dom'
import ListView from './ListView'

export const Nacecodes = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={ <ListView /> } />
        <Route path="*" element={ <Navigate replace to="/" /> } />
      </Routes>
    </DashboardLayout>
  )
}

export default Nacecodes;