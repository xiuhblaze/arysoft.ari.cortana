const getLocalDate = (date, isUTC = true) => {
    
    if (isUTC) {
        const fecha = new Date(date);
        const timeZoneOffset = fecha.getTimezoneOffset() * 60000;
        return new Date(fecha.getTime() - timeZoneOffset);
    }

    return new Date(date);
}