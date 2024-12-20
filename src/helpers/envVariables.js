const envVariables = () => {
    const APPLICATION_FORM_OPTIONS = 'arysoft-ari-applicationFormOptions';
    const AUDITORS_OPTIONS = 'arysoft-ari-auditorsOptions';
    const CATAUDITORDOCUMENTS_OPTIONS = 'arysoft-ari-catAuditorDocumentsOptions';
    const CONTACTS_OPTIONS = 'arysoft-ari-contactsOptions';
    const NACECODES_OPTIONS = 'arysoft-ari-nacecodesOptions';
    const ORGANIZATIONS_OPTIONS = 'arysoft-ari-organizationsOptions';
    const STANDARDS_OPTIONS = 'arysoft-ari-standardsOptions';
    
    const URL_APPLICATIONFORMS = '/applications';
    const URL_AUDITOR_FILES = '/auditors';

    return {
        ...import.meta.env,

        URL_APPLICATIONFORMS,
        URL_AUDITOR_FILES,

        APPLICATION_FORM_OPTIONS,
        AUDITORS_OPTIONS,
        CATAUDITORDOCUMENTS_OPTIONS,
        CONTACTS_OPTIONS,
        NACECODES_OPTIONS,
        ORGANIZATIONS_OPTIONS,
        STANDARDS_OPTIONS,
    }
};

export default envVariables;