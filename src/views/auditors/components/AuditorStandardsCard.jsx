import { useAuditorsStore } from '../../../hooks/useAuditorsStore';
import { Card, ListGroup } from 'react-bootstrap';
import { ViewLoading } from '../../../components/Loaders';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLandmark, faStickyNote } from '@fortawesome/free-solid-svg-icons';
import isNullOrEmpty from '../../../helpers/isNullOrEmpty';
import AuditorStandardCardItem from './AuditorStandardCardItem';

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
                        <FontAwesomeIcon icon={ faLandmark } size="lg" className="text-info me-2" />
                        Standards
                    </h5>
                </div>
            </Card.Header>
            <Card.Body className="p-3"> 
                {
                    isAuditorLoading ? ( 
                        <ViewLoading /> 
                    ) : !!auditor && auditor.Standards != null && auditor.Standards.length > 0 ? (
                        <>
                            <ListGroup className="mb-3">
                                {
                                    auditor.Standards.map(item => (
                                        <AuditorStandardCardItem
                                            key={item.ID}
                                            item={item}
                                            readOnly={ readOnly }
                                        />
                                    ))
                                    //     <div key={item.ID}>
                                    //         <ListGroup.Item className="border-0 ps-0 pt-0 text-sm">
                                    //             <div className="d-flex justify-content-between align-items-center me-2">
                                    //                 <div>
                                    //                     <h6 className="text-sm mb-0">
                                    //                         { item.StandardName }
                                    //                     </h6>
                                    //                     <p className="text-xs text-secondary mb-0">
                                    //                         { item.StandardDescription }
                                    //                     </p>
                                    //                 </div>
                                    //                 { !isNullOrEmpty(item.Comments) && 
                                    //                     <FontAwesomeIcon icon={ faStickyNote}
                                    //                         size="lg"
                                    //                         className="text-warning"
                                    //                         title={ item.Comments }
                                    //                     />
                                    //                 }
                                    //             </div>
                                    //         </ListGroup.Item>
                                    //     </div>
                                    // ))
                                }
                            </ListGroup>
                        </>
                    ) : null
                }
            </Card.Body>
        </Card>
    )
}

export default AuditorStandardsCard