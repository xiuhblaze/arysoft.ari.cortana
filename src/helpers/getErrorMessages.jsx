
export const getErrorMessages = (error) => {
    let message = '';

    if (!!error.response?.data?.errors) {
        const { errors } = error.response.data;

        message += '<div class="text-start text-sm">';
        for (const key of Object.keys(errors)) {
            message += '<strong>' + key + '</strong>: ' + errors[key][0] + '<br />'
        }
        message += '</div>';
        return message;
    }

    if (!!error.response?.data?.Detail) {
        return error.response.data.Detail
    }

    console.log(error.response.data.Message)
    if (!!error.response?.data?.Message) {
        message = `<strong>${error.response?.data?.Message}</strong>`;
        if (!!error.response?.data?.MessageDetail) {
            message += `<br /><span class="text-start text-xs">${error.response?.data?.MessageDetail}</span>`;
        }
        return message;
    }

    console.log(error);
    return 'An unhandled exception has occurred, (see log).';
}

export default getErrorMessages;