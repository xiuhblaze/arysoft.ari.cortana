import { useAuditorsStore } from '../../../hooks/useAuditorsStore';
import { Card, ListGroup } from 'react-bootstrap';
import { ViewLoading } from '../../../components/Loaders';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLandmark } from '@fortawesome/free-solid-svg-icons';
import AuditorStandardCardItem from './AuditorStandardCardItem';
import AuditorStandardEditItem from './AuditorStandardEditItem';

const AuditorStandardsCard = ({ readOnly = false, ...props }) => {
    const titleStyle = "bg-light p-2 border-radius-md mb-2";

    // CUSTOM HOOKS

    const {
        isAuditorLoading,
        auditor,
    } = useAuditorsStore();

    // HOOKS

    // METHODS

    return (
        <Card { ...props }>
            <Card.Header className="pb-0 p-3">
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                        <FontAwesomeIcon icon={ faLandmark } size="lg" className="text-dark me-2" />
                        Standards
                    </h5>
                    { !readOnly && <AuditorStandardEditItem /> }
                </div>
            </Card.Header>
            <Card.Body className="p-3"> 
                {
                    isAuditorLoading ? ( 
                        <ViewLoading /> 
                    ) : !!auditor && auditor.Standards != null && auditor.Standards.length > 0 ? (
                        <ListGroup className="mb-3">
                            {
                                auditor.Standards.map(item => (
                                    <AuditorStandardCardItem
                                        key={item.ID}
                                        item={item}
                                        readOnly={ readOnly }
                                    />
                                ))
                            }
                        </ListGroup>
                    ) : null
                }
            </Card.Body>
        </Card>
    )
}

export default AuditorStandardsCard