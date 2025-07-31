// Hacer una copia del ADCConceptValueInput pero con un decreaseList de solo 10 y 20 porciento y la modal de justificacion para permitir subir un archivo

import { useEffect, useState } from 'react';

const ADCMD11ValueInput = ({ formik, ...props }) => {

    const decreaseList = [
        { value: 0, label: '0' },
        { value: 10, label: '10' },
        { value: 20, label: '20' },
    ];

    const [formData, setFormData] = useState({
        value: 0,
        justification: '',
        error: null,
    });

    return (
        <div>ADCMD11ValueInput</div>
    )
}

export default ADCMD11ValueInput;