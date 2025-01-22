export const checkFileExists = (url) => {
    // console.log('checkFileExists');

    fetch(url, { method: 'HEAD', mode: 'no-cors' })
        .then(response => {
            // console.log(response);
            return response.ok ? true : false;
                //response.ok ? true : false
        })
        .catch(error => { 
            console.log(error);
            return false;
        });

    return false;
};