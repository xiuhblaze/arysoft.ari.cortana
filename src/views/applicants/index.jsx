import { Navigate, Route, Routes } from "react-router-dom";
import { DashboardLayout } from "../../layouts/dashboard"
import ApplicantsListView from "./ApplicantsListView";
import EditView from "../organizations/EditView";

const Applicants = () => {    
  return (
    <DashboardLayout>
        <Routes>
            <Route path="/" element={<ApplicantsListView />} />
            <Route path="*" element={ <Navigate replace to="/" /> } />
            <Route path="/:id" element={ <EditView applicantsOnly /> } />
        </Routes>
    </DashboardLayout>
  )
}

export default Applicants;