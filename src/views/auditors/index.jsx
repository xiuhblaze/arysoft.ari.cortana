import { Navigate, Route, Routes } from "react-router-dom";

import { DashboardLayout } from "../../layouts/dashboard";

import AuditorsListView from "./AuditorsListView";
import AuditorEditView from "./AuditorEditView";

export const Auditors = () => {
    return (
        <DashboardLayout>
            <Routes>
                <Route path="/" element={ <AuditorsListView /> } />
                <Route path="*" element={ <Navigate replace to="/" /> } />
                <Route path="/:id" element={ <AuditorEditView /> } />
            </Routes>
        </DashboardLayout>
    )
}

export default Auditors;