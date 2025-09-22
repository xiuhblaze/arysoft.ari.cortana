import { Navigate, Route, Routes } from "react-router-dom";

import { DashboardLayout } from "../../layouts/dashboard";
import ADCConceptListView from "./ADCConceptListView";
import ADCConceptEditView from "./ADCConceptEditView";

export const ADCConcepts = () => {
    return (
        <DashboardLayout>
            <Routes>
                <Route path="/" element={ <ADCConceptListView /> } />
                <Route path="*" element={ <Navigate replace to="/" /> } />
                <Route path="/:id" element={ <ADCConceptEditView /> } />
            </Routes>
        </DashboardLayout>
    );
};

export default ADCConcepts;