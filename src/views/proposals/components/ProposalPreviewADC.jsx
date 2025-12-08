import { memo, useEffect, useState } from "react";

import { useProposalController } from "../context/ProposalContext";
import enums from "../../../helpers/enums";
import aryMathTools from "../../../helpers/aryMathTools";
import ProposalPreviewADCTotalRowItem from "./ProposalPreviewADCTotalRowItem";

const {
    roundToDecimals,
    roundToHalf
} = aryMathTools();

const ProposalPreviewADC = memo(() => {
    const headerStyle = 'text-md text-wrap font-weight-bold bg-light';
    const headerColStyle = 'col-3 text-xs text-wrap font-weight-bold bg-light';
    const subHeaderStyle = 'text-xs text-dark text-center align-middle font-weight-bold text-wrap bg-light';
    const bodyStyle = 'text-xs text-center text-wrap';
    const totalStyle = 'text-xs text-dark text-end font-weight-bold text-wrap';
    const separatorStyle = { height: '.25rem' };

    const {
        ADCStatusType,
        AuditCyclePeriodicityType,
        AuditCycleType,
        AuditStepType,
    } = enums();

    const [controller, dispatch] = useProposalController();

    const {
        proposalData,
        adcList,
        proposalAuditList,
        includeTravelExpenses,
    } = controller;

    // HOOKS

    const [firstADC, setFirstADC] = useState(null);
    const [cycleType, setCycleType] = useState(null);
    const [proposalAuditFirstYear, setProposalAuditFirstYear] = useState(null);

    useEffect(() => {
        
        if (!!proposalData && !!adcList && !!proposalAuditList) {
            //console.log('ProposalPreviewADC.jsx: proposalData', proposalData);

            setFirstADC(adcList.find(adc => adc.Status <= ADCStatusType.inactive));
            const auditCycleStandard = proposalData.AuditCycle.AuditCycleStandards   //TODO: Considerar que este se va a obtener en combinacion de varios ADCs
                .find(acs => acs.StandardID == firstADC?.AppFormStandardID);
            setCycleType(auditCycleStandard?.CycleType ?? 0);
            setProposalAuditFirstYear(cycleType == AuditCycleType.initial
                ? proposalAuditList.find(proposalAudit => proposalAudit.AuditStep == AuditStepType.stage2)
                : cycleType == AuditCycleType.recertification
                    ? proposalAuditList.find(proposalAudit => proposalAudit.AuditStep == AuditStepType.recertification)
                    : null); // TODO: Va a ser Transfer, falta
        }
    }, [proposalData])

    //TODO: Para multiples ADCs considerar si al menos uno es Initial (anyADCInitial), con ello se puede validar la tabla 
    //TODO: para mostrar St1 y St2 de esta forma si hay alguno otro ADC que sea Recertification, sus valores se pueden 
    //TODO: mostrar en la columna St2 (o combinar las dos celdas -colSpan) - Esto es a futuro, ahora NO

    const showAuditDays = (adcSite, auditStepType) => {
        const days = adcSite.ADCSiteAudits.find(adcSiteAudit =>
            adcSiteAudit.AuditStep == auditStepType
        ).Value ? adcSite.Surveillance : '-'

        return days;
    } // showAuditDays

    const showTotalAuditDays = (auditStep) => {
        const proposalAudit = proposalAuditList.find(proposalAudit =>
            proposalAudit.AuditStep == auditStep
        );

        return roundToHalf(!!proposalAudit ? proposalAudit.TotalAuditDays : 0, 2);
    }; // showTotalAuditDays


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
                    <td className={`${headerStyle} align-middle text-center`}>{/* Sites/Stage */}</td>
                    <td className={`${subHeaderStyle} col-3`} colSpan={2}>First year</td>
                    <td className={`${subHeaderStyle} col-3`} colSpan={2}>Second year</td>
                    <td className={`${subHeaderStyle} col-3`} colSpan={2}>Third year</td>
                </tr>
                <tr>
                    <td className={`${subHeaderStyle} col-3`}>Sites/Stage</td>
                    {
                        cycleType == AuditCycleType.initial ? (
                            <>
                                <td className={subHeaderStyle}>
                                    Stage 1
                                    <br />
                                    <small className="text-secondary text-xxs">
                                        (Evaluation of readiness for certification audit)
                                    </small>
                                </td>
                                <td className={subHeaderStyle}>
                                    Stage 2
                                    <br />
                                    <small className="text-secondary text-xxs">
                                        (Certification audit)
                                    </small>
                                </td>
                            </>
                        ) : cycleType == AuditCycleType.recertification ? (
                            <td className={subHeaderStyle}
                                colSpan={proposalData.AuditCycle.Periodicity == AuditCyclePeriodicityType.annual
                                    ? 2 : 1}
                            >
                                Recertification
                                (Renewal of certification)
                            </td>
                        ) : null
                    }
                    {
                        proposalData.AuditCycle.Periodicity == AuditCyclePeriodicityType.annual
                            ? <>
                                <td className={subHeaderStyle} colSpan={2}>Surveillance 1</td>
                                <td className={subHeaderStyle} colSpan={2}>Surveillance 2</td>
                            </>
                            :  <>
                                <td className={subHeaderStyle}>Surveillance 1</td>
                                <td className={subHeaderStyle}>Surveillance 2</td>
                                <td className={subHeaderStyle}>Surveillance 3</td>
                                <td className={subHeaderStyle}>Surveillance 4</td>
                                <td className={subHeaderStyle}>Surveillance 5</td>
                            </>
                    }
                </tr>
                {
                    !!proposalAuditFirstYear && !!proposalData.Sites && proposalData.Sites.map(site => {
                        const adcSite = proposalData.ADCSites.find(adcSite => adcSite.SiteID == site.ID);
                        //const adc = proposalData.ADCs.find(adc => adc.ID == adcSite.ADCID);
                        const totalDaysSt1 = 1;
                        const totalDaysSt2 = proposalAuditFirstYear.TotalAuditDays < 2 ? 1 : proposalAuditFirstYear.TotalAuditDays - 1;

                        return (
                            <tr key={site.ID}>
                                <td className={headerColStyle}>
                                    <div>
                                        {site.Description}
                                    </div>
                                    <div className="font-weight-normal text-xxs">
                                        {site.Address}
                                    </div>
                                </td>
                                {
                                    cycleType == AuditCycleType.initial ? (
                                        <>
                                            <td className={`${bodyStyle} align-middle`}>
                                                {totalDaysSt1}
                                            </td>
                                            <td className={`${bodyStyle} align-middle`}>
                                                {totalDaysSt2}
                                            </td>
                                        </>
                                    ) : cycleType == AuditCycleType.recertification ? (
                                        <>
                                            <td className={`${bodyStyle} align-middle`}
                                                colSpan={proposalData.AuditCycle.Periodicity == AuditCyclePeriodicityType.annual
                                                    ? 2 : 1}
                                            >
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
                                            <td className={`${bodyStyle} align-middle`} colSpan={2}>
                                                {
                                                    adcSite.ADCSiteAudits.find(adcSiteAudit =>
                                                        adcSiteAudit.AuditStep == AuditStepType.surveillance1
                                                    ).Value ? adcSite.Surveillance : '-'
                                                }
                                            </td>
                                            <td className={`${bodyStyle} align-middle`} colSpan={2}>
                                                {showAuditDays(adcSite, AuditStepType.surveillance2)}
                                            </td>
                                        </>
                                    ) : proposalData.AuditCycle.Periodicity == AuditCyclePeriodicityType.biannual ? (
                                        <>
                                            <td className={`${bodyStyle} align-middle`} >
                                                {showAuditDays(adcSite, AuditStepType.surveillance1)}
                                            </td>
                                            <td className={`${bodyStyle} align-middle`} >
                                                {showAuditDays(adcSite, AuditStepType.surveillance2)}
                                            </td>
                                            <td className={`${bodyStyle} align-middle`} >
                                                {showAuditDays(adcSite, AuditStepType.surveillance3)}
                                            </td>
                                            <td className={`${bodyStyle} align-middle`} >
                                                {showAuditDays(adcSite, AuditStepType.surveillance4)}
                                            </td>
                                            <td className={`${bodyStyle} align-middle`} >
                                                {showAuditDays(adcSite, AuditStepType.surveillance5)}
                                            </td>
                                        </>
                                    ) : null

                                }
                            </tr>
                        )
                    })
                }
                <tr style={separatorStyle}></tr>
                <tr>
                    <td className={headerColStyle}>Total Audit Days</td>
                    <td
                        className={`${totalStyle} text-center`}
                        colSpan={proposalData.AuditCycle.Periodicity == AuditCyclePeriodicityType.annual
                            ? 2 : 1}
                    >
                        {!!proposalAuditFirstYear 
                            ? (proposalAuditFirstYear.TotalAuditDays < 2 ? 2 : proposalAuditFirstYear.TotalAuditDays)
                            : 0
                        }
                    </td>
                    {
                        proposalData.AuditCycle.Periodicity == AuditCyclePeriodicityType.annual ? (
                            <>
                                <td className={`${totalStyle} text-center`} colSpan={2}>
                                    {roundToDecimals(showTotalAuditDays(AuditStepType.surveillance1), 2)}
                                </td>
                                <td className={`${totalStyle} text-center`} colSpan={2}>
                                    {roundToDecimals(showTotalAuditDays(AuditStepType.surveillance2), 2)}
                                </td>
                            </>
                        ) : proposalData.AuditCycle.Periodicity == AuditCyclePeriodicityType.biannual ? (
                            <>
                                <td className={`${totalStyle} text-center`}>
                                    {roundToDecimals(showTotalAuditDays(AuditStepType.surveillance1), 2)}
                                </td>
                                <td className={`${totalStyle} text-center`}>
                                    {roundToDecimals(showTotalAuditDays(AuditStepType.surveillance2), 2)}
                                </td>
                                <td className={`${totalStyle} text-center`}>
                                    {roundToDecimals(showTotalAuditDays(AuditStepType.surveillance3), 2)}
                                </td>
                                <td className={`${totalStyle} text-center`}>
                                    {roundToDecimals(showTotalAuditDays(AuditStepType.surveillance4), 2)}
                                </td>
                                <td className={`${totalStyle} text-center`}>
                                    {roundToDecimals(showTotalAuditDays(AuditStepType.surveillance5), 2)}
                                </td>
                            </>
                        ) : null
                    }

                </tr>
                <ProposalPreviewADCTotalRowItem rowType="CertificateIssue" />
                <ProposalPreviewADCTotalRowItem rowType="SubTotal" />
                <ProposalPreviewADCTotalRowItem rowType="Taxes" />
                {
                    includeTravelExpenses ? (
                        <>
                            <ProposalPreviewADCTotalRowItem rowType="TotalCost" />
                            <ProposalPreviewADCTotalRowItem rowType="TravelExpenses" />
                        </>
                    ) : null
                }
                <ProposalPreviewADCTotalRowItem rowType="TotalFinal" />
            </tbody>
        </table>
    )
}); // ProposalPreviewADC

export default ProposalPreviewADC;