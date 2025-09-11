import { useState } from "react"

import { useADCController, setSiteAuditValueTouched, updateADCSiteAudit } from '../context/ADCContext';
import enums from "../../../helpers/enums";

const ADCSiteAuditInput = ({ adcSiteAudit, ...props }) => {

    if (!adcSiteAudit) return null;

    const { ADCStatusType } = enums();
    
    const [controller, dispatch] = useADCController();
    const { 
        adcData,
        siteAuditHidden
    } = controller;

    // HOOKS

    const [formData, setFormData] = useState({
        checkValue: adcSiteAudit.Value ?? false,
        error: null,
    });

    // METHODS

    const onChange = (e) => { //! Falta darle el seguimiento al check en el context y despues guardarlo en la bdd
        const { checked } = e.target;

        setFormData({
            ...formData,
            checkValue: checked,
        });

        setSiteAuditValueTouched(dispatch, true);

        updateADCSiteAudit(dispatch, {
            adcSiteAuditID: adcSiteAudit.ID,
            value: checked,
        });
    }; // onChange

    return (
        <div {...props} className="mx-auto">
            <div className="form-check form-switch">
                <input type="checkbox" 
                    name="checkValue"
                    className="form-check-input"
                    aria-label="Checkbox for including site in audit"
                    style={{ height: '20px' }}
                    onChange={ onChange }
                    checked={formData.checkValue}
                    disabled={ adcData.Status >= ADCStatusType.inactive }
                />
                <label className="form-check-label mb-0" htmlFor="checkValue">
                    <span className="text-xs text-secondary">
                        for audit
                    </span>
                </label>
            </div>
        </div>
    )
}

export default ADCSiteAuditInput