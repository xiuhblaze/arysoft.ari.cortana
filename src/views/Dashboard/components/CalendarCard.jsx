import { useEffect, useState } from "react";
import { ViewLoading } from "../../../components/Loaders";
import { useAuditsStore } from "../../../hooks/useAuditsStore";
import CalendarToolbar from "./CalendarToolbar";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { 
    format,
    parse, 
    startOfWeek, 
    getDay, 
    startOfMonth, 
    startOfDay, 
    endOfDay,
    endOfMonth, 
    endOfWeek, 
    isSameMonth, 
    isWeekend, 
    eachDayOfInterval,
    isSaturday,
    isSunday,
    addDays,
    isBefore,
    isAfter,
    parseISO,
    isEqual
} from "date-fns";
import envVariables from "../../../helpers/envVariables";
import AuditModalEditItem from "../../audits/components/AuditModalEditItem";
import { enUS } from "date-fns/locale";
import CalendarEvent from "./CalendarEvent";
import enums from "../../../helpers/enums";
import auditStepProps from "../../audits/helpers/auditStepProps";
import auditStatusProps from "../../audits/helpers/auditStatusProps";

const locales = {
    'en-US': enUS,
}

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
})

const CalendarCard = () => {
    const CALENDAR_LASTVIEW = 'ari-ariit-dashboard-lastview';

    const {
        DASHBOARD_OPTIONS,
    } = envVariables();

    const {
        AuditOrderType,
        DefaultStatusType
    } = enums();

    // CUSTOM HOOKS

    const {
        isAuditsLoading,
        audits,
        auditsAsync,
    } = useAuditsStore();

    // HOOKS

    const [eventsList, setEventsList] = useState([]);
    const [isEventsLoading, setIsEventsLoading] = useState(false);  
    const [lastview, setLastview] = useState(localStorage.getItem(CALENDAR_LASTVIEW) || 'month');
    const [auditID, setAuditID] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        const {start, end} = getInitialRange();
        const savedSearch = JSON.parse(localStorage.getItem(DASHBOARD_OPTIONS)) || null;
        const newSearch = {
            currentDate: currentDate,
            startDate: start,
            endDate: end,
            pageSize: 0,
            pageNumber: 1,
            order: savedSearch?.order ? savedSearch.order : AuditOrderType.date,
        };
        const search = !!savedSearch ? savedSearch : newSearch;
        
        if (!!search.currentDate) setCurrentDate(new Date(search.currentDate));

        auditsAsync(search);
        localStorage.setItem(DASHBOARD_OPTIONS, JSON.stringify(search));
    }, []);
    
    useEffect(() => {
        if (!!audits) {
            setIsEventsLoading(true);

            const events = getEvents(audits);

            setEventsList(events.map(item => {
                const endDate = new Date(item.EndDate);
                endDate.setHours(23, 59, 59, 999);

                const auditors = item.Auditors
                    .filter(i => i.Status == DefaultStatusType.active)
                    .map(i => i.AuditorName).join(', ');

                const toolTip = item.Description + '\n' 
                    + item.OrganizationName + '\n' 
                    + auditors + '\n' //item.Auditors.map(i => i.AuditorName).join(', ') + '\n'
                    + item.Standards.map(i => {
                        let s = i.StandardName;
                        s += ' - ' + auditStepProps[i.Step].
                        abbreviation.toUpperCase();
                        return s;
                    }).join(', ');

                return {
                    title: toolTip,
                    notes: item.OrganizationName,
                    start: new Date(item.StartDate),
                    end: endDate, // new Date(item.EndDate),
                    bgColor: item.Status == 1 ? '#347CF7' : '#82d616',
                    audit: item,
                    //allDay: true,
                    allDayAccessor: true,
                    // user: {
                    //     id: item.AuditorID,
                    //     name: item.AuditorName
                    // }
                }
            }));

            setIsEventsLoading(false);
        } else {
            setEventsList([]);
        }
    }, [audits]);

    // METHODS

    const getEvents = (auditList) => {
        const events = []; 

        auditList.forEach((item, i) => {
            const intervalDates = eachDayOfInterval({
                start: new Date(item.StartDate),
                end: new Date(item.EndDate)
            });
            
            const hasSaturday = intervalDates.find(date => isSaturday(date)) ?? null; 
            const hasSunday = intervalDates.find(date => isSunday(date)) ?? null;
            
            if (!!hasSaturday && item.IncludeSaturday && !!hasSunday && item.IncludeSunday) {
                events.push(item);
                return;
            }

            if (!!hasSaturday || !!hasSunday) { // ver si se tiene que dividir el evento para mostrarse en el calendario
                
                // crear un nuevo endDate para item y duplicar item con un nuevo startDate omitiendo saturday y sunday
                let newEndDate = new Date(item.EndDate);
                if (!!hasSunday && !item.IncludeSunday) {
                    newEndDate = addDays(new Date(hasSunday), -1)
                }
                if (!!hasSaturday && !item.IncludeSaturday) {
                    newEndDate = addDays(new Date(hasSaturday), -1);
                }

                let newStartDate = new Date(item.StartDate);
                if (!!hasSaturday && !item.IncludeSaturday) {
                    newStartDate = addDays(new Date(hasSaturday), 1);
                }
                if (!!hasSunday && !item.IncludeSunday) {
                    newStartDate = addDays(new Date(hasSunday), 1);
                }

                if (!isEqual(parseISO(newEndDate.toISOString()), parseISO(item.EndDate)) 
                    && (isAfter(parseISO(newEndDate.toISOString()), parseISO(item.StartDate)) 
                    || isEqual(parseISO(newEndDate.toISOString()), parseISO(item.StartDate))
                )) {
                    const newItem = {
                        ...item,
                        EndDate: newEndDate,
                    };
                    events.push(newItem);
                }

                if (!isEqual(parseISO(newStartDate.toISOString()), parseISO(item.StartDate))
                    && (isBefore(parseISO(newStartDate.toISOString()), parseISO(item.EndDate))
                    || isEqual(parseISO(newStartDate.toISOString()), parseISO(item.EndDate))
                )) {  
                    const newItem = {
                        ...item,
                        StartDate: newStartDate,
                    };
                    events.push(newItem);
                }

                if (isEqual(parseISO(newEndDate.toISOString()), parseISO(item.EndDate))
                    && isEqual(parseISO(newStartDate.toISOString()), parseISO(item.StartDate))) {
                    events.push(item);    
                }
            } else { // pasa normal
                events.push(item);
            }
        });

        return events;
    }; // getEvents

    const getInitialRange = () => {
        // Por defecto, calculamos el rango basado en la fecha actual y la vista predeterminada
        const currentDate = new Date();
        const view = lastview; // O la vista que uses por defecto

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

    // Se ejecuta cada que se rendereiza un evento del calendario
    const eventPropGetter = (event, start, end, isSelected) => {
        // console.log('eventPropGetter', event);
        if (!!event) {
            // const style = {
            //     backgroundColor: isSelected ? '#17c1e8' : '#cb0c9f',
            //     backgroundImage: isSelected ? linearGradientPrimary : linearGradientInfo,
            // };
    
            let myClassName = ''; // isSelected ? 'bg-gradient-primary' : 'bg-gradient-info';
            myClassName += ` border-radius-lg`;
            myClassName += ` bg-gradient-${auditStatusProps[event.audit.Status].variant}`;
    
            return {
                className: myClassName,
            }
        }
    }; // eventPropGetter

    // Se ejecuta cada que se renderiza un día del calendario
    const dayPropGetter = (date) => {        
        let myClassName = '';

        if (isWeekend(date)) {
            myClassName += 'bg-gray-100';            
        }

        if (!isSameMonth(date, currentDate)) {
            myClassName += 'bg-gray-200';
            if (isWeekend(date)) {
                myClassName += ' bg-gray-300';
            }
        }

        return {
            className: myClassName,
        };
    }; // dayPropGetter

    /// Se ejecuta cuando cambia el rango de fechas por cualquier motivo
    const onRangeChange = (range) => {
        // El formato de range depende de la vista actual
        // Para 'month' view: range es un array con un solo objeto {start, end}
        // Para 'week' o 'day' view: range es un objeto {start, end}
        // Para 'agenda' view: range es un array de fechas
        
        //consoleLog('Dashboard.onRangeChange(range)', range);

        let startDate, endDate;

        if (Array.isArray(range)) {
            if (range.length === 1) {
                // Vista mensual
                startDate = range[0];
                endDate = range[0];
            } else {
                // Vista agenda
                startDate = range[0];
                endDate = range[range.length - 1];
            }
        } else {
            // Vistas de semana o día
            startDate = range.start;
            endDate = range.end;
        }

        //consoleLog('Dashboard.onRangeChange(startDate, endDate)', startDate, endDate);

        // Actualizamos la consulta de auditorias con el rango de fechas a consultar
        const savedSearch = JSON.parse(localStorage.getItem(DASHBOARD_OPTIONS)) || null;
        const search = {
            ...savedSearch,
            startDate: startDate,
            endDate: endDate,
        };        
        auditsAsync(search);
        localStorage.setItem(DASHBOARD_OPTIONS, JSON.stringify(search));
    }; // onRangeChange

    const onDoubleClick = (event) => {
        // console.log('onDoubleClick', event);

        setAuditID(event.audit.ID);
        setShowModal(true);
    }; // onDoubleClick

    const onSelect = (event) => {
        // consoleLog('onSelect', event);
    }; // onSelect

    const onViewChanged = (event) => {
        // console.log('onViewChanged', event);

        localStorage.setItem(CALENDAR_LASTVIEW, event);
        setLastview(event);
    }; // onViewChanged

    const onNavigate = (date) => {
            // consoleLog('onNavigate', date);
    
            setCurrentDate(date);
    
            // Actualizamos la consulta de auditorias con la fecha base a mostrarse
            const savedSearch = JSON.parse(localStorage.getItem(DASHBOARD_OPTIONS)) || null;
            const search = {
                ...savedSearch,
                currentDate: date,
            };
            localStorage.setItem(DASHBOARD_OPTIONS, JSON.stringify(search));
        };
    
        const onCloseModal = () => {
            setShowModal(false);
    
            const savedSearch = JSON.parse(localStorage.getItem(DASHBOARD_OPTIONS)) || null;
            auditsAsync(savedSearch);
        }; // onCloseModal

    return (
        <div>
            <CalendarToolbar />
            {
                isAuditsLoading || isEventsLoading ? (
                    <ViewLoading />
                ) : (
                    <Calendar
                        date={currentDate}
                        defaultView={lastview}
                        localizer={localizer}
                        events={eventsList}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ 
                            minHeight: '800px',
                            height: 'calc(100vh - 100px)' 
                        }}
                        dayPropGetter={dayPropGetter}
                        eventPropGetter={eventPropGetter}                                        
                        components={{
                            event: CalendarEvent
                        }}
                        onDoubleClickEvent={onDoubleClick}
                        onSelectEvent={onSelect}
                        onView={onViewChanged}
                        onRangeChange={onRangeChange}
                        onNavigate={onNavigate}
                    />
                )
            }
            <AuditModalEditItem
                    id={ auditID }
                    show={showModal}
                    onHide={onCloseModal}
                />
        </div>
    )
};

export default CalendarCard;