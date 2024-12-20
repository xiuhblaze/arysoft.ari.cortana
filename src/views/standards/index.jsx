import { Navigate, Route, Routes } from 'react-router-dom';

import { DashboardLayout } from '../../layouts/dashboard';

import ListView from './ListView';
import EditView from './EditView';

export const Standards = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={ <ListView /> } />
        <Route path="*" element={ <Navigate replace to="/" /> } />
        <Route path="/:id" element={ <EditView /> } />
      </Routes>
    </DashboardLayout>
  )
}

export default Standards;