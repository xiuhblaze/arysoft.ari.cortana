import { Alert, Card, Col, Collapse, ListGroup, Modal, Row } from "react-bootstrap";
import { faExclamationCircle, faFileSignature, faSave, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form, Formik } from "formik";
import { memo, useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import * as Yup from 'yup';

import { AryFormikSelectInput, AryFormikTextArea, AryFormikTextInput } from "../../../components/Forms";
import { setADCList, setContactList, setOrganizationData, setProposalAuditList, setProposalData, useProposalController } from "../context/ProposalContext";
import { useAuditCyclesStore } from "../../../hooks/useAuditCyclesStore";
import { useNotesStore } from "../../../hooks/useNotesStore";
import { useOrganizationsStore } from "../../../hooks/useOrganizationsStore";
import { useProposalsStore } from "../../../hooks/useProposalsStore";
import { ViewLoading } from "../../../components/Loaders";
import AryLastUpdatedInfo from "../../../components/AryLastUpdatedInfo/AryLastUpdatedInfo";
import enums from "../../../helpers/enums";
import getRandomBackgroundImage from "../../../helpers/getRandomBackgroundImage";
import ProposalPreview from "./ProposalPreview";
import proposalStatusProps from "../helpers/proposalStatusProps";

import bgHeadModal from "../../../assets/img/bgTrianglesBW.jpg";
import proposalSetStatusOptions from "../helpers/proposalSetStatusOptions";
import ProposalEditADCs from "./ProposalEditADCs";
import currencyCodeProps from "../../../helpers/currencyCodeProps";
import { set } from "date-fns";
import envVariables from "../../../helpers/envVariables";
import isNullOrEmpty from "../../../helpers/isNullOrEmpty";

const ProposalModalEditItem = memo(({ id, show, onHide, ...props }) => {
    const [controller, dispatch] = useProposalController();
    const { 
        organizationData,
        proposalData,
        adcList,
        adcsCountHidden
    } = controller;

    const { 
        DefaultStatusType,
        DefaultCurrencyCodeType,
        ADCStatusType,
        ProposalStatusType, 
    } = enums();

    const { DEFAULT_TAX_RATE } = envVariables();

    const formDefaultValues = {
        justificationHiddenInput: '',
        signerNameInput: '',
        signerPositionInput: '',
        signedFileInput: '',
        currencyCodeSelect: '',
        exchangeRateInput: '',
        taxRateInput: '',
        includeTravelExpensesCheckbox: false,
        extraInfoInput: '',
        statusSelect: '',
        commentsInput: '',
        adcsCountHidden: 0,
    };

    const validationSchema = Yup.object({
        justificationHiddenInput: Yup.string()
            .required('Justification is required'),
        signerNameInput: Yup.string()
            .max(150, 'Signer name must be less than 150 characters'),
        signerPositionInput: Yup.string()
            .max(100, 'Signer position must be less than 100 characters'),
        currencyCodeSelect: Yup.string()
            .required('Currency code is required'),
        exchangeRateInput: Yup.number()
            .when('currencyCodeSelect', {
                is: (value) => value != DefaultCurrencyCodeType.mxn && value != DefaultCurrencyCodeType.nothing,
                then: (schema) => schema
                    .typeError('Exchange rate must be a number')
                    .required('Is required when currency code is different than MXN')
                    .min(0, 'Exchange rate must be greater than 0'),
                otherwise: (schema) => schema.nullable(),
            }),
        taxRateInput: Yup.number()
            .required('Tax rate is required')
            .min(0, 'Tax rate must be greater than 0')
            .max(100, 'Tax rate must be less than 100'),
        adcsCountHidden: Yup.number()
            .typeError('ADCs must be a number')
            .min(1, 'At least one ADC is required'),
    });

    // CUSTOM HOOKS

    const {
        isOrganizationLoading,
        organization,
        organizationAsync,
    } = useOrganizationsStore();

    const {
        isAuditCycleLoading,
        auditCycle,
        auditCycleAsync,
    } = useAuditCyclesStore();

    const {
        isProposalLoading,
        isProposalCreating,
        isProposalSaving,
        proposalSavedOk,
        proposal,
        proposalsErrorMessage,
        
        proposalAsync,
        proposalCreateAsync,
        proposalSaveAsync,

        proposalClear,
    } = useProposalsStore();

    const { noteCreateAsync } = useNotesStore();

    // HOOKS

    const formikRef = useRef(null);

    const [backgroundImage, setBackgroundImage] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    const [initialValues, setInitialValues] = useState(formDefaultValues);
    const [originalStatus, setOriginalStatus] = useState(null);
    const [statusOptions, setStatusOptions] = useState([]);
    const [showExchangeRateInput, setShowExchangeRateInput] = useState(false);
    const [showAddComments, setShowAddComments] = useState(false);
    const [saveNote, setSaveNote] = useState('');

    useEffect(() => {
        if (!!show) {

            setShowModal(true);
            if (!!id) {
                proposalAsync(id);
            } else if (!!auditCycle) {
                proposalCreateAsync({
                    AuditCycleID: auditCycle.ID,
                });
            } else {
                Swal.fire('Proposal', 'You must specify the Proposal ID or the audit cycle ID for show or create a new proposal', 'warning');
                actionsForCloseModal();
            }

            getRandomBackgroundImage().then(image => setBackgroundImage(image));
        }
    }, [show]);

    useEffect(() => {
        
        if (!!proposal && !!show) {

            //loadContextData(); // Considerar que de aquí todo utilizar el contexto hasta el guardado completo

            setOriginalStatus(proposal.Status);
            setStatusOptions(proposalSetStatusOptions(proposal.Status));
            setShowAddComments(false);

            if (proposal.Status >= ProposalStatusType.inactive) {
                if (!!proposal.HistoricalDataJSON) {
                    loadFromHistoricalData();
                } else {
                    Swal.fire('Proposal', 'The historical data is not available, contact the system administrator', 'warning');
                    onCloseModal();
                }
            } else {
                loadFromRealData();
            }

            // Obtener la lista de ADCs activos del AuditCycle

            console.log('ProposalModalEditItem.useEffect: proposal', proposal);
        }
    }, [proposal]);

    useEffect(() => {

        if (!!proposal && !!organization && !!show) {
            setOrganizationData(dispatch, {
                OrganizationName: organization.Name,
                AuditCycleName: !!auditCycle ? auditCycle.Name : '',
                Website: organization.Website,
                Phone: organization.Phone,
                Companies: organization.Companies
                    .filter(company => company.Status == DefaultStatusType.active),
            })
        }
    }, [proposal, organization]);

    useEffect(() => {
        if (!!formikRef?.current) {
            formikRef.current.setFieldValue('adcsCountHidden', 
                adcList.filter(i => i.Status <= ADCStatusType.inactive).length);
        }
    }, [adcList]);

    useEffect(() => {
        if (!!formikRef?.current) {
            formikRef.current.setFieldValue('justificationHiddenInput', proposalData.Justification);
        }
    }, [proposalData?.Justification])
    
    
    // METHODS

    const loadFromHistoricalData = () => { //! Por terminar, aun no se genera el historial de forma real
        console.log('loadFromHistoricalData()');
        const historicalData = JSON.parse(proposal.HistoricalDataJSON);

        setInitialValues({
            justificationHiddenInput: proposal.Justification ?? '',
            signerNameInput: proposal.SignerName ?? '',
            signerPositionInput: proposal.SignerPosition ?? '',
            signerFileInput: '',
            currencyCodeSelect: proposal.CurrencyCode ?? DefaultCurrencyCodeType.mxn,
            exchangeRateInput: proposal.ExchangeRate ?? '',
            taxRateInput: proposal.TaxRate ?? '',
            includeTravelExpensesCheckbox: proposal.IncludeTravelExpenses ?? false,
            extraInfoInput: proposal.ExtraInfo ?? '',
            statusSelect: proposal.Status,
            commentsInput: '',
            adcsCountHidden: !!historicalData.ADCs ? historicalData.ADCs.length : 0,
        });

        if (!!historicalData.ADCs && historicalData.ADCs.length > 0) {
            //setADCsList(dispatch, historicalData.ADCs);
            console.log('loadFromHistoricalData.historicalData.ADCs', historicalData.ADCs);
        }
    }; // loadFromHistoricalData

    const loadFromRealData = () => {
        
        console.log('loadFromRealData', proposal.ADCs.filter(a => a.Status <= ProposalStatusType.inactive).length);

        setInitialValues({
            justificationHiddenInput: proposal.Justification ?? '',
            signerNameInput: proposal.SignerName ?? '',
            signerPositionInput: proposal.SignerPosition ?? '',
            signerFileInput: '',
            currencyCodeSelect: proposal.CurrencyCode ?? DefaultCurrencyCodeType.mxn,
            exchangeRateInput: proposal.ExchangeRate ?? '',
            taxRateInput: proposal.TaxRate ?? DEFAULT_TAX_RATE,
            includeTravelExpensesCheckbox: proposal.IncludeTravelExpenses ?? false,
            extraInfoInput: proposal.ExtraInfo ?? '',
            statusSelect: proposal.Status ?? ProposalStatusType.nothing,
            commentsInput: '',
            adcsCountHidden: !!proposal.ADCs 
                ? proposal.ADCs.filter(a => a.Status <= ProposalStatusType.inactive).length
                : 0,
        });

        if (!!proposal.CurrencyCode 
            && proposal.CurrencyCode != DefaultCurrencyCodeType.mxn 
            && proposal.CurrencyCode != DefaultCurrencyCodeType.nothing) {
            setShowExchangeRateInput(true);
        }

        // if (!!organization && !!auditCycle) {
        //     setOrganizationData(dispatch, {
        //         OrganizationName: organization.Name,
        //         AuditCycleName: auditCycle.Name,
        //         Website: organization.Website,
        //         Phone: organization.Phone,
        //         Companies: organization.Companies
        //             .filter(company => company.Status == DefaultStatusType.active),
        //     })
        // }

        // Incluyendo valores por default para que se muestren en Preview
        setProposalData(dispatch, 
            {
                ...proposal,
                CurrencyCode: proposal.CurrencyCode ?? DefaultCurrencyCodeType.mxn,
                TaxRate: proposal.TaxRate ?? DEFAULT_TAX_RATE,
                IncludeTravelExpenses: proposal.IncludeTravelExpenses ?? false,
            }
        );

        if (!!proposal?.ADCs && proposal.ADCs.length > 0) {            
            setADCList(dispatch, proposal.ADCs);
        }

        if (!!proposal?.Contacts && proposal.Contacts.length > 0) {
            setContactList(dispatch, proposal.Contacts);
        }

        if (!!proposal?.ProposalAudits && proposal.ProposalAudits.length > 0) {
            setProposalAuditList(dispatch, proposal.ProposalAudits);
        }

    }; // loadFromRealData

    const currencyCodeSelectOnChange = (e) => {
        const selectedValue = e.target.value;

        formikRef.current.setFieldValue('currencyCodeSelect', selectedValue);
        setShowExchangeRateInput(selectedValue != DefaultCurrencyCodeType.mxn && selectedValue != DefaultCurrencyCodeType.nothing);

        setProposalData(dispatch, {
            ...proposalData,
            CurrencyCode: selectedValue,
        });
    }; // currencyCodeSelectOnChange

    const onFormSubmit = (values) => {
        console.log('onFormSubmit: values', values);
        if (proposalData.Status >= ProposalStatusType.inactive) {
            Swal.fire('Proposal', 'You cannot change the data of an inactive proposal', 'warning');
            return;
        }

        let newStatus = proposalData.Status == ProposalStatusType.nothing
            ? ProposalStatusType.new
            : values.statusSelect;

        if (proposalData.Status != newStatus) { // Si cambió el status crear una nota
            const text = 'Status changed to ' + proposalStatusProps[newStatus].label.toUpperCase();

            setSaveNote(`${text}${!isNullOrEmpty(values.commentsInput) ? ': ' + values.commentsInput : ''}`);
        }

        const toSave = {
            ID: proposalData.ID,
            Justification: values.justificationHiddenInput,
            SignerName: values.signerNameInput,
            SignerPosition: values.signerPositionInput,
            CurrencyCode: values.currencyCodeSelect,
            ExchangeRate: values.exchangeRateInput,
            TaxRate: values.taxRateInput,
            IncludeTravelExpenses: values.includeTravelExpensesCheckbox,
            ExtraInfo: values.extraInfoInput,
            Status: newStatus,
        };

        console.log('onFormSubmit: toSave', toSave);
    }; // onFormSubmit

    const onCloseModal = () => {

        if (hasChanges) {
            Swal.fire({
                title: 'Discard changes?',
                text: 'Are you sure you want to discard changes? The changes will be lost.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, discard changes!'
            }).then((result) => {
                if (result.isConfirmed) {
                    actionsForCloseModal();
                }
            })
        } else { 
            actionsForCloseModal();
        }
    }; // onCloseModal

    const actionsForCloseModal = () => {

        if (!!onHide) onHide();
        setShowModal(false);
    };

    return (
        <Modal {...props} show={showModal} onHide={onCloseModal}
            size={ 'xxxl' }
            contentClassName="bg-gray-100 border-0 shadow-lg"
            fullscreen="sm-down"
        >
            {
                isProposalLoading || isProposalCreating || isAuditCycleLoading ? (
                    <Modal.Body>
                        <div 
                            className="page-header min-height-150 border-radius-xl"
                            style={{
                                backgroundImage: `url(${backgroundImage ?? bgHeadModal})`,
                                backgroundPositionY: '50%'
                            }}
                        >
                            <h4 className="text-white mx-4 pb-5" style={{ zIndex: 1 }}>Loading...</h4>
                            <span className={`mask bg-gradient-secondary opacity-6`} />
                        </div>
                        <ViewLoading />
                    </Modal.Body>
                ) : !!proposal ?
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    enableReinitialize
                    onSubmit={onFormSubmit}
                    innerRef={formikRef}
                >
                    {(formik) => {
                        useEffect(() => {
                            setHasChanges(formik.dirty);
                        }, [formik.dirty]);
                        return (
                            <Form>
                                <Modal.Body>
                                    <div 
                                        className="page-header min-height-150 border-radius-xl"
                                        style={{
                                            backgroundImage: `url(${backgroundImage ?? bgHeadModal})`,
                                            backgroundPositionY: '50%'
                                        }}
                                    >
                                        <h4 className="text-white mx-4 pb-5" style={{ zIndex: 1 }}>Proposal</h4>
                                        <span className={`mask bg-gradient-${ proposalStatusProps[proposal.Status].variant }`} />
                                    </div>
                                    <div className="card card-body blur shadow-blur mx-4 mt-n6 overflow-hidden">
                                        <Row className="gx-4">
                                            <Col xs="12" className="d-flex justify-content-between align-items-center">
                                                <div className="d-flex align-items-center">
                                                    <div 
                                                        className={`icon icon-md icon-shape bg-gradient-info border-radius-md d-flex align-items-center justify-content-center me-2 position-relative`} 
                                                        title="Change this!!!"
                                                        style={{ minWidth: '48px' }}
                                                    >
                                                        <FontAwesomeIcon icon={ faFileSignature } className="opacity-10 text-white" aria-hidden="true" size="lg" /> 
                                                    </div>
                                                    <div className="h-100">
                                                        <h5 className="flex-wrap mb-1">
                                                            { organization.Name }
                                                        </h5>
                                                        <p className="mb-0 font-weight-bold text-sm">
                                                            { auditCycle.Name }
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="d-flex align-items-center">
                                                    <div 
                                                        className={`badge bg-gradient-${ proposalStatusProps[proposal.Status].variant } text-white`}
                                                        title={ proposalStatusProps[proposal.Status].description } 
                                                    >
                                                        {proposalStatusProps[proposal.Status].label}
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                    <Row className="mt-4">
                                        <Col xs="12" sm="5">
                                            <Card>
                                                <Card.Body className="p-3">
                                                    <Row>
                                                        <Col xs="12">
                                                            <Row>
                                                                <Col xs="12">
                                                                    <AryFormikTextArea
                                                                        name="justificationInput"
                                                                        label="Justification"
                                                                        type="text"
                                                                        disabled={ proposal.Status >= ProposalStatusType.inactive }
                                                                    />
                                                                </Col>
                                                            </Row>
                                                            <ProposalEditADCs
                                                                formik={ formik }
                                                                readonly={ proposal.Status >= ProposalStatusType.inactive } 
                                                            />
                                                            <Row>
                                                                <Col xs="12">
                                                                    <div  className="mb-3">
                                                                        <div className="bg-light border-radius-md p-3 pb-0">
                                                                            <Row>
                                                                                <Col xs="12">
                                                                                    <label className="form-label">Signer</label>
                                                                                </Col>
                                                                                <Col xs="12">
                                                                                    <AryFormikTextInput
                                                                                        name="signerNameInput"
                                                                                        label="Full name"
                                                                                        disabled={ proposal.Status >= ProposalStatusType.inactive }
                                                                                    />
                                                                                </Col>
                                                                                <Col xs="12">
                                                                                    <AryFormikTextInput
                                                                                        name="signerPositionInput"
                                                                                        label="Position"
                                                                                        disabled={ proposal.Status >= ProposalStatusType.inactive }
                                                                                    />
                                                                                </Col>
                                                                            </Row>
                                                                        </div>
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col xs="12" sm="6">
                                                                    <AryFormikSelectInput
                                                                        name="currencyCodeSelect"
                                                                        label="Currency code"
                                                                        onChange={ currencyCodeSelectOnChange }
                                                                    >
                                                                        { currencyCodeProps
                                                                            .filter(item => item.id != DefaultCurrencyCodeType.nothing)
                                                                            .map(currencyCode => 
                                                                            <option key={currencyCode.id} 
                                                                                value={currencyCode.id}
                                                                            >
                                                                                { currencyCode.label } ({ currencyCode.abbreviation })
                                                                            </option>
                                                                        )}
                                                                    </AryFormikSelectInput>
                                                                </Col>
                                                                <Collapse in={ showExchangeRateInput }>
                                                                    <Col xs="12" sm="6">
                                                                        <AryFormikTextInput
                                                                            name="exchangeRateInput"
                                                                            label="Exchange rate"
                                                                            disabled={ proposal.Status >= ProposalStatusType.inactive }
                                                                            helpText="Exchange rate to pesos (MXN)"
                                                                        />
                                                                    </Col>
                                                                </Collapse>
                                                            </Row>
                                                            <Row>
                                                                <Col xs="12" sm="6">
                                                                    <AryFormikTextInput
                                                                        name="taxRateInput"
                                                                        label="Tax rate"
                                                                        endLabel="%"
                                                                        disabled={ proposal.Status >= ProposalStatusType.inactive }
                                                                        helpText="0 - 100"
                                                                    />
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col xs="12">
                                                                    <AryFormikTextArea
                                                                        name="extraInfoInput"
                                                                        label="Extra Info"
                                                                        placehoolder="Add any extra info"
                                                                        type="text"
                                                                        rows={ 2 }
                                                                        disabled={ proposal.Status >= ProposalStatusType.inactive }
                                                                    />
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col xs="12">
                                                                    <AryFormikSelectInput
                                                                        name="statusSelect"
                                                                        label="Status"
                                                                        onChange={ (e) => {
                                                                            const selectedValue = e.target.value;

                                                                            formik.setFieldValue('statusSelect', selectedValue);
                                                                            setShowAddComments(originalStatus != selectedValue);
                                                                        }}
                                                                    >
                                                                        <option value="">(select a status)</option>
                                                                        { statusOptions.map((option) => (
                                                                            <option key={option.value} value={option.value}>{option.label}</option>
                                                                        )) }
                                                                    </AryFormikSelectInput>
                                                                </Col>
                                                            </Row>
                                                            <Collapse in={ showAddComments }>
                                                                <Row>
                                                                    <Col xs="12">
                                                                        <AryFormikTextArea
                                                                            name="commentsInput"
                                                                            label="Comments"
                                                                            type="text"
                                                                            helpText="Add any comments for the status change"
                                                                        />
                                                                    </Col>
                                                                </Row>
                                                            </Collapse>
                                                        </Col>
                                                    </Row>
                                                    { 
                                                        formik.submitCount > 0 && 
                                                        Object.keys(formik.errors).length > 0 ?
                                                        <Row className="mt-3">
                                                            <Col xs="12">
                                                                <Alert variant="danger" className="text-sm text-white">
                                                                    <h6 className="text-sm text-white font-weight-bold"> 
                                                                        There are some errors in the form
                                                                    </h6>
                                                                    <ListGroup variant="flush" size="sm">
                                                                        { Object.keys(formik.errors).map(key => 
                                                                            <ListGroup.Item 
                                                                                key={key} 
                                                                                className="text-xs bg-transparent p-1 border-0"
                                                                            >
                                                                                <FontAwesomeIcon icon={faExclamationCircle} className="me-2" />
                                                                                {formik.errors[key]}
                                                                            </ListGroup.Item>
                                                                        )} 
                                                                    </ListGroup>
                                                                </Alert>
                                                            </Col>
                                                        </Row>
                                                        : null
                                                    }
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        <Col xs="12" sm="7">
                                            <Card>
                                                <Card.Body className="p-3">
                                                    { !!proposalData 
                                                        ? <ProposalPreview formik={ formik } />
                                                        : null
                                                    }
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>
                                </Modal.Body>
                                <Modal.Footer>
                                    <div className="d-flex justify-content-between align-items-start align-items-sm-center w-100">
                                        <div className="text-secondary mb-3 mb-sm-0">
                                            <AryLastUpdatedInfo item={ proposal } />
                                        </div>
                                        <div className="d-flex justify-content-end ms-auto ms-sm-0 mb-3 mb-sm-0 gap-2">
                                            <input type="hidden" name="justificationHiddenInput" />
                                            {/* <input type="hidden" name="adcsCountHidden" /> */}
                                            <button 
                                                type="submit"
                                                className="btn bg-gradient-dark mb-0"
                                                disabled={ isProposalSaving || !hasChanges || proposal.Status >= ProposalStatusType.inactive }
                                            >
                                                {
                                                    isProposalSaving 
                                                        ? <FontAwesomeIcon icon={ faSpinner } className="me-1" size="lg" spin />
                                                        : <FontAwesomeIcon icon={ faSave } className="me-1" size="lg" />
                                                }
                                                Save
                                            </button>
                                            <button type="button"
                                                className="btn btn-link text-secondary mb-0"
                                                onClick={ onCloseModal }
                                            >
                                                Close
                                            </button>
                                        </div>
                                    </div>
                                </Modal.Footer>
                            </Form>
                        )
                    }}
                </Formik>
                : null
            }
        </Modal>
    )
}); // ProposalModalEditItem - memo

export default ProposalModalEditItem;