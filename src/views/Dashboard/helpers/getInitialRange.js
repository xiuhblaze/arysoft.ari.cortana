import { endOfMonth, endOfWeek, startOfMonth, startOfWeek } from "date-fns";

const getInitialRange = (lastView) => {
    // Por defecto, calculamos el rango basado en la fecha actual y la vista predeterminada
    const currentDate = new Date();
    const view = lastView ?? 'month'; // O la vista que uses por defecto

    let start, end;

    if (view === 'month') {
        const firstDayOfMonth = startOfMonth(currentDate);
        const lastDayOfMonth = endOfMonth(currentDate);
        const firstVisibleDay = startOfWeek(firstDayOfMonth);
        const lastVisibleDay = endOfWeek(lastDayOfMonth);

        start = firstVisibleDay;
        end = lastVisibleDay;
    } else if (view === 'week') {

        start = startOfWeek(currentDate);
        end = endOfWeek(currentDate);
    } else if (view === 'day') {
        start = startOfDay(currentDate);
        end = endOfDay(currentDate);
    } else {
        // Agenda view (por defecto 4 días en muchas configuraciones)
        start = currentDate;
        end = addDays(currentDate, 4);
    }

    if (!!start) start.setHours(0, 0, 0, 0);
    if (!!end) end.setHours(23, 59, 59, 999);

    return { start, end };
}; // getInitialRange

export default getInitialRange;