const envVariables = () => {
  const NACECODES_OPTIONS = 'arysoft-ari-nacecodesOptions';
  const ORGANIZATIONS_OPTIONS = 'arysoft-ari-organizationsOptions';
  const STANDARDS_OPTIONS = 'arysoft-ari-standardsOptions';

  return {
    ...import.meta.env,
    NACECODES_OPTIONS,
    ORGANIZATIONS_OPTIONS,
    STANDARDS_OPTIONS,
  }
};

export default envVariables;