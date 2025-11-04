import { Card, Col, Modal, Row } from "react-bootstrap";
import { faFileSignature, faSave, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form, Formik } from "formik";
import { memo, useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";

import { AryFormikTextArea, AryFormikTextInput } from "../../../components/Forms";
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

const ProposalModalEditItem = memo(({ id, show, onHide, ...props }) => {
    const [controller, dispatch] = useProposalController();
    const { 
        organizationData,
        proposalData
    } = controller;

    const { 
        DefaultStatusType,
        DefaultCurrencyCodeType,

        ProposalStatusType, 
    } = enums();

    const formDefaultValues = {
        justificationInput: '',
        signerNameInput: '',
        signerPositionInput: '',
        currencyCodeSelect: '',
        extraInfoInput: '',
        statusSelect: '',
        commentsInput: '',

        adcsCountHidden: 0,
    };

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
    const [statusOptions, setStatusOptions] = useState([]);
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

            loadContextData(); // Considerar que de aquí todo utilizar el contexto hasta el guardado completo

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

            console.log('ProposalModalEditItem.useEffect: proposal', proposal);
        }
    }, [proposal]);
    
    // METHODS

    const loadContextData = () => {

        if (!!organization) {
            console.log('loadContextData.organization', organization);

            setOrganizationData(dispatch, {
                Name: organization.Name,
                
            });
        }
        setProposalData(dispatch, proposal);
    };

    const loadFromHistoricalData = () => { //! Por terminar, aun no se genera el historial de forma real
        const historicalData = JSON.parse(proposal.HistoricalDataJSON);
        // console.log('loadFromHistoricalData', historicalData);

        setInitialValues({
            justificationInput: proposal.Justification ?? '',
            signerNameInput: proposal.SignerName ?? '',
            signerPositionInput: proposal.SignerPosition ?? '',
            signerEmailInput: proposal.SignerEmail ?? '',
            signerPhoneInput: proposal.SignerPhone ?? '',
            currencyCodeSelect: proposal.CurrencyCode ?? '',
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
        
        // console.log('loadFromRealData', proposal);

        setInitialValues({
            justificationInput: proposal.Justification ?? '',
            signerNameInput: proposal.SignerName ?? '',
            signerPositionInput: proposal.SignerPosition ?? '',
            currencyCodeSelect: proposal.CurrencyCode ?? '',
            extraInfoInput: proposal.ExtraInfo ?? '',
            statusSelect: !!proposal?.Status && proposal.Status != ProposalStatusType.nothing
                ? proposal.Status
                : ProposalStatusType.new,
            commentsInput: '',

            adcsCountHidden: !!proposal.ADCs 
                ? proposal.ADCs.filter(a => a.Status == ProposalStatusType.active).length
                : 0,
        });

        if (!!organization && !!auditCycle) {
            setOrganizationData(dispatch, {
                OrganizationName: organization.Name,
                AuditCycleName: auditCycle.Name,
                Website: organization.Website,
                Phone: organization.Phone,
                Companies: organization.Companies
                    .filter(company => company.Status == DefaultStatusType.active),
            })
        }

        setProposalData(dispatch, proposal);

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

    const onFormSubmit = (values) => {

        console.log('onFormSubmit: values', values);
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
            size={ 'xl' }
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
                                                                <Col xs="12">
                                                                    
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Row>
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