// Formatear el parametro recibido tipo string en solo la hora y los minutos en formato HH:mm:ss o H:mm:ss en solo H:mm

const getSmallHour = (time) => {
    const timeSplit = time.split(':');
    let hour = timeSplit[0];
    let minute = timeSplit[1];

    if (hour.length == 1) hour = '0' + hour;
    if (minute.length == 1) minute = '0' + minute;

    return `${hour}:${minute}`;
}

export default getSmallHour;