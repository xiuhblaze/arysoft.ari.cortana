import { Navigate, Route, Routes } from 'react-router-dom';

import { DashboardLayout } from '../../layouts/dashboard';

import NacecodesListView from './NacecodesListView';
import NacecodeEditView from './NacecodeEditView';

export const Nacecodes = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={ <NacecodesListView /> } />
        <Route path="*" element={ <Navigate replace to="/" /> } />
        <Route path="/:id" element={ <NacecodeEditView /> } />
      </Routes>
    </DashboardLayout>
  )
}

export default Nacecodes;