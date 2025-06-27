import { format, formatDistanceToNow } from "date-fns";

const aryDateTools = () => {

    /**
     * Devuelve una fecha con un formato amigable, comparando la fecha actual
     * con la fecha recibida como parámetro
     * @param {date} date 
     * @param {bool} includeTime opcional, indica si se debe devolver el tiempo también
     * @param {bool} isUTC opcional, indica si se debe usar la fecha UTC o la fecha local
     * @returns valor String que indica la fecha deforma amigable
     */
    const getFriendlyDate = (date, includeTime = false, isUTC = true) => {
    
        if (!isValidDate(date)) {
            return null;
        }

        let fechaLocal = null;
    
        if (isUTC) {
            const fecha = new Date(date);
            const timeZoneOffset = fecha.getTimezoneOffset() * 60000;
            fechaLocal = new Date(fecha.getTime() - timeZoneOffset);
        } else {
            fechaLocal = new Date(date);
        }

        const delta = Math.round((+new Date - fechaLocal) / 1000);

        const minute = 60;
        const hour = minute * 60;
        const day = hour * 24;
        const week = day * 7;
    
        if (delta < week) {
            return formatDistanceToNow(fechaLocal, { addSuffix: true });
        }
    
        return format(new Date(fechaLocal), !!includeTime ? "dd/MM/yyyy HH:mm:ss" : "dd/MM/yyyy");
    }; // getFriendlyDate

    /**
     * Devuelve la fecha ajustada ya sea la hora local o UTC
     * @param {date} date - fecha a devolver en horario local
     * @param {bool} isUTC - indica si se debe usar la fecha UTC o la fecha local
     * @returns objeto Date con la fecha y hora
     */
    const getLocalDate = (date, isUTC = true) => {

        if (!isValidDate(date)) {
            return null;
        }

        if (isUTC) {
            const fecha = new Date(date);
            const timeZoneOffset = fecha.getTimezoneOffset() * 60000;
            return new Date(fecha.getTime() - timeZoneOffset);
        }

        return new Date(date);
    }; // getLocalDate

    /**
     * Revisa si una fecha es valida
     * @param {object} date valida si el objeto es una fecha
     * @returns bool
     */
    const isValidDate = (date) => {
        return !!date && !isNaN(new Date(date));
    }; // isValidDate

    return {
        getFriendlyDate,
        getLocalDate,
        isValidDate,
    };
}; // aryDateTools

export default aryDateTools;