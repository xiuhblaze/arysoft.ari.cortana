import { faArrowsSpin } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Nav } from 'react-bootstrap';
import AuditCycleEditItem from './AuditCycleEditItem';
import enums from '../../../helpers/enums';

const AuditCyclesCardItem = ({ item, ...props }) => {
    const { DefaultStatusType } = enums();
    return (
        <Nav.Item { ...props } className="d-flex justify-content-between align-items-center">
            <Nav.Link className="mb-0 px-3 py-1" eventKey={item.ID}>
                <FontAwesomeIcon icon={ faArrowsSpin } className="text-dark" />
                <span className={`${item.Status == DefaultStatusType.active ? 'text-info text-gradient' : ''} mx-2`}>{ item.Name }</span>
            </Nav.Link>
        </Nav.Item>
    )
}

export default AuditCyclesCardItem;