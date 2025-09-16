import { useEffect, useState } from "react"

import { useADCController, setSiteAuditValueTouched, updateADCSiteAudit } from '../context/ADCContext';
import enums from "../../../helpers/enums";

const ADCSiteAuditInput = ({ adcSiteAudit, ...props }) => {
//console.log("1. Inicio del componente", { adcSiteAudit });
    
    // Early returns con mejor debugging
    if (!adcSiteAudit) {
        //console.log("adcSiteAudit no existe");
        return null;
    }

    const { ADCStatusType } = enums();
    
    const [controller, dispatch] = useADCController();     
    const { 
        adcData,
    } = controller;

    // HOOKS

    const [formData, setFormData] = useState({
        checkValue: adcSiteAudit.Value ?? false,
        error: null,
    });

    useEffect(() => {
        //console.log("useEffect: Sincronizando valor", adcSiteAudit.Value);
        setFormData(prev => ({
            ...prev,
            checkValue: adcSiteAudit.Value ?? false
        }));
    }, [adcSiteAudit.Value])
    

    // METHODS

    const onChange = (e) => {
        const { checked } = e.target;
//console.log("onChange local", checked);
        setFormData(prev => ({
            ...prev,
            checkValue: checked,
        }));

        setSiteAuditValueTouched(dispatch, true);

        updateADCSiteAudit(dispatch, {
            adcSiteAuditID: adcSiteAudit.ID,
            value: checked,
        });
    }; // onChange

    //console.log("Renderizando - formData:", formData.checkValue, "prop:", adcSiteAudit.Value);

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