import * as Yup from 'yup';
import enums from '../../../helpers/enums';

const appFormValidationSchema = () => {
    const { StandardBaseType } = enums();

    return Yup.object({
        standardSelect: Yup.string()
            .required('Standard is required'),
        // ISO 9K
        activitiesScopeInput: Yup.string()
            .max(1000, 'Process activities/scope must be less than 1000 characters')
            .when('standardSelect', {
                is: (standardSelect) => standardSelect == StandardBaseType.iso9k,
                then: schema => schema.required('Process activities/scope is required'),
                otherwise: schema => schema.notRequired(),
            }),
        processServicesCountInput: Yup.number()
            .typeError('Process services count must be a number')
            .min(1, 'Process services count must be greater than 0')
            .when('standardSelect', {
                is: (standardSelect) => standardSelect == StandardBaseType.iso9k,
                then: schema => schema.required('Number of processes/services is required'),
                otherwise: schema => schema.notRequired(),
            }),
        processServicesDescriptionInput: Yup.string()
            .max(1000, 'Processes/services description must be less than 1000 characters')
            .when('standardSelect', {
                is: (standardSelect) => standardSelect == StandardBaseType.iso9k,
                then: schema => schema.required('Processes/services description is required'),
                otherwise: schema => schema.notRequired(),
            }),
        legalRequirementsInput: Yup.string()
            .max(1000, 'Legal requirements must be less than 1000 characters')
            .when('standardSelect', {
                is: (standardSelect) => standardSelect == StandardBaseType.iso9k,
                then: schema => schema.required('Legal requirements are required'),
                otherwise: schema => schema.notRequired(),
            }),
        anyCriticalComplaintCheck: Yup.bool(),
        criticalComplaintCommentsInput: Yup.string()
            .max(1000, 'Critical complaint comments must be less than 1000 characters')
            .when(['anyCriticalComplaintCheck', 'standardSelect'], {
                is: (anyCriticalComplaintCheck, standardSelect) => 
                    anyCriticalComplaintCheck && standardSelect == StandardBaseType.iso9k,
                then: schema => schema.required('Critical complaint comments are required'),
                otherwise: schema => schema.notRequired(),
            }),
        automationLevelInput: Yup.string()
            .max(1000, 'Automation level must be less than 1000 characters'),
        isDesignResponsibilityCheck: Yup.bool(),
        designResponsibilityJustificationInput: Yup.string()
            .max(1000, 'Design responsibility justification must be less than 1000 characters')
            .when(['isDesignResponsibilityCheck', 'standardSelect'], {
                is: (isDesignResponsibilityCheck, standardSelect) => 
                    isDesignResponsibilityCheck && standardSelect == StandardBaseType.iso9k,
                then: schema => schema.required('Design responsibility justification is required'),
                otherwise: schema => schema.notRequired(),
            }),
        nacecodeCountHidden: Yup.number()
            .when('standardSelect', {
                is: (standardSelect) => standardSelect == StandardBaseType.iso9k,
                then: schema => schema
                    .positive('Must be at least one sector clasification')
                    .required('Must add at least one sector clasification'),
                otherwise: schema => schema.notRequired(),
            }),
        // General
        auditLanguageSelect: Yup.string()
            .required('Audit language is required'),
        currentCertificationsExpirationInput: Yup.string()
            .max(100, 'Current certification expiration must be less than 100 characters'),
        currentStandardsInput: Yup.string()
            .max(100, 'Current standards must be less than 100 characters'),
        currentCertificationsByInput: Yup.string()
            .max(100, 'Current certifications by must be less than 100 characters'),
        outsourcedProcessInput: Yup.string()
            .max(1000, 'Outsourced process must be less than 1000 characters'),
        anyConsultancyCheck: Yup.bool(),
        anyConsultancyByInput: Yup.string()
            .max(250, 'Any consultancy by must be less than 250 characters')
            .when('anyConsultancyCheck', {
                is: (anyConsultancyCheck) => anyConsultancyCheck,
                then: schema => schema.required('Indicate by who the consultation is received is required'),
                otherwise: schema => schema.notRequired(),
            }),
    });
};

export default appFormValidationSchema;
