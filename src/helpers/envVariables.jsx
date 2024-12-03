const envVariables = () => {
    const APPLICATION_FORM_OPTIONS = 'arysoft-ari-applicationFormOptions';
    const AUDITORS_OPTIONS = 'arysoft-ari-auditorsOptins';
    const CONTACTS_OPTIONS = 'arysoft-ari-contactsOptions';
    const NACECODES_OPTIONS = 'arysoft-ari-nacecodesOptions';
    const ORGANIZATIONS_OPTIONS = 'arysoft-ari-organizationsOptions';
    const STANDARDS_OPTIONS = 'arysoft-ari-standardsOptions';

    const URI_APPLICATIONFORMS = '/applications';
    const URI_AUDITOR_FILES = '/files/auditors';

    return {
        ...import.meta.env,

        URI_APPLICATIONFORMS,
        URI_AUDITOR_FILES,

        APPLICATION_FORM_OPTIONS,
        AUDITORS_OPTIONS,
        CONTACTS_OPTIONS,
        NACECODES_OPTIONS,
        ORGANIZATIONS_OPTIONS,
        STANDARDS_OPTIONS,
    }
};

export default envVariables;