import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAlignLeft, faCalendarDay, faMinus, faPercent } from '@fortawesome/free-solid-svg-icons';
import enums from '../../../helpers/enums';
import { useEffect, useState } from 'react';

const ADCConceptValueInput = ({ adcConcept, adcConceptValue, formik, ...props }) => {
    const {
        ADCConceptUnitType,
    } = enums();

    const decreaseList = [
        { value: 0, label: '0' },
        { value: 5, label: '5' },
        { value: 10, label: '10' },
        { value: 15, label: '15' },
        { value: 20, label: '20' },
    ];

    // HOOKS

    const [checkValue, setCheckValue] = useState(adcConceptValue.CheckValue);
    const [iconUnit, setIconUnit] = useState({ icon: faMinus, label: '-' });
    const [isDecrease, setIsDecrease] = useState(false);

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
            setIconUnit(unit == ADCConceptUnitType.percentage 
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
            {
                // !!adcConcept.Decrease 
                // && !!adcConcept.DecreaseUnit == ADCConceptUnitType.percentage 
                isDecrease
                ? (
                    <select 
                        onSelect={(e) => {
                            const value = e.target.value;
                            // formik.setFieldValue(`ADCConceptValues.${adcConceptValue.ID}.Value`, value);
                        }}
                        className="form-select text-end ari-pe-2"
                        defaultValue={adcConceptValue.Value}
                    >
                        {decreaseList.map((item, index) => (
                            <option key={index} value={item.value} className="text-end">{item.label}</option>
                        ))}
                    </select>
                ) : (
                    <input type="text"
                        className="form-control ari-form-control-with-end text-end"
                        placeholder="0"
                        aria-label="Text input with checkbox"
                        // value={adcConceptValue.Value}
                        defaultValue={adcConceptValue.Value}
                        onChange={(e) => {
                            const value = e.target.value;
                            console.log('onChange', value);
                            // formik.setFieldValue(`ADCConceptValues.${adcConceptValue.ID}.Value`, value);
                        }}
                    />
                )
            }
            <span className="input-group-text ari-input-group-text-end text-sm">
                <FontAwesomeIcon icon={ iconUnit.icon } title={ iconUnit.label } />
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