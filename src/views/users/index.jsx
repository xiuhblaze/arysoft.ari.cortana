import { Navigate, Route, Routes } from "react-router-dom";
import { DashboardLayout } from "../../layouts/dashboard";

import UsersListView from "./UsersListView";
import UsersEditView from "./UsersEditView";
import { useAuthStore } from "../../hooks/useAuthStore";

const Users = () => {
    
    const { 
        ROLES,
        hasRole,
    } = useAuthStore();

    if (!hasRole(ROLES.admin)) return <Navigate replace to="/" />;

    return (
        <DashboardLayout>
            <Routes>
                <Route path="/" element={<UsersListView />} />
                <Route path="*" element={ <Navigate replace to="/" /> } />
                <Route path="/:id" element={ <UsersEditView /> } />
            </Routes>
        </DashboardLayout>
    )
}

export default Users;