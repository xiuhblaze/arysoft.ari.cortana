import { differenceInMilliseconds } from "date-fns";

const getDateDifferenceInUpperDays = (firstDate, secondDate) => {
    
    if (!firstDate || !secondDate) {
        return null;
    }

    const date1 = new Date(firstDate);
    const date2 = new Date(secondDate);

    const milisegundosPorDia = 24 * 60 * 60 * 1000;
    const diferenciaEnMilisegundos = differenceInMilliseconds(date2, date1);
  
    // Dividir por milisegundos en un día y redondear hacia arriba
    return Math.ceil(diferenciaEnMilisegundos / milisegundosPorDia);
};

export default getDateDifferenceInUpperDays;