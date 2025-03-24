import { useField } from "formik";

// Basado en: https://codesandbox.io/s/formik-v2-tutorial-added-textarea-ujz18
export const AryFormikTextInput = ({ label, classNameDiv, startLabel, endLabel, helpText, innerRef, ...props }) => {
    const [field, meta] = useField(props);
    const { className, ...baseProps } = props;

    const inputForm = (
        <input
            className={`form-control${ meta.touched && meta.error ? ' is-invalid' : ''}${ !!className ?  ' ' + className : ''}`}
            ref={innerRef}
            {...field}
            {...baseProps}
        />
    );

    return (
        <div className={ classNameDiv ?? 'mb-3' }>
            {!!label && <label htmlFor={props.id || props.name} className="form-label" dangerouslySetInnerHTML={{ __html: label }} />}
            { !!startLabel || !!endLabel ? (
                <div className="input-group">
                    { !!startLabel && <span className="input-group-text">{ startLabel }</span> }
                    { inputForm }
                    { !!endLabel && <span className="input-group-text">{ endLabel }</span> }
                </div>
            ) : (
                inputForm
            )}
            {
                !!helpText && <div className="text-xs text-secondary mt-1 me-2">{helpText}</div>
            }
            {
                meta.touched && meta.error && <span className="text-danger text-xs">{meta.error}</span>
            }
        </div>
    );
};

export default AryFormikTextInput;