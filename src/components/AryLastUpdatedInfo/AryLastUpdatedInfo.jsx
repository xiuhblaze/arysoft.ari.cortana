import { format, formatDistanceToNow } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";

import { ListGroup } from "react-bootstrap";
import aryDateTools from "../../helpers/aryDateTools";

const AryLastUpdatedInfo = ({ item, ...props }) => {

    const {
        getFriendlyDate,
        getLocalDate,
    } = aryDateTools();
    // const timeZone = 'America/Mexico_City';
    // const createdGMTFormat = (new Date(created)).toGMTString();
    // const createdLocalDate = utcToZonedTime(createdFormat, timeZone); // new Date(createdGMTFormat);

    // const created = item.Created instanceof Date ? new Date(item.Created) : null;
    // const updated = item.Updated instanceof Date ? new Date(item.Updated) : null;

    // const created = !!item?.Created ? new Date(item.Created) : null;
    // const updated = !!item?.Updated ? new Date(item.Updated) : null;

    // let createdLocalDate = null;
    // let updatedLocalDate = null;

    // if (!!created) {
    //     const createdFormat = new Date(created);
    //     const createdOffset = createdFormat.getTimezoneOffset();    
    //     createdLocalDate = new Date(createdFormat.getTime() - createdOffset * 60000);
    // }

    // if (!!updated) {
    //     const updatedFormat = new Date(updated);
    //     const updatedOffset = updatedFormat.getTimezoneOffset();
    //     updatedLocalDate = new Date(updatedFormat.getTime() - updatedOffset * 60000);
    // }

    return (
        <ListGroup {...props}>
            <ListGroup.Item
                className="border-0 py-0 ps-0 text-xs"
                title={!!item?.Created ? format(getLocalDate(item.Created), "dd/MM/yyyy HH:mm:ss") : '00-00-00'}
            >
                <strong className="me-2">Created:</strong>
                { !!item?.Created ? getFriendlyDate(item.Created, true) : '(unknow)'} 
            </ListGroup.Item>
            <ListGroup.Item
                className="border-0 py-0 ps-0 text-xs"
                title={!!item?.Updated ? format(getLocalDate(item.Updated), "dd/MM/yyyy HH:mm:ss") : '00-00-00'} 
            >
                <strong className="me-2">Last updated:</strong>
                { !!item?.Updated ? getFriendlyDate(item.Updated, true) : '(unknow)'}
            </ListGroup.Item>
            <ListGroup.Item className="border-0 py-0 ps-0 text-xs">
                <strong className="me-2">By:</strong>
                { !!item?.UpdatedUser ? item.UpdatedUser : '(unknow)' }
            </ListGroup.Item>
        </ListGroup>
    )
}

export default AryLastUpdatedInfo;