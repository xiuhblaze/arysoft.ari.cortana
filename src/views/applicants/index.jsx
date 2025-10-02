import { Navigate, Route, Routes } from "react-router-dom";
import { DashboardLayout } from "../../layouts/dashboard"
import ApplicantsListView from "./ApplicantsListView";
import OrganizationEditView from "../organizations/OrganizationEditView";

const Applicants = () => {    
  return (
    <DashboardLayout>
        <Routes>
            <Route path="/" element={<ApplicantsListView />} />
            <Route path="*" element={ <Navigate replace to="/" /> } />
            <Route path="/:id" element={ <OrganizationEditView applicantsOnly /> } />
        </Routes>
    </DashboardLayout>
  )
}

export default Applicants;