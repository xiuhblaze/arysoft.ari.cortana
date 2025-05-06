import { useEffect, useRef, useState } from "react";
import { Alert, Card, Col, ListGroup, Modal, Row } from "react-bootstrap";
import { faBuilding, faExclamationTriangle, faPlus, faSave, faSpinner, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { Field, Form, Formik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Yup from "yup";
import Swal from "sweetalert2";

import { AryFormikSelectInput, AryFormikTextArea, AryFormikTextInput } from "../../../components/Forms";
import { useAuditAuditorsStore } from "../../../hooks/useAuditAuditorsStore";
import { useAuditCyclesStore } from "../../../hooks/useAuditCyclesStore";
import { useAuditsStore } from "../../../hooks/useAuditsStore";
import { useAuditStandardsStore } from "../../../hooks/useAuditStandardsStore";
import { useOrganizationsStore } from "../../../hooks/useOrganizationsStore";
import { ViewLoading } from "../../../components/Loaders";
import AryLastUpdatedInfo from "../../../components/AryLastUpdatedInfo/AryLastUpdatedInfo";
import AuditAuditorsList from "./AuditAuditorsList";
import AuditDocumentsList from "./AuditDocumentsList";
import AuditStandardsList from "./AuditStandardsList";
import auditStatusProps from "../helpers/auditStatusProps";
import enums from "../../../helpers/enums";
import getISODate from "../../../helpers/getISODate";

import bgHeadModal from "../../../assets/img/bgWavesWhite.jpg";
import isNullOrEmpty from "../../../helpers/isNullOrEmpty";
import { useNotesStore } from "../../../hooks/useNotesStore";
import NotesListModal from "../../notes/components/NotesListModal";

const AuditModalEditItem = ({ id, show, onHide, ...props }) => {

    const {
        AuditStatusType,
        AuditStepType,
        DefaultStatusType,
    } = enums();
    const formDefaultValues = {
        descriptionInput: '',
        startDateInput: '',
        endDateInput: '',
        isMultisiteCheck: false,
        daysInput: '',
        includeSaturdayCheck: false,
        includeSundayCheck: false,
        extraInfoInput: '',
        statusSelect: AuditStatusType.scheduled,
        noteInput: '',
        standardsCountHidden: 0,
        auditorsCountHidden: 0,
        sitesCountHidden: 0,
    }; // formDefaultValues

    const {
        auditStandards
    } = useAuditStandardsStore();

    const validationSchema = Yup.object({
        descriptionInput: Yup.string()
            .max(1000, 'Audit description must be at most 1000 characters'),
        extraInfoInput: Yup.string()
            .max(1000, 'Extra info must be at most 1000 characters'),
        startDateInput: Yup.date()
            .typeError('Start date has an invalid format')
            .required('Must specify start date'),
        endDateInput: Yup.date()
            .typeError('End date has an invalid format')
            .required('Must specify end date'),
        daysInput: Yup.number()
            .typeError('Days must be a number'),
        statusSelect: Yup.string()
            .required('Must select a status'),
        noteInput: Yup.string()
            .max(1000, 'The note must be at most 1000 characters'),
        standardsCountHidden: Yup.number()
            .when('statusSelect', {
                is: (statusSelect) => statusSelect > AuditStatusType.scheduled && statusSelect < AuditStatusType.canceled,
                then: schema => schema.min(1, 'For this status change, there must be at least one active standard assigned')
            }),
        auditorsCountHidden: Yup.number()
            .when('statusSelect', {
                is: (statusSelect) => statusSelect > AuditStatusType.scheduled 
                    && statusSelect < AuditStatusType.canceled
                    && (!!auditStandards && auditStandards.length > 0 && auditStandards[0].Step != AuditStepType.special),
                then: schema => schema.min(1, 'For this status change, there must be at least one active auditor assigned')
            }),
        // sitesCountHidden: Yup.number()
        //     .min(1, 'There must be at least one site assigned'),
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
        auditAuditors
    } = useAuditAuditorsStore();

    const {
        isAuditLoading,
        isAuditCreating,
        isAuditSaving,
        auditSavedOk,
        isAuditDeleting,
        auditDeletedOk,
        audit,

        auditsErrorMessage,

        auditAsync,
        auditCreateAsync,
        auditSaveAsync,
        auditDeleteAsync,
        auditClear,

        auditSiteAddAsync,
        auditSiteDeleteAsync,
    } = useAuditsStore();

    const {
            noteCreateAsync,
        } = useNotesStore();

    // HOOKS

    const formikRef = useRef(null);

    const [showModal, setShowModal] = useState(!!show);
    const [initialValues, setInitialValues] = useState(formDefaultValues);
    const [showAllFiles, setShowAllFiles] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    const [sitesList, setSitesList] = useState([]);
    // const [showSites, setShowSites] = useState(false);
    const [disabledMultisiteCheck, setDisabledMultisiteCheck] = useState(false);
    const [siteSelect, setSiteSelect] = useState('');

    const [statusOptions, setStatusOptions] = useState(false);
    const [showAddNote, setShowAddNote] = useState(false);
    const [saveNote, setSaveNote] = useState(''); 
    
    useEffect(() => {
        
        if (!!show) {
            if (!!id) {
                auditAsync(id);
            } else if (!!auditCycle) {
                auditCreateAsync({ // Crear nuevo audit
                    AuditCycleID: auditCycle.ID,
                });
            } else {
                Swal.fire('Audit', 'You must specify the ID or the audit cycle', 'warning');
                onCloseModal();
            }
        }
    }, [show]);

    useEffect(() => {

        if (!!audit && !!show) {

            let standardsActiveCount = !!audit.Standards 
                ? audit.Standards.filter(i => 
                    i.Status == DefaultStatusType.active 
                    && i.StandardStatus == DefaultStatusType.active)
                    .length
                : 0;
            const auditorsActiveCount = !!audit.Auditors
                ? audit.Auditors.filter(i => 
                    i.Status == DefaultStatusType.active)
                    .length
                : 0;
            const sitesActiveCount = !!audit.Sites
                ? audit.Sites.filter(i => 
                    i.Status == DefaultStatusType.active)
                    .length
                : 0;

            setInitialValues({
                descriptionInput: audit.Description ?? '',
                startDateInput: !!audit.StartDate ? getISODate(audit.StartDate) : '',
                endDateInput: !!audit.EndDate ? getISODate(audit.EndDate) : '',
                isMultisiteCheck: audit.IsMultisite ?? false,
                daysInput: audit.Days ?? '',
                includeSaturdayCheck: audit.IncludeSaturday ?? false,
                includeSundayCheck: audit.IncludeSunday ?? false,
                extraInfoInput: audit.ExtraInfo ?? '',
                statusSelect: !!audit.Status && audit.Status != AuditStatusType.nothing
                    ? audit.Status
                    : AuditStatusType.scheduled,
                noteInput: '',
                standardsCountHidden: standardsActiveCount,
                auditorsCountHidden: auditorsActiveCount,
                sitesCountHidden: sitesActiveCount, 
            });

            switch (audit.Status) {
                case AuditStatusType.scheduled:
                    setStatusOptions([
                        { label: 'Scheduled', value: AuditStatusType.scheduled },
                        { label: 'Confirmed', value: AuditStatusType.confirmed },
                        { label: 'Canceled', value: AuditStatusType.canceled },
                    ]);
                    break;
                case AuditStatusType.confirmed:
                    setStatusOptions([
                        { label: 'Confirmed', value: AuditStatusType.confirmed },
                        { label: 'Canceled', value: AuditStatusType.canceled },
                    ]);
                    break;
                
                case AuditStatusType.inProcess:
                    setStatusOptions([
                        { label: 'In process', value: AuditStatusType.inProcess },
                        { label: 'Canceled', value: AuditStatusType.canceled },
                    ]);
                    break;
                case AuditStatusType.finished:
                    setStatusOptions([
                        { label: 'Finished', value: AuditStatusType.finished },
                        { label: 'Completed', value: AuditStatusType.completed },
                        { label: 'Canceled', value: AuditStatusType.canceled },
                    ]);
                    break;
                case AuditStatusType.completed:
                    setStatusOptions([
                        { label: 'Completed', value: AuditStatusType.completed },
                        { label: 'Closed', value: AuditStatusType.closed },
                        { label: 'Canceled', value: AuditStatusType.canceled },
                    ]);
                    break;
                case AuditStatusType.closed:
                    setStatusOptions([
                        { label: 'Closed', value: AuditStatusType.closed },
                    ]);
                    break;
                case AuditStatusType.canceled:
                    setStatusOptions([
                        { label: 'Scheduled', value: AuditStatusType.scheduled },
                        { label: 'Canceled', value: AuditStatusType.canceled },
                    ]);
                    break;
                default:
                    setStatusOptions([
                        { label: '(select)', value: AuditStatusType.nothing },
                        { label: 'Scheduled', value: AuditStatusType.scheduled },
                        { label: 'Confirmed', value: AuditStatusType.confirmed },
                        // { label: 'In process', value: AuditStatusType.inProcess },
                        // { label: 'Finished', value: AuditStatusType.finished },
                        { label: 'Completed', value: AuditStatusType.completed },
                        { label: 'Closed', value: AuditStatusType.closed },
                        { label: 'Canceled', value: AuditStatusType.canceled },
                    ]);
                    break;
            } // switch
            
            if (!organization || (!!audit.AuditCycle && organization.ID != audit.AuditCycle?.OrganizationID)) {
                organizationAsync(audit.AuditCycle.OrganizationID);
            } else {
                // Validar antes si ya paso la auditoria y tiene sites, los muestre aunque hayan sido dados de baja
                setMultisite();
            }
            
            if (!auditCycle || (!!audit.AuditCycle && auditCycle.ID != audit.AuditCycle.ID)) {
                auditCycleAsync(audit.AuditCycle.ID);
            }

            if (!!audit.Sites) {
                setSitesList(audit.Sites.map(i => ({
                    ID: i.ID,
                    Description: i.Description,
                })));
            } else {
                setSitesList([]);
            }
            
            // setShowSites(audit.IsMultisite ?? false);
            setShowModal(show);            
        }

    }, [audit]);

    useEffect(() => {

        if (!!organization && show) setMultisite();

    }, [organization]);
    
    useEffect(() => {
        if (!!auditStandards && show && !!formikRef?.current) {
            const standardsActive = auditStandards.filter(item => 
                item.Status == DefaultStatusType.active 
                && item.StandardStatus == DefaultStatusType.active);
            formikRef.current.setFieldValue('standardsCountHidden', standardsActive.length);
        }
    }, [auditStandards]);

    useEffect(() => {
        if (!!auditAuditors && show && !!formikRef?.current) {
            formikRef.current.setFieldValue(
                'auditorsCountHidden', 
                auditAuditors.filter(aa => 
                    aa.Status == DefaultStatusType.active)
                    .length);
        }
    }, [auditAuditors]);

    useEffect(() => {
        if (!!auditSavedOk && show) {
            if (!isNullOrEmpty(saveNote)) {
                noteCreateAsync({ OwnerID: audit.ID, Text: saveNote });
                setSaveNote('');
            }
            Swal.fire('Audit', `Audit ${!id ? 'created' : 'updated'} successfully`, 'success');
            auditAsync(audit.ID); // Refrescar los datos de la audit
            // onCloseModal(); // Probando el evitar cerrar la modal al guardar
        }
    }, [auditSavedOk]);
        
    useEffect(() => {
        if (!!auditsErrorMessage && show) {
            Swal.fire('Audit', auditsErrorMessage, 'error');
            // onCloseModal(); // Probando el evitar cerrar la modal al ocurrir un error
        }
    }, [auditsErrorMessage]);

    // METHODS

    const setMultisite = () => {
        
        if (!!organization && !!audit) {

            if (audit.Status >= AuditStatusType.inProcess) { // Ya pasó, como haya quedado
                const isMultisite = audit.isMultisite ?? false;
                const hasSites = audit.Sites.length > 0;

                setDisabledMultisiteCheck(true);
                // setShowSites(isMultisite && hasSites);
                formikRef?.current?.setFieldValue('isMultisiteCheck', isMultisite);
            } else { // No ha pasado, se puede modificar

                // - que tenga más de un site activo, si no tiene más de un site activo, deshabilitar multisite
                // - que este marcado como multisite
                const multisite = organization.Sites
                    .filter(site => site.Status == DefaultStatusType.active)
                    .length > 1;
                const hasSites = !!audit.Sites && audit.Sites.length > 0; 

                //setCanBeMultisite(multisite || hasSites);

                if (!multisite) {
                    //setShowSites(false);
                    formikRef?.current?.setFieldValue('isMultisiteCheck', false);
                }
            }
        }
    }; // setIsMultisite

    const onFormSubmit = (values) => {

        const newStatus = audit.Status == AuditStatusType.nothing
            ? AuditStatusType.scheduled
            : values.statusSelect;

        if (audit.Status != newStatus) { // Si cambió el status crear una nota
            const text = 'Status changed to ' + auditStatusProps[newStatus].label.toUpperCase();

            setSaveNote(`${text}${!isNullOrEmpty(values.noteInput) ? ': ' + values.noteInput : ''}`);
            //setSaveNote(text);
        }

        const toSave = {
            ID: audit.ID,
            Description: values.descriptionInput,
            StartDate: values.startDateInput,
            EndDate: values.endDateInput,
            IsMultisite: values.isMultisiteCheck,
            Days: values.daysInput,
            IncludeSaturday: values.includeSaturdayCheck,
            IncludeSunday: values.includeSundayCheck,
            ExtraInfo: values.extraInfoInput,
            Status: values.statusSelect,
        };

        // console.log('AuditModalEditItem.onFormSubmit: toSave', toSave);
        auditSaveAsync(toSave);
    };

    const onDeleteAudit = () => {

        console.log('AuditModalEditItem.onDeleteAudit', audit.ID);
        //auditDeleteAsync(audit.ID);
    };

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
                    auditClear();
                    setShowModal(false);

                    if (!!onHide) onHide(); // Desde el exterior se decide que limpiar los regristros Redux o no
                                            // asi como cargar nuevamente el listado de audits
                }
            })
        } else { // No se puede omitir la duplicación de este código porque Swal es asincrono
            auditClear();
            setShowModal(false);

            if (!!onHide) onHide(); // Desde el exterior se decide que limpiar los regristros Redux o no
        }
    };  // onCloseModal

    const onSiteSelectChange = (e) => {
        setSiteSelect(e.target.value);

        // const sitesCount = formikRef.current.values.sitesCountHidden;

        // // Para contar el numero de sites o si al menos esta uno seleccionado
        // if (!isNullOrEmpty(e.target.value)) {
        //     //setSitesCount(sitesCount + 1);
        //     formikRef.current.setFieldValue('sitesCountHidden', sitesCount + 1);
        //     //console.log('onSiteSelectChange', sitesCount + 1);
        // } else {
        //     //setSitesCount(sitesCount - 1);
        //     formikRef.current.setFieldValue('sitesCountHidden', sitesCount - 1 < 0 ? 0 : sitesCount - 1);
        //     //console.log('onSiteSelectChange', sitesCount - 1);
        // }
    };

    const onAddSite = () => {

        auditSiteAddAsync(siteSelect)
            .then(data => {
                if (!!data) {
                    const currentSite = organization.Sites.find(i => i.ID == siteSelect);
                    setSiteSelect(''); // Reiniciar el select
                    setSitesList([
                        ...sitesList,
                        {
                            ID: currentSite.ID,
                            Description: currentSite.Description,
                        }
                    ].sort((a, b) => a.Description.localeCompare(b.Description)));
                    formikRef.current.setFieldValue('sitesCountHidden', sitesList.length + 1);

                    if (sitesList.length + 1 > 1) {
                        formikRef.current.setFieldValue('isMultisiteCheck', true);
                    } else {
                        formikRef.current.setFieldValue('isMultisiteCheck', false);
                    }
                }
            })
            .catch(err => {
                console.log(err);
            });
    }; // onAddSite

    const onDeleteSite = (siteID) => {

        if (!siteID) {
            setError('You must specify the site ID');
            return;
        }

        auditSiteDeleteAsync(siteID)
            .then(data => {
                if (!!data) {
                    setSitesList(sitesList.filter(i => i.ID != siteID));
                    formikRef.current.setFieldValue('sitesCountHidden', audit.Sites.length - 1);
                }
            })
            .catch(err => {
                console.log(err);
            });
    }; // onDeleteSite

    return (
        <Modal {...props} show={showModal} onHide={ onCloseModal } 
            size="xl" 
            contentClassName="bg-gray-100 border-0 shadow-lg"
            fullscreen="sm-down"
        >
            { 
                isAuditLoading || isAuditCreating || isOrganizationLoading || isAuditCycleLoading ? (
                    <Modal.Body>
                        <ViewLoading />
                    </Modal.Body>
                ) : !!audit &&
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        enableReinitialize
                        onSubmit={onFormSubmit}
                        innerRef={formikRef}
                    >
                        {formik => {
                            useEffect(() => {
                                setHasChanges(formik.dirty);
                            }, [formik.dirty]);
                            return (
                                <Form>
                                    <Modal.Body>
                                        <div
                                            className="page-header min-height-150 border-radius-xl"
                                            style={{
                                                backgroundImage: `url(${bgHeadModal})`,
                                                backgroundPositionY: '50%'
                                            }}
                                        >
                                            <h4 className="text-white mx-4 pb-5" style={{ zIndex: 1 }}>Audit</h4>
                                            <span className={`mask bg-gradient-${auditStatusProps[audit.Status].variant} opacity-6`} />
                                        </div>                                        
                                        <div className="card card-body blur shadow-blur mx-4 mt-n6 overflow-hidden">
                                            <Row className="gx-4">
                                                <Col xs="12" className="d-flex justify-content-between align-items-center">
                                                    <div className="d-flex align-items-center">
                                                        <div 
                                                            className={`icon icon-md icon-shape bg-gradient-${ auditStatusProps[audit.Status].variant } border-radius-md d-flex align-items-center justify-content-center me-2 position-relative`} 
                                                            title={ auditStatusProps[audit.Status].label }
                                                            style={{ minWidth: '48px' }}
                                                        >
                                                            <FontAwesomeIcon icon={ auditStatusProps[audit.Status].icon  } className="opacity-10 text-white" aria-hidden="true" size="lg" /> 
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
                                                        <div className={`badge bg-gradient-${auditStatusProps[audit.Status].variant} text-white`}>
                                                            { auditStatusProps[audit.Status].label }
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
                                                                <AuditStandardsList />
                                                                <Field name="standardsCountHidden" type="hidden" value={ formik.values.standardsCountHidden } />
                                                                {
                                                                    formik.touched.standardsCountHidden && formik.errors.standardsCountHidden &&
                                                                    <span className="text-danger text-xs">{formik.errors.standardsCountHidden}</span>
                                                                }
                                                            </Col>
                                                            <Col xs="12">
                                                                <AuditAuditorsList />
                                                                <Field name="auditorsCountHidden" type="hidden" value={ formik.values.auditorsCountHidden } />
                                                                {
                                                                    formik.touched.auditorsCountHidden && formik.errors.auditorsCountHidden &&
                                                                    <span className="text-danger text-xs">{formik.errors.auditorsCountHidden}</span>
                                                                }
                                                            </Col>
                                                            <Col xs="12">
                                                                <AryFormikTextArea
                                                                    name="descriptionInput"
                                                                    label="Audit description"
                                                                />
                                                            </Col>
                                                            <hr className="horizontal dark mb-3" />
                                                            <Col xs="12" sm="5">
                                                                <AryFormikTextInput
                                                                    name="startDateInput"
                                                                    type="date"
                                                                    label="Start date"
                                                                />
                                                            </Col>
                                                            <Col xs="12" sm="5">
                                                                <AryFormikTextInput
                                                                    name="endDateInput"
                                                                    type="date"
                                                                    label="End date"
                                                                />
                                                            </Col>
                                                            <Col xs="12" sm="2">
                                                                <AryFormikTextInput
                                                                    name="daysInput"
                                                                    label="Days"
                                                                />
                                                            </Col>
                                                            <Col xs="12" sm="6">
                                                                <div className="form-check form-switch mb-3">
                                                                    <input id="includeSaturdayCheck" name="includeSaturdayCheck"
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        onChange={ formik.handleChange }
                                                                        checked={ formik.values.includeSaturdayCheck }
                                                                    />
                                                                    <label 
                                                                        className="form-check-label text-secondary mb-0" 
                                                                        htmlFor="includeSaturdayCheck"
                                                                    >
                                                                        Include Saturday
                                                                    </label>
                                                                </div>
                                                            </Col>
                                                            <Col xs="12" sm="6">
                                                                <div className="form-check form-switch mb-3">
                                                                    <input id="includeSundayCheck" name="includeSundayCheck"
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        onChange={ formik.handleChange }
                                                                        checked={ formik.values.includeSundayCheck }
                                                                    />
                                                                    <label 
                                                                        className="form-check-label text-secondary mb-0" 
                                                                        htmlFor="includeSundayCheck"
                                                                    >
                                                                        Include Sunday
                                                                    </label>
                                                                </div>
                                                            </Col>
                                                            <hr className="horizontal dark mb-3" />
                                                            <Col xs="12">
                                                                <Row>
                                                                    <Col xs="12">
                                                                        <div className="form-check form-switch mb-3">
                                                                            <input id="isMultisiteCheck" name="isMultisiteCheck"
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                onChange={ (e) => {
                                                                                    const isChecked = e.target.checked;
                                                                                    formik.setFieldValue('isMultisiteCheck', isChecked);
                                                                                    setShowSites(isChecked);
                                                                                }}
                                                                                checked={ formik.values.isMultisiteCheck }
                                                                                disabled={ disabledMultisiteCheck }
                                                                            />
                                                                            <label 
                                                                                className="form-check-label text-secondary mb-0" 
                                                                                htmlFor="isMultisiteCheck"
                                                                            >
                                                                                Is Multisite
                                                                            </label>
                                                                        </div>
                                                                    </Col>
                                                                </Row>                                                              
                                                                <Row>
                                                                    <Col xs="10">
                                                                        <label className="form-label">Sites</label>
                                                                        <select
                                                                            className="form-select"
                                                                            value={siteSelect}
                                                                            onChange={onSiteSelectChange}
                                                                        >
                                                                            <option value="">(select site)</option>
                                                                            {
                                                                                !!organization && organization.Sites && organization.Sites.length > 0 &&
                                                                                organization.Sites.map(site =>
                                                                                    <option
                                                                                        key={site.ID}
                                                                                        value={site.ID}
                                                                                        className="text-capitalize"
                                                                                        disabled={site.Status != DefaultStatusType.active}
                                                                                    >
                                                                                        {site.Description}
                                                                                    </option>
                                                                                )
                                                                            }
                                                                        </select>
                                                                    </Col>
                                                                    <Col xs="2">
                                                                        <div className="d-grid gap-1">
                                                                        <label className="form-label">&nbsp;</label>
                                                                        <button
                                                                            type='button'
                                                                            className="btn btn-link text-dark px-1"
                                                                            onClick={ onAddSite }
                                                                            title="Add selected site"
                                                                        >
                                                                            Add
                                                                        </button>
                                                                        </div>
                                                                    </Col>
                                                                </Row>
                                                                    <Row>
                                                                        <Col xs="12">
                                                                            <div className="bg-gray-100 rounded-3 p-2 mb-3">
                                                                            {
                                                                                !!sitesList && sitesList.length > 0 ?
                                                                                <ListGroup variant="flush">
                                                                                    {
                                                                                        sitesList.map(item => 
                                                                                            <ListGroup.Item key={item.ID} className="bg-transparent border-0 py-1 ps-0 text-xs">
                                                                                                <div className='d-flex justify-content-between align-items-center'>
                                                                                                    <span>
                                                                                                        <FontAwesomeIcon icon={ faBuilding } className="me-2" />
                                                                                                        <span className="font-weight-bold">
                                                                                                            {item.Description}
                                                                                                        </span>
                                                                                                    </span>
                                                                                                    <button
                                                                                                        type="button"
                                                                                                        className="btn btn-link p-0 mb-0 text-secondary"
                                                                                                        onClick={() => onDeleteSite(item.ID)}
                                                                                                        title="Delete site"
                                                                                                    >
                                                                                                        <FontAwesomeIcon icon={faTrashCan} size="lg" />
                                                                                                    </button>
                                                                                                </div>
                                                                                            </ListGroup.Item>
                                                                                        )
                                                                                    }
                                                                                </ListGroup>
                                                                                :
                                                                                <p className="text-center text-secondary text-xs mb-0">
                                                                                    (no sites assigned, select a site and press the <span className="text-dark font-weight-bold">ADD</span> button to assign more than one)
                                                                                </p>
                                                                            }
                                                                            </div>
                                                                        </Col>
                                                                    </Row>
                                                                <Field name="sitesCountHidden" type="hidden" value={ formik.values.sitesCountHidden } />                                                                
                                                                {
                                                                    formik.touched.sitesCountHidden && formik.errors.sitesCountHidden &&
                                                                    <span className="text-danger text-xs">{formik.errors.sitesCountHidden}</span>
                                                                }
                                                            </Col>
                                                            <Col xs="12">
                                                                <AryFormikTextArea
                                                                    name="extraInfoInput"
                                                                    label="Extra info"
                                                                    helpText="Add any extra info for the audit"
                                                                />
                                                            </Col>
                                                            {
                                                                !!audit.Notes && audit.Notes.length > 0 &&
                                                                <Col xs="12" className="text-end">
                                                                    <NotesListModal notes={audit.Notes} buttonLabel="View notes" />
                                                                </Col>
                                                            }
                                                            <Col xs="12">
                                                                <AryFormikSelectInput
                                                                    name="statusSelect"
                                                                    label="Status"
                                                                    onChange={ (e) => {
                                                                        const selectedValue = e.target.value;

                                                                        formik.setFieldValue('statusSelect', selectedValue);
                                                                        setShowAddNote(audit.Status != selectedValue);
                                                                    }}
                                                                    helpText={ audit.Status == AuditStatusType.confirmed 
                                                                        || audit.Status == AuditStatusType.inProcess 
                                                                        || audit.Status == AuditStatusType.finished 
                                                                        || audit.Status == AuditStatusType.completed 
                                                                        || audit.Status == AuditStatusType.closed 
                                                                            ? 'Add a note for the status change' 
                                                                            : '' 
                                                                    }
                                                                >
                                                                    {
                                                                        !!statusOptions && statusOptions.map(item =>
                                                                            <option
                                                                                key={item.value}
                                                                                value={item.value}
                                                                            >
                                                                                {item.label}
                                                                            </option>
                                                                        )
                                                                    }
                                                                </AryFormikSelectInput>
                                                            </Col>
                                                            {
                                                                showAddNote &&
                                                                <Col xs="12">
                                                                    <AryFormikTextInput
                                                                        name="noteInput"
                                                                        label="Note"
                                                                        helpText="Add any note for the audit status change"
                                                                    />
                                                                </Col>
                                                            }
                                                        </Row>
                                                        <Row>
                                                            <Col xs="12" className="d-flex justify-content-between align-items-center">
                                                                <div>
                                                                    {
                                                                        audit.Status >= AuditStatusType.canceled ?
                                                                        <button type="button"
                                                                            className="btn btn-link text-danger mb-0"
                                                                            onClick={ () => console.log('delete') }
                                                                            title="Delete audit"
                                                                        >
                                                                            <FontAwesomeIcon icon={ faTrashCan } className="me-1" size="lg" />
                                                                            Delete
                                                                        </button>
                                                                        : null
                                                                    }
                                                                </div>
                                                                <div>
                                                                    <button type="submit"
                                                                        className="btn bg-gradient-dark mb-0"
                                                                        disabled={ isAuditSaving || !hasChanges }
                                                                    >
                                                                        {
                                                                            isAuditSaving 
                                                                                ? <FontAwesomeIcon icon={ faSpinner } className="me-1" size="lg" spin />
                                                                                : <FontAwesomeIcon icon={ faSave } className="me-1" size="lg" />
                                                                        }
                                                                        Save
                                                                    </button>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                            <Col xs="12" sm="7">
                                                <div className="bg-gray-100 rounded-3 p-2">
                                                    <h5>Documents</h5>
                                                    {
                                                        audit.Status == AuditStatusType.nothing &&
                                                        <div className="alert alert-primary">
                                                            <div className="d-flex justify-content-start align-items-center">
                                                                <FontAwesomeIcon icon={faExclamationTriangle} className="text-white me-3" size="lg" />
                                                                <span className="text-white text-xs">
                                                                    This audit has <span className="font-weight-bold">not been saved</span> even once; 
                                                                    save it first so you can add documents
                                                                </span>
                                                            </div>
                                                        </div>
                                                    }
                                                    <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                                                        <AuditDocumentsList showAllFiles={ showAllFiles } />
                                                    </div>
                                                    <Row>
                                                        <Col xs="12" className="d-flex justify-content-end">
                                                            <div className="form-check form-switch">
                                                                <input id="showAllFilesCheck" name="showAllFilesCheck"
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    onChange={ () => setShowAllFiles(!showAllFiles) }
                                                                    checked={ showAllFiles }
                                                                />
                                                                <label 
                                                                    className="form-check-label text-secondary mb-0" 
                                                                    htmlFor="showAllFilesCheck"
                                                                >
                                                                    Show all files
                                                                </label>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <div className="d-flex justify-content-between align-items-start align-items-sm-center w-100">
                                            <div className="text-secondary mb-3 mb-sm-0">
                                                <AryLastUpdatedInfo item={ audit } />
                                            </div>
                                            <div className="d-flex justify-content-end ms-auto ms-sm-0 mb-3 mb-sm-0 gap-2">
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
                            );
                        }}
                    </Formik>                    
            }
        </Modal>
    )
}

export default AuditModalEditItem