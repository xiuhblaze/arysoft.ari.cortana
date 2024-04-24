import { Navigate, Route, Routes } from 'react-router-dom';

import { DashboardLayout } from "../../layouts/dashboard";

import ApplicationFormListView from './ApplicationFormListView';
import ApplicationFormEditView from './ApplicationFormEditView';

export const ApplicationForms = () => {
    return (
        <DashboardLayout>
            <Routes>
                <Route path="/" element={ <ApplicationFormListView /> } />
                <Route path="*" element={ <Navigate replace to="/" /> } />
                <Route path="/:id" element={ <ApplicationFormEditView /> } />
            </Routes>
        </DashboardLayout>
    );
};

export default ApplicationForms;