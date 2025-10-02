import { Navigate, Route, Routes } from 'react-router-dom';

import { DashboardLayout } from '../../layouts/dashboard';

import OrganizationsListView from './OrganizationsListView';
import OrganizationEditView from './OrganizationEditView';

export const Organizations = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={ <OrganizationsListView /> } />
        <Route path="*" element={ <Navigate replace to="/" /> } />
        <Route path="/:id" element={ <OrganizationEditView /> } />
      </Routes>
    </DashboardLayout>
  )
}

export default Organizations;