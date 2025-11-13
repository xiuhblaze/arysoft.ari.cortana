import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import Swal from "sweetalert2";

import { ADCControllerProvider } from "../context/ADCContext";
import { useADCsStore } from "../../../hooks/useADCsStore";
import { useAuditCyclesStore } from "../../../hooks/useAuditCyclesStore"
import ADCModalEditItem from "./ADCModalEditItem";
import enums from "../../../helpers/enums";
import ADCAuditCycleListItem from "./ADCAuditCycleListItem";

const ADCAuditCycleList = ({ showAll = false }) => {
    const { ADCStatusType } = enums();
    
    const { auditCycle } = useAuditCyclesStore();

    const {
        isADCsLoading,
        adc,
        adcs,
        adcsErrorMessage,

        adcsAsync,
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
            Swal.fire('Audit Day Calculation', adcsErrorMessage, 'error');
        }
    }, [adcsErrorMessage]);

    // METHODS
    
    const onShowModal = (id) => {
        
        setADCID(id);
        setShowModal(true);
    }; // onShowModal

    const onCloseModal = () => {

        if (!!adc && adc.Status < ADCStatusType.inactive) {
            adcsAsync({
                auditCycleID: auditCycle.ID,
                pageSize: 0,
            });
        }

        setShowModal(false);
    }; // onCloseModal
        
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
                    ) : !!adcs && adcs.length > 0 ? adcs
                        .filter(adc => showAll || adc.Status <= ADCStatusType.inactive)
                        .map(adc => <ADCAuditCycleListItem 
                            key={adc.ID} 
                            adc={adc} 
                            onShowModal={ () => { onShowModal(adc.ID) } }
                        />) : null
                }
            </div>
            <ADCControllerProvider>
                <ADCModalEditItem show={ showModal } onHide={ onCloseModal } id={ adcID } />
            </ADCControllerProvider>
        </>
    )
}

export default ADCAuditCycleList