import React, { useEffect, useRef, useState } from 'react'
import { Card, Col, Container, Modal, Row } from 'react-bootstrap';
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
import { faCalendarDay, faClock, faMinus, faPercent, faSave, faSpinner, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AryFormikTextInput } from '../../../components/Forms';
import AryLastUpdatedInfo from '../../../components/AryLastUpdatedInfo/AryLastUpdatedInfo';
import enums from '../../../helpers/enums';
import { useADCConceptsStore } from '../../../hooks/useADCConceptsStore';
import isNullOrEmpty from '../../../helpers/isNullOrEmpty';
import ADCConceptYesNoInfo from '../../adcConcepts/components/ADCConceptYesNoInfo';
import ADCConceptValueInput from './ADCConceptValueInput';
import MiniStatisticsCard from '../../../components/Cards/MiniStatisticsCard/MiniStatisticsCard';
import { setADCConceptList, setADCData, setADCSiteList, useADCController } from '../context/ADCContext';

const ADCModalEditItem = React.memo(({ id, show, onHide, ...props }) => {
    const headStyle = 'text-uppercase text-secondary text-xxs font-weight-bolder text-wrap';
    const firstColStyle = 'text-dark text-xxs font-weight-bolder text-wrap';
    const h6Style = 'text-sm text-dark text-gradient text-wrap mb-0';
    const pStyle = 'text-sm text-wrap pe-0 pe-sm-5 mb-0';
    const [ controller, dispatch ] = useADCController();
    const {
        adcData,
        adcSiteList,
        adcConceptList,
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
        reviewCommentsInput: '',
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

            setInitialValues({
                descriptionInput: adc.Description ?? '',
                extraInfoInput: adc.ExtraInfo ?? '',
                statusSelect: adc.Status,
                reviewCommentsInput: adc.ReviewComments ?? '',
            });

            adcConceptsAsync({
                standardID: adc.AppForm.StandardID,
                status: DefaultStatusType.active,
                pageSize: 0,
                order: ADCConceptOrderType.indexSort,
            });

            loadData();
            calculateData();
        }
    }, [adc]);

    useEffect(() => {
        console.log('adcData', adcData);
        console.log('adcSiteList', adcSiteList);
    }, [adcData, adcSiteList]);
    
    useEffect(() => {
        if (!!adcConcepts) {
            setADCConceptList(dispatch, adcConcepts);
        }
    }, [adcConcepts]);
    
    // METHODS

    const loadData = () => {
        // console.log('loadData', adc);
        if (!!adc) {
            setADCData(dispatch, adc);
            setADCSiteList(dispatch, adc.ADCSites);
        }
    }; // loadData

    const calculateData = () => {
        // console.log('calculateData', adcData, adcSitesList);
        if (!!adcData && !!adcSiteList && adcSiteList.length > 0) {            
            const totalEmployees = adcSiteList
                .filter(i => i.Status == DefaultStatusType.active)
                .reduce((acc, i) => acc + i.Employees, 0);
            const totalInitial = adcSiteList
                .filter(i => i.Status == DefaultStatusType.active)
                .reduce((acc, i) => acc + i.InitialMD5, 0);
            const totalMD11 = adcSiteList
                .filter(i => i.Status == DefaultStatusType.active)
                .reduce((acc, i) => acc + i.MD11, 0);
            const totalSurveillance = adcSiteList
                .filter(i => i.Status == DefaultStatusType.active)
                .reduce((acc, i) => acc + i.Surveillance, 0);
            const totalRR = adcSiteList
                .filter(i => i.Status == DefaultStatusType.active)
                .reduce((acc, i) => acc + i.RR, 0);

            setADCData(dispatch, 
                {
                    ...adcData,
                    TotalEmployees: totalEmployees,
                    TotalInitial: totalInitial,
                    TotalMD11: totalMD11,
                    TotalSurveillance: totalSurveillance,
                    TotalRR: totalRR,
                }
            );
        }
    }; // calculateData

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
                                        <Row className="mt-4 mb-3">
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
                                                                <div className='table-responsive'>
                                                                    <table>
                                                                        <thead>
                                                                            <tr>
                                                                                <th></th>
                                                                                <th></th>
                                                                                {
                                                                                    isADCLoading ? (
                                                                                        <th className={headStyle}>Loading...</th>
                                                                                    ) : adcSiteList.length > 0 ? (  //!!adc && !!adc.ADCSites && adc.ADCSites.length > 0 ? ( 
                                                                                        adcSiteList.map(adcSite =>  
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
                                                                                    ) : (
                                                                                        adcSiteList.map(adcSite =>  
                                                                                            <td key={adcSite.ID}>
                                                                                                <p className={`${pStyle} text-end`}>
                                                                                                    { adcSite.Employees } 
                                                                                                    <span className="px-2" title="Employees">
                                                                                                        <FontAwesomeIcon icon={ faUsers } fixedWidth />
                                                                                                    </span>
                                                                                                </p>
                                                                                            </td>
                                                                                        )
                                                                                    )
                                                                                    // ) : !!adc && !!adc.ADCSites && adc.ADCSites.length > 0 ? (
                                                                                    //     adc.ADCSites.map(adcSite =>  
                                                                                    //     <td key={adcSite.ID}>
                                                                                    //         <p className={`${pStyle} text-end`}>
                                                                                    //             { adcSite.Employees } 
                                                                                    //             <span className="px-2" title="Employees">
                                                                                    //                 <FontAwesomeIcon icon={ faUsers } fixedWidth />
                                                                                    //             </span>
                                                                                    //         </p>
                                                                                    //     </td>
                                                                                    //     )
                                                                                    // ) : null
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
                                                                                    ) : (
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
                                                                                                    .map(acv => 
                                                                                                        <ADCConceptValueInput 
                                                                                                            key={acv.ID} 
                                                                                                            name={`ADCConceptValue.${acv.ID}`}
                                                                                                            adcConcept={adcConcept} 
                                                                                                            adcConceptValue={acv} 
                                                                                                        />
                                                                                                )}
                                                                                            </td>
                                                                                            )
                                                                                        }
                                                                                    </tr>
                                                                                ))
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
                                                                                    ) : (
                                                                                        adcSiteList.map(adcSite =>  
                                                                                        <td key={adcSite.ID}>
                                                                                            <p className={`${pStyle} text-end`}>
                                                                                                { adcSite.TotalInitial ?? 0 }
                                                                                                <span className="px-2" title="Days">
                                                                                                    <FontAwesomeIcon icon={ faCalendarDay } fixedWidth />
                                                                                                </span>
                                                                                            </p>
                                                                                        </td>
                                                                                        )
                                                                                    ) 
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
                                                                                    ) : (
                                                                                        adcSiteList.map(adcSite =>  
                                                                                        <td key={adcSite.ID}>
                                                                                            <div className="input-group mb-3">
                                                                                                <input type="text" 
                                                                                                    className="form-control ari-form-control-with-end text-end" 
                                                                                                    placeholder="0" 
                                                                                                    defaultValue={ adcSite.MD11 ?? 0 }
                                                                                                    onChange={(e) => {
                                                                                                        const value = e.target.value;
                                                                                                        console.log('onChange', value);
                                                                                                        //formik.setFieldValue(`ADCConceptValues.${adcConceptValue.ID}.Value`, value);
                                                                                                    }}
                                                                                                />
                                                                                                <span className="input-group-text ari-input-group-text-end text-sm">
                                                                                                    <FontAwesomeIcon icon={ faCalendarDay } title="Days" />
                                                                                                </span>
                                                                                            </div>
                                                                                            {/* <p className={`${pStyle} text-center`}>{ adcSite.MD11 ?? 0 }</p> */}
                                                                                        </td>
                                                                                        )
                                                                                    )
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
                                                                                    ) : (
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
                                                                                    )
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
                                                                                    ) : (
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
                                                                                    )
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
                                                                                    ) : (
                                                                                        adcSiteList.map(adcSite =>  
                                                                                        <td key={adcSite.ID}>
                                                                                            <p className={`${pStyle} text-center`}>{ adcSite.ExtraInfo ?? '' }</p>
                                                                                        </td>
                                                                                        )
                                                                                    )
                                                                                }
                                                                            </tr>
                                                                        </tbody>                                                                    
                                                                    </table>
                                                                    <hr className="horizontal dark my-3" />
                                                                    
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
                                            <Col>
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