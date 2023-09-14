
export const getErrorMessages = (error) => {
  let message = '';

  //console.log(error.response.data.errors);

  if (!!error.response?.data?.errors) {
    const { errors } = error.response.data;

    message += '<div class="text-start text-sm">';
    for (const key of Object.keys(errors)) {
      message += '<strong>' + key + '</strong>: ' + errors[key][0] + '<br />'
    }
    message += '</div>';
    return message;
  }

  console.log(error);
  return 'An unhandled exception has occurred, (see log).';
}

export default getErrorMessages;