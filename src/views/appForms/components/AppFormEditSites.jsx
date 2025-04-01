import { Col, ListGroup, Row } from "react-bootstrap"
import { useOrganizationsStore } from "../../../hooks/useOrganizationsStore";
import { useEffect, useState } from "react";
import { AryFormikSelectInput } from "../../../components/Forms";
import { useAppFormsStore } from "../../../hooks/useAppFormsStore";
import enums from "../../../helpers/enums";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

const AppFormEditSites = ({ onChange, ...props }) => {

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
    const [sitesList, setSitesList] = useState([]);
    const [disabledButtons, setDisabledButtons] = useState(false);

    useEffect(() => {
        console.log('AppFormEditSites: useEffect: void'); //! AQUI VOY - No mantiene el state si se cambia de Step :/
        if (!!appForm && !!appForm.Sites && appForm.Sites.length > 0) {
            setSitesList(appForm.Sites
                .map(site => (
                    { 
                        ID: site.ID, 
                        Description: site.Description,
                        Address: site.Address,
                        EmployeesCount: site.EmployeesCount,
                        Status: site.Status,
                    }
                ))
            );
        }
    }, []);
    

    // METHODS

    const onSiteSelected = (e) => {
        setSiteSelected(e.target.value);
    };

    const onClickAdd = () => {
        setDisabledButtons(true);
        console.log('onClickAdd', siteSelected);

        const mySite = organization.Sites.find(i => i.ID == siteSelected);
        console.log('mySite', mySite);

        if(!!mySite) {
            setSitesList([
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

        setDisabledButtons(false);
    }; // onClickAdd

    const onClickRemove = (id) => {
        console.log('onClickRemove', id);
    } // onClickRemove

    return (
        <Row {...props}>
            <Col xs="8" sm="9">
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
            <Col xs="4" sm="3">
                <div className="d-grid gap-1 align-items-end">
                    <label className="form-label">&nbsp;</label>
                    <button type="button"
                        className="btn bg-gradient-secondary text-white"
                        onClick={onClickAdd}
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
                                                    {item.Address}
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