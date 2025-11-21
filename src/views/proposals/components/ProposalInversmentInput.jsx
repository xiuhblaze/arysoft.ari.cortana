import { useState } from "react";

import { setProposalAuditList, useProposalController } from "../context/ProposalContext";
import auditStepProps from "../../audits/helpers/auditStepProps";
import currencyCodeProps from "../../../helpers/currencyCodeProps";
import enums from "../../../helpers/enums";

const ProposalInversmentInput = ({ proposalAudit, formik, readonly = false, ...props }) => {
    const [controller, dispatch] = useProposalController();
    const {
        proposalData,
        proposalAuditList,
        includeTravelExpenses
    } = controller;    
    const { AuditStepType } = enums();

    const currencyCode = currencyCodeProps[proposalData.CurrencyCode].simbol;

    // HOOKS

    const [formData, setFormData] = useState({
        subTotalInput: proposalAudit.SubTotal ?? 0,
        certificateIssueInput: proposalAudit.CertificateIssue ?? 0,
        travelExpensesInput: proposalAudit.TravelExpenses ?? 0,
    });

    // METHODS

    const onBlur = (e) => {
        const { name, value } = e.target;
        if (name === 'subTotalInput') {            
            const newProposalAuditList = proposalAuditList.map(item => {
                if (item.ID == proposalAudit.ID) {
                    return {
                        ...item,
                        SubTotal: value,
                    };
                }
                return item;
            });
            setProposalAuditList(dispatch, newProposalAuditList);
        }

        if (name === 'certificateIssueInput') {
            const newProposalAuditList = proposalAuditList.map(item => {
                if (item.ID == proposalAudit.ID) {
                    return {
                        ...item,
                        CertificateIssue: value,
                    };
                }
                return item;
            });
            setProposalAuditList(dispatch, newProposalAuditList);
        }

        if (name === 'travelExpensesInput') {
            const newProposalAuditList = proposalAuditList.map(item => {
                if (item.ID == proposalAudit.ID) {
                    return {
                        ...item,
                        TravelExpenses: value,
                    };
                }
                return item;
            });
            setProposalAuditList(dispatch, newProposalAuditList);
        }
    }; // onBlur

    return (
        <>
            <tr>
                <td className="py-0" colSpan={ includeTravelExpenses ? 3 : 2 }>
                    <label className="form-label">
                        { auditStepProps[proposalAudit.AuditStep].label }
                    </label>
                </td>
            </tr>
            <tr>
                <td className="ps-0 pt-0">
                    <input name="subTotalInput"
                        className="form-control"
                        placeholder="Subtotal"
                        aria-label="Text input for subTotal"
                        value={formData.subTotalInput}
                        onChange={ (e) => {
                            const { value } = e.target;
                            setFormData(prev => ({
                                ...prev,
                                subTotalInput: value,
                            }));
                        }}
                        onBlur={ onBlur }
                        disabled={ readonly }
                    />
                </td>
                <td className={ includeTravelExpenses ? 'pt-0' : 'pt-0 pe-0' }>
                    <input name="certificateIssueInput"
                        className="form-control"
                        placeholder="Certificate Issue"
                        aria-label="Text input for certificateIssue"
                        value={formData.certificateIssueInput}
                        onChange={ (e) => {
                            const { value } = e.target;
                            setFormData(prev => ({
                                ...prev,
                                certificateIssueInput: value,
                            }));
                        }}
                        onBlur={ onBlur }
                        disabled={ readonly }
                    />
                </td>
                {
                    includeTravelExpenses ? (
                        <td className="pt-0 pe-0">
                            <input name="travelExpensesInput"
                                className="form-control"
                                placeholder="Travel Expenses"
                                aria-label="Text input for travelExpenses"
                                value={formData.travelExpensesInput}
                                onChange={ (e) => {
                                    const { value } = e.target;
                                    setFormData(prev => ({
                                        ...prev,
                                        travelExpensesInput: value,
                                    }));
                                }}
                                onBlur={ onBlur }
                                disabled={ readonly }
                            />
                        </td>
                    ) : null
                }
            </tr>
        </>
    )
}

export default ProposalInversmentInput