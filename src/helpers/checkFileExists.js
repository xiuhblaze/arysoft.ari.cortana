export const checkFileExists = (url) => {
    fetch(url, { method: 'HEAD', mode: 'no-cors' })
        .then(response => response.ok ? true : false)
        .catch(error => console.log(error));
};