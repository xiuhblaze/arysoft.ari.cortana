import React, { useEffect, useRef, useState } from 'react'
import { Alert, Card, Col, Collapse, Modal, Row } from 'react-bootstrap';
import { ErrorMessage, Field, Form, Formik, getIn } from 'formik';
import Swal from 'sweetalert2';
import * as Yup from 'yup';

import { useADCsStore } from '../../../hooks/useADCsStore';
import { useOrganizationsStore } from '../../../hooks/useOrganizationsStore';
import { useAuditCyclesStore } from '../../../hooks/useAuditCyclesStore';

import bgHeadModal from "../../../assets/img/bgTrianglesBW.jpg";
import { ViewLoading } from '../../../components/Loaders';
import adcStatusProps from '../helpers/adcStatusProps';
import getRandomBackgroundImage from '../../../helpers/getRandomBackgroundImage';
import { faCalendarDay, faClock, faExclamationTriangle, faSave, faSpinner, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AryFormikSelectInput, AryFormikTextArea, AryFormikTextInput } from '../../../components/Forms';
import AryLastUpdatedInfo from '../../../components/AryLastUpdatedInfo/AryLastUpdatedInfo';
import enums from '../../../helpers/enums';
import { useADCConceptsStore } from '../../../hooks/useADCConceptsStore';
import isNullOrEmpty from '../../../helpers/isNullOrEmpty';
import ADCConceptYesNoInfo from '../../adcConcepts/components/ADCConceptYesNoInfo';
import ADCConceptValueInput from './ADCConceptValueInput';
import MiniStatisticsCard from '../../../components/Cards/MiniStatisticsCard/MiniStatisticsCard';
import { clearADCController, setADCConceptList, setADCData, setADCSiteList, setMisc, updateADCSite, updateTotals, useADCController } from '../context/ADCContext';
import adcSetStatusOptions from '../helpers/adcSetStatusOptions';
import NotesListModal from '../../notes/components/NotesListModal';
import AryFormDebug from '../../../components/Forms/AryFormDebug';
import adcAlertsProps from '../helpers/adcAlertsProps';
import { useADCSitesStore } from '../../../hooks/useADCSitesStore';
import { useADCConceptValuesStore } from '../../../hooks/useADCConceptValuesStore';
import ADCMD11ValueInput from './ADCMD11ValueInput';

const ADCModalEditItem = React.memo(({ id, show, onHide, ...props }) => {
    const headStyle = 'text-uppercase text-secondary text-xxs font-weight-bolder text-wrap';
    //const firstColStyle = 'text-dark text-xxs font-weight-bolder text-wrap';
    const h6Style = 'text-sm text-dark text-gradient text-wrap mb-0';
    const pStyle = 'text-sm text-wrap pe-0 pe-sm-5 mb-0';
    const [ controller, dispatch ] = useADCController();
    const {
        adcData,
        adcSiteList,
        adcConceptList,
        misc,
    } = controller;

    const {
        DefaultStatusType,
        ADCStatusType,
        ADCConceptUnitType,
        ADCConceptOrderType
    } = enums();

    const formDefaultValues = {
        descriptionInput: '',
        extraInfoInput: '',
        statusSelect: '',
        commentsInput: '',
        items: [],          
        conceptValueHidden: 0,
    };

    //TODO: Ver la posibilidad de crear un array como items pero para guardar inputs hidden
    //      que guarden el valor de TotalInitial por cada ADCSite, para validar si se pasan del 30% o mas
    //      y asi evitar que se guarde el ADC

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
                MD11: Yup.number()
                    .typeError('MD11 must be a number')
                    .min(0, 'MD11 must be greater than 0')
                    .max(99, 'MD11 must be less than 100'),
                extraInfo: Yup.string()
                    .max(500, 'Extra info must be less than 500 characters'),
            })
        ),
        conceptValueHidden: Yup.number()
            .max(0, 'At last a concept value is not valid')
    });

    // CUSTOM HOOKS

    const {
        isOrganizationLoading,
        organization,
        organizationsErrorMessage,

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

        adcAsync,
        adcSaveAsync,
        adcClear,
    } = useADCsStore();

    const {
        isADCSiteSaving,
        adcSiteSavedOk,
        adcSiteSaveAsync,
    } = useADCSitesStore();

    const {
        isADCConceptValueSaving,
        adcConceptValueSavedOk,
        adcConceptValueSaveAsync,        
    } = useADCConceptValuesStore();

    const {
        isADCConceptsLoading,
        adcConcepts,
        adcConceptsAsync,
        adcConceptsErrorMessage,
    } = useADCConceptsStore();

    // HOOKS

    const formikRef = useRef(null);

    //const [firstTime, setFirstTime] = useState(true);

    const [backgroundImage, setBackgroundImage] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [initialValues, setInitialValues] = useState(formDefaultValues);

    const [originalStatus, setOriginalStatus] = useState(null);
    const [statusOptions, setStatusOptions] = useState([]);
    const [showComments, setShowComments] = useState(false);
    const [saveNote, setSaveNote] = useState(''); 

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
                // const adcConceptValueItems = adcSite.ADCConceptValues.map(acv => {
                //     return {
                //         ID: acv.ID,
                //         checkValue: acv.CheckValue ?? false,
                //         value: acv.Value ?? 0,
                //         justification: acv.Justification ?? '',
                //         valueUnit: acv.ValueUnit ?? ADCConceptUnitType.nothing,
                //     }
                // }); 

                return {
                    ID: adcSite.ID,
                    MD11: adcSite.MD11 ?? '0',
                    extraInfo: adcSite.ExtraInfo ?? '',
                    //adcConceptValues: adcConceptValueItems,
                }
            });

            setInitialValues({
                descriptionInput: adc.Description ?? '',
                extraInfoInput: adc.ExtraInfo ?? '',
                statusSelect: adc.Status,
                commentsInput: '',
                items: itemsInputs,
                conceptValueHidden: 0,
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

            loadData();
            // updateTotals(dispatch);
            //calculateData();
        }
    }, [adc]);

    useEffect(() => {
console.log('useEffect', adc, organization);
        if (!!adc && !!organization && !!organization.Standards && organization.ID == adc.AppForm.OrganizationID) {
            const isMultistandard = organization.Standards
                .filter(item => item.Status == DefaultStatusType.active).length > 1;
console.log('isMultistandard', isMultistandard);
            setMisc(dispatch, {
                ...misc,
                isMultistandard: isMultistandard,
            });
        }
    }, [adc, organization])
    

    // useEffect(() => {
        
    //     if (firstTime && !!adcData && adcSiteList.length > 0) {
    //         console.log('firstTime', adcData ,adcSiteList);
    //         updateTotals(dispatch);
    //         setFirstTime(false);
    //     }   
    // }, [adcData, adcSiteList]);
    

    useEffect(() => {
        
        if (!!adcSavedOk) {
            console.log('...saved ok');

            if (!isNullOrEmpty(saveNote)) {
                noteCreateAsync({ OwnerID: adc.ID, Text: saveNote });
                setSaveNote('');
            }            
            Swal.fire('ADC', 'Changes made successfully', 'success');            
            actionsForCloseModal();
        }
    }, [adcSavedOk]);
    
    useEffect(() => {
        if (!!adcConcepts) {
            setADCConceptList(dispatch, adcConcepts);
        }
    }, [adcConcepts]);

    useEffect(() => {
        if (!!adcConceptsErrorMessage) {
            console.log(`ADCModalEditItem(error): ${ adcConceptsErrorMessage }`);
        }
    }, [adcConceptsErrorMessage]);
    
    // METHODS

    const loadData = () => {

        if (!!adc) {
            setADCData(dispatch, adc);
            setADCSiteList(dispatch, adc.ADCSites);
        }
    }; // loadData

    const onFormSubmit = (values) => {

        console.log('onFormSubmit()');
        console.log('values', values);
        console.log('adcData', adcData);
        console.log('adcSiteList', adcSiteList);

        let reviewComments = adc.ReviewComments;
        let newStatus = adc.Status == ADCStatusType.nothing
            ? ADCStatusType.new
            : values.statusSelect;

        if (adc.Status != newStatus) { // Si cambió el status crear una nota
            const text = 'Status changed to ' + adcStatusProps[newStatus].label.toUpperCase();
            console.log('text', text);
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
            TotalRR: adcData.TotalRR,
            ReviewComments: reviewComments,
            ExtraInfo: values.extraInfoInput,
            Status: newStatus,
        };

        console.log('toSave', toSave);
        adcSaveAsync(toSave);
        console.log('send to save...');
        console.log('----- Sites -----');

        adcSiteList.forEach(adcSite => {
            const localADCSite = values.items.find(item => item.ID == adcSite.ID);
            //console.log('localADCSite', localADCSite);
            const toADCSiteSave = {
                ID: adcSite.ID,
                SiteID: adcSite.SiteID,
                TotalInitial: adcSite.TotalInitial,
                MD11: localADCSite?.MD11 ?? 0,
                Surveillance: adcSite.Surveillance,
                RR: adcSite.RR,
                ExtraInfo: localADCSite?.extraInfo ?? '',
                Status: adcSite.Status,
            };
            //console.log('toADCSiteSave', toADCSiteSave);
            console.log('ADCSite, send to save...');

            adcSiteSaveAsync(toADCSiteSave);

            console.log('----- Concept Values -----');
            adcSite.ADCConceptValues.forEach(adccvItem => {
                
                //console.log('adccvItem', adccvItem);
                const toADCCVSave = {
                    ID: adccvItem.ID,
                    CheckValue: adccvItem.CheckValue,
                    Value: adccvItem.Value,
                    Justification: adccvItem.Justification,
                    ValueUnit: adccvItem.ValueUnit,
                    Status: adccvItem.Status,
                };

                console.log('ADCConceptValue, send to save...');
                adcConceptValueSaveAsync(toADCCVSave);
                console.log('toADCCVSave', toADCCVSave);
            });
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
            size="xl"
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
                                                            adc.Alerts.length > 0 && (
                                                                <Row>
                                                                    <Col xs="12">
                                                                        <Alert variant="danger" className="text-white">
                                                                            <FontAwesomeIcon icon={ faExclamationTriangle } className="me-3" />
                                                                            { adc.Alerts.map((alert) => 
                                                                                <p key={alert} className="text-xs text-white mb-0">{ adcAlertsProps[alert].description }</p>) 
                                                                            }
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
                                                                        />
                                                                        <input type="hidden" name="conceptValueHidden" />
                                                                    </Col>
                                                                    <Col xs="12">
                                                                        <AryFormikTextArea
                                                                            name="extraInfoInput"
                                                                            label="Extra Info"
                                                                            placehoolder="Add any extra info"
                                                                            type="text"
                                                                            rows={ 2 }
                                                                        />
                                                                        {
                                                                            !!adc.Notes && adc.Notes.length > 0 &&
                                                                            <Row>
                                                                                <Col xs="12">
                                                                                    <NotesListModal notes={adc.Notes} buttonLabel="View notes" />
                                                                                </Col>
                                                                            </Row>
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
                                                                                    <AryFormikTextInput
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
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col xs="12">
                                                                <div className='table-responsive'>
                                                                    <table className='table align-items-center table-borderless'>
                                                                        <thead>
                                                                            <tr>
                                                                                <th></th>
                                                                                <th></th>
                                                                                {
                                                                                    adcSiteList.map(adcSite =>  
                                                                                        <th key={adcSite.ID} className={headStyle}>
                                                                                            { adcSite.SiteDescription }
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
                                                                                ) : (
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
                                                                                            <td key={adcSite.ID}>
                                                                                                { adcSite.ADCConceptValues
                                                                                                    .filter(acv => acv.ADCConceptID == adcConcept.ID)
                                                                                                    .map(acv => {
                                                                                                        //console.log('acv', acv);
                                                                                                        return (
                                                                                                            <ADCConceptValueInput 
                                                                                                                key={acv.ID} 
                                                                                                                name={`ADCConceptValue.${acv.ID}`}
                                                                                                                adcConcept={adcConcept} 
                                                                                                                adcConceptValue={acv} 
                                                                                                                formik={formik}
                                                                                                            />
                                                                                                        )
                                                                                                    }
                                                                                                )}
                                                                                            </td>
                                                                                            )
                                                                                        }
                                                                                    </tr>
                                                                                ))
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
                                                                            {/* //! Verificar si MD11 debe de quedar bloqueado si es un solo Standard, de hecho SI
                                                                            <tr> 
                                                                                <th className="text-end" colSpan={2}>
                                                                                    <h6 className={h6Style}>
                                                                                        MD11
                                                                                    </h6>
                                                                                </th>
                                                                                {
                                                                                    formik.values.items.map((item, index) =>  
                                                                                        <td key={item.ID}>
                                                                                            <div className="input-group">
                                                                                                <Field
                                                                                                    name={ `items[${index}].MD11` }
                                                                                                    className="form-control ari-form-control-with-end text-end"
                                                                                                >
                                                                                                    {({field, form}) => {
                                                                                                        const error = getIn(form.errors, `items[${index}].MD11`);
                                                                                                        const touched = getIn(form.touched, `items[${index}].MD11`);
                                                                                                        
                                                                                                        return (
                                                                                                            <input 
                                                                                                                {...field}                                                                                                                
                                                                                                                className={`form-control ari-form-control-with-end text-end${touched && error ? ' is-invalid' : ''}`} 
                                                                                                                onBlur={(e) => {
                                                                                                                    const value = e.target.value;

                                                                                                                    field.onBlur(e);
                                                                                                                    updateADCSite(dispatch, {
                                                                                                                        ID: item.ID,
                                                                                                                        MD11: Number(value),
                                                                                                                    })
                                                                                                                }}
                                                                                                            />
                                                                                                        )
                                                                                                    }}
                                                                                                </Field>
                                                                                                <span 
                                                                                                    className="input-group-text ari-input-group-text-end text-sm"
                                                                                                    style={{ paddingRight: '58px' }}
                                                                                                >
                                                                                                    <FontAwesomeIcon icon={ faCalendarDay } title="Days" />
                                                                                                </span>
                                                                                            </div>
                                                                                            <ErrorMessage
                                                                                                name={`items[${index}].MD11`}
                                                                                                className="text-danger text-xs"
                                                                                                component="div"
                                                                                            />
                                                                                        </td>
                                                                                    )
                                                                                }
                                                                            </tr> */}
                                                                            {
                                                                                misc.isMultistandard ? (
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
                                                                                            adcSiteList.map((adcSite, index) =>   
                                                                                                <td key={adcSite.ID}>
                                                                                                    <ADCMD11ValueInput 
                                                                                                        name={ `items[${index}].MD11` }
                                                                                                        item={adcSite} 
                                                                                                        formik={formik} 
                                                                                                    />
                                                                                                </td>
                                                                                            )
                                                                                        }
                                                                                    </tr>
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
                                                                            {/* <tr>
                                                                                <th className="text-end" colSpan={2}>
                                                                                    <h6 className={h6Style}>
                                                                                        Recertification (RR)
                                                                                    </h6>
                                                                                </th>
                                                                                {
                                                                                    adcSiteList.map(adcSite =>  
                                                                                        <td key={adcSite.ID}>
                                                                                            <p className={`${pStyle} text-end`}>
                                                                                                { adcSite.RR ?? 0 }
                                                                                                <span className="px-2" title="Days">
                                                                                                    <FontAwesomeIcon icon={ faCalendarDay } fixedWidth />
                                                                                                </span>
                                                                                            </p>
                                                                                        </td>
                                                                                    )
                                                                                }
                                                                            </tr> */}
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
                                                                                            {/* <p className={`${pStyle} text-center`}>{ adcSite.ExtraInfo ?? '' }</p> */}
                                                                                            <Field
                                                                                                name={ `items[${index}].extraInfo` }
                                                                                                className="form-control"
                                                                                                as="textarea"
                                                                                                rows={ 2 }
                                                                                            />
                                                                                        </td>
                                                                                    )
                                                                                }
                                                                            </tr>
                                                                        </tbody>                                                                    
                                                                    </table>
                                                                    {/* <hr className="horizontal dark my-3" /> */}
                                                                    {
                                                                        !!formik.errors.conceptValueHidden && (
                                                                            <div className="text-xs text-danger text-wrap mt-1">
                                                                                <FontAwesomeIcon icon={ faExclamationTriangle } fixedWidth className="text-danger me-1" />
                                                                                { formik.errors.conceptValueHidden }
                                                                            </div>
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
                                            {/* <Col>
                                                <MiniStatisticsCard
                                                    title="RR"
                                                    count={ adcData?.TotalRR ?? 0 }
                                                    percentage={{
                                                        color: 'dark',
                                                        text: 'days',
                                                    }}
                                                    icon={{
                                                        icon: faCalendarDay,
                                                        bgColor: 'dark',
                                                    }}
                                                />
                                            </Col> */}
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
                                                    disabled={ isADCSaving || !hasChanges || adc.Status >= ADCStatusType.inactive }
                                                    //disabled={ isADCSaving || adc.Status >= ADCStatusType.inactive } 
                                                >
                                                    {
                                                        isADCSaving 
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