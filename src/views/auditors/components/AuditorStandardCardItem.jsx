import { ListGroup } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStickyNote } from '@fortawesome/free-solid-svg-icons'

import AuditorStandardEditItem from './AuditorStandardEditItem'
import enums from '../../../helpers/enums'
import isNullOrEmpty from '../../../helpers/isNullOrEmpty'

const AuditorStandardCardItem = ({ item, readOnly = false, ...props }) => {
    const {
        DefaultStatusType
    } = enums();
    const itemStyle = `border-0 d-flex justify-content-between align-items-center px-0${item.Status == DefaultStatusType.inactive ? ' opacity-6' : ''}`;
    
    return (
        <ListGroup.Item {...props} className={itemStyle}>
                <div>
                    <h6 className="text-sm mb-0">
                        {item.StandardName}
                    </h6>
                    <p className="text-xs text-secondary mb-0">
                        {item.StandardDescription}
                    </p>
                </div>
                <div>
                    <div className="d-flex justify-content-end align-items-center gap-2">
                        {
                            !isNullOrEmpty(item.Comments) 
                                ? <FontAwesomeIcon icon={faStickyNote}
                                    size="lg"
                                    className="text-warning"
                                    title={item.Comments}
                                    />
                                : <FontAwesomeIcon icon={faStickyNote}
                                    size="lg"
                                    className="text-light"
                                    title="No comments"
                                    />
                        }
                        {!readOnly &&
                            <AuditorStandardEditItem
                                auditorStandardID={item.ID}
                            />
                        }
                    </div>
                </div>
        </ListGroup.Item>
    )
}

export default AuditorStandardCardItem