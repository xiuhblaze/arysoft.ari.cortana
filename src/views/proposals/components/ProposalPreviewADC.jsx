import { Fragment, useEffect, useState } from "react";
import { useProposalController } from "../context/ProposalContext";
import auditCycleProps from "../../auditCycles/helpers/auditCycleProps";
import enums from "../../../helpers/enums";
import { cy } from "date-fns/locale";
import auditStepProps from "../../audits/helpers/auditStepProps";

const ProposalPreviewADC = () => {
    const headerStyle = 'col-3 text-xs text-wrap font-weight-bold bg-light';
    const subHeaderStyle = 'text-xs text-dark text-center align-middle font-weight-bold text-wrap bg-light';
    const bodyStyle = 'text-xs text-center text-wrap';
    const totalStyle = 'text-xs text-dark text-center font-weight-bold text-wrap';
    const separatorStyle = { height: '.25rem' };

    const { 
        AuditCyclePeriodicityType,
        AuditCycleType,
        AuditStepType,
    } = enums();

    const [ controller, dispatch ] = useProposalController();

    const {
        proposalData,
    } = controller;

    if (!proposalData) { return null; }  

    // HOOKS

    const [totals, setTotals] = useState({ //! Aquyi me quedé, ver que se muestren los totales
        firstYear: 0,
        secondYear: 0,
        thirdYear: 0,
    });

     // proposalData.AuditCycle.AuditCycleStandards[].CycleType // Para ver en que punto inicia la tabla 

     // 1. Por cada ADC hacer una tabla y ver si son Initial o Recertification
     // 2. Crear los encabezados de la tabla de acuerdo al CycleType
     // 3. Buscar del ADC los sites y de el los ADCSiteAudit para ver si participan en el Step
     //    - Si es el caso, mostrar el número de días de acuerdo al ADC y su tipo (inital, surv, recertificación)
     
    const { ADCs } = proposalData;

    ADCs.forEach(adc => {
        console.log('adc', adc);
        // console.log('Tabla para ADC', adc.AppFormStandardName);

        // console.log('Buscar el CycleType del ADC: ', adc.AppFormStandardID);
        const cycleType = proposalData.AuditCycle.AuditCycleStandards.find(acs => acs.StandardID == adc.AppFormStandardID).CycleType;
        //console.log('CycleType', auditCycleProps[cycleType].label);

        // if (cycleType == AuditCycleType.initial) {
        //     console.log('Poner St1 y St2');
        // }

        // if (cycleType == AuditCycleType.recertification) {
        //     console.log('Poner RR');
        // }

        // if (proposalData.AuditCycle.Periodicity == AuditCyclePeriodicityType.annual) {
        //     console.log('S1 y S2');
        // } else if (proposalData.AuditCycle.Periodicity == AuditCyclePeriodicityType.biannual) {
        //     console.log('S1, S2, S3, S4 y S5');
        // }

        const adcSites = proposalData.ADCSites.filter(adcSite => adcSite.ADCID == adc.ID);
        console.log('ADCSites', adcSites);
    });

    return (
        <table className="table table-borderless table-hover mx-print-3">
            <thead>
                <tr>
                    <th colSpan={5} className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                        Audit Days Calculation
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td className={ `${headerStyle} align-middle text-center` } rowSpan={2}>Sites/Stage</td>
                    <td className={ `${subHeaderStyle} col-3` } colSpan={2}>First year</td>
                    <td className={ `${subHeaderStyle} col-3` } colSpan={2}>Second year</td>
                    <td className={ `${subHeaderStyle} col-3` } colSpan={2}>Third year</td>
                </tr>
                {
                    ADCs.map(adc => {
                        const cycleType = proposalData.AuditCycle.AuditCycleStandards.find(acs => acs.StandardID == adc.AppFormStandardID).CycleType;

                        return (
                            <Fragment key={adc.ID}>
                                <tr>
                                    {
                                        cycleType == AuditCycleType.initial 
                                            ? (<>
                                                <td className={ subHeaderStyle }>
                                                    Stage 1
                                                    <br />
                                                    <small className="text-secondary text-xxs">
                                                        (Evaluation of readiness for certification audit)
                                                    </small>
                                                </td>
                                                <td className={ subHeaderStyle }>
                                                    Stage 2
                                                    <br />
                                                    <small className="text-secondary text-xxs">
                                                        (Renewal of certification)
                                                    </small>
                                                </td>
                                            </>)
                                            : cycleType == AuditCycleType.recertification
                                                ? (<td className={ subHeaderStyle } colSpan={2}>
                                                        Recertification
                                                    </td>)
                                                : null
                                    }
                                    {
                                        proposalData.AuditCycle.Periodicity == AuditCyclePeriodicityType.annual
                                        ? <>
                                            <td className={ subHeaderStyle } colSpan={2}>Surveillance 1</td>
                                            <td className={ subHeaderStyle } colSpan={2}>Surveillance 2</td>
                                        </>
                                        : proposalData.AuditCycle.Periodicity == AuditCyclePeriodicityType.biannual
                                        ? <>
                                            <td className={ subHeaderStyle }>Surveillance 1</td>
                                            <td className={ subHeaderStyle }>Surveillance 2</td>
                                            <td className={ subHeaderStyle }>Surveillance 3</td>
                                            <td className={ subHeaderStyle }>Surveillance 4</td>
                                            <td className={ subHeaderStyle }>Surveillance 5</td>
                                        </>
                                        : null
                                    }
                                </tr>
                                {
                                    proposalData.ADCSites.filter(adcSite => adcSite.ADCID == adc.ID).map(adcSite => {
                                        return (
                                            <tr key={adcSite.ID}>
                                                <td className={ headerStyle }>
                                                    { adcSite.SiteDescription }
                                                </td>
                                                {
                                                    cycleType == AuditCycleType.initial ? (
                                                        <>
                                                            <td className={ bodyStyle }>
                                                                {
                                                                    adcSite.ADCSiteAudits.find(adcSiteAudit => 
                                                                        adcSiteAudit.AuditStep == AuditStepType.stage1
                                                                    )?.Value ? adcSite.Total : '-'
                                                                }
                                                            </td>
                                                            <td className={ bodyStyle }>
                                                                {
                                                                    adcSite.ADCSiteAudits.find(adcSiteAudit => 
                                                                        adcSiteAudit.AuditStep == AuditStepType.stage2
                                                                    ).Value ? adcSite.Total : '-'
                                                                }
                                                            </td>
                                                        </>
                                                    ) : cycleType == AuditCycleType.recertification ? (
                                                        <>
                                                            <td className={ bodyStyle } colSpan={2}>
                                                                {
                                                                    adcSite.ADCSiteAudits.find(adcSiteAudit => 
                                                                        adcSiteAudit.AuditStep == AuditStepType.recertification
                                                                    ).Value ? adcSite.Recertification : '-'
                                                                }
                                                            </td>
                                                        </>
                                                    ) : null
                                                }
                                                {
                                                    proposalData.AuditCycle.Periodicity == AuditCyclePeriodicityType.annual ? (
                                                        <>
                                                            <td className={ bodyStyle } colSpan={2}>
                                                                {
                                                                    adcSite.ADCSiteAudits.find(adcSiteAudit => 
                                                                        adcSiteAudit.AuditStep == AuditStepType.surveillance1
                                                                    ).Value ? adcSite.Surveillance : '-'
                                                                }
                                                            </td>
                                                            <td className={ bodyStyle } colSpan={2}>
                                                                { showAuditDays(adcSite, AuditStepType.surveillance2) }
                                                            </td>
                                                        </>
                                                    ) : proposalData.AuditCycle.Periodicity == AuditCyclePeriodicityType.biannual ? (
                                                        <>
                                                            <td className={ bodyStyle } >
                                                                { showAuditDays(adcSite, AuditStepType.surveillance1) }
                                                            </td>
                                                            <td className={ bodyStyle } >
                                                                { showAuditDays(adcSite, AuditStepType.surveillance2) }
                                                            </td>
                                                            <td className={ bodyStyle } >0</td>
                                                            <td className={ bodyStyle } >0</td>
                                                            <td className={ bodyStyle } >0</td>
                                                        </>
                                                    ) : null

                                                }
                                            </tr>
                                        );
                                    })
                                }
                            </Fragment>
                        );
                    })
                }
                {/* <tr>
                    <td className={ subHeaderStyle }>
                        Stage 1
                        <br />
                        <small className="text-secondary text-xxs">
                            (Evaluation of readiness for certification audit)
                        </small>
                    </td>
                    <td className={ subHeaderStyle }>
                        Stage 2
                        <br />
                        <small className="text-secondary text-xxs">
                            (Renewal of certification)
                        </small>
                    </td>
                    <td className={ subHeaderStyle }>Surveillance 1</td>
                    <td className={ subHeaderStyle }>Surveillance 2</td>
                </tr> 
                <tr>
                    <td className={ headerStyle }>Main site</td>
                    <td className={ bodyStyle }>1</td>
                    <td className={ bodyStyle }>1</td>
                    <td className={ bodyStyle }>1</td>
                    <td className={ bodyStyle }>1</td>
                </tr>
                <tr>
                    <td className={ headerStyle }>Total</td>
                    <td className={ totalStyle }>$ 1,000.00</td>
                    <td className={ totalStyle }>$ 1,000.00</td>
                    <td className={ totalStyle }>$ 1,000.00</td>
                    <td className={ totalStyle }>$ 1,000.00</td>
                </tr>*/}
            </tbody>
        </table>
    )
}; // ProposalPreviewADC

const showAuditDays = (adcSite, auditStepType) => {

    const days = adcSite.ADCSiteAudits.find(adcSiteAudit => 
        adcSiteAudit.AuditStep == auditStepType
    ).Value ? adcSite.Surveillance : '-'

    return days;
} // showAuditDays

export default ProposalPreviewADC;