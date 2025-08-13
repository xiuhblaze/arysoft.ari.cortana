import { useEffect, useState } from "react";
import { useAuditCyclesStore } from "../../../hooks/useAuditCyclesStore"
import { useADCsStore } from "../../../hooks/useADCsStore";
import { Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuilding, faCalendarDay, faEdit, faFileLines, faStickyNote, faUsers, faWindowMaximize } from "@fortawesome/free-solid-svg-icons";
import isNullOrEmpty from "../../../helpers/isNullOrEmpty";
import ADCModalEditItem from "./ADCModalEditItem";
import { ADCControllerProvider } from "../context/ADCContext";
import Swal from "sweetalert2";
import enums from "../../../helpers/enums";
import adcAlertsProps from "../helpers/adcAlertsProps";
import adcStatusProps from "../helpers/adcStatusProps";

const ADCAuditCycleList = () => {
    const { ADCAlertType } = enums();

    const { auditCycle } = useAuditCyclesStore();

    const {
        isADCsLoading,
        adcs,
        adcsAsync,
        adcsErrorMessage,
    } = useADCsStore();

    // HOOKS

    const [showModal, setShowModal] = useState(false);
    const [adcID, setADCID] = useState(null);

    useEffect(() => {

        if (!!auditCycle) {
            adcsAsync({
                auditCycleID: auditCycle.ID,
                pageSize: 0,
            });
        }
    }, [auditCycle]);

    useEffect(() => {
        if (!!adcsErrorMessage) {
            // console.log(`ADCAuditCycleList(error): ${ adcsErrorMessage }`);
            Swal.fire('Audit Day Calculation', adcsErrorMessage, 'error');
        }
    }, [adcsErrorMessage]);

    // METHODS
    
    const onShowModal = (id) => {
        
        setADCID(id);
        setShowModal(true);
    };

    const onCloseModal = () => {

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
                    isADCsLoading ? (
                        <div className="ms-3 my-3">
                            <Spinner animation="border" variant="secondary" role="status" size="sm">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </div>
                    ) : !!adcs && adcs.length > 0 ? adcs.map(adc => {
                        const itemStyle = `d-flex justify-content-between align-items-center rounded-1 item-action gap-2 px-2 py-1`;

                        return (
                            <div key={adc.ID} className={itemStyle}>
                                <div className="text-sm">
                                    <FontAwesomeIcon 
                                        icon={ faWindowMaximize } 
                                        size="lg" 
                                        className={`text-${ !!adc.Alerts && adc.Alerts.length > 0 
                                            ? 'danger' 
                                            : adcStatusProps[adc.Status].variant 
                                        } text-gradient`}  
                                        title={ !!adc.Alerts && adc.Alerts.length > 0 
                                            ? 'The ADC have alerts, see the details'
                                            : adcStatusProps[adc.Status].description 
                                        }
                                    />
                                </div>
                                <div>
                                    <h6 className="text-xs text-dark text-gradient mb-0">
                                        {adc.AppFormStandardName}
                                    </h6>
                                    {
                                        !isNullOrEmpty(adc.Description) && 
                                        <p className="text-xs text-secondary text-wrap mb-0"> 
                                            {adc.Description}
                                        </p>
                                    }
                                    <div className="d-flex justify-content-start align-items-center text-xs text-secondary gap-1">
                                        <FontAwesomeIcon icon={ faStickyNote } 
                                            className={`text-${ adc.NotesCount == 0 ? 'secondary' : 'warning' }`}
                                            title={ `${adc.NotesCount} notes` }
                                        /> | 
                                        <span title="Sites">
                                            <FontAwesomeIcon icon={ faBuilding } />: { adc.ADCSitesCount ?? '0' }
                                        </span> | 
                                        <span title="Total initial (days)">
                                            <FontAwesomeIcon icon={ faCalendarDay } />: {adc.TotalInitial ?? '0'}
                                        </span> |
                                        <span title="Total employees">
                                            <FontAwesomeIcon icon={ faUsers } />: { adc.TotalEmployees ?? '0' }
                                        </span>
                                    </div>
                                </div>
                                <div className="text-end">
                                    <button type="button" 
                                        className="btn btn-link text-dark text-gradient p-0 mb-0"
                                        onClick={ () => { onShowModal(adc.ID) } } 
                                        title="Edit ADC"
                                    >
                                        <FontAwesomeIcon icon={ faEdit } size="lg" />
                                    </button>
                                </div>
                            </div>
                        );
                    }) : null
                }
            </div>
            <ADCControllerProvider>
                <ADCModalEditItem show={ showModal } onHide={ onCloseModal } id={ adcID } />
            </ADCControllerProvider>
        </>
    )
}

export default ADCAuditCycleList