const envVariables = () => {
    const APPLICANTS_OPTIONS = 'arysoft-ari-applicantsOptions';
    const APPLICATION_FORM_OPTIONS = 'arysoft-ari-applicationFormOptions';
    const AUDITORS_OPTIONS = 'arysoft-ari-auditorsOptions';
    const CATAUDITORDOCUMENTS_OPTIONS = 'arysoft-ari-catAuditorDocumentsOptions';
    const CONTACTS_OPTIONS = 'arysoft-ari-contactsOptions';
    const NACECODES_OPTIONS = 'arysoft-ari-nacecodesOptions';
    const ORGANIZATIONS_OPTIONS = 'arysoft-ari-organizationsOptions';
    const STANDARDS_OPTIONS = 'arysoft-ari-standardsOptions';

    const COID_REGEX = /[A-Z]{3}-\d-[0-9]{4}-[0-9]{6}/;//  /^[A-Z]{3}-\d-\d{4}-\d{6}$/;
    const HOUR24_REGEX =  /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
    // const PHONE_REGEX = /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;
    const PHONE_REGEX = /^(((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4})?[ ]?(x[0-9]{3,4})?$/;

    const URL_APPLICATIONFORMS = '/applications';
    const URL_AUDITOR_FILES = '/auditors';
    const URL_CONTACTS_FILES = '/contacts';
    const URL_ORGANIZATION_FILES = '/organizations';

    const COMMENTS_SMALL_MAX_LENGTH = 15;

    return {
        ...import.meta.env,
        
        URL_APPLICATIONFORMS,
        URL_AUDITOR_FILES,
        URL_CONTACTS_FILES,
        URL_ORGANIZATION_FILES,

        COID_REGEX,
        HOUR24_REGEX,
        PHONE_REGEX,

        APPLICANTS_OPTIONS,
        APPLICATION_FORM_OPTIONS,
        AUDITORS_OPTIONS,
        CATAUDITORDOCUMENTS_OPTIONS,
        CONTACTS_OPTIONS,
        NACECODES_OPTIONS,
        ORGANIZATIONS_OPTIONS,
        STANDARDS_OPTIONS,

        COMMENTS_SMALL_MAX_LENGTH,
    }
};

export default envVariables;