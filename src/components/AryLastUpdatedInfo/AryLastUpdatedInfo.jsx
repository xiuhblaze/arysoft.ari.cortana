import { format, formatDistanceToNow } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";

import { ListGroup } from "react-bootstrap";

const AryLastUpdatedInfo = ({ item, ...props }) => {
    // const timeZone = 'America/Mexico_City';
    // const createdGMTFormat = (new Date(created)).toGMTString();
    // const createdLocalDate = utcToZonedTime(createdFormat, timeZone); // new Date(createdGMTFormat);

    // const created = item.Created instanceof Date ? new Date(item.Created) : null;
    // const updated = item.Updated instanceof Date ? new Date(item.Updated) : null;

    const created = new Date(item.Created);
    const updated = new Date(item.Updated);

    let createdLocalDate = null;
    let updatedLocalDate = null;

    if (!!created) {
        const createdFormat = new Date(created);
        const createdOffset = createdFormat.getTimezoneOffset();    
        createdLocalDate = new Date(createdFormat.getTime() - createdOffset * 60000);
    }

    if (!!updated) {
        const updatedFormat = new Date(updated);
        const updatedOffset = updatedFormat.getTimezoneOffset();
        updatedLocalDate = new Date(updatedFormat.getTime() - updatedOffset * 60000);
    }

    return (
        <ListGroup {...props}>
            <ListGroup.Item
                className="border-0 py-0 ps-0 text-xs"
                title={!!created ? format(createdLocalDate, "dd/MM/yyyy HH:mm:ss"): '00-00-00'}
            >
                <strong className="me-2">Created:</strong>
                { !!created ? formatDistanceToNow(createdLocalDate) : '(unknow)'}
            </ListGroup.Item>
            <ListGroup.Item
                className="border-0 py-0 ps-0 text-xs"
                title={!!updated ? format(new Date(updatedLocalDate), "dd/MM/yyyy HH:mm:ss") : '00-00-00'}
            >
                <strong className="me-2">Last updated:</strong>
                { !!updated ? formatDistanceToNow(new Date(updatedLocalDate)) : '(unknow)'}
            </ListGroup.Item>
            <ListGroup.Item className="border-0 py-0 ps-0 text-xs">
                <strong className="me-2">By:</strong>
                {item.UpdatedUser}
            </ListGroup.Item>
        </ListGroup>
    )
}

export default AryLastUpdatedInfo;