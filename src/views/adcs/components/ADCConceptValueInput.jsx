import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAlignLeft, faCalendarDay, faMinus, faPercent } from '@fortawesome/free-solid-svg-icons';
import enums from '../../../helpers/enums';
import { useEffect, useState } from 'react';
import { setADCSitesList, updateADCConceptValue, useADCController } from '../context/ADCContext';
import { useField } from 'formik';

const ADCConceptValueInput = ({ adcConcept, adcConceptValue, ...props }) => {
    const [field, meta] = useField(props);

    const {
        ADCConceptUnitType,
    } = enums();
    const [controller, dispatch]= useADCController();
    const { 
        adcData,
        adcSitesList,
        adcConceptValuesList,
    } = controller;

    const decreaseList = [
        { value: 0, label: '0' },
        { value: 5, label: '5' },
        { value: 10, label: '10' },
        { value: 15, label: '15' },
        { value: 20, label: '20' },
    ];

    // HOOKS

    const [checkValue, setCheckValue] = useState(adcConceptValue.CheckValue);    
    const [isDecrease, setIsDecrease] = useState(false);
    const [myProps, setMyProps] = useState({ 
        icon: faMinus, 
        label: '-',
        disabled: true,
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

        const unit = checkValue && adcConcept.WhenTrue && !!adcConcept.Increase
            ? adcConcept.IncreaseUnit
            : !checkValue && adcConcept.WhenTrue && !!adcConcept.Decrease
                ? adcConcept.DecreaseUnit
                : checkValue && !adcConcept.WhenTrue && !!adcConcept.Decrease
                    ? adcConcept.DecreaseUnit
                    : !checkValue && !adcConcept.WhenTrue && !!adcConcept.Increase
                        ? adcConcept.IncreaseUnit
                        : ADCConceptUnitType.nothing;

        setIsDecrease(
            (!checkValue && adcConcept.WhenTrue && !!adcConcept.Decrease) 
            || (checkValue && !adcConcept.WhenTrue && !!adcConcept.Decrease)
        );

        if (unit != ADCConceptUnitType.nothing) {
            setMyProps(unit == ADCConceptUnitType.percentage 
                ? { icon: faPercent, label: 'percent', disabled: false } 
                : { icon: faCalendarDay, label: 'days', disabled: false }
            );
        } else {
            setMyProps({ icon: faMinus, label: '-', disabled: true });
        }

    }, [checkValue]);

    const onChangeValue = (id, value) => {
        // console.log('onChangeValue: set values at ADCContext', id, value);

        // console.log('adcConcept', adcConcept);
        // console.log('adcConceptValue', adcConceptValue);

        console.log('onChangeValue', {
            adcConceptValueID: adcConceptValue.ID,
            checkValue: checkValue,
            newValue: Number(value),
        });

        updateADCConceptValue(dispatch, {
            adcConceptValueID: adcConceptValue.ID,
            checkValue: checkValue,
            newValue: Number(value),
        });

        // const newADCSitesList = adcSitesList.map(adcSite => {
        //     if (adcSite.ID == adcConceptValue.ADCSiteID) {
        //         const newADCConceptValuesList = adcSite.ADCConceptValues.map(adccvItem => {
        //             if (adccvItem.ID == adcConceptValue.ID) {
        //                 return {
        //                     ...adccvItem,
        //                     CheckValue: checkValue,
        //                     Value: Number(value),
        //                 };
        //             }
        //             return adccvItem
        //         });

        //         return {
        //             ...adcSite,
        //             ADCConceptValues: newADCConceptValuesList,
        //         };
        //     }
        //     return adcSite;
        // });

        // setADCSitesList(dispatch, newADCSitesList);

        //console.log('newADCSitesList', adcSitesList);

        // Verificar que sea un valor valido
        // Actualizar el valor en el ADCContext
        // Enviar a formik el valor
        // Recalcular todos los totales del ADC

    }; // onChangeValue
    

    return (
        <div className="input-group mb-3">
            <div className="input-group-text py-1">
                <div className="form-check form-switch">
                    <input type="checkbox" className="form-check-input"
                        aria-label="Checkbox for following text input"
                        style={{ height: '20px' }}
                        onChange={(e) => {
                            const checkValue = e.target.checked;
                            setCheckValue(checkValue);
                            //formik.setFieldValue(`ADCConceptValues.${adcConceptValue.ID}.Value`, checkValue);
                        }}
                        checked={checkValue}
                    />
                </div>
            </div>
            {
                isDecrease ? (
                    <select 
                        {...field}                        
                        onChange={(e) => {
                            const value = e.target.value;
                            onChangeValue(adcConceptValue.ID, value);
                            
                            // formik.setFieldValue(`ADCConceptValues.${adcConceptValue.ID}.Value`, value);
                        }}
                        className="form-select text-end ari-pe-2"
                        defaultValue={adcConceptValue.Value}
                        disabled={ myProps.disabled }
                    >
                        { decreaseList.map((item, index) => (
                            <option key={index} value={item.value} className="text-end">{item.label}</option>
                        ))}
                    </select>
                ) : (
                    <input 
                        {...field}
                        type="text"
                        className="form-control ari-form-control-with-end text-end"
                        placeholder="0"
                        aria-label="Text input with checkbox"
                        // value={adcConceptValue.Value}
                        defaultValue={adcConceptValue.Value}
                        // onChange={(e) => {
                        //     const value = e.target.value;
                        //     //console.log('onChange', value);
                        //     // formik.setFieldValue(`ADCConceptValues.${adcConceptValue.ID}.Value`, value);
                        // }}
                        onBlur={(e) => {
                            //console.log('onBlur', adcConceptValue.ID, e.target.value);
                            onChangeValue(adcConceptValue.ID, e.target.value);
                        }}
                        disabled={ myProps.disabled }
                    />
                )
            }
            <span className="input-group-text ari-input-group-text-end text-sm">
                <FontAwesomeIcon icon={ myProps.icon } title={ myProps.label } />
            </span>
            <button 
                className="btn btn-outline-light ari-btn-outline-light-2 px-3 mb-0" 
                type="button"
                onClick={ (e) => {
                    e.preventDefault();
                    console.log('onClick');
                    //formik.setFieldValue(`ADCConceptValues.${adcConceptValue.ID}.Value`, 0);
                }}
            >
                <FontAwesomeIcon icon={ faAlignLeft } />
            </button>
        </div>
    )
}

export default ADCConceptValueInput;