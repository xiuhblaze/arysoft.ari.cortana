import { Fragment, memo, useEffect, useState } from "react";
import { useProposalController } from "../context/ProposalContext";
import auditCycleProps from "../../auditCycles/helpers/auditCycleProps";
import enums from "../../../helpers/enums";
import auditStepProps from "../../audits/helpers/auditStepProps";
import currencyCodeProps from "../../../helpers/currencyCodeProps";
import getCurrencyFormat from "../../../helpers/getCurrencyFormat";
import aryMathTools from "../../../helpers/aryMathTools";

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
        DefaultCurrencyCodeType,
        AuditCyclePeriodicityType,
        AuditCycleType,
        AuditStepType,
    } = enums();

    const [ controller, dispatch ] = useProposalController();

    const {
        proposalData,
        adcList,
        proposalAuditList,
    } = controller;

    let totalDaysFirstYear = 0;
    let totalInvestmentFirstYear = 0;
    let totalCertificateIssueFirstYear = 0;
    let totalCostFirstYear = 0;
    
    if (!proposalData) { return null; }  
    
    // HOOKS

     // proposalData.AuditCycle.AuditCycleStandards[].CycleType // Para ver en que punto inicia la tabla 

     // 1. Por cada ADC hacer una tabla y ver si son Initial o Recertification
     // 2. Crear los encabezados de la tabla de acuerdo al CycleType
     // 3. Buscar del ADC los sites y de el los ADCSiteAudit para ver si participan en el Step
     //    - Si es el caso, mostrar el número de días de acuerdo al ADC y su tipo (inital, surv, recertificación)
     
    // const { ADCs } = proposalData;

    adcList.forEach(adc => {
        console.log('adc', adc);
        // console.log('Tabla para ADC', adc.AppFormStandardName);

        // console.log('Buscar el CycleType del ADC: ', adc.AppFormStandardID);
        const cycleType = proposalData.AuditCycle.AuditCycleStandards.find(acs => acs.StandardID == adc.AppFormStandardID).CycleType;

        if (cycleType == AuditCycleType.initial) {
            const firstYear = proposalAuditList.find(proposalAudit => proposalAudit.AuditStep == AuditStepType.stage2);            
            totalDaysFirstYear += firstYear.TotalAuditDays > 2 ? firstYear.TotalAuditDays : 2;
            totalInvestmentFirstYear += firstYear.Investment;
            totalCertificateIssueFirstYear += firstYear.CertificateIssue;
            totalCostFirstYear += firstYear.TotalCost;

        } else if (cycleType == AuditCycleType.recertification) {
            const firstYear = proposalAuditList.find(proposalAudit => proposalAudit.AuditStep == AuditStepType.recertification);
            totalDaysFirstYear += firstYear.TotalAuditDays;
            totalInvestmentFirstYear += firstYear.Investment;
            totalCertificateIssueFirstYear += firstYear.CertificateIssue;
            totalCostFirstYear += firstYear.TotalCost;
        } // else if (cycleType == AuditCycleType.transfer) //TODO: Falta

        totalDaysFirstYear = roundToHalf(totalDaysFirstYear, 2);

        const adcSites = proposalData.ADCSites.filter(adcSite => adcSite.ADCID == adc.ID);
        console.log('ADCSites', adcSites);
    });

    console.log('proposalAuditList', proposalAuditList);
    // console.log(showTotalAuditDays(proposalAuditList, AuditStepType.surveillance1));

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
                    <td className={ `${headerStyle} align-middle text-center` }>{/* Sites/Stage */}</td> 
                    <td className={ `${subHeaderStyle} col-3` } colSpan={2}>First year</td>
                    <td className={ `${subHeaderStyle} col-3` } colSpan={2}>Second year</td>
                    <td className={ `${subHeaderStyle} col-3` } colSpan={2}>Third year</td>
                </tr>
                {
                    adcList.map(adc => {
                        const cycleType = proposalData.AuditCycle.AuditCycleStandards.find(acs => acs.StandardID == adc.AppFormStandardID).CycleType;

                        return (
                            <Fragment key={adc.ID}>
                                <tr>
                                    <td className={`${headerColStyle} align-middle text-center`}>
                                        { adc.AppFormStandardName }
                                    </td>
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
                                                ? (
                                                    <td className={ subHeaderStyle } 
                                                        colSpan={ proposalData.AuditCycle.Periodicity == AuditCyclePeriodicityType.annual 
                                                            ? 2 : 1 }
                                                    >
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
                                                <td className={ headerColStyle }>
                                                    <div className="">
                                                        { adcSite.SiteDescription }
                                                    </div>
                                                    <div className="font-weight-normal text-xxs">
                                                        { adcSite.SiteAddress }
                                                    </div>
                                                </td>
                                                {
                                                    cycleType == AuditCycleType.initial ? (
                                                        <>
                                                            <td className={ `${bodyStyle} align-middle` }>
                                                                {
                                                                    adcSite.ADCSiteAudits.find(adcSiteAudit => 
                                                                        adcSiteAudit.AuditStep == AuditStepType.stage1
                                                                    )?.Value ? adcSite.Total : '-'
                                                                }
                                                            </td>
                                                            <td className={ `${bodyStyle} align-middle` }>
                                                                {
                                                                    adcSite.ADCSiteAudits.find(adcSiteAudit => 
                                                                        adcSiteAudit.AuditStep == AuditStepType.stage2
                                                                    ).Value ? adcSite.Total : '-'
                                                                }
                                                            </td>
                                                        </>
                                                    ) : cycleType == AuditCycleType.recertification ? (
                                                        <>
                                                            <td className={ `${bodyStyle} align-middle` } 
                                                                colSpan={ proposalData.AuditCycle.Periodicity == AuditCyclePeriodicityType.annual 
                                                                    ? 2 : 1 }
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
                                                            <td className={ `${bodyStyle} align-middle` } colSpan={2}>
                                                                {
                                                                    adcSite.ADCSiteAudits.find(adcSiteAudit => 
                                                                        adcSiteAudit.AuditStep == AuditStepType.surveillance1
                                                                    ).Value ? adcSite.Surveillance : '-'
                                                                }
                                                            </td>
                                                            <td className={ `${bodyStyle} align-middle` } colSpan={2}>
                                                                { showAuditDays(adcSite, AuditStepType.surveillance2) }
                                                            </td>
                                                        </>
                                                    ) : proposalData.AuditCycle.Periodicity == AuditCyclePeriodicityType.biannual ? (
                                                        <>
                                                            <td className={ `${bodyStyle} align-middle` } >
                                                                { showAuditDays(adcSite, AuditStepType.surveillance1) }
                                                            </td>
                                                            <td className={ `${bodyStyle} align-middle` } >
                                                                { showAuditDays(adcSite, AuditStepType.surveillance2) }
                                                            </td>
                                                            <td className={ `${bodyStyle} align-middle` } >
                                                                { showAuditDays(adcSite, AuditStepType.surveillance3) }
                                                            </td>
                                                            <td className={ `${bodyStyle} align-middle` } >
                                                                { showAuditDays(adcSite, AuditStepType.surveillance4) }
                                                            </td>
                                                            <td className={ `${bodyStyle} align-middle` } >
                                                                { showAuditDays(adcSite, AuditStepType.surveillance5) }
                                                            </td>
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
                <tr style={separatorStyle}></tr>
                <tr>
                    <td className={ headerColStyle }>Total Audit Days</td>
                    <td 
                        className={ `${totalStyle} text-center` } 
                        colSpan={ proposalData.AuditCycle.Periodicity == AuditCyclePeriodicityType.annual 
                        ? 2 : 1 }
                    >
                        { totalDaysFirstYear }
                    </td>
                    {
                        proposalData.AuditCycle.Periodicity == AuditCyclePeriodicityType.annual ? (
                            <>
                                <td className={ `${totalStyle} text-center` } colSpan={2}>
                                    { roundToDecimals(showTotalAuditDays(proposalAuditList, AuditStepType.surveillance1), 2) }
                                </td>
                                <td className={ `${totalStyle} text-center` } colSpan={2}>
                                    { roundToDecimals(showTotalAuditDays(proposalAuditList, AuditStepType.surveillance2), 2) }
                                </td>
                            </>
                        ) : proposalData.AuditCycle.Periodicity == AuditCyclePeriodicityType.biannual ? (
                            <>
                                <td className={ `${totalStyle} text-center` }>
                                    { roundToDecimals(showTotalAuditDays(proposalAuditList, AuditStepType.surveillance1), 2) }
                                </td>
                                <td className={ `${totalStyle} text-center` }>
                                    { roundToDecimals(showTotalAuditDays(proposalAuditList, AuditStepType.surveillance2), 2) }
                                </td>
                                <td className={ `${totalStyle} text-center` }>
                                    { roundToDecimals(showTotalAuditDays(proposalAuditList, AuditStepType.surveillance3), 2) }
                                </td>
                                <td className={ `${totalStyle} text-center` }>
                                    { roundToDecimals(showTotalAuditDays(proposalAuditList, AuditStepType.surveillance4), 2) }
                                </td>
                                <td className={ `${totalStyle} text-center` }>
                                    { roundToDecimals(showTotalAuditDays(proposalAuditList, AuditStepType.surveillance5), 2) }
                                </td>
                            </>
                        ) : null
                    }
                    
                </tr>
                <tr>
                    <td className={ headerColStyle }>
                        Inversment ({ currencyCodeProps[proposalData.CurrencyCode ?? DefaultCurrencyCodeType.nothing].abbreviation })
                    </td>
                    
                    <td 
                        className={ totalStyle } 
                        colSpan={ proposalData.AuditCycle.Periodicity == AuditCyclePeriodicityType.annual 
                            ? 2 : 1 }
                    >
                        { getCurrencyFormat(totalInvestmentFirstYear, proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn) }
                    </td>
                    {
                        proposalData.AuditCycle.Periodicity == AuditCyclePeriodicityType.annual ? (
                            <>
                                <td className={ totalStyle } colSpan={2}>
                                    { getCurrencyFormat(showInvestment(proposalAuditList, AuditStepType.surveillance1), proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn) }
                                </td>
                                <td className={ totalStyle } colSpan={2}>
                                    { getCurrencyFormat(showInvestment(proposalAuditList, AuditStepType.surveillance2), proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn) }
                                </td>
                            </>
                        ): proposalData.AuditCycle.Periodicity == AuditCyclePeriodicityType.biannual ? (
                            <>
                                <td className={ totalStyle }>
                                    { getCurrencyFormat(showInvestment(proposalAuditList, AuditStepType.surveillance1), proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn) }
                                </td>
                                <td className={ totalStyle }>
                                    { getCurrencyFormat(showInvestment(proposalAuditList, AuditStepType.surveillance2), proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn) }
                                </td>
                                <td className={ totalStyle }>
                                    { getCurrencyFormat(showInvestment(proposalAuditList, AuditStepType.surveillance3), proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn) }
                                </td>
                                <td className={ totalStyle }>
                                    { getCurrencyFormat(showInvestment(proposalAuditList, AuditStepType.surveillance4), proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn) }
                                </td>
                                <td className={ totalStyle }>
                                    { getCurrencyFormat(showInvestment(proposalAuditList, AuditStepType.surveillance5), proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn) }
                                </td>
                            </>
                        ) : null
                    }

                    
                </tr>
                <tr>
                    <td className={ headerColStyle }>Certificate Issue</td>
                    <td 
                        className={ totalStyle } 
                        colSpan={ proposalData.AuditCycle.Periodicity == AuditCyclePeriodicityType.annual 
                            ? 2 : 1 }
                    >
                        { getCurrencyFormat(totalCertificateIssueFirstYear, proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn) }
                    </td>
                    {
                        proposalData.AuditCycle.Periodicity == AuditCyclePeriodicityType.annual ? (
                            <>
                                <td className={ totalStyle } colSpan={2}>
                                    { getCurrencyFormat(showCertificateIssue(proposalAuditList, AuditStepType.surveillance1), proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn) }
                                </td>
                                <td className={ totalStyle } colSpan={2}>
                                    { getCurrencyFormat(showCertificateIssue(proposalAuditList, AuditStepType.surveillance2), proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn) }
                                </td>
                            </>
                        ) : proposalData.AuditCycle.Periodicity == AuditCyclePeriodicityType.biannual ? (
                            <>
                                <td className={ totalStyle }>
                                    { getCurrencyFormat(showCertificateIssue(proposalAuditList, AuditStepType.surveillance1), proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn) }
                                </td>
                                <td className={ totalStyle }>
                                    { getCurrencyFormat(showCertificateIssue(proposalAuditList, AuditStepType.surveillance2), proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn) }
                                </td>
                                <td className={ totalStyle }>
                                    { getCurrencyFormat(showCertificateIssue(proposalAuditList, AuditStepType.surveillance3), proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn) }
                                </td>
                                <td className={ totalStyle }>
                                    { getCurrencyFormat(showCertificateIssue(proposalAuditList, AuditStepType.surveillance4), proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn) }
                                </td>
                                <td className={ totalStyle }>
                                    { getCurrencyFormat(showCertificateIssue(proposalAuditList, AuditStepType.surveillance5), proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn) }
                                </td>
                            </>
                        ) : null
                    }
                </tr>
                <tr>
                    <td className={ headerColStyle }>Total</td>
                    <td 
                        className={ totalStyle } 
                        colSpan={ proposalData.AuditCycle.Periodicity == AuditCyclePeriodicityType.annual 
                            ? 2 : 1 }
                    >
                        { getCurrencyFormat(totalCostFirstYear, proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn) }
                    </td>
                    {
                        proposalData.AuditCycle.Periodicity == AuditCyclePeriodicityType.annual ? (
                            <>
                                <td className={ totalStyle } colSpan={2}>
                                    { getCurrencyFormat(showTotalCost(proposalAuditList, AuditStepType.surveillance1), proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn) }
                                </td>
                                <td className={ totalStyle } colSpan={2}>
                                    { getCurrencyFormat(showTotalCost(proposalAuditList, AuditStepType.surveillance2), proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn) }
                                </td>
                            </>
                        ) : proposalData.AuditCycle.Periodicity == AuditCyclePeriodicityType.biannual ? (
                            <>
                                <td className={ totalStyle }>
                                    { getCurrencyFormat(showTotalCost(proposalAuditList, AuditStepType.surveillance1), proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn) }
                                </td>
                                <td className={ totalStyle }>
                                    { getCurrencyFormat(showTotalCost(proposalAuditList, AuditStepType.surveillance2), proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn) }                                
                                </td>
                                <td className={ totalStyle }>
                                    { getCurrencyFormat(showTotalCost(proposalAuditList, AuditStepType.surveillance3), proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn) }
                                </td>
                                <td className={ totalStyle }>
                                    { getCurrencyFormat(showTotalCost(proposalAuditList, AuditStepType.surveillance4), proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn) }
                                </td>
                                <td className={ totalStyle }>
                                    { getCurrencyFormat(showTotalCost(proposalAuditList, AuditStepType.surveillance5), proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn) }
                                </td>                                
                            </>
                        ) : null
                    }
                </tr>
            </tbody>
        </table>
    )
}); // ProposalPreviewADC

const showAuditDays = (adcSite, auditStepType) => {
    const days = adcSite.ADCSiteAudits.find(adcSiteAudit => 
        adcSiteAudit.AuditStep == auditStepType
    ).Value ? adcSite.Surveillance : '-'

    return days;
} // showAuditDays

const showTotalAuditDays = (proposalAuditList, auditStep) => {
    const proposalAudit = proposalAuditList.find(proposalAudit => 
        proposalAudit.AuditStep == auditStep
    );

    return roundToHalf(!!proposalAudit ? proposalAudit.TotalAuditDays : 0, 2);
}; // showTotalAuditDays

const showInvestment = (proposalAuditList, auditStep) => {
    const proposalAudit = proposalAuditList.find(proposalAudit => 
        proposalAudit.AuditStep == auditStep
    );

    return !!proposalAudit ? proposalAudit.Investment : 0;
}; // showInvestment

const showCertificateIssue = (proposalAuditList, auditStep) => {
    const proposalAudit = proposalAuditList.find(proposalAudit => 
        proposalAudit.AuditStep == auditStep
    );

    return !!proposalAudit ? proposalAudit.CertificateIssue : 0;
}; // showCertificateIssue

const showTotalCost = (proposalAuditList, auditStep) => {
    const proposalAudit = proposalAuditList.find(proposalAudit => 
        proposalAudit.AuditStep == auditStep
    );

    return !!proposalAudit ? proposalAudit.TotalCost : 0;
}; // showTotalCost

export default ProposalPreviewADC;