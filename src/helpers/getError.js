import isString from "./isString";

/**
 * Devuelve los parametros del error encontrado en el objeto recibido, el objeto debe de ser resultado de
 * una petición ajax a un endpoint
 * @param {*} error 
 * @returns { message, status } el mensaje de error en texto para que pueda ser desplegado en pantalla
 */
export const getError = (error) => {
    let message = '';

    // console.log(error);

    if (!!error.response && !!error.response.data && !!error.response.data.validation) {
        const { validation } = error.response.data;

        if (!!validation) {
            message = validation.detail + '<br /><br />';
            if (Array.isArray(validation.errors)) {
                message += '<ul class="list-unstyled">';
                validation.errors.forEach(item => {
                    //console.log(item);
                    message += '<li>' + item + '</li>';
                });
                message += '</ul>';
            }

            return {
                message,
                status: 400
            };
        }
    }

    if (!!error.response && !!error.response.data && error.response.data.Detail) {
        const { Detail } = error.response.data;
        
        return {
            message: Detail,
            status: 400
        }
    }

    if (!!error.response && !!error.response.data) {
        const { errors } = error.response.data;
        // console.log(errors);
        if (!!errors) { // errores del BusinesException
            // console.log(errors);

            if (Array.isArray(errors)) {
                message += '<ul class="list-unstyled">';
                errors.forEach(error => {
                    // console.log(error);
                    message += '<li>' + error.detail + '</li>';
                });
                message += '</ul>';
            } else { // errores del FluentValidation u otra cosa, ver si con otro tipo de devolución marca error
                message += '<ul class="list-unstyled">';
                for (const element of Object.keys(errors)) {
                    //message += element + ': ' + errors[element][0] + '\n';
                    message += `<li>${errors[element][0]}</li>`;
                }
                message += '</ul>';
            }
            // console.error(errors);

            return {
                message,
                status: 400
            };
        }
    }

    if (!!error.response) {
        const { response } = error;

        switch (response.status) {
            case 400:
                return { message: 'Query error', status: 400 };
            case 404:
                return { message: 'Data not found', status: 404 };
            default:
                return { message: response.statusText, status: response.status };
        }
    }
    
    if (!!error.message)
    {
        return { message: error.message };
    }

    if (!!error && isString(error)) {        
        return { message: error };
    }

    console.error(error);

    return { message: 'Unknow error, see log'};
};

export default getError;