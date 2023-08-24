const envVariables = () => {
  const NACECODES_OPTIONS = 'arysoft-ari-nacecodesOptions';

  return {
    ...import.meta.env,
    NACECODES_OPTIONS,
  }
};

export default envVariables;