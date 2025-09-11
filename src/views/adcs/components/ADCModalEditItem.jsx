import React, { useEffect, useRef, useState } from 'react';
import { Alert, Card, Col, Collapse, ListGroup, Modal, Row } from 'react-bootstrap';
import { Field, Form, Formik } from 'formik';
import Swal from 'sweetalert2';
import * as Yup from 'yup';

import { useADCConceptsStore } from '../../../hooks/useADCConceptsStore';
import { useADCConceptValuesStore } from '../../../hooks/useADCConceptValuesStore';
import { useADCSitesStore } from '../../../hooks/useADCSitesStore';
import { useADCsStore } from '../../../hooks/useADCsStore';
import { useAuditCyclesStore } from '../../../hooks/useAuditCyclesStore';
import { useNotesStore } from '../../../hooks/useNotesStore';
import { useOrganizationsStore } from '../../../hooks/useOrganizationsStore';

import { AryFormikSelectInput, AryFormikTextArea, AryFormikTextInput } from '../../../components/Forms';
import { clearADCController, setADCConceptList, setADCData, setADCSiteList, setConceptValueHidden, setMisc, useADCController } from '../context/ADCContext';
import { faArrowCircleLeft, faArrowLeft, faCalendarDay, faClock, faExclamationCircle, faExclamationTriangle, faSave, faSpinner, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ViewLoading } from '../../../components/Loaders';
import adcAlertsProps from '../helpers/adcAlertsProps';
import ADCConceptValueInput from './ADCConceptValueInput';
import ADCConceptYesNoInfo from '../../adcConcepts/components/ADCConceptYesNoInfo';
import ADCMD11ValueInput from './ADCMD11ValueInput';
import adcSetStatusOptions from '../helpers/adcSetStatusOptions';
import adcStatusProps from '../helpers/adcStatusProps';
import AryFormDebug from '../../../components/Forms/AryFormDebug';
import AryLastUpdatedInfo from '../../../components/AryLastUpdatedInfo/AryLastUpdatedInfo';
import bgHeadModal from "../../../assets/img/bgTrianglesBW.jpg";
import enums from '../../../helpers/enums';
import getRandomBackgroundImage from '../../../helpers/getRandomBackgroundImage';
import isNullOrEmpty from '../../../helpers/isNullOrEmpty';
import isObjectEmpty from '../../../helpers/isObjectEmpty';
import MiniStatisticsCard from '../../../components/Cards/MiniStatisticsCard/MiniStatisticsCard';
import NotesListModal from '../../notes/components/NotesListModal';
import AryJumpAnimation from '../../../components/AryAnimations/AryJumpAnimation';
import auditStepProps from '../../audits/helpers/auditStepProps';
import ADCSiteAuditInput from './ADCSiteAuditInput';
import getAuditStepList from '../../audits/helpers/getAuditStepList';

const ADCModalEditItem = React.memo(({ id, show, onHide, ...props }) => {
    const headStyle = 'text-uppercase text-secondary text-xxs font-weight-bolder text-wrap';
    const h6Style = 'text-sm text-dark text-gradient text-wrap mb-0';
    const pStyle = 'text-sm text-wrap pe-0 pe-sm-5 mb-0';
    const [ controller, dispatch ] = useADCController();
    const {
        adcData,
        adcSiteList,
        adcConceptList,
        adcSiteAuditsList,
        misc,
        conceptValueHidden,
        siteAuditHidden,
    } = controller;

    const {
        DefaultStatusType,
        ADCStatusType,
        ADCConceptOrderType
    } = enums();

    const formDefaultValues = {
        descriptionInput: '',
        extraInfoInput: '',
        statusSelect: '',
        commentsInput: '',
        items: [], // datos por cada adcSite
        conceptValueHidden: 0,
        siteAuditHidden: 0,
        md11Hidden: 0,
        exceedsMaximumReductionHidden: false,
    };

    const validationSchema = Yup.object({
        descriptionInput: Yup.string()
            .max(500, 'Description must be less than 500 characters')
            .required('Description is required'),
        extraInfoInput: Yup.string()
            .max(500, 'Extra info must be less than 500 characters'),
        commentsInput: Yup.string()
            .max(250, 'Comments must be less than 500 characters'),
        items: Yup.array().of(
            Yup.object({
                ID: Yup.string().required('ID is required'),
                extraInfo: Yup.string()
                    .max(500, 'Extra info must be less than 500 characters'),
            })
        ),
        conceptValueHidden: Yup.number()
            .typeError('Concept value must be a number')
            .max(0, 'At least one concept value is not valid'),
        md11Hidden: Yup.number()
            .typeError('MD11 value must be a number')
            .max(0, 'At least one MD11 value is not valid'),
        exceedsMaximumReductionHidden: Yup.boolean()
            .oneOf([false], 'At least one site exceeds maximum reduction'),
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
        isADCLoading,
        isADCSaving,
        adcSavedOk,
        adc,
        adcsErrorMessage,

        adcAsync,
        adcSaveAsync,
        adcClear,
    } = useADCsStore();

    const {
        isADCSiteSaving,
        adcSiteSavedOk,
        adcSiteSaveListAsync,
    } = useADCSitesStore();

    const {
        isADCConceptValueSaving,
        adcConceptValueSavedOk,
        adcConceptValueSaveListAsync,
    } = useADCConceptValuesStore();

    const {
        isADCConceptsLoading,
        adcConcepts,
        adcConceptsAsync,
        adcConceptsErrorMessage,
    } = useADCConceptsStore();

    const {
        noteCreateAsync,
    } = useNotesStore();

    // HOOKS

    const formikRef = useRef(null);

    const [backgroundImage, setBackgroundImage] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [initialValues, setInitialValues] = useState(formDefaultValues);

    const [originalStatus, setOriginalStatus] = useState(null);
    const [statusOptions, setStatusOptions] = useState([]);
    const [showComments, setShowComments] = useState(false);
    const [saveNote, setSaveNote] = useState(''); 
    const [auditStepList, setAuditStepList] = useState([]);

    useEffect(() => {

        if (!!show) {
            
            setShowModal(true);
            if (!!id) {
                adcAsync(id);
                clearADCController(dispatch);
            } else {
                Swal.fire('ADC', 'You must specify the Audit Day Calculation ID', 'warning');
                actionsForCloseModal();
            }
            getRandomBackgroundImage().then(image => setBackgroundImage(image));
            setOriginalStatus(null);
        }
    }, [show]);

    useEffect(() => {
        
        if (!!adc && !!show) {

            if (!organization || organization.ID != adc.AppForm.OrganizationID) {
                organizationAsync(adc.AppForm.OrganizationID);
            }

            if (!auditCycle || auditCycle.ID != adc.AppForm.AuditCycleID) {
                auditCycleAsync(adc.AppForm.AuditCycleID);
            }

            const itemsInputs = adc.ADCSites.map(adcSite => {
                
                return {
                    ID: adcSite.ID,
                    extraInfo: adcSite.ExtraInfo ?? '',
                }
            });

            setInitialValues({
                descriptionInput: adc.Description ?? '',
                extraInfoInput: adc.ExtraInfo ?? '',
                statusSelect: adc.Status,
                commentsInput: '',
                items: itemsInputs,
                conceptValueHidden: 0,
                siteAuditHidden: 0,
                md11Hidden: 0,
                exceedsMaximumReductionHidden: false,
            });

            adcConceptsAsync({
                standardID: adc.AppForm.StandardID,
                status: DefaultStatusType.active,
                pageSize: 0,
                order: ADCConceptOrderType.indexSort,
            });

            setOriginalStatus(adc.Status);
            setStatusOptions(adcSetStatusOptions(adc.Status));
            setShowComments(false);

            // Obteniendo la lista de tipos de auditorias
            const currentAuditStandard = auditCycle.AuditCycleStandards
                .find(acs => acs.StandardID == adc.AppForm.StandardID);
            setAuditStepList(getAuditStepList(
                currentAuditStandard.CycleType, 
                currentAuditStandard.InitialStep,
                auditCycle.Periodicity
            ));

            if (adc.Status >= ADCStatusType.inactive) {
                if (!!adc.HistoricalDataJSON) {
                    loadFromHistoricalData();
                } else {
                    Swal.fire('ADC', 'The historical data is not available, contact the system administrator', 'warning');
                    onCloseModal();
                }
            } else {
                loadContextData();
            }
        }
    }, [adc]);

    useEffect(() => {

        if (!!adc && !!organization && !!organization.Standards && organization.ID == adc.AppForm.OrganizationID) {
            const isMultistandard = organization.Standards
                .filter(item => item.Status == DefaultStatusType.active).length > 1;

            setMisc(dispatch, {
                ...misc,
                isMultistandard: isMultistandard,
            });
        }
    }, [adc, organization]);

    useEffect(() => {
        
        if (!!adcSiteList && adcSiteList.length > 0) {
            const result = adcSiteList.some(item => item.ExceedsMaximumReduction);
console.log(adcSiteList);
            if (!!formikRef?.current) {
                formikRef.current.setFieldValue('exceedsMaximumReductionHidden', result);
            }
        }
    }, [adcSiteList]);

    useEffect(() => {
        
        if (!!adcSavedOk && !!adcSiteSavedOk && !!adcConceptValueSavedOk) {
            if (!isNullOrEmpty(saveNote)) {
                noteCreateAsync({ OwnerID: adc.ID, Text: saveNote });
                setSaveNote('');
            }            
            Swal.fire('ADC', 'Changes made successfully', 'success');            
            actionsForCloseModal();
        }
    }, [adcSavedOk, adcSiteSavedOk, adcConceptValueSavedOk]);
    
    useEffect(() => {
        if (!!adcConcepts && adcConcepts.length > 0) {

            if (!!adc && adc.Status >= ADCStatusType.inactive) {
                const historicalData = JSON.parse(adc.HistoricalDataJSON);
                const newADCConcepts = historicalData.ADCConcepts
                    .sort((a, b) => a.IndexSort - b.IndexSort)
                    .map(historicalAdcConcept => {

                    const adcConcept = adcConcepts.find(ac => ac.ID == historicalAdcConcept.ADCConceptID);

                    return {
                        ...adcConcept,
                        Description: historicalAdcConcept.Description,
                        ExtraInfo: historicalAdcConcept.ExtraInfo,
                    };
                }); // newADCConcepts

                setADCConceptList(dispatch, newADCConcepts);
            } else {
                setADCConceptList(dispatch, adcConcepts);
            }
        }
    }, [adcConcepts]);

    useEffect(() => { 
        if (!!adcsErrorMessage) {
            console.log(`ADCModalEditItem(error): ${ adcsErrorMessage }`);
            actionsForCloseModal();
        }
    }, [adcsErrorMessage]);

    useEffect(() => {
        if (!!adcConceptsErrorMessage) {
            console.log(`ADCModalEditItem(error): ${ adcConceptsErrorMessage }`);
        }
    }, [adcConceptsErrorMessage]);

    // - Formik

    useEffect(() => {
        if (formikRef.current) {
            formikRef.current.setFieldTouched('conceptValueHidden', conceptValueHidden.touch);
        }
    }, [conceptValueHidden.touch]);

    useEffect(() => {
        if (formikRef.current) {
            const numericValue = Number(conceptValueHidden.value);                                
            formikRef.current.setFieldValue('conceptValueHidden', numericValue);
        }
    }, [conceptValueHidden.value]);

    useEffect(() => {
        if (formikRef.current) {
            formikRef.current.setFieldTouched('siteAuditHidden', siteAuditHidden.touch);
        }
    }, [siteAuditHidden.touch]);
        
    // METHODS

    const loadContextData = () => {

        setADCData(dispatch, adc);
        setADCSiteList(dispatch, adc.ADCSites);        
        setConceptValueHidden(dispatch, 0);
    }; // loadContextData

    const loadFromHistoricalData = () => {
        const historicalData = JSON.parse(adc.HistoricalDataJSON);
        const newADCSites = adc.ADCSites.map(adcSite => {
            const historicalADCSite = historicalData.Sites.find(s => s.SiteID == adcSite.SiteID);
            
            return {
                ...adcSite,
                SiteDescription: historicalADCSite.Description,
            };
        }); // newADCSites

        setADCData(dispatch, adc);
        setADCSiteList(dispatch, newADCSites);
        setConceptValueHidden(dispatch, 0);
    }; // loadFromHistoricalData

    const onFormSubmit = (values) => {
        let reviewComments = adc.ReviewComments;
        let newStatus = adc.Status == ADCStatusType.nothing && values.statusSelect == ADCStatusType.nothing
            ? ADCStatusType.new
            : values.statusSelect;

        if (adc.Status != newStatus) { // Si cambió el status crear una nota
            const text = 'Status changed to ' + adcStatusProps[newStatus].label.toUpperCase();
            setSaveNote(`${text}${!isNullOrEmpty(values.commentsInput) ? ': ' + values.commentsInput : ''}`);

            if (newStatus == ADCStatusType.review 
                || newStatus == ADCStatusType.rejected 
                || newStatus == ADCStatusType.active) {
                reviewComments = values.commentsInput;
            }
        }

        const toSave = {
            ID: adc.ID,
            Description: values.descriptionInput,
            TotalInitial: adcData.TotalInitial,
            TotalMD11: adcData.TotalMD11,
            TotalSurveillance: adcData.TotalSurveillance,
            ReviewComments: reviewComments,
            ExtraInfo: values.extraInfoInput,
            Status: newStatus,
        };

        adcSaveAsync(toSave);

        let files = [];
        const toADCSiteSaveList = adcSiteList.map(contextADCSite => {
            const formikADCSite = values.items.find(item => item.ID == contextADCSite.ID);

            if (!!contextADCSite.MD11File && !!contextADCSite.IsMultiStandard) {
                const fileName = `${contextADCSite.ID}.${contextADCSite.MD11File.name.split('.').pop()}`;
                files.push(
                    new File([contextADCSite.MD11File], fileName, {
                        type: contextADCSite.MD11File.type,
                        lastModified: contextADCSite.MD11File.lastModified,
                }));
            }

            return {
                ID: contextADCSite.ID,
                SiteID: contextADCSite.SiteID,
                TotalInitial: contextADCSite.TotalInitial,
                MD11: contextADCSite.MD11 ?? 0,
                Total: contextADCSite.Total ?? 0,
                Surveillance: contextADCSite.Surveillance ?? 0,
                ExtraInfo: formikADCSite?.extraInfo ?? '',
                Status: contextADCSite.Status,
            };
        });

        adcSiteSaveListAsync(toADCSiteSaveList, files);

        adcSiteList.forEach(contextADCSite => { //* SITES
            const toADCConceptValuesSaveList = contextADCSite.ADCConceptValues.map(adccvItem => {
                return {
                    ID: adccvItem.ID,
                    CheckValue: adccvItem.CheckValue,
                    Value: adccvItem.Value,
                    Justification: adccvItem.Justification,
                    ValueUnit: adccvItem.ValueUnit,
                    Status: adccvItem.Status,
                };
            });

            adcConceptValueSaveListAsync(toADCConceptValuesSaveList);
        });

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
        adcClear();
        setShowModal(false);
    }; // actionsForCloseModal
    
    return (
        <Modal {...props} show={showModal} onHide={onCloseModal}
            size={ adcSiteList.length > 3 ? 'xxxl' : 'xl' }
            contentClassName="bg-gray-100 border-0 shadow-lg"
            fullscreen="sm-down"
        >
            {
                isADCLoading || isOrganizationLoading || isAuditCycleLoading ? (
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
                ) : !!adc ? (
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        enableReinitialize
                        onSubmit={onFormSubmit}
                        innerRef={formikRef}
                    >
                        {(formik) => {
                            useEffect(() => {
                                setHasChanges(formik.dirty || Object.keys(formik.touched).length > 0);
                            }, [formik.dirty]);

                            useEffect(() => {
                                if(Object.keys(formik.touched).length > 0) {
                                    setHasChanges(true);
                                }
                            }, [formik.touched]);

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
                                            <h4 className="text-white mx-4 pb-5" style={{ zIndex: 1 }}>Audit Day Calculation</h4>
                                            <span className={`mask bg-gradient-${ adcStatusProps[adc.Status].variant } opacity-6`} />
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
                                                            <FontAwesomeIcon icon={ faClock  } className="opacity-10 text-white" aria-hidden="true" size="lg" /> 
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
                                                            className={`badge bg-gradient-${ adcStatusProps[adc.Status].variant } text-white`}
                                                            title={ adcStatusProps[adc.Status].description } 
                                                        >
                                                            {adcStatusProps[adc.Status].label}
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                        <Row className="mt-4 mb-3">
                                            <Col xs="12" sm="12">
                                                <Card>
                                                    <Card.Body className="p-3">
                                                        {
                                                            !!adc.Alerts && adc.Alerts.length > 0 && (
                                                                <Row>
                                                                    <Col xs="12">
                                                                        <Alert variant="danger" className="text-white">
                                                                            <ListGroup variant="flush" size="sm">
                                                                                { adc.Alerts.map((alert) => 
                                                                                    <ListGroup.Item 
                                                                                        key={alert} 
                                                                                        className="text-xs bg-transparent p-1 border-0"
                                                                                    >
                                                                                        <FontAwesomeIcon icon={ faExclamationCircle } className="me-2" />
                                                                                        { adcAlertsProps[alert].description }
                                                                                    </ListGroup.Item>
                                                                                )} 
                                                                            </ListGroup>
                                                                        </Alert>
                                                                    </Col>
                                                                </Row>
                                                            )
                                                        }
                                                        <Row>
                                                            <Col xs="12" sm="8">
                                                                <Row>
                                                                    <Col xs="12">
                                                                        <AryFormikTextInput
                                                                            name="descriptionInput"
                                                                            label="Description"
                                                                            type="text"
                                                                            disabled={ adc.Status >= ADCStatusType.inactive }
                                                                        />
                                                                        <input type="hidden" name="conceptValueHidden" />
                                                                        <input type="hidden" name="siteAuditHidden" />
                                                                        <input type="hidden" name="md11Hidden" />
                                                                        <input type="hidden" name="exceedsMaximumReductionHidden" />
                                                                    </Col>
                                                                    <Col xs="12">
                                                                        <AryFormikTextArea
                                                                            name="extraInfoInput"
                                                                            label="Extra Info"
                                                                            placehoolder="Add any extra info"
                                                                            type="text"
                                                                            rows={ 2 }
                                                                            disabled={ adc.Status >= ADCStatusType.inactive }
                                                                        />
                                                                        {
                                                                            !!adc.Notes ? (
                                                                            <Row>
                                                                                <Col xs="12">
                                                                                    <NotesListModal notes={adc.Notes} buttonLabel="View notes" />
                                                                                    {
                                                                                        adc.Status == ADCStatusType.rejected && (
                                                                                            <AryJumpAnimation jumpHeight={8}>
                                                                                                <FontAwesomeIcon icon={ faArrowCircleLeft } className="ms-2 text-danger" size="sm" />
                                                                                            </AryJumpAnimation>
                                                                                        )
                                                                                    }
                                                                                </Col>
                                                                            </Row> ) : null
                                                                        }
                                                                        {
                                                                            adc.Status == ADCStatusType.rejected ? ( 
                                                                            <Row>
                                                                                <Col xs="12">
                                                                                    <div className="text-danger text-xs">
                                                                                        The status is rejected, please, check the comments in the notes
                                                                                    </div>
                                                                                </Col>
                                                                            </Row> ) : null
                                                                        }
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                            <Col xs="12" sm="4">
                                                                <Row>
                                                                    <Col xs="12">
                                                                        <AryFormikSelectInput
                                                                            name="statusSelect"
                                                                            label="Status"
                                                                            onChange={ (e) => {
                                                                                const selectedValue = e.target.value;

                                                                                formik.setFieldValue('statusSelect', selectedValue);
                                                                                setShowComments(originalStatus != selectedValue);
                                                                            }}
                                                                        >
                                                                            <option value="">(select a status)</option>
                                                                            { statusOptions.map((option) => (
                                                                                <option key={option.value} value={option.value}>{option.label}</option>
                                                                            )) }
                                                                        </AryFormikSelectInput>
                                                                    </Col>
                                                                    <Col xs="12">
                                                                        <Collapse in={ showComments }>
                                                                            <Row>
                                                                                <Col xs="12">
                                                                                    <AryFormikTextArea
                                                                                        name="commentsInput"
                                                                                        label="Comments"
                                                                                        type="text"
                                                                                        helpText="Add any comments for the status change"
                                                                                        rows={ 2 }
                                                                                    />
                                                                                </Col>
                                                                            </Row>
                                                                        </Collapse>
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col xs="12">
                                                                <div className='table-responsive'>
                                                                    <table className='table align-items-center table-borderless'>
                                                                        <thead>
                                                                            <tr>
                                                                                <th style={{minWidth: '300px'}}></th>
                                                                                <th></th>
                                                                                {
                                                                                    adcSiteList.map(adcSite =>  
                                                                                        <th key={adcSite.ID} className="align-top" style={{minWidth: '220px'}}>
                                                                                            <div className={headStyle}>
                                                                                                { adcSite.SiteDescription }
                                                                                            </div>
                                                                                            <div 
                                                                                                className="text-xs text-secondary text-wrap font-weight-lighter mb-0"
                                                                                                title={ adcSite.SiteAddress.length > 20 ? adcSite.SiteAddress : null }
                                                                                            >
                                                                                                { 
                                                                                                    adcSite.SiteAddress.length > 20 
                                                                                                        ? adcSite.SiteAddress.substring(0, 20) + '...'
                                                                                                        : adcSite.SiteAddress
                                                                                                }
                                                                                            </div>
                                                                                        </th>
                                                                                    )
                                                                                }
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            <tr>
                                                                                <th className='text-end' colSpan={2}>
                                                                                    <h6 className={h6Style}>
                                                                                        Employees
                                                                                    </h6>
                                                                                </th>
                                                                                {
                                                                                    adcSiteList.map(adcSite =>  
                                                                                        <td key={adcSite.ID}>
                                                                                            <p className={`${pStyle} text-end`}>
                                                                                                { adcSite.NoEmployees } 
                                                                                                <span className="px-2" title="Employees">
                                                                                                    <FontAwesomeIcon icon={ faUsers } fixedWidth />
                                                                                                </span>
                                                                                            </p>
                                                                                        </td>
                                                                                    )
                                                                                }
                                                                            </tr>
                                                                            <tr>
                                                                                <th className="text-end" colSpan={2}>
                                                                                    <h6 className={h6Style}>
                                                                                        Initial MD5
                                                                                    </h6>
                                                                                </th>
                                                                                {
                                                                                    adcSiteList.map(adcSite =>  
                                                                                        <td key={adcSite.ID}>
                                                                                            <p className={`${pStyle} text-end`}>
                                                                                                { adcSite.InitialMD5 }
                                                                                                <span className="px-2" title="Days">
                                                                                                    <FontAwesomeIcon icon={ faCalendarDay } fixedWidth />
                                                                                                </span>
                                                                                            </p>
                                                                                        </td>
                                                                                    )
                                                                                }
                                                                            </tr>
                                                                            {
                                                                                isADCConceptsLoading ? (
                                                                                    <tr>
                                                                                        <th>
                                                                                            <h6 className={`${h6Style} text-secondary`}>
                                                                                                Loading...
                                                                                            </h6>
                                                                                        </th>
                                                                                    </tr>
                                                                                ) : adcConceptList.length > 0 ? (
                                                                                    adcConceptList.map(adcConcept => 
                                                                                        <tr key={ adcConcept.ID }>
                                                                                            <th>
                                                                                                <h6 className={h6Style}>{adcConcept.Description}</h6>
                                                                                                <p className="text-xs text-secondary text-wrap mb-0">
                                                                                                    { adcConcept.ExtraInfo }
                                                                                                </p>
                                                                                            </th>
                                                                                            <td>
                                                                                                <ADCConceptYesNoInfo item={adcConcept} />
                                                                                            </td>
                                                                                            {
                                                                                                adcSiteList.map(adcSite => 
                                                                                                <td key={adcSite.ID} className="align-top">
                                                                                                    { adcSite.ADCConceptValues
                                                                                                        .filter(acv => acv.ADCConceptID == adcConcept.ID)
                                                                                                        .map(acv => {
                                                                                                            return (
                                                                                                                <ADCConceptValueInput 
                                                                                                                    key={acv.ID} 
                                                                                                                    name={`ADCConceptValue.${acv.ID}`}
                                                                                                                    adcConcept={adcConcept} 
                                                                                                                    adcConceptValue={acv} 
                                                                                                                />
                                                                                                            )
                                                                                                        }
                                                                                                    )}
                                                                                                </td>
                                                                                                )
                                                                                            }
                                                                                        </tr>
                                                                                    )) : null
                                                                            }
                                                                            <tr>
                                                                                <th className="text-end" colSpan={2}>
                                                                                    <h6 className={h6Style}>
                                                                                        Total Initial
                                                                                    </h6>
                                                                                </th>                                                                                
                                                                                {
                                                                                    adcSiteList.map(adcSite => 
                                                                                        <td key={adcSite.ID}>
                                                                                            <p className={`${pStyle} text-end ${!!adcSite.ExceedsMaximumReduction ? 'text-danger' : ''}`}>
                                                                                                { adcSite.TotalInitial ?? 0 }
                                                                                                <span className="px-2" title="Days">
                                                                                                    <FontAwesomeIcon icon={ faCalendarDay } fixedWidth />
                                                                                                </span>
                                                                                            </p>
                                                                                            {
                                                                                                !!adcSite.ExceedsMaximumReduction ? (
                                                                                                    <span className="text-xs text-danger">
                                                                                                        <FontAwesomeIcon icon={ faExclamationTriangle } className="me-1" size="sm" />
                                                                                                        Exceeds maximum reduction
                                                                                                    </span>
                                                                                                ) : null
                                                                                            }
                                                                                        </td>
                                                                                    ) 
                                                                                }
                                                                            </tr>
                                                                            {
                                                                                misc.isMultistandard ? (
                                                                                    <>
                                                                                        <tr>
                                                                                            <th className="text-end" colSpan={2}>
                                                                                                <h6 className={h6Style}>
                                                                                                    MD11 with File
                                                                                                </h6>
                                                                                                <p className="text-xs text-secondary text-wrap mb-0">
                                                                                                    Decrease
                                                                                                </p>
                                                                                            </th>
                                                                                            {
                                                                                                adcSiteList.map((adcSite) =>   
                                                                                                    <td key={adcSite.ID}>
                                                                                                        <ADCMD11ValueInput 
                                                                                                            name={ `adcSite[${adcSite.ID}].MD11` }
                                                                                                            adcSite={adcSite} 
                                                                                                            formik={formik} 
                                                                                                        />
                                                                                                    </td>
                                                                                                )
                                                                                            }
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <th className="text-end" colSpan={2}>
                                                                                                <h6 className={h6Style}>
                                                                                                    Total
                                                                                                </h6>
                                                                                            </th>
                                                                                            {
                                                                                                adcSiteList.map((adcSite) =>
                                                                                                    <td key={adcSite.ID}>
                                                                                                        <p className={`${pStyle} text-end`}>
                                                                                                            { adcSite.Total ?? 0}
                                                                                                            <span className="px-2" title="Days">
                                                                                                                <FontAwesomeIcon icon={ faCalendarDay } fixedWidth />
                                                                                                            </span>
                                                                                                        </p>
                                                                                                    </td>
                                                                                                )
                                                                                            }
                                                                                        </tr>
                                                                                    </>
                                                                                ) : null
                                                                            }
                                                                            <tr>
                                                                                <th className="text-end" colSpan={2}>
                                                                                    <h6 className={h6Style}>
                                                                                        Surveillance
                                                                                    </h6>
                                                                                </th>
                                                                                {
                                                                                    adcSiteList.map(adcSite =>  
                                                                                        <td key={adcSite.ID}>
                                                                                            <p className={`${pStyle} text-end`}>
                                                                                                { adcSite.Surveillance ?? 0 }
                                                                                                <span className="px-2" title="Days">
                                                                                                    <FontAwesomeIcon icon={ faCalendarDay } fixedWidth />
                                                                                                </span>
                                                                                            </p>
                                                                                        </td>
                                                                                    )
                                                                                }
                                                                            </tr>
                                                                            <tr>
                                                                                <th className="text-end" colSpan={2}>
                                                                                    <h6 className={h6Style}>
                                                                                        Extra Info
                                                                                    </h6>
                                                                                    <p className="text-xs text-secondary text-wrap mb-0">
                                                                                        for site
                                                                                    </p>
                                                                                </th>
                                                                                {
                                                                                    formik.values.items.map((item, index) =>   
                                                                                        <td key={item.ID}>
                                                                                            <Field
                                                                                                name={ `items[${index}].extraInfo` }
                                                                                                className="form-control"
                                                                                                as="textarea"
                                                                                                rows={ 2 }
                                                                                                disabled={ adc.Status >= ADCStatusType.inactive }
                                                                                            />
                                                                                        </td>
                                                                                    )
                                                                                }
                                                                            </tr>
                                                                            { auditStepList.length > 0 ? auditStepList.map(auditStep =>
                                                                                <tr key={ auditStep }>
                                                                                    <th colSpan={2}>
                                                                                        <h6 className={ `${h6Style} text-end`}>
                                                                                            { auditStepProps[auditStep].label }
                                                                                        </h6>
                                                                                    </th>
                                                                                    {
                                                                                        adcSiteList.map(adcSite => 
                                                                                            <td key={adcSite.ID} className="align-middle">
                                                                                                {/* { adcSite.ADCSiteAudits
                                                                                                    .filter(asa => asa.AuditStep == auditStep)
                                                                                                    .map(asa => <ADCSiteAuditInput key={asa.ID} adcSiteAudit={asa} />)
                                                                                                } */}                                                                                                
                                                                                                <ADCSiteAuditInput 
                                                                                                    adcSiteAudit={ adcSite.ADCSiteAudits.find(asa => asa.AuditStep == auditStep) } 
                                                                                                />
                                                                                            </td>
                                                                                        )
                                                                                    }
                                                                                </tr>
                                                                            ) : null }
                                                                        </tbody>                                                                    
                                                                    </table>
                                                                    {
                                                                        !isObjectEmpty(formik.errors) && (
                                                                            <>
                                                                                <hr className="horizontal dark my-3" />
                                                                                <Alert variant="danger" className="text-sm text-white">
                                                                                    <h6 className="text-sm text-white font-weight-bold mb-0"> 
                                                                                        There are some errors in the form
                                                                                    </h6>
                                                                                    <p className="text-xs text-white mb-0 opacity-8">Please, check the list of errors below</p>
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
                                                                            </>
                                                                        )
                                                                    }
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <MiniStatisticsCard
                                                    title="Employees"
                                                    count={ adcData?.TotalEmployees ?? 0 }
                                                    percentage={{
                                                        color: 'primary',
                                                        text: 'persons',
                                                    }}
                                                    icon={{
                                                        icon: faUsers,
                                                        bgColor: 'primary',
                                                    }}
                                                />
                                            </Col>
                                            <Col>
                                                <MiniStatisticsCard
                                                    title="Total Initial"
                                                    count={ adcData?.TotalInitial ?? 0 }
                                                    percentage={{
                                                        color: 'info',
                                                        text: 'days',
                                                    }}
                                                    icon={{
                                                        icon: faCalendarDay,
                                                        bgColor: 'info',
                                                    }}
                                                />
                                            </Col>
                                            {
                                                misc.isMultistandard ? (
                                                    <Col>
                                                        <MiniStatisticsCard
                                                            title="Total MD11"
                                                            count={ adcData?.TotalMD11 ?? 0 }
                                                            percentage={{
                                                                color: 'secondary',
                                                                text: 'days',
                                                            }}
                                                            icon={{
                                                                icon: faCalendarDay,
                                                                bgColor: 'secondary',
                                                            }}
                                                        />
                                                    </Col>
                                                ) : null
                                            }
                                            <Col>
                                                <MiniStatisticsCard
                                                    title="Surveillance"
                                                    count={ adcData?.TotalSurveillance ?? 0 }
                                                    percentage={{
                                                        color: 'dark',
                                                        text: 'days',
                                                    }}
                                                    icon={{
                                                        icon: faCalendarDay,
                                                        bgColor: 'dark',
                                                    }}
                                                />
                                            </Col>
                                        </Row>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <div className="d-flex justify-content-between align-items-start align-items-sm-center w-100">
                                            <div className="text-secondary mb-3 mb-sm-0">
                                                <AryLastUpdatedInfo item={ adc } />
                                            </div>
                                            {/* <AryFormDebug formik={ formik } /> */}
                                            <div className="d-flex justify-content-end ms-auto ms-sm-0 mb-3 mb-sm-0 gap-2">
                                                <button 
                                                    type="submit"
                                                    className="btn bg-gradient-dark mb-0"
                                                    disabled={ isADCSaving || isADCConceptValueSaving || isADCSiteSaving
                                                        || !hasChanges || adc.Status >= ADCStatusType.inactive }
                                                >
                                                    {
                                                        isADCSaving || isADCConceptValueSaving || isADCSiteSaving
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
                ) : null
            }
        </Modal>
    )
}); // ADCModalEditItem

export default ADCModalEditItem;