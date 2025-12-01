import { useProposalController } from '../context/ProposalContext'
import enums from '../../../helpers/enums';
import getCurrencyFormat from '../../../helpers/getCurrencyFormat';
import { useEffect, useState } from 'react';
import currencyCodeProps from '../../../helpers/currencyCodeProps';

const ProposalPreviewADCTotalRowItem = ({ rowType, proposalAuditFirstYear, ...props }) => {
    const _headerColStyle = 'col-3 text-xs text-wrap font-weight-bold bg-light';
    const _totalStyle = 'text-xs text-end text-wrap';

    const {
        ADCStatusType,
        AuditCyclePeriodicityType, 
        AuditCycleType,
        AuditStepType, 
        DefaultCurrencyCodeType
    } = enums();

    const [controller, dispatch] = useProposalController();
    const {
        proposalData,
        proposalAuditList,
    } = controller;

    // HOOKS

    const [title, setTitle] = useState('');
    const [cycleType, setCycleType] = useState(null);
    const [totalStyle, setTotalStyle] = useState(_totalStyle);
    const [headerColStyle, setHeaderColStyle] = useState(_headerColStyle);

    useEffect(() => {
        const firstADC = proposalData.ADCs.find(adc => adc.Status <= ADCStatusType.inactive);
        const auditCycleStandard = proposalData.AuditCycle.AuditCycleStandards   //TODO: Considerar que este se va a obtener en combinacion de varios ADCs
            .find(acs => acs.StandardID == firstADC?.AppFormStandardID);
        setCycleType(auditCycleStandard?.CycleType ?? 0);

        switch (rowType) {
            case 'TotalAuditDays': {
                setTitle('Total Audit Days');
                break;
            }
            case 'SubTotal': {
                setTitle(`SubTotal (${
                    currencyCodeProps[proposalData.CurrencyCode ?? DefaultCurrencyCodeType.nothing].abbreviation
                })`);
                break;
            }
            case 'CertificateIssue': {
                setTitle('Certificate Issue');
                break;
            }
            case 'Taxes': {
                setTitle('Taxes');
                break;
            }
            case 'TotalCost': {
                setTitle('Total Cost');
                setTotalStyle(`${_totalStyle } text-dark font-weight-bold`);
                setHeaderColStyle(`${_headerColStyle} text-dark`);
                break;
            }
            case 'TravelExpenses': {
                setTitle('Travel Expenses');
                break;
            }
            case 'TotalFinal': {
                setTitle('Total Final');
                setTotalStyle(`${_totalStyle } text-dark font-weight-bold`);
                setHeaderColStyle(`${_headerColStyle} text-dark`);
                break;
            }
            default: {
                setTitle('');
                break;
            }
        }
    }, []);

    // METHODS

    const getProposalAuditValue = (auditStep) => {
        const proposalAudit = proposalAuditList.find(proposalAudit =>
            proposalAudit.AuditStep == auditStep
        );

        switch (rowType) {
            case 'TotalAuditDays': {
                return proposalAudit?.TotalAuditDays ?? 0;
            }
            case 'SubTotal': {
                return proposalAudit?.SubTotal ?? 0;
            }
            case 'CertificateIssue': {
                return proposalAudit?.CertificateIssue ?? 0;
            }
            case 'Taxes': {
                return proposalAudit?.Taxes ?? 0;
            }
            case 'TotalCost': {
                return proposalAudit?.TotalCost ?? 0;
            }
            case 'TravelExpenses': {
                return proposalAudit?.TravelExpenses ?? 0;
            }
            case 'TotalFinal': {
                return proposalAudit?.TotalFinal ?? 0;
            }
            default: {
                return 0;
            }
        }
    }; // getProposalAuditValue

    return (
        <tr {...props}>
            <td className={headerColStyle}>{ title }</td>
            <td
                className={totalStyle}
                colSpan={proposalData.AuditCycle.Periodicity == AuditCyclePeriodicityType.annual
                    ? 2 : 1}
            >
                {
                    cycleType == AuditCycleType.initial
                        ? getCurrencyFormat(getProposalAuditValue(AuditStepType.stage2) ?? 0, proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn)
                        : getCurrencyFormat(getProposalAuditValue(AuditStepType.recertification) ?? 0, proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn)
                }
            </td>
            {
                proposalData.AuditCycle.Periodicity == AuditCyclePeriodicityType.annual ? (
                    <>
                        <td className={totalStyle} colSpan={2}>
                            {
                                getCurrencyFormat(
                                    getProposalAuditValue(AuditStepType.surveillance1),
                                    proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn
                                )
                            }
                        </td>
                        <td className={totalStyle} colSpan={2}>
                            {
                                getCurrencyFormat(
                                    getProposalAuditValue(AuditStepType.surveillance2),
                                    proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn
                                )
                            }
                        </td>
                    </>
                ) : proposalData.AuditCycle.Periodicity == AuditCyclePeriodicityType.biannual ? (
                    <>
                        <td className={totalStyle}>
                            {
                                getCurrencyFormat(
                                    getProposalAuditValue(AuditStepType.surveillance1),
                                    proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn
                                )
                            }
                        </td>
                        <td className={totalStyle}>
                            {
                                getCurrencyFormat(
                                    getProposalAuditValue(AuditStepType.surveillance2),
                                    proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn
                                )
                            }
                        </td>
                        <td className={totalStyle}>
                            {
                                getCurrencyFormat(
                                    getProposalAuditValue(AuditStepType.surveillance3),
                                    proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn
                                )
                            }
                        </td>
                        <td className={totalStyle}>
                            {
                                getCurrencyFormat(
                                    getProposalAuditValue(AuditStepType.surveillance4),
                                    proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn
                                )
                            }
                        </td>
                        <td className={totalStyle}>
                            {
                                getCurrencyFormat(
                                    getProposalAuditValue(AuditStepType.surveillance5),
                                    proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn
                                )
                            }
                        </td>
                    </>
                ) : null
            }
        </tr>
    )
}

export default ProposalPreviewADCTotalRowItem