import { useState } from "react";

import { Col, ListGroup, Row } from "react-bootstrap"
import { faBuilding, faSpinner, faTrashCan, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppFormsStore } from "../../../hooks/useAppFormsStore";
import Swal from "sweetalert2";

import { setSitesList, useAppFormController } from "../context/appFormContext";
import { useSitesStore } from "../../../hooks/useSiteStore";
import enums from "../../../helpers/enums";

const AppFormEditSites = ({ readonly = false, ...props }) => {
    const [ controller, dispatch ] = useAppFormController();
    const { sitesList } = controller;
    const { DefaultStatusType} = enums();

    // CUSTOM HOOKS

    const { sites } = useSitesStore(); // Este viene cargado desde OrganizationEditView
    const {
        siteAddAsync,
        siteDelAsync,
    } = useAppFormsStore();

    // HOOKS

    const [siteSelected, setSiteSelected] = useState(null);    
    const [isAdding, setIsAddging] = useState(false); 
    const [isDeleting, setIsDeleting] = useState(null);
    
    // METHODS

    const onSiteSelected = (e) => {
        setSiteSelected(e.target.value);
    };

    const onClickAdd = () => {

        if (readonly) { return; }

        setIsAddging(true);
        siteAddAsync(siteSelected)
            .then(data => {
                if (!!data) {
                    const mySite = sites.find(i => i.ID == siteSelected);

                    if(!!mySite) {
                        setSitesList(dispatch,[
                            ...sitesList,
                            mySite,
                        ]);
                    }
                    setSiteSelected(null);
                }
                setIsAddging(false);
            }).catch(err => {
                console.log('onClickAdd', err);
                Swal.fire('Add site', err, 'error');
                setIsAddging(false);
            });
        
    }; // onClickAdd

    const onClickRemove = (id) => {

        if (readonly) { return; }

        setIsDeleting(id);
        siteDelAsync(id)
            .then(data => {
                if (!!data) {
                    setSitesList(dispatch, sitesList.filter(i => i.ID != id));
                }
                setIsDeleting(null);
            })
            .catch(err => {
                console.log('onClickRemove', err);
                Swal.fire('Remove site', err, 'error');
                setIsDeleting(null);
            });        
    } // onClickRemove

    return (
        <Row {...props}>
            {
                readonly ? (
                    <Col xs="8" sm="10">
                        <label className="form-label">Sites</label>
                    </Col>
                ) : (
                <>
                    <Col xs="8" sm="10">
                        <label className="form-label">Sites</label>
                        <select 
                            className="form-select" 
                            value={siteSelected ?? ''} 
                            onChange={onSiteSelected}
                            disabled={ isAdding || isDeleting || readonly }
                        >
                            <option value="">(select a site)</option>
                            {
                                !!sites && sites.length > 0 && sites.map(site => ( 
                                    <option 
                                        key={site.ID} 
                                        value={site.ID}
                                        disabled={ site.Status != DefaultStatusType.active }
                                    >
                                        {site.Description}
                                    </option>
                                ))
                            }
                        </select>
                    </Col>
                    <Col xs="4" sm="2">
                        <div className="d-grid gap-1 align-items-end">
                            <label className="form-label">&nbsp;</label>
                            <button type="button"
                                className="btn btn-link text-dark px-2"
                                onClick={onClickAdd}
                                disabled={isAdding || readonly}
                            >
                                { isAdding ? <FontAwesomeIcon icon={ faSpinner } spin /> : 'ADD' }
                            </button>
                        </div>
                    </Col>
                </>
            )}
            <Col xs="12">
                {
                    !!sitesList && sitesList.length > 0 && 
                    <ListGroup variant="flush" className="mb-3">
                        {
                            sitesList
                                .map(item => 
                                    <ListGroup.Item key={item.ID} 
                                        className={`bg-transparent border-0 py-1 px-0 text-xs${ item.Status != DefaultStatusType.active ? ' opacity-6' : ''}`}
                                        title={ item.Status != DefaultStatusType.active ? 'Inactive' : '' }
                                    >
                                        <div className='d-flex justify-content-between align-items-center'>
                                            <span className="d-flex flex-row flex-wrap align-items-center">
                                                <span className="text-dark font-weight-bold">
                                                    {item.Description}
                                                </span>
                                                <span className="text-secondary ms-2">
                                                    <FontAwesomeIcon icon={ faBuilding } className="me-1" />
                                                    {item.Address}
                                                </span>
                                                <span className="text-secondary ms-2">
                                                    <FontAwesomeIcon icon={ faUsers } className="me-1" />
                                                    Employees {item.EmployeesCount}
                                                </span>
                                            </span>
                                            <button
                                                type="button"
                                                className="btn btn-link px-1 py-0 mb-0 text-secondary"
                                                onClick={() => onClickRemove(item.ID)}
                                                title="Delete"
                                                disabled={isDeleting == item.ID || readonly}
                                            >
                                                {
                                                    isDeleting == item.ID 
                                                        ? <FontAwesomeIcon icon={ faSpinner } spin />
                                                        : <FontAwesomeIcon icon={ faTrashCan } size="lg" />
                                                }                                                
                                            </button>
                                        </div>
                                    </ListGroup.Item>
                                )
                        }
                    </ListGroup>
                }
            </Col>
        </Row>
    )
}

export default AppFormEditSites