import { Col, ListGroup, Row } from "react-bootstrap"
import { useOrganizationsStore } from "../../../hooks/useOrganizationsStore";
import { useEffect, useState } from "react";
import { AryFormikSelectInput } from "../../../components/Forms";
import { useAppFormsStore } from "../../../hooks/useAppFormsStore";
import enums from "../../../helpers/enums";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuilding, faTrashCan, faUsers } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { setSitesList, useAppFormController } from "../context/appFormContext";

const AppFormEditSites = ({ ...props }) => {
    const [ controller, dispatch ] = useAppFormController();
    const { sitesList } = controller;
    const { DefaultStatusType} = enums();

    // CUSTOM HOOKS

    const {
        organization
    } = useOrganizationsStore();

    const {
        appForm,
        siteAddAsync,
        siteDelAsync,
    } = useAppFormsStore();

    // HOOKS

    const [siteSelected, setSiteSelected] = useState(null);
    // const [sitesList, setSitesList] = useState(sitesListRef.current);
    const [disabledButtons, setDisabledButtons] = useState(false);

    // useEffect(() => {
    //     // console.log('AppFormEditSites: useEffect: void'); 
    //     if (!!appForm && !!appForm.Sites && appForm.Sites.length > 0) {
    //         setSitesList(dispatch, appForm.Sites
    //             .map(site => (
    //                 { 
    //                     ID: site.ID, 
    //                     Description: site.Description,
    //                     Address: site.Address,
    //                     EmployeesCount: site.EmployeesCount,
    //                     Status: site.Status,
    //                 }
    //             ))
    //         );
    //     }
    // }, []);

    // METHODS

    const onSiteSelected = (e) => {
        setSiteSelected(e.target.value);
    };

    const onClickAdd = () => {
        setDisabledButtons(true);
        siteAddAsync(siteSelected)
            .then(data => {
                console.log('onClickAdd', data);
                if (!!data) {
                    const mySite = organization.Sites.find(i => i.ID == siteSelected);

                    if(!!mySite) {
                        setSitesList(dispatch,[
                            ...sitesList,
                            { 
                                ID: mySite.ID, 
                                Description: mySite.Description,
                                Address: mySite.Address,
                                EmployeesCount: mySite.EmployeesCount,
                                Status: mySite.Status,
                            },
                        ]);
                    }
                    setSiteSelected(null);
                }
            }).catch(err => {
                console.log('onClickAdd', err);
                Swal.fire('Add site', err, 'error');
            });
        setDisabledButtons(false);
    }; // onClickAdd

    const onClickRemove = (id) => {
        setDisabledButtons(true);
        siteDelAsync(id)
            .then(data => {
                console.log('onClickRemove', data);
                if (!!data) {
                    setSitesList(dispatch, sitesList.filter(i => i.ID != id));
                }
            })
            .catch(err => {
                console.log('onClickAdd', err);
                Swal.fire('Remove site', err, 'error');
            });
        setDisabledButtons(false);
    } // onClickRemove

    return (
        <Row {...props}>
            <Col xs="8" sm="10">
                <label className="form-label">Sites</label>
                <select 
                    className="form-select" 
                    value={siteSelected ?? ''} 
                    onChange={onSiteSelected}
                >
                    <option value="">(select a site)</option>
                    {
                        !!organization.Sites && organization.Sites.length > 0 && organization.Sites.map(site => (
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
                        disabled={disabledButtons}
                    >
                        Add
                    </button>
                </div>
            </Col>
            <Col xs="12">
                {
                    !!sitesList && sitesList.length > 0 && 
                    <ListGroup variant="flush" className="mb-3">
                        {
                            sitesList
                                .sort((a, b) => a.Description.localeCompare(b.Description))
                                .map(item => 
                                    <ListGroup.Item key={item.ID} className="bg-transparent border-0 py-1 ps-0 text-xs">
                                        <div className='d-flex justify-content-between align-items-center'>
                                            <span>
                                                <span className="text-dark font-weight-bold">
                                                    {item.Description}
                                                </span>
                                                <span className="text-secondary ms-2">
                                                    <FontAwesomeIcon icon={ faBuilding } className="me-1" />
                                                    {item.Address}
                                                </span>
                                                <span className="text-secondary ms-2">
                                                    <FontAwesomeIcon icon={ faUsers } className="me-1" />
                                                    {item.EmployeesCount}
                                                </span>
                                            </span>
                                            <button
                                                type="button"
                                                className="btn btn-link p-0 mb-0 text-secondary"
                                                onClick={() => onClickRemove(item.ID)}
                                                title="Delete"
                                                disabled={disabledButtons}
                                            >
                                                <FontAwesomeIcon icon={faTrashCan} size="lg" />
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