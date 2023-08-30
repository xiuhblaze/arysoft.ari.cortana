import { useField } from "formik";

export const AryFormikSelectInput = ({ label, children, ...props }) => {
  const [ field, meta] = useField(props);

  return (
    <div className="mb-3">
      { !!label && <label htmlFor={ props.id || props.name } className="form-label">{ label }</label> }
      <select 
        className="form-select"
        { ...field }
        { ...props }
      >
        { children }
      </select>
      {
        meta.touched && meta.error ? (
          <span className="text-danger text-xs">{ meta.error }</span>
        ) : null
      }
    </div>
  )
};

export default AryFormikSelectInput;