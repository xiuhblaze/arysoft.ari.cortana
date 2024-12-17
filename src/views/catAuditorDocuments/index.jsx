import { Navigate, Route, Routes } from "react-router-dom";
import { DashboardLayout } from "../../layouts/dashboard";

import CatAuditorDocumentsListView from "./CatAuditorDocumentsListView";
import CatAuditorDocumentEditView from "./CatAuditorDocumentEditView";

export const CatAuditorDocuments = () => {
    return (
        <DashboardLayout>
            <Routes>
                <Route path="/" element={ <CatAuditorDocumentsListView /> } />
                <Route path="*" element={ <Navigate replace to="/" /> } />
                <Route path="/:id" element={ <CatAuditorDocumentEditView /> } />
            </Routes>
        </DashboardLayout>
    )
};

export default CatAuditorDocuments;