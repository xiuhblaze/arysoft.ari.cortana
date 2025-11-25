import { Fragment, memo, useEffect, useState } from "react";
import { useProposalController } from "../context/ProposalContext";
import auditCycleProps from "../../auditCycles/helpers/auditCycleProps";
import enums from "../../../helpers/enums";
import auditStepProps from "../../audits/helpers/auditStepProps";
import currencyCodeProps from "../../../helpers/currencyCodeProps";
import getCurrencyFormat from "../../../helpers/getCurrencyFormat";
import aryMathTools from "../../../helpers/aryMathTools";
import StepTotals from "../classes/StepTotals";
import envVariables from "../../../helpers/envVariables";

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

    const { VITE_TOTAL_INITIAL_MIN_DAYS } = envVariables();

    const { 
        DefaultCurrencyCodeType,
        ADCStatusType,
        AuditCyclePeriodicityType,
        AuditCycleType,
        AuditStepType,
    } = enums();

    const [ controller, dispatch ] = useProposalController();

    const {
        proposalData,
        adcList,
        proposalAuditList,
        includeTravelExpenses,
    } = controller;
    
    if (!proposalData) { return null; }  
    //console.log('call: ProposalPreviewADC.jsx');
    //const taxRate = sanitizarNumero(proposalData.TaxRate, 0);
    const firstADC = adcList.find(adc => adc.Status <= ADCStatusType.inactive);

    if (!firstADC) { return null; }
    const cycleType = proposalData.AuditCycle.AuditCycleStandards.find(acs => acs.StandardID == firstADC.AppFormStandardID).CycleType;
    const firstYear = cycleType == AuditCycleType.initial
        ? proposalAuditList.find(proposalAudit => proposalAudit.AuditStep == AuditStepType.stage2)
        : cycleType == AuditCycleType.recertification
            ? proposalAuditList.find(proposalAudit => proposalAudit.AuditStep == AuditStepType.recertification)
            : null; // TODO: Va a ser Transfer, falta

    if (!firstYear) { return null; }

    const firstYearValues = new StepTotals(
        firstYear.AuditStep, 
        firstADC.TotalInitial,
        firstYear.SubTotal,
        proposalData.TaxRate,
        firstYear.CertificateIssue,
        firstYear.TravelExpenses,
    );

    const totalValues = [];
    Object.entries(AuditStepType).forEach(([key, value]) => {
        const proposalAudit = proposalAuditList.find(proposalAudit => proposalAudit.AuditStep == value);

        if (!!proposalAudit) {
            const totalValuesItem = new StepTotals(
                value,                
                proposalAudit.TotalAuditDays, 
                proposalAudit.SubTotal, 
                proposalData.TaxRate, 
                proposalAudit.CertificateIssue, 
                proposalAudit.TravelExpenses,
            );
            totalValues.push(totalValuesItem);
        } else {
            totalValues.push(new StepTotals(value, 0, 0, proposalData.TaxRate, 0, 0));
        }

    });

    // const totalSubTotalFirstYear = sanitizarNumero(firstYear.SubTotal, 0);        
    // const totalCertificateIssueFirstYear = sanitizarNumero(firstYear.CertificateIssue, 0);

    // adcList.forEach(adc => {
    //     const cycleType = proposalData.AuditCycle.AuditCycleStandards.find(acs => acs.StandardID == adc.AppFormStandardID).CycleType;

    //     const firstYear = cycleType == AuditCycleType.initial
    //         ? proposalAuditList.find(proposalAudit => proposalAudit.AuditStep == AuditStepType.stage2)
    //         : cycleType == AuditCycleType.recertification
    //             ? proposalAuditList.find(proposalAudit => proposalAudit.AuditStep == AuditStepType.recertification)
    //             : null; // TODO: Va a ser Transfer, falta

    //     console.log('firstYear', firstYear);

    //     totalDaysFirstYear += firstYear.TotalAuditDays; // firstYear.TotalAuditDays > 2 ? firstYear.TotalAuditDays : 2;
    //     // totalSubTotalFirstYear += subTotal;
        
    //     // totalCertificateIssueFirstYear += certificateIssue;
    //     // totalCostFirstYear += subTotal;        
    //     // totalDaysFirstYear = roundToHalf(totalDaysFirstYear, 2);
    // });

    // totalSubTotalFirstYear = subTotal;
    // totalCertificateIssueFirstYear = certificateIssue;
    // totalTaxesFirstYear += (subTotal * taxRate) / 100;
    // totalCostFirstYear = totalSubTotalFirstYear + totalTaxesFirstYear;

    // if (includeTravelExpenses) {
    //     totalTravelExpensesFirstYear += sanitizarNumero(firstYear.TravelExpenses, 0);
    //     totalFinalFirstYear += totalCostFirstYear + totalTravelExpensesFirstYear;
    // } else {
    //     totalFinalFirstYear += totalCostFirstYear;
    // }

    //console.log('proposalAuditList', proposalAuditList);
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
                        const adcSites = proposalData.ADCSites
                            .filter(adcSite => adcSite.ADCID == adc.ID)
                            .sort((a, b) => b.IsMainSite - a.IsMainSite 
                                || a.SiteDescription.localeCompare(b.SiteDescription));

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
                                    //proposalData.ADCSites.filter(adcSite => adcSite.ADCID == adc.ID).map(adcSite => {
                                    adcSites.map(adcSite => {                                        
                                        const totalDaysSt1 = 1;
                                        const totalDaysSt2 = adc.TotalInitial - 1;
                                        
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
                                                                { totalDaysSt1 }
                                                            </td>
                                                            <td className={ `${bodyStyle} align-middle` }>
                                                                { totalDaysSt2 }
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
                        { firstYearValues.totalDays }
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
                    <td className={ headerColStyle }>Certificate Issue</td>
                    <td 
                        className={ totalStyle } 
                        colSpan={ proposalData.AuditCycle.Periodicity == AuditCyclePeriodicityType.annual 
                            ? 2 : 1 }
                    >
                        { getCurrencyFormat(firstYearValues.certificateIssue, proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn) }
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
                    <td className={ headerColStyle }>
                        SubTotal ({ currencyCodeProps[proposalData.CurrencyCode ?? DefaultCurrencyCodeType.nothing].abbreviation })
                    </td>
                    
                    <td 
                        className={ totalStyle } 
                        colSpan={ proposalData.AuditCycle.Periodicity == AuditCyclePeriodicityType.annual 
                            ? 2 : 1 }
                    >
                        { getCurrencyFormat(firstYearValues.subTotal, proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn) }
                    </td>
                    {
                        proposalData.AuditCycle.Periodicity == AuditCyclePeriodicityType.annual ? (
                            <>
                                <td className={ totalStyle } colSpan={2}>
                                    {/* { getCurrencyFormat(showSubTotal(proposalAuditList, AuditStepType.surveillance1), proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn) } */}
                                    { getCurrencyFormat(totalValues[AuditStepType.surveillance1].subTotal, proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn) }
                                </td>
                                <td className={ totalStyle } colSpan={2}>
                                    {/* { getCurrencyFormat(showSubTotal(proposalAuditList, AuditStepType.surveillance2), proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn) } */}
                                    { getCurrencyFormat(totalValues[AuditStepType.surveillance2].subTotal, proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn) }
                                </td>
                            </>
                        ): proposalData.AuditCycle.Periodicity == AuditCyclePeriodicityType.biannual ? (
                            <>
                                <td className={ totalStyle }>
                                    { getCurrencyFormat(totalValues[AuditStepType.surveillance1].subTotal, proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn) }
                                </td>
                                <td className={ totalStyle }>
                                    { getCurrencyFormat(totalValues[AuditStepType.surveillance2].subTotal, proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn) }
                                </td>
                                <td className={ totalStyle }>
                                    { getCurrencyFormat(totalValues[AuditStepType.surveillance3].subTotal, proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn) }
                                </td>
                                <td className={ totalStyle }>
                                    { getCurrencyFormat(totalValues[AuditStepType.surveillance4].subTotal, proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn) }
                                </td>
                                <td className={ totalStyle }>
                                    { getCurrencyFormat(totalValues[AuditStepType.surveillance5].subTotal, proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn) }
                                </td>
                            </>
                        ) : null
                    }
                </tr>
                <tr>
                    <td className={ headerColStyle }>Taxes</td>
                    <td 
                        className={ totalStyle } 
                        colSpan={ proposalData.AuditCycle.Periodicity == AuditCyclePeriodicityType.annual 
                            ? 2 : 1 }
                    >
                        {/* { getCurrencyFormat(firstYearValues.getTaxes(), proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn) } */}
                        { 
                            cycleType == AuditCycleType.recertification 
                                ? getCurrencyFormat(totalValues[AuditStepType.recertification].getTaxes(), proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn) 
                                : getCurrencyFormat(totalValues[AuditStepType.stage2].getTaxes(), proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn)
                        }
                    </td>
                    {
                        proposalData.AuditCycle.Periodicity == AuditCyclePeriodicityType.annual ? (
                            <>
                                <td className={ totalStyle } colSpan={2}>
                                    { getCurrencyFormat(totalValues[AuditStepType.surveillance1].getTaxes(), proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn) }
                                </td>
                                <td className={ totalStyle } colSpan={2}>
                                    { getCurrencyFormat(totalValues[AuditStepType.surveillance2].getTaxes(), proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn) }
                                </td>
                            </>
                        ) : proposalData.AuditCycle.Periodicity == AuditCyclePeriodicityType.biannual ? (
                            <>
                                <td className={ totalStyle }>
                                    { getCurrencyFormat(totalValues[AuditStepType.surveillance1].getTaxes(), proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn) }
                                </td>
                                <td className={ totalStyle }>
                                    { getCurrencyFormat(totalValues[AuditStepType.surveillance2].getTaxes(), proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn) }
                                </td>
                                <td className={ totalStyle }>
                                    { getCurrencyFormat(totalValues[AuditStepType.surveillance3].getTaxes(), proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn) }
                                </td>
                                <td className={ totalStyle }>
                                    { getCurrencyFormat(totalValues[AuditStepType.surveillance4].getTaxes(), proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn) }
                                </td>
                                <td className={ totalStyle }>
                                    { getCurrencyFormat(totalValues[AuditStepType.surveillance5].getTaxes(), proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn) }
                                </td>
                            </>
                        ) : null
                    }
                </tr>
                { 
                    includeTravelExpenses ? (
                        <>
                            <tr>
                                <td className={ headerColStyle }>Total Cost</td>
                                <td 
                                    className={ totalStyle } 
                                    colSpan={ proposalData.AuditCycle.Periodicity == AuditCyclePeriodicityType.annual 
                                        ? 2 : 1 }
                                >
                                    { getCurrencyFormat(firstYearValues.getTotalCost(), proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn) }
                                </td>
                                {
                                    proposalData.AuditCycle.Periodicity == AuditCyclePeriodicityType.annual ? (
                                        <>
                                            <td className={ totalStyle } colSpan={2}>
                                                { getCurrencyFormat(totalValues[AuditStepType.surveillance1].getTotalCost(), proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn) }
                                            </td>
                                            <td className={ totalStyle } colSpan={2}>
                                                { getCurrencyFormat(totalValues[AuditStepType.surveillance2].getTotalCost(), proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn) }
                                            </td>
                                        </>
                                    ) : proposalData.AuditCycle.Periodicity == AuditCyclePeriodicityType.biannual ? (
                                        <>
                                            <td className={ totalStyle }>
                                                { getCurrencyFormat(totalValues[AuditStepType.surveillance1].getTotalCost(), proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn) }
                                            </td>
                                            <td className={ totalStyle }>
                                                { getCurrencyFormat(totalValues[AuditStepType.surveillance2].getTotalCost(), proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn) }
                                            </td>
                                            <td className={ totalStyle }>
                                                { getCurrencyFormat(totalValues[AuditStepType.surveillance3].getTotalCost(), proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn) }
                                            </td>
                                            <td className={ totalStyle }>
                                                { getCurrencyFormat(totalValues[AuditStepType.surveillance4].getTotalCost(), proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn) }
                                            </td>
                                            <td className={ totalStyle }>
                                                { getCurrencyFormat(totalValues[AuditStepType.surveillance5].getTotalCost(), proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn) }
                                            </td>
                                        </>
                                    ) : null
                                }
                            </tr>
                            <tr>
                                <td className={ headerColStyle }>Travel Expenses</td>
                                <td 
                                    className={ totalStyle } 
                                    colSpan={ proposalData.AuditCycle.Periodicity == AuditCyclePeriodicityType.annual 
                                        ? 2 : 1 }
                                >
                                    { getCurrencyFormat(firstYearValues.travelExpenses, proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn) }
                                </td>
                                {
                                    proposalData.AuditCycle.Periodicity == AuditCyclePeriodicityType.annual ? (
                                        <>
                                            <td className={ totalStyle } colSpan={2}>
                                                { getCurrencyFormat(totalValues[AuditStepType.surveillance1].travelExpenses, proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn) }
                                            </td>
                                            <td className={ totalStyle } colSpan={2}>
                                                { getCurrencyFormat(totalValues[AuditStepType.surveillance2].travelExpenses, proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn) }
                                            </td>
                                        </>
                                    ) : proposalData.AuditCycle.Periodicity == AuditCyclePeriodicityType.biannual ? (
                                        <>
                                            <td className={ totalStyle }>
                                                { getCurrencyFormat(totalValues[AuditStepType.surveillance1].travelExpenses, proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn) }
                                            </td>
                                            <td className={ totalStyle }>
                                                { getCurrencyFormat(totalValues[AuditStepType.surveillance2].travelExpenses, proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn) }
                                            </td>
                                            <td className={ totalStyle }>
                                                { getCurrencyFormat(totalValues[AuditStepType.surveillance3].travelExpenses, proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn) }
                                            </td>
                                            <td className={ totalStyle }>
                                                { getCurrencyFormat(totalValues[AuditStepType.surveillance4].travelExpenses, proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn) }
                                            </td>
                                            <td className={ totalStyle }>
                                                { getCurrencyFormat(totalValues[AuditStepType.surveillance5].travelExpenses, proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn) }
                                            </td>
                                        </>
                                    ) : null
                                }
                            </tr>
                        </>
                    ) : null 
                }
                <tr>
                    <td className={ headerColStyle }>{ includeTravelExpenses ? 'Total Final' : 'Total Cost' }</td>
                    <td 
                        className={ totalStyle } 
                        colSpan={ proposalData.AuditCycle.Periodicity == AuditCyclePeriodicityType.annual 
                            ? 2 : 1 }
                    >
                        { getCurrencyFormat(firstYearValues.getTotalFinal(), proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn) }
                    </td>
                    {
                        proposalData.AuditCycle.Periodicity == AuditCyclePeriodicityType.annual ? (
                            <>
                                <td className={ totalStyle } colSpan={2}>
                                    {/* { getCurrencyFormat(showTotalCost(proposalAuditList, AuditStepType.surveillance1), proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn) } */}
                                    { getCurrencyFormat(totalValues[AuditStepType.surveillance1].getTotalFinal(), proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn) }
                                </td>
                                <td className={ totalStyle } colSpan={2}>
                                    { getCurrencyFormat(totalValues[AuditStepType.surveillance2].getTotalFinal(), proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn) }
                                </td>
                            </>
                        ) : proposalData.AuditCycle.Periodicity == AuditCyclePeriodicityType.biannual ? (
                            <>
                                <td className={ totalStyle }>
                                    { getCurrencyFormat(totalValues[AuditStepType.surveillance1].getTotalFinal(), proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn) }
                                </td>
                                <td className={ totalStyle }>
                                    { getCurrencyFormat(totalValues[AuditStepType.surveillance2].getTotalFinal(), proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn) }
                                </td>
                                <td className={ totalStyle }>
                                    { getCurrencyFormat(totalValues[AuditStepType.surveillance3].getTotalFinal(), proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn) }
                                </td>
                                <td className={ totalStyle }>
                                    { getCurrencyFormat(totalValues[AuditStepType.surveillance4].getTotalFinal(), proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn) }
                                </td>
                                <td className={ totalStyle }>
                                    { getCurrencyFormat(totalValues[AuditStepType.surveillance5].getTotalFinal(), proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn) }
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

const showSubTotal = (proposalAuditList, auditStep) => {
    const proposalAudit = proposalAuditList.find(proposalAudit => 
        proposalAudit.AuditStep == auditStep
    );

    return !!proposalAudit ? proposalAudit.SubTotal : 0;
}; // showSubTotal

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