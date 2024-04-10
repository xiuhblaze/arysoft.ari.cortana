import { useField } from "formik";

// Basado en: https://codesandbox.io/s/formik-v2-tutorial-added-textarea-ujz18
export const AryFormikTextInput = ({ label, classNameDiv, ...props }) => {
    const [field, meta] = useField(props);
    const { className, ...baseProps } = props;

    return (
        <div className={ classNameDiv ?? 'mb-3' }>
            {!!label && <label htmlFor={props.id || props.name} className="form-label" dangerouslySetInnerHTML={{ __html: label }} />}
            <input
                className={`form-control${meta.touched && meta.error ? ' is-invalid' : ''}${ !!className ? ' ' + className : '' }`}
                {...field}
                {...baseProps}
            />
            {
                meta.touched && meta.error ? (
                    <span className="text-danger text-xs">{meta.error}</span>
                ) : null
            }
        </div>
    );
};

export default AryFormikTextInput;