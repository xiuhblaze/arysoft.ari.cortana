import React, { useEffect, useState } from 'react';

import { Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAlignLeft, faCalendarDay, faCheckToSlot, faExclamationTriangle, faMinus, faPercent, faStickyNote } from '@fortawesome/free-solid-svg-icons';

import enums from '../../../helpers/enums';
import { setConceptValueHidden, setConceptValueTouched, updateADCConceptValue, useADCController } from '../context/ADCContext';
import isNullOrEmpty from '../../../helpers/isNullOrEmpty';

const ADCConceptValueInput = React.memo(({ adcConcept, adcConceptValue, ...props }) => {
    const {
        ADCStatusType,
        ADCConceptUnitType,
    } = enums();
    const [controller, dispatch]= useADCController();
    const { 
        adcData,
        conceptValueHidden,
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
        value: adcConceptValue.Value.toString() ?? '0',
        justification: adcConceptValue.Justification ?? '',
        error: null,
    });
    const [currentJustification, setCurrentJustification] = useState(adcConceptValue.Justification ?? '');
    const [isDecrease, setIsDecrease] = useState(false);
    const [myProps, setMyProps] = useState({ 
        icon: faMinus, 
        label: '-',
        disabled: true,
        unit: ADCConceptUnitType.nothing,
    });

    useEffect(() => {
        setConceptValue(formData.checkValue);
    }, []);

    // METHODS

    const isValidDays = (value) => {
        const regex = /^-?\d*\.?\d*$/;
        let isValid = true;

        if (regex.test(value) || value === '') { // Validar que sea un numero

            // Validar que esté dentro del rango permitido - si es incremento (decremento es un select)
            if ((formData.checkValue && adcConcept.WhenTrue && !!adcConcept.Increase)
                || (!formData.checkValue && !adcConcept.WhenTrue && !!adcConcept.Increase)) {

                if (Number(value) > adcConcept.Increase || Number(value) < 0) {
                    isValid = false;
                    setFormData({
                        ...formData,
                        error: 'The increase value must be positive and less than the maximum allowed',
                    });
                    if (isNullOrEmpty(formData.error)) {
                        setConceptValueHidden(dispatch, conceptValueHidden.value + 1);
                    }                    
                } else {
                    setFormData({
                        ...formData,
                        error: ''
                    });
                    setConceptValueHidden(dispatch, conceptValueHidden.value == 0 ? 0 : conceptValueHidden.value - 1);
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

    const setConceptValue = (value) => {

        const unit = value && adcConcept.WhenTrue && !!adcConcept.Increase
            ? adcConcept.IncreaseUnit
            : !value && adcConcept.WhenTrue && !!adcConcept.Decrease
                ? adcConcept.DecreaseUnit
                : value && !adcConcept.WhenTrue && !!adcConcept.Decrease
                    ? adcConcept.DecreaseUnit
                    : !value && !adcConcept.WhenTrue && !!adcConcept.Increase
                        ? adcConcept.IncreaseUnit
                        : ADCConceptUnitType.nothing;
                
        setIsDecrease(
            (!value && adcConcept.WhenTrue && !!adcConcept.Decrease) 
            || (value && !adcConcept.WhenTrue && !!adcConcept.Decrease)
        );
        
        if (unit != ADCConceptUnitType.nothing) {
            setMyProps(unit == ADCConceptUnitType.percentage 
                ? { icon: faPercent, label: 'percent', disabled: false, unit: ADCConceptUnitType.percentage } 
                : { icon: faCalendarDay, label: 'days', disabled: false, unit: ADCConceptUnitType.days }
            );
            setFormData({
                ...formData,
                checkValue: value,
            });
        } else {
            setMyProps({ icon: faMinus, label: '-', disabled: true, unit: ADCConceptUnitType.nothing });
            setFormData({
                ...formData,
                checkValue: value,
                value: 0,
                justification: '',
                error: '',
            });
            setCurrentJustification('');
        }

        if (!isNullOrEmpty(formData.error)) {
            setConceptValueHidden(dispatch, conceptValueHidden.value == 0 ? 0 : conceptValueHidden.value - 1);
        }
    }; // setConceptValue

    const onCheckChange = (e) => {        
        const checked = e.target.checked;

        setConceptValue(checked);
        setConceptValueTouched(dispatch, true);
        updateConceptValues(0);
    }; // onCheckChange

    const onChange = (e) => {
        const { name, value, type } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });

        if (type === 'select-one') { // Cuando se cambia el select
            setConceptValueTouched(dispatch, true);
            updateConceptValues(value, formData.justification);
        }
    }; // onChange

    const onBlur = (e) => { // Cuando se deja el input de Value
        const { name, value } = e.target;
        
        if (name === 'value' && isValidDays(value)) {
            setConceptValueTouched(dispatch, true);
            updateConceptValues(value ?? 0, formData.justification);
        }
    }; // onBlur

    const onSaveJustification = () => {
        updateConceptValues(formData.value, formData.justification);
        setCurrentJustification(formData.justification);
        setConceptValueTouched(dispatch, true);
        setShowModal(false);
    }; // onSaveJustification

    const updateConceptValues = (value, justification = '') => {
        
        updateADCConceptValue(dispatch, {
            adcConceptValueID: adcConceptValue.ID,
            checkValue: formData.checkValue,
            newValue: Number(value),
            unit: myProps.unit,
            justification,
        });
    }; // updateConceptValues

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
                                onChange={ onCheckChange }
                                checked={formData.checkValue}
                                disabled={ adcData.Status >= ADCStatusType.inactive }
                            />
                        </div>
                    </div>
                    {
                        isDecrease ? (
                            <select 
                                name="value"
                                onChange={ onChange }
                                className="form-select text-end ari-pe-2"
                                value={formData.value.toString() ?? '0'}
                                disabled={ myProps.disabled || adcData.Status >= ADCStatusType.inactive }
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
                                disabled={ myProps.disabled || adcData.Status >= ADCStatusType.inactive }
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
                        disabled={ myProps.disabled || adcData.Status >= ADCStatusType.inactive }
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
                        <div 
                            className="text-xs text-secondary text-wrap mt-1"
                            title={ currentJustification.length > 30 ? currentJustification : null }
                        >
                            <FontAwesomeIcon icon={ faStickyNote } fixedWidth className="text-warning me-1" />
                            {
                                currentJustification.length > 30
                                    ? currentJustification.substring(0, 30) + '...'
                                    : currentJustification
                            }
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
                            disabled={ adcData.Status >= ADCStatusType.inactive }
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
}); // ADCConceptValueInput - React.memo

export default ADCConceptValueInput;