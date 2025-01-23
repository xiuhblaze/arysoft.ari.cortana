import { Card, ListGroup, Spinner } from "react-bootstrap"
import EditContactModal from "./EditContactModal"
import { useContactsStore } from "../../../hooks/useContactStore"
import { useEffect } from "react";
import { useOrganizationsStore } from "../../../hooks/useOrganizationsStore";
import enums from "../../../helpers/enums";
import Swal from "sweetalert2";

import defaultProfile from '../../../assets/img/phoDefaultProfile.jpg';
import envVariables from "../../../helpers/envVariables";
import { checkFileExists } from "../../../helpers/checkFileExists";
import isNullOrEmpty from "../../../helpers/isNullOrEmpty";

const ContactsCard = ({ readOnly = false, ...props }) => {
    const statusStyle = [
        'bg-light opacity-6',
        '',
        'opacity-6',
        'bg-light opacity-6',
    ];
    const { ContactOrderType } = enums();
    const { 
        VITE_FILES_URL,
        URL_ORGANIZATION_FILES,
    } = envVariables();

    // CUSTOM HOOKS

    const {
        organization
    } = useOrganizationsStore();

    const {
        isContactsLoading,
        contacts,
        contactsAsync,
        contactsErrorMessage,
    } = useContactsStore();
    
    // HOOKS

    useEffect(() => {
        if (!!organization) {
            contactsAsync({
                organizationID: organization.ID,
                pageSize: 0,
                order: ContactOrderType.isMainContactDesc,
            })
        }
    }, [organization]);

    useEffect(() => {
        if (!!contactsErrorMessage) {
            Swal.fire('Contacts', contactsErrorMessage, 'error');
        }
    }, [contactsErrorMessage]);
    

    return (
        <Card {...props} className="h-100">
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
                    ) : !!contacts && !!organization ? (
                        <ListGroup style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            {
                                contacts.map( item => {
                                    const url = `${VITE_FILES_URL}${URL_ORGANIZATION_FILES}/${organization.ID}/contacts/${item.ID}`;
                                    const fileName = !!item.PhotoFilename // && checkFileExists(`${url}/${ item.PhotoFilename }`)
                                        ? `${url}/${ item.PhotoFilename }`
                                        : defaultProfile ;
                                    const itemStyle= `border-0 d-flex justify-content-between align-items-center px-0 mb-2 ${ statusStyle[item.Status] }`;
                                    
                                    return (
                                        <ListGroup.Item key={ item.ID }
                                            className={ itemStyle }
                                            title={ item.IsMainContact ? 'Is main contact' : '' }
                                        >
                                            <div className="d-flex align-items-top me-2">
                                                <div className="avatar me-3" style={{ minWidth: '48px' }}>
                                                    <img className="border-radius-md shadow" src={ fileName } />
                                                </div>
                                                <div className="d-flex align-items-start flex-column justify-content-center">
                                                    <h6 className={ `mb-0 text-sm ${ item.IsMainContact ? 'text-info text-gradient' : '' }` }>{ item.FullName }</h6>
                                                    { !isNullOrEmpty(item.Position) 
                                                        && <p className="text-xs font-weight-bold mb-0">{ item.Position }</p> 
                                                    }
                                                    <p className="mb-0 text-xs d-flex flex-column gap-1">
                                                        { 
                                                            !!item.Email ? (
                                                                <a className={ item.IsMainContact ? 'text-dark' : 'text-secondary' } href={`mailto:${item.Email}`} title="Send mail">{ item.Email }</a>
                                                            ) : null
                                                        }
                                                        {
                                                            !!item.Phone ? (
                                                                <a className={ item.IsMainContact ? 'text-dark' : 'text-secondary' } href={`tel:${ item.Phone }`} title="Use to call">{ item.Phone }</a>
                                                            ) : null
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                            <div>
                                                { !readOnly && <EditContactModal id={ item.ID } /> }
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