import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuilding, faEdit, faStickyNote, faUser, faUsers, faWindowMaximize } from "@fortawesome/free-solid-svg-icons";

import enums from "../../../helpers/enums";
import { useAppFormsStore } from "../../../hooks/useAppFormsStore"
import { useAuditCyclesStore } from "../../../hooks/useAuditCyclesStore";
import AppFormModalEditItem from './AppFormModalEditItem';
import appFormStatusProps from "../helpers/appFormStatusProps";
import { ViewLoading } from "../../../components/Loaders";
import { AppFormControllerProvider } from "../context/appFormContext";
import { Spinner } from "react-bootstrap";

const AppFormAuditCycleList = React.memo(() => {
    const {
        AppFormOrderType,
    } = enums();

    // CUSTOM HOOKS

    const {
        auditCycle
    } = useAuditCyclesStore();

    const {
        isAppFormsLoading,
        appForms,
        appFormsAsync,
    } = useAppFormsStore();

    // HOOKS

    const [showModal, setShowModal] = useState(false);
    const [appFormID, setAppFormID] = useState(null);

    useEffect(() => {

        if (!!auditCycle) {
            appFormsAsync({
                auditCycleID: auditCycle.ID,
                pageSize: 0,
                order: AppFormOrderType.createdDesc,
            });
        }
    }, [auditCycle]);

    // METHODS

    const onShowModal = (id) => {
        setAppFormID(id);
        setShowModal(true);
    };

    const onCloseModal = () => {

        appFormsAsync({
            auditCycleID: auditCycle.ID,
            pageSize: 0,
            order: AppFormOrderType.createdDesc,
        });
        
        setShowModal(false);
    };
    
    return (
        <>
            <div className="d-flex justify-content-start flex-wrap gap-2 mt-1 mb-0">
                { 
                    isAppFormsLoading ? (
                        <div className="ms-3 my-3">
                            <Spinner animation="border" variant="secondary" role="status" size="sm">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </div>
                    ) : !!appForms && appForms.length > 0 && appForms.map(appForm => {
                    const itemStyle = `d-flex justify-content-between align-items-center rounded-1 item-action gap-2 px-2 py-1`;

                    return (
                        <div key={appForm.ID} className={itemStyle}>
                            <div className="text-sm">
                                <FontAwesomeIcon 
                                    icon={ faWindowMaximize } 
                                    size="lg" 
                                    className={`text-${ appFormStatusProps[appForm.Status].variant } text-gradient`}
                                    title={ appFormStatusProps[appForm.Status].description }
                                />
                            </div>
                            <div>
                                <h6 className="text-xs text-dark text-gradient mb-0">
                                    {appForm.StandardName}
                                </h6>
                                <div className="d-flex justify-content-start align-items-center text-xs text-secondary gap-1">
                                    <FontAwesomeIcon icon={ faStickyNote } 
                                        className={`text-${ appForm.NotesCount == 0 ? 'secondary' : 'warning' }`}
                                        title={ `${appForm.NotesCount} notes` }
                                    /> | 
                                    <span title="Sites">
                                        <FontAwesomeIcon icon={ faBuilding } />: { appForm.Sites?.length ?? '0' }
                                    </span> | 
                                    <span title="Contacts">
                                        <FontAwesomeIcon icon={ faUser } />: { appForm.Contacts != null ? appForm.Contacts.length : '0' }
                                    </span> | 
                                    <span title="Employees">
                                        <FontAwesomeIcon icon={ faUsers } />: { appForm.EmployeesCount }
                                    </span>
                                </div>
                            </div>
                            <div className="text-end">
                                <button type="button" 
                                    className="btn btn-link text-dark text-gradient p-0 mb-0"
                                    onClick={ () => { onShowModal(appForm.ID) } } 
                                    title="Edit application form"
                                >
                                    <FontAwesomeIcon icon={ faEdit } size="lg" />
                                </button>
                            </div>
                        </div>
                    )}
                )}
            </div>
            <AppFormControllerProvider>
                <AppFormModalEditItem show={ showModal } onHide={ onCloseModal } id={ appFormID } />
            </AppFormControllerProvider>
        </>
    )
});

export default AppFormAuditCycleList;