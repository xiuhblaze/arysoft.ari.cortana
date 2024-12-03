import { Navigate, Route, Routes } from "react-router-dom"
import { DashboardLayout } from "../../layouts/dashboard"
import AuditorsListView from "./AuditorsListView"

export const Auditors = () => {
    return (
        <DashboardLayout>
            <Routes>
                <Route path="/" element={ <AuditorsListView /> } />
                <Route path="*" element={ <Navigate replace to="/" /> } />
            </Routes>
        </DashboardLayout>
    )
}

export default Auditors;