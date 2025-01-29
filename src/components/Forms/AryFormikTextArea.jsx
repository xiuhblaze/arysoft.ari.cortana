import { useField } from "formik";


export const AryFormikTextArea = ({ label, helpText, ...props }) => {
    const [field, meta] = useField(props);

    // console.log(meta.touched, !!meta.error ? meta.error : 'nothing')

    return (
        <div className="mb-3">
            {!!label && <label htmlFor={props.id || props.name} className="form-label" dangerouslySetInnerHTML={{ __html: label }} />}
            <textarea
                className={`form-control${meta.touched && meta.error ? ' is-invalid' : ''}`}
                {...field}
                {...props}
            />
            {
                !!helpText && <div className="text-xs text-secondary mt-1 me-2">{helpText}</div>
            }
            {
                meta.touched && meta.error && <span className="text-danger text-xs">{meta.error}</span>
            }
        </div>
    );
};

export default AryFormikTextArea;