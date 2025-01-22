import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuilding, faCaretDown, faCaretUp, faClone, faEdit, faEnvelope, faGlobe, faPhone, faUser } from "@fortawesome/free-solid-svg-icons";

import enums from "../../../helpers/enums";
import envVariables from "../../../helpers/envVariables";
import getFriendlyDate from "../../../helpers/getFriendlyDate";
import { ViewLoading } from "../../../components/Loaders";

import Status from "./Status";
import DetailsModal from "./DetailsModal";
import { useOrganizationsStore } from "../../../hooks/useOrganizationsStore";
import AryTableSortIcon from "../../../components/AryTableSortIcon/AryTableSortIcon";
import OrganizationTableItem from "./OrganizationTableItem";
import { Modal } from "react-bootstrap";

const SortItem = ({ activeAsc, activeDesc, onOrderAsc, onOrderDesc, ...props }) => {
    return (
        <div {...props} className="d-flex flex-row">
            <AryTableSortIcon
                icon={faCaretUp}
                isActive={activeAsc}
                title="Ascending"
                onClick={onOrderAsc}
            />
            <AryTableSortIcon
                icon={faCaretDown}
                isActive={activeDesc}
                title="Descending"
                onClick={onOrderDesc}
            />
        </div>
    );
};

const OrganizationsTableList = () => {
    const headStyle = 'text-uppercase text-secondary text-xxs font-weight-bolder';
    const { OrganizationStatusType, OrganizationOrderType } = enums();
    const { 
        ORGANIZATIONS_OPTIONS,
        VITE_FILES_URL,
        URL_ORGANIZATION_FILES,
     } = envVariables();
    
    // CUSTOM HOOKS
    
    const {
        isOrganizationsLoading,
        organizations,
        organizationsAsync,
        organizationAsync,
    } = useOrganizationsStore();
    
    // HOOKS
    
    const [showModal, setShowModal] = useState(false);
    const [showQRModal, setShowQRModal] = useState(false);
    const [qrValues, setQRValues] = useState(null);
    const [currentOrder, setCurrentOrder] = useState(OrganizationOrderType.name);

    useEffect(() => {
        if (!!organizations) {
            const savedSearch = JSON.parse(localStorage.getItem(ORGANIZATIONS_OPTIONS)) || null;
            setCurrentOrder(savedSearch?.order ?? OrganizationOrderType.name);
        }
    }, [organizations]);

    // METHODS

    const onShowModal = (id) => {
        setShowModal(true);
        organizationAsync(id);
    }

    const onCloseModal = () => {
        setShowModal(false);
    };

    const onShowQRModal = (values) => {
        setQRValues(values);
        setShowQRModal(true);
    }

    const onCloseQRModal = () => {
        setShowQRModal(false);
    };

    const onClickOrderList = (order = OrganizationOrderType.name) => {
        const savedSearch = JSON.parse(localStorage.getItem(ORGANIZATIONS_OPTIONS)) || null;
        const search = {
            ...savedSearch,
            order: order
        }

        organizationsAsync(search);
        localStorage.setItem(ORGANIZATIONS_OPTIONS, JSON.stringify(search));
    };

    return (
        <>
            {isOrganizationsLoading ? (
                <ViewLoading />
            ) : !!organizations ? (
                <div className="table-responsive p-0">
                    <table className="table align-items-center mb-0">
                        <thead>
                            <tr>
                                <th>
                                    <div className="d-flex justify-content-start align-items-center gap-1">
                                        <SortItem
                                            activeAsc={currentOrder === OrganizationOrderType.folio}
                                            activeDesc={currentOrder === OrganizationOrderType.folioDesc}
                                            onOrderAsc={() => { onClickOrderList(OrganizationOrderType.folio) }}
                                            onOrderDesc={() => { onClickOrderList(OrganizationOrderType.folioDesc) }}
                                        />
                                        <div className={headStyle}>
                                            Folio 
                                        </div>
                                        <SortItem
                                            activeAsc={currentOrder === OrganizationOrderType.name}
                                            activeDesc={currentOrder === OrganizationOrderType.nameDesc}
                                            onOrderAsc={() => { onClickOrderList(OrganizationOrderType.name) }}
                                            onOrderDesc={() => { onClickOrderList(OrganizationOrderType.nameDesc) }}
                                        />
                                        <div className={headStyle}>
                                            Organization
                                        </div>
                                    </div>
                                </th>
                                <th className={headStyle}>Info</th>
                                <th className={headStyle}>Contact</th>
                                <th className={headStyle}>Sites</th>
                                <th className="d-flex justify-content-start align-items-center gap-1">
                                    <SortItem
                                        activeAsc={currentOrder === OrganizationOrderType.certificatesValidityStatus}
                                        activeDesc={currentOrder === OrganizationOrderType.certificatesValidityStatusDesc}
                                        onOrderAsc={() => { onClickOrderList(OrganizationOrderType.certificatesValidityStatus) }}
                                        onOrderDesc={() => { onClickOrderList(OrganizationOrderType.certificatesValidityStatusDesc) }}
                                    />
                                    <div className={headStyle}>
                                        Certificates
                                    </div>
                                </th>
                                <th className={headStyle}>QR</th>
                                <th>
                                    <div className="d-flex justify-content-center align-items-center gap-1">
                                        <SortItem
                                            activeAsc={currentOrder === OrganizationOrderType.status}
                                            activeDesc={currentOrder === OrganizationOrderType.statusDesc}
                                            onOrderAsc={() => { onClickOrderList(OrganizationOrderType.status) }}
                                            onOrderDesc={() => { onClickOrderList(OrganizationOrderType.statusDesc) }}
                                        />
                                        <div className={headStyle}>
                                            Status
                                        </div>
                                    </div>
                                </th>
                                <th className={`${headStyle} text-center`}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                organizations.map(item => 
                                    <OrganizationTableItem 
                                        key={ item.ID } 
                                        item={ item }
                                        onShowModal={ () => onShowModal(item.ID) }
                                        onShowQRModal={ () => onShowQRModal({ID: item.ID, QRFile: item.QRFile}) }
                                    />
                                )
                            }
                        </tbody>
                    </table>
                </div>
            ) : null
            }
            <DetailsModal show={showModal} onHide={onCloseModal} />
            <Modal show={showQRModal} onHide={onCloseQRModal} centered>
                <Modal.Body>
                    <div className="d-flex justify-content-center align-items-center py-5">
                        { !!qrValues &&
                            <img 
                                src={`${VITE_FILES_URL}${URL_ORGANIZATION_FILES}/${qrValues.ID}/${qrValues.QRFile}`} 
                                alt="QR code"
                                className="img-fluid w-50"
                            />
                        }
                    </div>
                    <div className="d-flex justify-content-end align-items-center mt-3">
                        <button type="button" className="btn btn-link text-secondary mb-0" onClick={onCloseQRModal}>
                            Close
                        </button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default OrganizationsTableList