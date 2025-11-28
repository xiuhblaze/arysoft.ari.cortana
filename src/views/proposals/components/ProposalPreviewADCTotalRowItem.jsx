import React from 'react'
import { useProposalController } from '../context/ProposalContext'
import enums from '../../../helpers/enums';
import getCurrencyFormat from '../../../helpers/getCurrencyFormat';

const ProposalPreviewADCTotalRowItem = ({ rowType, proposalAuditFirstYear, ...props }) => {
    const headerColStyle = 'col-3 text-xs text-wrap font-weight-bold bg-light';
    const totalStyle = 'text-xs text-dark text-end font-weight-bold text-wrap';

    const {AuditCyclePeriodicityType, AuditStepType, DefaultCurrencyCodeType} = enums();

    const [controller, dispatch] = useProposalController();
    const {
        proposalData,
        proposalAuditList,
    } = controller;

    // METHODS

    const getProposalAuditValue = (proposalAuditList, auditStep, valueType) => {
        const proposalAudit = proposalAuditList.find(proposalAudit =>
            proposalAudit.AuditStep == auditStep
        );

        switch (valueType) {
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
        <tr>
            <td className={headerColStyle}>Total Cost</td>
            <td
                className={totalStyle}
                colSpan={proposalData.AuditCycle.Periodicity == AuditCyclePeriodicityType.annual
                    ? 2 : 1}
            >
                {getCurrencyFormat(proposalAuditFirstYear?.TotalCost ?? 0, proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn)}
            </td>
            {
                proposalData.AuditCycle.Periodicity == AuditCyclePeriodicityType.annual ? (
                    <>
                        <td className={totalStyle} colSpan={2}>
                            {
                                getCurrencyFormat(
                                    getProposalAuditValue(proposalAuditList, AuditStepType.surveillance1, 'TotalCost'),
                                    proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn
                                )
                            }
                        </td>
                        <td className={totalStyle} colSpan={2}>
                            {
                                getCurrencyFormat(
                                    getProposalAuditValue(proposalAuditList, AuditStepType.surveillance2, 'TotalCost'),
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
                                    getProposalAuditValue(proposalAuditList, AuditStepType.surveillance1, 'TotalCost'),
                                    proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn
                                )
                            }
                        </td>
                        <td className={totalStyle}>
                            {
                                getCurrencyFormat(
                                    getProposalAuditValue(proposalAuditList, AuditStepType.surveillance2, 'TotalCost'),
                                    proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn
                                )
                            }
                        </td>
                        <td className={totalStyle}>
                            {
                                getCurrencyFormat(
                                    getProposalAuditValue(proposalAuditList, AuditStepType.surveillance3, 'TotalCost'),
                                    proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn
                                )
                            }
                        </td>
                        <td className={totalStyle}>
                            {
                                getCurrencyFormat(
                                    getProposalAuditValue(proposalAuditList, AuditStepType.surveillance4, 'TotalCost'),
                                    proposalData.CurrencyCode ?? DefaultCurrencyCodeType.mxn
                                )
                            }
                        </td>
                        <td className={totalStyle}>
                            {
                                getCurrencyFormat(
                                    getProposalAuditValue(proposalAuditList, AuditStepType.surveillance5, 'TotalCost'),
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