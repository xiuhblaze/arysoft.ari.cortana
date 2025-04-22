import { Navigate, Route, Routes } from "react-router-dom";
import { DashboardLayout } from "../../layouts/dashboard";

import AuditListView from "./AuditListView";

export const Audits = () => {
    return (
        <DashboardLayout>
            <Routes>
                <Route path="/" element={ <AuditListView /> } />
                <Route path="*" element={ <Navigate replace to="/" /> } />
                {/* <Route path="/:id" element={ <EditView /> } /> */}
            </Routes>
        </DashboardLayout>
    );
};

export default Audits;