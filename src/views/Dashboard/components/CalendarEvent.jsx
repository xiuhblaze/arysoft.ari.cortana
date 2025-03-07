import AuditEditItem from "../../audits/components/AuditEditItem"

const CalendarEvent = (props) => {

    // console.log('props', props);

    return (
        <div className="d-flex justify-content-between align-items-center">
            <div>
                <h6 className="text-white text-sm font-weight-bold mb-0">{props.event.title}</h6>
                <p className="text-light text-xs mb-0">{props.event.notes}</p>
            </div>
            <AuditEditItem 
                id={ props.event.audit.ID } 
                iconClassName="text-white"
                onClose={ () => console.log('onClose') }
            />
        </div>
    )
}

export default CalendarEvent