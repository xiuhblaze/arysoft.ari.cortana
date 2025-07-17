
import { useEffect, useState } from 'react';

import { setIn, useField } from 'formik';
import { Button, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAlignLeft, faCalendarDay, faCheckToSlot, faJ, faMinus, faPercent, faStickyNote } from '@fortawesome/free-solid-svg-icons';

import enums from '../../../helpers/enums';
import { setADCSiteList, updateADCConceptValue, updateTotals, useADCController } from '../context/ADCContext';
import isNullOrEmpty from '../../../helpers/isNullOrEmpty';

const ADCConceptValueInput = ({ adcConcept, adcConceptValue, ...props }) => {
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
    })
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
        });
        console.log('useEffect, update value,', 0);
        updateConceptValues(0);

    }, [formData.checkValue]);

    // METHODS

    const onChange = (e) => {
        let isValid = true;
        const { name, value, type, checked } = e.target;

        // Validations

        if (name==='value' && type === 'text') { // Validar que sea un numero
            const regex = /^-?\d*\.?\d*$/;
            isValid = regex.test(value) || value === '';
        }

        if (isValid) {
// console.log('onChange.isValid', name, value);
            setFormData({
                ...formData,
                [name]: type === 'checkbox' ? checked : value,
            });

            if (type === 'select-one') { // Cuando se cambia el select
                updateConceptValues(value, formData.justification);
            }
        }

        // console.log('onChange', value);
    }; // onChange

    const onBlur = (e) => { // Cuando se deja el input de Value
        const { name, value } = e.target;
        console.log('onBlur', name, value);

        if (name === 'value') {
            //! validar que sea un numero
            console.log('onChange, update value', value);
            updateConceptValues(value ?? 0, formData.justification);
        }
    };

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
                
        updateTotals(dispatch);
    }; // updateConceptValues

    const onSaveJustification = () => {
        console.log('onSaveJustification, update justification', formData.justification);
        updateConceptValues(formData.value);
        setCurrentJustification(formData.justification);

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
            <div className="mb-3">
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
                        <div className="text-xs text-secondary mt-1">
                            <FontAwesomeIcon icon={ faStickyNote } fixedWidth className="text-warning me-1" />
                            {currentJustification}
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