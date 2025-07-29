import { useEffect, useState } from 'react';

import { setIn, useField } from 'formik';
import { Button, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAlignLeft, faCalendarDay, faCheckToSlot, faExclamationTriangle, faJ, faMinus, faPercent, faStickyNote } from '@fortawesome/free-solid-svg-icons';

import enums from '../../../helpers/enums';
import { setADCSiteList, updateADCConceptValue, updateTotals, useADCController } from '../context/ADCContext';
import isNullOrEmpty from '../../../helpers/isNullOrEmpty';

const ADCConceptValueInput = ({ adcConcept, adcConceptValue, formik, ...props }) => {
    // const [field, meta] = useField(props);

    const {
        ADCConceptUnitType,
    } = enums();
    const [controller, dispatch]= useADCController();
    const { 
        adcData,
        adcSiteList,
        adcConceptList,
    } = controller;

    const decreaseList = [
        { value: 0, label: '0' },
        { value: 5, label: '5' },
        { value: 10, label: '10' },
        { value: 15, label: '15' },
        { value: 20, label: '20' },
    ];

    // HOOKS

    const [showModal, setShowModal] = useState(false);    
    const [formData, setFormData] = useState({
        checkValue: adcConceptValue.CheckValue ?? false,
        value: adcConceptValue.Value ?? 0,
        justification: adcConceptValue.Justification ?? '',
        error: null,
    });
    const [currentJustification, setCurrentJustification] = useState(adcConceptValue.Justification ?? '');  
    
    //const [checkValue, setCheckValue] = useState(adcConceptValue.CheckValue);    
    const [isDecrease, setIsDecrease] = useState(false);
    const [myProps, setMyProps] = useState({ 
        icon: faMinus, 
        label: '-',
        disabled: true,
        unit: ADCConceptUnitType.nothing,
    });

    useEffect(() => {
        // let unitType = ADCConceptUnitType.nothing;

        // if (checkValue && adcConcept.WhenTrue && !!adcConcept.Increase) {
        //     unitType = adcConcept.IncreaseUnit;
        // } else if (!checkValue && adcConcept.WhenTrue && !!adcConcept.Decrease) {
        //     unitType = adcConcept.DecreaseUnit;
        // } else if (checkValue && !adcConcept.WhenTrue && !!adcConcept.Decrease) {
        //     unitType = adcConcept.DecreaseUnit;            
        // } else if (!checkValue && !adcConcept.WhenTrue && !!adcConcept.Increase) {
        //     unitType = adcConcept.IncreaseUnit;
        // }

        const unit = formData.checkValue && adcConcept.WhenTrue && !!adcConcept.Increase
            ? adcConcept.IncreaseUnit
            : !formData.checkValue && adcConcept.WhenTrue && !!adcConcept.Decrease
                ? adcConcept.DecreaseUnit
                : formData.checkValue && !adcConcept.WhenTrue && !!adcConcept.Decrease
                    ? adcConcept.DecreaseUnit
                    : !formData.checkValue && !adcConcept.WhenTrue && !!adcConcept.Increase
                        ? adcConcept.IncreaseUnit
                        : ADCConceptUnitType.nothing;

        setIsDecrease(
            (!formData.checkValue && adcConcept.WhenTrue && !!adcConcept.Decrease) 
            || (formData.checkValue && !adcConcept.WhenTrue && !!adcConcept.Decrease)
        );

        if (unit != ADCConceptUnitType.nothing) {
            setMyProps(unit == ADCConceptUnitType.percentage 
                ? { icon: faPercent, label: 'percent', disabled: false, unit: ADCConceptUnitType.percentage } 
                : { icon: faCalendarDay, label: 'days', disabled: false, unit: ADCConceptUnitType.days }
            );
        } else {
            setMyProps({ icon: faMinus, label: '-', disabled: true, unit: ADCConceptUnitType.nothing });
        }

        setFormData({
            ...formData,
            value: 0,
            error: '',
        });

        if (!!formik && !isNullOrEmpty(formData.error)) {
            //console.log(formik.values.conceptValueHidden, 'aqui se debe restar');
            formik.setFieldValue(
                'conceptValueHidden', 
                formik.values.conceptValueHidden == 0 
                    ? 0 
                    : formik.values.conceptValueHidden - 1
            );
        }
        // console.log('useEffect, update value,', 0);
        updateConceptValues(0);

    }, [formData.checkValue]);

    // METHODS

    const isValidDays = (value) => {
        const regex = /^-?\d*\.?\d*$/;
        let isValid = true;

        if (regex.test(value) || value === '') { // Validar que sea un numero

            // Validar que esté dentro del rango permitido - si es incremento
            if ((formData.checkValue && adcConcept.WhenTrue && !!adcConcept.Increase)
                || (!formData.checkValue && !adcConcept.WhenTrue && !!adcConcept.Increase)) {

                if (Number(value) > adcConcept.Increase || Number(value) < 0) {
                    isValid = false;
                    setFormData({
                        ...formData,
                        error: 'The increase value must be positive and less than the maximum allowed',
                    });
                    if (!!formik && isNullOrEmpty(formData.error)) {
                        //formik.setFieldError('conceptValueHidden', 'At last a concept value is not valid');
                        //console.log(formik.values.conceptValueHidden, 'aqui se debe sumar');
                        formik.setFieldValue('conceptValueHidden', formik.values.conceptValueHidden + 1);
                    }
                } else {
                    setFormData({
                        ...formData,
                        error: ''
                    });
                    if (!!formik && !isNullOrEmpty(formData.error)) {
                        //formik.setFieldError('conceptValueHidden', '');
                        //console.log(formik.values.conceptValueHidden, 'aqui se debe restar');
                        formik.setFieldValue('conceptValueHidden', formik.values.conceptValueHidden == 0 ? 0 : formik.values.conceptValueHidden - 1);
                    }
                }
            } 
        } else {
            isValid = false;
            setFormData({
                ...formData,
                error: 'The value must be a number',
            });
        }

        return isValid;
    }; // isValidDays

    const onChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });

        if (type === 'select-one') { // Cuando se cambia el select
            if (!!formik) {
                formik.setFieldTouched('conceptValueHidden', true);
                formik.setFieldValue('conceptValueHidden', 0);
            }
            updateConceptValues(value, formData.justification);
        }
    }; // onChange

    const onBlur = (e) => { // Cuando se deja el input de Value
        const { name, value } = e.target;
        
        if (name === 'value' && isValidDays(value)) {
            
            if (!!formik) {
                formik.setFieldTouched('conceptValueHidden', true);
                formik.setFieldValue('conceptValueHidden', 0);
            }
            
            updateConceptValues(value ?? 0, formData.justification);
        }
    }; // onBlur

    const updateConceptValues = (value, justification = '') => {
        
        updateADCConceptValue(dispatch, {
            adcConceptValueID: adcConceptValue.ID,
            checkValue: formData.checkValue,
            newValue: Number(value),
            unit: myProps.unit,
            justification,
        });

        // Verificar que sea un valor valido
        // Actualizar el valor en el ADCContext - Ya con updateADCConceptValue
        
        if (!!formik) {
            formik.setFieldTouched('conceptValueHidden', true);
            formik.setFieldValue('conceptValueHidden', 0);
        }
                
        updateTotals(dispatch);
    }; // updateConceptValues

    const onSaveJustification = () => {
        //console.log('onSaveJustification, update justification', formData.justification);
        updateConceptValues(formData.value);
        setCurrentJustification(formData.justification);

        if (!!formik) {
            formik.setFieldTouched('conceptValueHidden', true);
            //formik.setFieldValue('conceptValueHidden', true);
        }

        setShowModal(false);
    }; // onSaveJustification
    
    const onHideModal = () => {

        if (isNullOrEmpty(currentJustification)) {
            setFormData({
                ...formData,
                justification: '',
            });
        } else {
            setFormData({
                ...formData,
                justification: currentJustification,
            });
        }
        setShowModal(false);
    };

    const onShowModal = () => {
        setShowModal(true);
    };

    return (
        <>
            <div {...props}>
                <div className="input-group">
                    <div className="input-group-text py-1">
                        <div className="form-check form-switch">
                            <input type="checkbox" 
                                name="checkValue"
                                className="form-check-input"
                                aria-label="Checkbox for following text input"
                                style={{ height: '20px' }}
                                onChange={ onChange }
                                checked={formData.checkValue}
                            />
                        </div>
                    </div>
                    {
                        isDecrease ? (
                            <select 
                                name="value"
                                onChange={ onChange }
                                className="form-select text-end ari-pe-2"
                                value={formData.value ?? 0}
                                disabled={ myProps.disabled }
                            >
                                { decreaseList.map((item, index) => (
                                    <option key={index} value={item.value} className="text-end">{item.label}</option>
                                ))}
                            </select>
                        ) : (
                            <input type="text"
                                name="value"
                                className="form-control ari-form-control-with-end text-end"
                                placeholder="0"
                                aria-label="Text input with checkbox"
                                value={formData.value ?? '0'}
                                onChange={ onChange }
                                onBlur={ onBlur }
                                disabled={ myProps.disabled }
                            />
                        )
                    }
                    <span className="input-group-text ari-input-group-text-end text-sm">
                        <FontAwesomeIcon icon={ myProps.icon } title={ myProps.label } />
                    </span>
                    <button 
                        className={`btn ${ isNullOrEmpty(formData.justification) 
                            ? 'btn-outline-light ari-btn-outline-light-2' 
                            : 'btn-outline-secondary'} px-3 mb-0`}
                        type="button"
                        disabled={ myProps.disabled }
                        onClick={ (e) => {
                            e.preventDefault();
                            onShowModal();
                        }}
                    >
                        <FontAwesomeIcon icon={ faAlignLeft } />
                    </button>
                </div>
                {
                    !isNullOrEmpty(currentJustification) ? (
                        <div className="text-xs text-secondary text-wrap mt-1">
                            <FontAwesomeIcon icon={ faStickyNote } fixedWidth className="text-warning me-1" />
                            {currentJustification}
                        </div>
                    ) : null
                }
                {
                    !isNullOrEmpty(formData.error) ? ( 
                        <div className="text-xs text-danger text-wrap mt-1">
                            <FontAwesomeIcon icon={ faExclamationTriangle } fixedWidth className="text-danger me-1" />
                            { formData.error }
                        </div>
                    ) : null
                }
            </div>
            <Modal show={ showModal } onHide={ onHideModal } centered>
                <Modal.Header >
                    <Modal.Title>
                        <FontAwesomeIcon icon={ faCheckToSlot } className="me-3" size="lg" />
                        Justification
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h6 className="text-sm text-dark text-gradient text-wrap mb-0">
                        { adcConcept.Description }
                    </h6>
                    <p className="text-xs text-secondary text-wrap mb-0">
                        { adcConcept.ExtraInfo }
                    </p>
                    <hr className="horizontal dark my-3" />
                    <label className="form-label">Include a justification for the applied increase/decrease:</label>
                    <textarea 
                        name="justification"
                        className="form-control"
                        placeholder="Justification"
                        onChange={ onChange }
                        value={ formData.justification }
                        rows={ 3 }
                    />
                </Modal.Body>
                <Modal.Footer>
                    <div className="d-flex justify-content-end ms-auto ms-sm-0 mb-3 mb-sm-0 gap-2">
                        <button type="button"
                            className="btn bg-gradient-dark mb-0"
                            onClick={ onSaveJustification }
                        >
                            Save
                        </button>
                        <button type="button" 
                            className="btn btn-link text-secondary mb-0" 
                            onClick={ onHideModal }
                            >
                            Close
                        </button>
                    </div>
                </Modal.Footer>
            </Modal>            
        </>
    )
}

export default ADCConceptValueInput;