import { useField } from "formik";


export const AryFormikTextArea = ({label, ...props}) => {
  const [field, meta] = useField(props);

  return (
    <div className="mb-3">
      { !!label && <label htmlFor={ props.id || props.name } className="form-label" dangerouslySetInnerHTML={{ __html: label}} /> }
      <textarea
        className={ `form-control${ meta.touched && meta.error ? ' is-invalid' : '' }`}
        { ...field }
        { ...props }
      />
      {
        meta.touched && meta.error ? (
          <span className="text-danger text-xs">{ meta.error }</span>
        ) : null
      }
    </div>
  );
};

export default AryFormikTextArea;