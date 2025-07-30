

const AryFormDebug = ({ formik }) => {
    return (
        <div>
            <h6>Estado del formulario</h6>
            <pre>
                {JSON.stringify({
                    values: formik.values,
                    errors: formik.errors,
                    touched: formik.touched,
                    isValid: formik.isValid,
                    isDirty: formik.dirty,
                    isSubmitting: formik.isSubmitting,
                    submitCount: formik.submitCount,
                }, null, 2)}
            </pre>
        </div>
    )
}

export default AryFormDebug;