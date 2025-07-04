import { useEffect, useState } from "react";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";

import enums from "../../../helpers/enums";
import envVariables from "../../../helpers/envVariables";
import { ViewLoading } from "../../../components/Loaders";

import DetailsModal from "./DetailsModal";
import { useOrganizationsStore } from "../../../hooks/useOrganizationsStore";
import AryTableSortIcon from "../../../components/AryTableSortIcon/AryTableSortIcon";
import OrganizationsTableItem from "./OrganizationsTableItem";

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

const OrganizationsTableList = ({ applicantsOnly = false, ...props }) => {
    const headStyle = 'text-uppercase text-secondary text-xxs font-weight-bolder';
    const { OrganizationOrderType } = enums();
    const { 
        ORGANIZATIONS_OPTIONS,
        APPLICANTS_OPTIONS,
     } = envVariables();
     const SEARCH_OPTIONS = applicantsOnly
        ? APPLICANTS_OPTIONS
        : ORGANIZATIONS_OPTIONS;
    
    // CUSTOM HOOKS
    
    const {
        isOrganizationsLoading,
        organizations,
        organizationsAsync,
        organizationAsync,
    } = useOrganizationsStore();
    
    // HOOKS
    
    const [showModal, setShowModal] = useState(false);
    const [currentOrder, setCurrentOrder] = useState(OrganizationOrderType.name);

    useEffect(() => {
        if (!!organizations) {
            const savedSearch = JSON.parse(localStorage.getItem(SEARCH_OPTIONS)) || null;
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

    const onClickOrderList = (order = OrganizationOrderType.name) => {
        const savedSearch = JSON.parse(localStorage.getItem(SEARCH_OPTIONS)) || null;
        const search = {
            ...savedSearch,
            order: order
        }

        organizationsAsync(search);
        localStorage.setItem(SEARCH_OPTIONS, JSON.stringify(search));
    };

    return (
        <>
            {
                isOrganizationsLoading ? (
                    <ViewLoading />
                ) : !!organizations ? (
                    <div className="table-responsive p-0" style={{
                        maxHeight: '65vh',
                        overflowY: 'auto'
                    }}>
                        <table className="table align-items-center mb-0">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>
                                        <div className="d-flex justify-content-between align-items-center gap-1">
                                            <div className="d-flex flex-row gap-1">
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
                                                    {
                                                        applicantsOnly
                                                            ? 'Applicant'
                                                            : 'Organization'
                                                    }
                                                </div>
                                            </div>
                                            {
                                                !applicantsOnly &&
                                                <div className="d-flex flex-row gap-1">
                                                    <SortItem
                                                        activeAsc={currentOrder === OrganizationOrderType.folderFolio}
                                                        activeDesc={currentOrder === OrganizationOrderType.folderFolioDesc}
                                                        onOrderAsc={() => { onClickOrderList(OrganizationOrderType.folderFolio) }}
                                                        onOrderDesc={() => { onClickOrderList(OrganizationOrderType.folderFolioDesc) }}
                                                    />
                                                    <div className={headStyle}>
                                                        Folder
                                                    </div>
                                                </div>
                                            } 
                                        </div>
                                    </th>
                                    <th className={headStyle}>Info</th>
                                    <th className={headStyle}>Contact</th>
                                    { applicantsOnly ? null : <th className={headStyle}>Next audit</th> }
                                    <th className={headStyle}>Standards</th>
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
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    organizations.map(item => 
                                        <OrganizationsTableItem 
                                            key={ item.ID } 
                                            item={ item }
                                            applicantsOnly={ applicantsOnly }
                                            onShowModal={ () => onShowModal(item.ID) }
                                        />
                                    )
                                }
                            </tbody>
                        </table>
                    </div>
                ) : null
            }
            <DetailsModal show={showModal} onHide={onCloseModal} />
        </>
    )
}

export default OrganizationsTableList