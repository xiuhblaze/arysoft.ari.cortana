import { useEffect, useState } from "react";

import { setProposalAuditHiddenTouched, setProposalAuditHiddenValue, setProposalAuditList, useProposalController } from "../context/ProposalContext";
import auditStepProps from "../../audits/helpers/auditStepProps";
import currencyCodeProps from "../../../helpers/currencyCodeProps";
import enums from "../../../helpers/enums";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import isNullOrEmpty from "../../../helpers/isNullOrEmpty";

const ProposalInversmentInput = ({ proposalAudit, formik, readonly = false, ...props }) => {
    const [controller, dispatch] = useProposalController();
    const {
        proposalData,
        proposalAuditList,
        includeTravelExpenses,
        proposalAuditHidden,
    } = controller;
    const { AuditStepType } = enums();

    const currencyCode = currencyCodeProps[proposalData.CurrencyCode];

    // HOOKS

    const [formData, setFormData] = useState({
        subTotalInput: proposalAudit.SubTotal ?? 0,
        certificateIssueInput: proposalAudit.CertificateIssue ?? 0,
        travelExpensesInput: proposalAudit.TravelExpenses ?? 0,
        error: {
            subTotalInput: null,
            certificateIssueInput: null,
            travelExpensesInput: null,
        },
        hasSomeError: false,
    });

    useEffect(() => {
      
        console.log('ProposalInversmentInput.useEffect: formData.error', formData.error);

        if (!!formData.error.subTotalInput || !!formData.error.certificateIssueInput || !!formData.error.travelExpensesInput) {
            console.log('hay un error'); 
            if (!formData.hasSomeError) {
                setProposalAuditHiddenValue(dispatch, proposalAuditHidden.value + 1);
                setFormData({
                    ...formData,
                    hasSomeError: true,
                });
            }
        } else {
            console.log('no hay un errores')
            setFormData({
                ...formData,
                hasSomeError: false,
            });
            setProposalAuditHiddenValue(dispatch, proposalAuditHidden.value == 0 ? 0 : proposalAuditHidden.value - 1);
        }

    }, [formData.error]);
    

    // METHODS

    const validateNumber = (value) => {
        const num = parseFloat(value);

        return isNaN(num) ? 0 : num;
    }; // validateNumber

    const getTaxes = () => {
        return validateNumber(formData.subTotalInput) * proposalData.TaxRate / 100;
    }; // getTaxes

    const getTotalCost = () => {
        return validateNumber(formData.subTotalInput) + getTaxes();
    }; // getTotalCost

    const getTotalFinal = () => {
        if (validateNumber(formData.travelExpensesInput) > 0) {
            return getTotalCost() + validateNumber(formData.travelExpensesInput);
        }
        return getTotalCost();
    }; // getTotalFinal

    const isValid = (value) => {
        const regex = /^-?\d*\.?\d*$/;

        if (regex.test(value) || value === '') return true;

        return false;
    }; // isValid

    const onBlur = (e) => {
        const { name, value } = e.target;

        // console.log('onBlur', name, value);

        if (name === 'subTotalInput') {

            if (isValid(value)) {
                const numericValue = validateNumber(value);
                const newProposalAuditList = proposalAuditList.map(item => {
                    if (item.ID == proposalAudit.ID) {
                        return {
                            ...item,
                            SubTotal: numericValue,
                            Taxes: getTaxes(),
                            TotalCost: getTotalCost(),
                            TotalFinal: getTotalFinal(),
                        };
                    }
                    return item;
                });
                setProposalAuditList(dispatch, newProposalAuditList);
                setFormData({
                    ...formData,
                    error: {
                        ...formData.error,
                        subTotalInput: null,
                    },
                });
            } else {
                setFormData({
                    ...formData,
                    error: {
                        ...formData.error,
                        subTotalInput: 'The SubTotal value is not valid',
                    },
                });
            }
        } // 'subTotalInput'

        if (name === 'certificateIssueInput') {
            
            if (isValid(value)) {
                const numericValue = validateNumber(value);
                const newProposalAuditList = proposalAuditList.map(item => {
                    if (item.ID == proposalAudit.ID) {
                        return {
                            ...item,
                            CertificateIssue: numericValue,
                        };
                    }
                    return item;
                });
                setProposalAuditList(dispatch, newProposalAuditList);
                setFormData({
                    ...formData,
                    error: {
                        ...formData.error,
                        certificateIssueInput: null,
                    },
                });
            } else {
                setFormData({
                    ...formData,
                    error: {
                        ...formData.error,
                        certificateIssueInput: 'The Certificate Issue value is not valid',
                    },
                });
            }
        } // 'certificateIssueInput'

            // const numericValue = validateNumber(value);

            // if (!isNullOrEmpty(value) && numericValue === null) {
            //     setFormData({
            //         ...formData,
            //         error: {
            //             ...formData.error,
            //             CertificateIssue: 'The Certificate Issue value must be a number',
            //         }
            //     });
            //     setProposalAuditHiddenValue(dispatch, proposalAuditHidden.value + 1);
            //     return;
            // } else {
            //     setFormData({
            //         ...formData,
            //         error: {
            //             ...formData.error,
            //             CertificateIssue: null,
            //         }
            //     });
            //     setProposalAuditHiddenValue(dispatch, proposalAuditHidden.value == 0 ? 0 : proposalAuditHidden.value - 1);
            // }

            // const newProposalAuditList = proposalAuditList.map(item => {
            //     if (item.ID == proposalAudit.ID) {
            //         return {
            //             ...item,
            //             CertificateIssue: numericValue ?? 0,
            //         };
            //     }
            //     return item;
            // });
            // setProposalAuditList(dispatch, newProposalAuditList);
        //}

        if (name === 'travelExpensesInput') {

            if (isValid(value)) {
                const numericValue = validateNumber(value);
                const newProposalAuditList = proposalAuditList.map(item => {
                    if (item.ID == proposalAudit.ID) {
                        return {
                            ...item,
                            TravelExpenses: numericValue,
                            TotalFinal: getTotalFinal(),
                        };
                    }
                    return item;
                });
                setProposalAuditList(dispatch, newProposalAuditList);
                setFormData({
                    ...formData,
                    error: {
                        ...formData.error,
                        travelExpensesInput: null,
                    },
                });
            } else {                
                setFormData({
                    ...formData,
                    error: {
                        ...formData.error,
                        travelExpensesInput: 'The Travel Expenses value is not valid',
                    },
                });
            }
            // const numericValue = validateNumber(value);

            // if (!isNullOrEmpty(value) && numericValue === null) {
            //     setFormData({
            //         ...formData,
            //         error: {
            //             ...formData.error,
            //             TravelExpenses: 'The Travel Expenses value must be a number',
            //         }
            //     });
            //     setProposalAuditHiddenValue(dispatch, proposalAuditHidden.value + 1);
            //     return;
            // } else {
            //     setFormData({
            //         ...formData,
            //         error: {
            //             ...formData.error,
            //             TravelExpenses: null,
            //         }
            //     });
            //     setProposalAuditHiddenValue(dispatch, proposalAuditHidden.value == 0 ? 0 : proposalAuditHidden.value - 1);
            // }

            // const newProposalAuditList = proposalAuditList.map(item => {
            //     if (item.ID == proposalAudit.ID) {
            //         return {
            //             ...item,
            //             TravelExpenses: numericValue ?? 0,
            //             TotalFinal: getTotalFinal(),
            //         };
            //     }
            //     return item;
            // });
            // setProposalAuditList(dispatch, newProposalAuditList);
        } // 'travelExpensesInput'

        setProposalAuditHiddenTouched(dispatch, true);
    }; // onBlur

    return (
        <>
            <tr>
                <td className="py-0" colSpan={includeTravelExpenses ? 3 : 2}>
                    <label className="form-label">
                        { 
                            proposalAudit.AuditStep == AuditStepType.stage2 
                                ? `${auditStepProps[AuditStepType.stage1].label} + ${auditStepProps[AuditStepType.stage2].label}`
                                : auditStepProps[proposalAudit.AuditStep].label}
                    </label>
                </td>
            </tr>
            <tr>
                <td className="ps-0 pt-0">
                    <div className="input-group">
                        <span className="input-group-text">
                            {currencyCode.symbol}
                        </span>
                        <input name="subTotalInput"
                            className="form-control text-end"
                            placeholder="Subtotal"
                            aria-label="Text input for subTotal"
                            value={formData.subTotalInput}
                            onChange={(e) => {
                                const { value } = e.target;
                                setFormData(prev => ({
                                    ...prev,
                                    subTotalInput: value,
                                }));
                            }}
                            onBlur={onBlur}
                            disabled={readonly}
                        />
                    </div>
                </td>
                <td className={includeTravelExpenses ? 'pt-0' : 'pt-0 pe-0'}>
                    <div className="input-group">
                        <span className="input-group-text">
                            {currencyCode.symbol}
                        </span>
                        <input name="certificateIssueInput"
                            className="form-control text-end"
                            placeholder="Certificate Issue"
                            aria-label="Text input for certificateIssue"
                            value={formData.certificateIssueInput}
                            onChange={(e) => {
                                const { value } = e.target;
                                setFormData(prev => ({
                                    ...prev,
                                    certificateIssueInput: value,
                                }));
                            }}
                            onBlur={onBlur}
                            disabled={readonly}
                        />
                    </div>
                </td>
                {
                    includeTravelExpenses ? (
                        <td className="pt-0 pe-0">
                            <div className="input-group">
                                <span className="input-group-text">
                                    {currencyCode.symbol}
                                </span>
                                <input name="travelExpensesInput"
                                    className="form-control text-end"
                                    placeholder="Travel Expenses"
                                    aria-label="Text input for travelExpenses"
                                    value={formData.travelExpensesInput}
                                    onChange={(e) => {
                                        const { value } = e.target;
                                        setFormData(prev => ({
                                            ...prev,
                                            travelExpensesInput: value,
                                        }));
                                    }}
                                    onBlur={onBlur}
                                    disabled={readonly}
                                />
                            </div>
                        </td>
                    ) : null
                }
            </tr>
            {
                !isNullOrEmpty(formData.error.certificateIssueInput)
                || !isNullOrEmpty(formData.error.subTotalInput)
                || !isNullOrEmpty(formData.error.travelExpensesInput)
                 ? (
                    <tr>
                        <td className="text-end" colSpan={includeTravelExpenses ? 3 : 2}>
                            <div className="text-danger text-xs">
                                { Object.keys(formData.error).map(key => {

                                    if (formData.error[key] === null) return null;

                                    return (
                                        <div key={key}>
                                            { formData.error[key] }
                                        </div>
                                    );
                                })}
                            </div>
                        </td>
                    </tr>
                ) : null
            }            
        </>
    )
}

export default ProposalInversmentInput