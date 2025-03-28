import { useEffect } from "react";
import { useAppFormsStore } from "../../../hooks/useAppFormsStore"
import { useAuditCyclesStore } from "../../../hooks/useAuditCyclesStore";
import enums from "../../../helpers/enums";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faWindowMaximize } from "@fortawesome/free-solid-svg-icons";

const AppFormAuditCycleList = () => {

    const {
        AppFormOrderType,
        AppFormStatusType,
    } = enums();

    // CUSTOM HOOKS

    const {
        auditCycle
    } =useAuditCyclesStore();

    const {
        isAppFormsLoading,
        appForms,
        appFormsAsync,
        appFormsErrorMessage
    } = useAppFormsStore();

    // HOOKS

    useEffect(() => {
        
        if (!!auditCycle) {
            appFormsAsync({
                auditCycleID: auditCycle.ID,
                pageSize: 0,
                order: AppFormOrderType.createdDesc,
            });
        }
    }, []);

    const itemStyle = `d-flex justify-content-between align-items-center rounded-1 item-action gap-1 px-2 py-1`;

    // METHODS
    
    return (
        <div className="d-flex justify-content-start flex-wrap gap-2 mt-1 mb-0">
            { !!appForms && appForms.length > 0 && appForms.map(appForm =>
                <div key={appForm.ID} className={itemStyle}>
                    <div className="text-sm">
                        <FontAwesomeIcon icon={ faWindowMaximize } size="lg" className="text-dark text-gradient me-1" />
                    </div>
                    <div>
                        <h6 className="text-xs text-info text-gradient mb-0">
                            {appForm.StandardName}
                        </h6>
                        <p className="text-xs text-secondary mb-0">
                            Sites: 1 | Contacts: 1 | Employees: 34
                        </p>
                    </div>
                    <div className="text-end">
                        <button type="button" 
                            className="btn btn-link p-0 mb-0 text-secondary"
                            onClick={ () => { console.log('Editar appForm') } }
                            title="Edit application form"
                        >
                            <FontAwesomeIcon icon={ faEdit } size="lg" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AppFormAuditCycleList