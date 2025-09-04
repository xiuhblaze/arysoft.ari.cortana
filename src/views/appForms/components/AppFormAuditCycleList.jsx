import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuilding, faEdit, faGear, faGears, faStickyNote, faUser, faUsers, faWindowMaximize } from "@fortawesome/free-solid-svg-icons";

import enums from "../../../helpers/enums";
import { useAppFormsStore } from "../../../hooks/useAppFormsStore"
import { useAuditCyclesStore } from "../../../hooks/useAuditCyclesStore";
import AppFormModalEditItem from './AppFormModalEditItem';
import appFormStatusProps from "../helpers/appFormStatusProps";
import { ViewLoading } from "../../../components/Loaders";
import { AppFormControllerProvider } from "../context/appFormContext";
import { Spinner } from "react-bootstrap";
import isNullOrEmpty from "../../../helpers/isNullOrEmpty";
import { useADCsStore } from "../../../hooks/useADCsStore";
import { useShiftsStore } from "../../../hooks/useShiftsStore";

const AppFormAuditCycleList = React.memo(() => {
    const {
        AppFormStatusType,
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

    const {
        adcsAsync,
    } = useADCsStore();

    const {
        shiftSavedOk,
    } = useShiftsStore();

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

    useEffect(() => {
        if (!!shiftSavedOk) {
            //console.log('shiftSavedOk, actualizar la lista de appForms y de ADCs', shiftSavedOk);
            appFormsAsync({
                auditCycleID: auditCycle.ID,
                pageSize: 0,
                order: AppFormOrderType.createdDesc,
            });

            adcsAsync({
                auditCycleID: auditCycle.ID,
                pageSize: 0,
            });
        }
    }, [shiftSavedOk]);

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

        adcsAsync({
            auditCycleID: auditCycle.ID,
            pageSize: 0,
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
                        const itemStyle = `d-flex justify-content-between align-items-center rounded-1 ${ appFormStatusProps[appForm.Status].bgCss } gap-2 px-2 py-1`;

                        let standardName = '';
                        let sitesCount = 0;
                        let contactsCount = 0;
                        let employeesCount = 0;
                        
                        if (appForm.Status >= AppFormStatusType.inactive) {                            
                            if (!!appForm.HistoricalDataJSON) {
                                const historicalData = JSON.parse(appForm.HistoricalDataJSON);

                                standardName = historicalData?.StandardName ?? '';
                                sitesCount = historicalData?.Sites?.length ?? 0;
                                contactsCount = historicalData?.Contacts?.length ?? 0;
                                employeesCount = historicalData?.SitesEmployeesCount ?? 0;
                            }
                        } else {
                            standardName = appForm.StandardName;
                            sitesCount = appForm.Sites?.length ?? 0;
                            contactsCount = appForm.Contacts?.length ?? 0;
                            employeesCount = appForm.EmployeesCount;
                        }

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
                                        {standardName}
                                    </h6>
                                    {
                                        !isNullOrEmpty(appForm.Description) && 
                                        <p className="text-xs text-secondary text-wrap mb-0"> 
                                            {appForm.Description}
                                        </p>
                                    }
                                    <div className="d-flex justify-content-start align-items-center text-xs text-secondary gap-1">
                                        <FontAwesomeIcon icon={ faStickyNote } 
                                            className={`text-${ appForm.NotesCount == 0 ? 'secondary' : 'warning' }`}
                                            title={ `${appForm.NotesCount} notes` }
                                        /> | 
                                        <span title="Sites">
                                            <FontAwesomeIcon icon={ faBuilding } />: { sitesCount }
                                        </span> | 
                                        <span title="Contacts">
                                            <FontAwesomeIcon icon={ faUser } />: { contactsCount }
                                        </span> | 
                                        <span title="Employees">
                                            <FontAwesomeIcon icon={ faUsers } />: { employeesCount }
                                        </span>
                                    </div>
                                </div>
                                <div className="text-end">
                                    <button type="button" 
                                        className="btn btn-link text-dark text-gradient p-0 mb-0"
                                        onClick={ () => { onShowModal(appForm.ID) } } 
                                        title="Edit application form"
                                    >
                                        <FontAwesomeIcon icon={ faGear } size="lg" />
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