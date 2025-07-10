import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDay, faMinus, faPercent } from '@fortawesome/free-solid-svg-icons';
import enums from '../../../helpers/enums';
import { useEffect, useState } from 'react';

const ADCConceptValueInput = ({ adcConcept, adcConceptValue, formik, ...props }) => {
    const {
        ADCConceptUnitType,
    } = enums();

    const [checkValue, setCheckValue] = useState(adcConceptValue.CheckValue);
    const [iconUnit, setIconUnit] = useState({ icon: faMinus, label: '-' });

    useEffect(() => {
        let unitType = ADCConceptUnitType.nothing;

        if (checkValue && adcConcept.WhenTrue && !!adcConcept.Increase)
        {
            unitType = adcConcept.IncreaseUnit;
            // setIconUnit(adcConcept.IncreaseUnit == ADCConceptUnitType.percentage 
            //     ? { icon: faPercent, label: 'percent' } 
            //     : { icon: faCalendarDay, label: 'days' }
            // );  
        } else if (!checkValue && adcConcept.WhenTrue && !!adcConcept.Decrease) {
            unitType = adcConcept.DecreaseUnit;
            // setIconUnit(adcConcept.DecreaseUnit == ADCConceptUnitType.percentage 
            //     ? { icon: faPercent, label: 'percent' } 
            //     : { icon: faCalendarDay, label: 'days' }
            // );  
        } else if (checkValue && !adcConcept.WhenTrue && !!adcConcept.Decrease) {
            unitType = adcConcept.DecreaseUnit;
            // setIconUnit(adcConcept.DecreaseUnit == ADCConceptUnitType.percentage 
            //     ? { icon: faPercent, label: 'percent' } 
            //     : { icon: faCalendarDay, label: 'days' }
            // );
        } else if (!checkValue && !adcConcept.WhenTrue && !!adcConcept.Increase) {
            unitType = adcConcept.IncreaseUnit;
            // setIconUnit(adcConcept.IncreaseUnit == ADCConceptUnitType.percentage 
            //     ? { icon: faPercent, label: 'percent' } 
            //     : { icon: faCalendarDay, label: 'days' }
            // );
        }

        if (unitType != ADCConceptUnitType.nothing) {
            setIconUnit(unitType == ADCConceptUnitType.percentage 
                ? { icon: faPercent, label: 'percent' } 
                : { icon: faCalendarDay, label: 'days' }
            );
        } else {
            setIconUnit({ icon: faMinus, label: '-' });
        }

    }, [checkValue]);
    

    return (
        <div className="input-group mb-3" {...props}>
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
            <input type="text"
                className="form-control ari-form-control-with-end text-end"
                placeholder="0"
                aria-label="Text input with checkbox"
                // value={adcConceptValue.Value}
                defaultValue={adcConceptValue.Value}
                onChange={(e) => {
                    const value = e.target.value;
                    // formik.setFieldValue(`ADCConceptValues.${adcConceptValue.ID}.Value`, value);
                }}
            />
            <span className="input-group-text ari-input-group-text-end text-sm text-secondary">
                <FontAwesomeIcon icon={ iconUnit.icon } title={ iconUnit.label } />
            </span>
        </div>
    )
}

export default ADCConceptValueInput;