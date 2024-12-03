import { format, formatDistanceToNow } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";

import { ListGroup } from "react-bootstrap";

const AryLastUpdatedInfo = ({ created, updated, updatedUser }) => {
    // const timeZone = 'America/Mexico_City';
    // const createdGMTFormat = (new Date(created)).toGMTString();
    // const createdLocalDate = utcToZonedTime(createdFormat, timeZone); // new Date(createdGMTFormat);

    const createdFormat = new Date(created);
    const createdOffset = createdFormat.getTimezoneOffset();    
    const createdLocalDate = new Date(createdFormat.getTime() - createdOffset * 60000);

    const updatedFormat = new Date(updated);
    const updatedOffset = updatedFormat.getTimezoneOffset();
    const updatedLocalDate = new Date(updatedFormat.getTime() - updatedOffset * 60000);

    return (
        <ListGroup>
            <ListGroup.Item
                className="border-0 py-0 ps-0 text-xs"
                title={format(createdLocalDate, "dd/MM/yyyy HH:mm:ss")}
            >
                <strong className="me-2">Created:</strong>
                {formatDistanceToNow(createdLocalDate)}
            </ListGroup.Item>
            <ListGroup.Item
                className="border-0 py-0 ps-0 text-xs"
                title={format(new Date(updatedLocalDate), "dd/MM/yyyy HH:mm:ss")}
            >
                <strong className="me-2">Last updated:</strong>
                {formatDistanceToNow(new Date(updatedLocalDate))}
            </ListGroup.Item>
            <ListGroup.Item className="border-0 py-0 ps-0 text-xs">
                <strong className="me-2">By:</strong>
                {updatedUser}
            </ListGroup.Item>
        </ListGroup>
    )
}

export default AryLastUpdatedInfo;