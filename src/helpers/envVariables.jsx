const envVariables = () => {
    const APPLICATION_FORM_OPTIONS = 'arysoft-ari-applicationFormOptions';
    const NACECODES_OPTIONS = 'arysoft-ari-nacecodesOptions';
    const ORGANIZATIONS_OPTIONS = 'arysoft-ari-organizationsOptions';
    const STANDARDS_OPTIONS = 'arysoft-ari-standardsOptions';

    const URI_APPLICATIONFORMS = '/applications';

    return {
        ...import.meta.env,

        URI_APPLICATIONFORMS,

        APPLICATION_FORM_OPTIONS,
        NACECODES_OPTIONS,
        ORGANIZATIONS_OPTIONS,
        STANDARDS_OPTIONS,
    }
};

export default envVariables;