import React from 'react';
import { FastField } from 'formik';

const AryFormikFastField = ({ label, classNameDiv, startLabel, endLabel, helpText, innerRef, ...props}) => {
  return (
    <FastField name={props.name}>
        {({ field, meta }) => {
            const inputForm = (
                <input
                    className={`form-control${ meta.touched && meta.error ? ' is-invalid' : ''}${ !!props.className ?  ' ' + props.className : ''}`}
                    ref={innerRef}
                    {...field}
                    {...props}
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
        }}
    </FastField>
  )
}

export default AryFormikFastField