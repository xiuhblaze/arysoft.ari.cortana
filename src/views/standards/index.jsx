import { Navigate, Route, Routes } from 'react-router-dom';

import { DashboardLayout } from '../../layouts/dashboard';

import StandardsListView from './StandardsListView';
import StandardEditView from './StandardEditView';

export const Standards = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={ <StandardsListView /> } />
        <Route path="*" element={ <Navigate replace to="/" /> } />
        <Route path="/:id" element={ <StandardEditView /> } />
      </Routes>
    </DashboardLayout>
  )
}

export default Standards;