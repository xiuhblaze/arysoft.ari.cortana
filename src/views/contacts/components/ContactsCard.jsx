import { Card, ListGroup, Spinner } from "react-bootstrap"
import EditContactModal from "./EditContactModal"
import { useContactsStore } from "../../../hooks/useContactStore"
import { useEffect } from "react";
import { useOrganizationsStore } from "../../../hooks/useOrganizationsStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";


const ContactsCard = ({ readOnly = false, ...props }) => {
    const statusStyle = [
        'bg-light opacity-6',
        '',
        'opacity-6',
        'bg-light opacity-6',
    ];

    // CUSTOM HOOKS

    const {
        organization
    } = useOrganizationsStore();

    const {
        isContactsLoading,
        contacts,
        contactsAsync
    } = useContactsStore();

    // HOOKS

    useEffect(() => {
        if (!!organization) {
            contactsAsync({
                organizationID: organization.ID,
                pageSize: 0,
            })
        }
    }, [organization]);

    
    
    

    return (
        <Card className="h-100">
            <Card.Header className="pb-0 p-3">
                <div className="d-flex justify-content-between align-items-center">
                    <h6 className="mb-0">Contacts</h6>
                    {
                        !readOnly ? (
                            <EditContactModal />
                        ) : null
                    }
                </div>
            </Card.Header>
            <Card.Body className="p-3">
                {
                    isContactsLoading ? (
                        <Spinner animation="border" variant="secondary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    ) : !!contacts ? (
                        <ListGroup style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            {
                                contacts.map( item => {
                                    const fileName = `/files/contacts/${ item.PhotoFilename ?? 'nocontactphoto.png' }`;
                                    const itemStyle= `border-0 d-flex justify-content-between align-items-center px-0 mb-2 ${ statusStyle[item.Status] }`;

                                    return (
                                        <ListGroup.Item key={ item.ID }
                                            className={ itemStyle }
                                        >
                                            <div className="d-flex align-items-center me-2">
                                                <div className="avatar me-3">
                                                    <img className="border-radius-lg shadow" src={ fileName } />
                                                </div>
                                                <div className="d-flex align-items-start flex-column justify-content-center">
                                                    <h6 className="mb-0 text-sm">{ item.FullName }</h6>
                                                    <p className="mb-0 text-xs d-flex flex-column">
                                                        { 
                                                            !!item.Email ? (
                                                                <a className="text-secondary" href={`mailto:${item.Email}`}>{ item.Email }</a>
                                                            ) : null
                                                        }
                                                        {
                                                            !!item.Phone ? (
                                                                <a className="text-secondary" href={`tel:${ item.Phone }`}>{ item.Phone }</a>
                                                            ) : null
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                            <div>
                                                <EditContactModal id={ item.ID } />
                                            </div>
                                            
                                        </ListGroup.Item>
                                    )
                                })
                            }
                        </ListGroup>
                    ) : null
                }
                <ListGroup>

                </ListGroup>
            </Card.Body>
        </Card>
    )
}

export default ContactsCard