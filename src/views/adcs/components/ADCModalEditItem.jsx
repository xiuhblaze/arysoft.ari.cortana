import React, { useEffect, useRef, useState } from 'react'
import { Card, Col, Modal, Row } from 'react-bootstrap';
import { Form, Formik } from 'formik';
import Swal from 'sweetalert2';
import * as Yup from 'yup';

import { useADCsStore } from '../../../hooks/useADCsStore';
import { useOrganizationsStore } from '../../../hooks/useOrganizationsStore';
import { useAuditCyclesStore } from '../../../hooks/useAuditCyclesStore';

import bgHeadModal from "../../../assets/img/bgTrianglesBW.jpg";
import { ViewLoading } from '../../../components/Loaders';
import adcStatusProps from '../helpers/adcStatusProps';
import getRandomBackgroundImage from '../../../helpers/getRandomBackgroundImage';
import { faCalendarDay, faClock, faMinus, faPercent, faSave, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AryFormikTextInput } from '../../../components/Forms';
import AryLastUpdatedInfo from '../../../components/AryLastUpdatedInfo/AryLastUpdatedInfo';
import enums from '../../../helpers/enums';
import { useADCConceptsStore } from '../../../hooks/useADCConceptsStore';
import isNullOrEmpty from '../../../helpers/isNullOrEmpty';
import ADCConceptYesNoInfo from '../../adcConcepts/components/ADCConceptYesNoInfo';
import ADCConceptValueInput from './ADCConceptValueInput';

const ADCModalEditItem = React.memo(({ id, show, onHide, ...props }) => {
    const headStyle = 'text-uppercase text-secondary text-xxs font-weight-bolder text-wrap';
    const subHeadStyle = 'text-secondary text-xxs text-wrap';
    const firstColStyle = 'text-dark text-xxs font-weight-bolder text-wrap';
    const h6Style = 'text-sm text-dark text-gradient text-wrap mb-0';
    const pStyle = 'text-xs font-weight-bold text-wrap mb-0';

    const {
        DefaultStatusType,
        ADCStatusType,
        ADCConceptUnitType,
        ADCConceptOrderType
    } = enums();

    const formDefaultValues = {
        descriptionInput: '',
    };

    const validationSchema = Yup.object({
        descriptionInput: Yup.string()
            .max(500, 'Description must be less than 500 characters')
            .required('Description is required'),
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
        adcsErrorMessage,

        adcAsync,
        adcSaveAsync,
        adcClear,
    } = useADCsStore();

    const {
        isADCConceptsLoading,
        adcConcepts,
        adcConceptsAsync,
        adcConceptsErrorMessage,
    } = useADCConceptsStore();

    // HOOKS

    const formikRef = useRef(null);

    const [backgroundImage, setBackgroundImage] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [initialValues, setInitialValues] = useState(formDefaultValues);

    useEffect(() => {

        if (!!show) {
            
            setShowModal(true);
            if (!!id) {
                adcAsync(id);
            } else {
                Swal.fire('ADC', 'You must specify the Audit Day Calculation ID', 'warning');
                actionsForCloseModal();
            }
            getRandomBackgroundImage().then(image => setBackgroundImage(image));
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

            adcConceptsAsync({
                standardID: adc.AppForm.StandardID,
                status: DefaultStatusType.active,
                pageSize: 0,
                order: ADCConceptOrderType.indexSort,
            });
        }
    }, [adc]);
    
    // METHODS

    const onFormSubmit = (values) => {
        console.log('onFormSubmit', values);
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
                                setHasChanges(formik.dirty);
                            }, [formik.dirty])
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
                                        <Row className="mt-4">
                                            <Col xs="12" sm="12">
                                                <Card>
                                                    <Card.Body className="p-3">
                                                        <Row>
                                                            <Col xs="12">
                                                                <AryFormikTextInput
                                                                    name="descriptionInput"
                                                                    label="Description"
                                                                    type="text"
                                                                />
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col xs="12">
                                                                <table>
                                                                    <thead>
                                                                        <tr>
                                                                            <th></th>
                                                                            <th></th>
                                                                            {
                                                                                isADCLoading ? (
                                                                                    <th className={headStyle}>Loading...</th>
                                                                                ) : !!adc && !!adc.ADCSites && adc.ADCSites.length > 0 ? (
                                                                                    adc.ADCSites.map(adcSite =>  
                                                                                    <th key={adcSite.ID} className={headStyle}>
                                                                                        { adcSite.SiteDescription }
                                                                                    </th>
                                                                                    )
                                                                                ) : null
                                                                            }
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        <tr>
                                                                            <th>
                                                                                <h6 className={h6Style}>
                                                                                    Employees
                                                                                </h6>
                                                                            </th>
                                                                            <td></td>
                                                                            {
                                                                                isADCLoading ? (
                                                                                    <td>
                                                                                        <FontAwesomeIcon icon={ faSpinner } spin />
                                                                                    </td>
                                                                                ) : !!adc && !!adc.ADCSites && adc.ADCSites.length > 0 ? (
                                                                                    adc.ADCSites.map(adcSite =>  
                                                                                    <td key={adcSite.ID}>
                                                                                        <p className={`${pStyle} text-center`}>{ adcSite.Employees }</p>
                                                                                    </td>
                                                                                    )
                                                                                ) : null
                                                                            }
                                                                        </tr>
                                                                        <tr>
                                                                            <th className={firstColStyle}>
                                                                                <h6 className={h6Style}>
                                                                                    Initial MD5
                                                                                </h6>
                                                                            </th>
                                                                            <td></td>
                                                                            {
                                                                                isADCLoading ? (
                                                                                    <td>
                                                                                        <FontAwesomeIcon icon={ faSpinner } spin />
                                                                                    </td>
                                                                                ) : !!adc && !!adc.ADCSites && adc.ADCSites.length > 0 ? (
                                                                                    adc.ADCSites.map(adcSite =>  
                                                                                    <td key={adcSite.ID}>
                                                                                        <p className={`${pStyle} text-center`}>{ adcSite.InitialMD5 }</p>
                                                                                    </td>
                                                                                    )
                                                                                ) : null
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
                                                                            ) : !!adcConcepts && adcConcepts.length > 0 ? (
                                                                                adcConcepts.map(adcConcept => 
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
                                                                                        !!adc && !!adc.ADCSites && adc.ADCSites.length > 0 ? (
                                                                                            adc.ADCSites.map(adcSite =>  
                                                                                            <td key={adcSite.ID}>
                                                                                                { adcSite.ADCConceptValues
                                                                                                    .filter(acv => acv.ADCConceptID == adcConcept.ID)
                                                                                                    .map(acv => 
                                                                                                        <ADCConceptValueInput key={acv.ID} adcConcept={adcConcept} adcConceptValue={acv} />
                                                                                                )}
                                                                                            </td>
                                                                                            )
                                                                                        ) : null
                                                                                    }
                                                                                </tr>
                                                                            )) : null
                                                                        }
                                                                        <tr>
                                                                            <th className={firstColStyle}>
                                                                                <h6 className={h6Style}>
                                                                                    Total Initial
                                                                                </h6>
                                                                            </th>
                                                                            <td></td>
                                                                            {
                                                                                isADCLoading ? (
                                                                                    <td>
                                                                                        <FontAwesomeIcon icon={ faSpinner } spin />
                                                                                    </td>
                                                                                ) : !!adc && !!adc.ADCSites && adc.ADCSites.length > 0 ? (
                                                                                    adc.ADCSites.map(adcSite =>  
                                                                                    <td key={adcSite.ID}>
                                                                                        <p className={`${pStyle} text-center`}>{ adcSite.TotalInitial ?? 0 }</p>
                                                                                    </td>
                                                                                    )
                                                                                ) : null
                                                                            }
                                                                        </tr>
                                                                        <tr>
                                                                            <th className={firstColStyle}>
                                                                                <h6 className={h6Style}>
                                                                                    MD11
                                                                                </h6>
                                                                            </th>
                                                                            <td></td>
                                                                            {
                                                                                isADCLoading ? (
                                                                                    <td>
                                                                                        <FontAwesomeIcon icon={ faSpinner } spin />
                                                                                    </td>
                                                                                ) : !!adc && !!adc.ADCSites && adc.ADCSites.length > 0 ? (
                                                                                    adc.ADCSites.map(adcSite =>  
                                                                                    <td key={adcSite.ID}>
                                                                                        <p className={`${pStyle} text-center`}>{ adcSite.MD11 ?? 0 }</p>
                                                                                    </td>
                                                                                    )
                                                                                ) : null
                                                                            }
                                                                        </tr>
                                                                        <tr>
                                                                            <th className={firstColStyle}>
                                                                                <h6 className={h6Style}>
                                                                                    Surveillance
                                                                                </h6>
                                                                            </th>
                                                                            <td></td>
                                                                            {
                                                                                isADCLoading ? (
                                                                                    <td>
                                                                                        <FontAwesomeIcon icon={ faSpinner } spin />
                                                                                    </td>
                                                                                ) : !!adc && !!adc.ADCSites && adc.ADCSites.length > 0 ? (
                                                                                    adc.ADCSites.map(adcSite =>  
                                                                                    <td key={adcSite.ID}>
                                                                                        <p className={`${pStyle} text-center`}>{ adcSite.Surveillance ?? 0 }</p>
                                                                                    </td>
                                                                                    )
                                                                                ) : null
                                                                            }
                                                                        </tr>
                                                                        <tr>
                                                                            <th className={firstColStyle}>
                                                                                <h6 className={h6Style}>
                                                                                    Recertification (RR)
                                                                                </h6>
                                                                            </th>
                                                                            <td></td>
                                                                            {
                                                                                isADCLoading ? (
                                                                                    <td>
                                                                                        <FontAwesomeIcon icon={ faSpinner } spin />
                                                                                    </td>
                                                                                ) : !!adc && !!adc.ADCSites && adc.ADCSites.length > 0 ? (
                                                                                    adc.ADCSites.map(adcSite =>  
                                                                                    <td key={adcSite.ID}>
                                                                                        <p className={`${pStyle} text-center`}>{ adcSite.RR ?? 0 }</p>
                                                                                    </td>
                                                                                    )
                                                                                ) : null
                                                                            }
                                                                        </tr>
                                                                        <tr>
                                                                            <th className={firstColStyle}>
                                                                                <h6 className={h6Style}>
                                                                                    Extra Info
                                                                                </h6>
                                                                            </th>
                                                                            <td></td>
                                                                            {
                                                                                isADCLoading ? (
                                                                                    <td>
                                                                                        <FontAwesomeIcon icon={ faSpinner } spin />
                                                                                    </td>
                                                                                ) : !!adc && !!adc.ADCSites && adc.ADCSites.length > 0 ? (
                                                                                    adc.ADCSites.map(adcSite =>  
                                                                                    <td key={adcSite.ID}>
                                                                                        <p className={`${pStyle} text-center`}>{ adcSite.ExtraInfo ?? '' }</p>
                                                                                    </td>
                                                                                    )
                                                                                ) : null
                                                                            }
                                                                        </tr>
                                                                    </tbody>                                                                    
                                                                </table>
                                                            </Col>
                                                        </Row>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                            <Col xs="12" sm="4" className="d-none">
                                                <Row>
                                                    <Col xs="6">
                                                        <div className="input-group mb-3">
                                                            <div className="input-group-text">
                                                                <input type="checkbox" className="form-check-input mt-0" aria-label="Checkbox for following text input" />
                                                            </div>
                                                            <input type="text" className="form-control text-end" placeholder="0" aria-label="Text input with checkbox" />                                                        
                                                        </div>
                                                    </Col>
                                                    <Col xs="6">
                                                        <div className="input-group mb-3">
                                                            <div className="input-group-text py-1">
                                                                <div className="form-check form-switch">
                                                                    <input type="checkbox" className="form-check-input" 
                                                                        aria-label="Checkbox for following text input" 
                                                                        style={{ height: '20px' }}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <input type="text" className="form-control text-end" placeholder="0" aria-label="Text input with checkbox" />
                                                            Days
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>

                                    </Modal.Body>
                                    <Modal.Footer>
                                    <div className="d-flex justify-content-between align-items-start align-items-sm-center w-100">
                                        <div className="text-secondary mb-3 mb-sm-0">
                                            <AryLastUpdatedInfo item={ adc } />
                                        </div>
                                        <div className="d-flex justify-content-end ms-auto ms-sm-0 mb-3 mb-sm-0 gap-2">
                                            <button 
                                                type="submit"
                                                className="btn bg-gradient-dark mb-0"
                                                disabled={ isADCSaving || !hasChanges || adc.Status >= ADCStatusType.inactive }
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