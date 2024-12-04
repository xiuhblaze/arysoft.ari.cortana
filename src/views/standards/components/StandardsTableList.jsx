import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp, faClone, faEdit } from "@fortawesome/free-solid-svg-icons";

import enums from "../../../helpers/enums";
import envVariables from "../../../helpers/envVariables";
import AryTableSortIcon from "../../../components/AryTableSortIcon/AryTableSortIcon";
import { ViewLoading } from "../../../components/Loaders";
import getFriendlyDate from "../../../helpers/getFriendlyDate";
import { useStandardsStore } from "../../../hooks/useStandardsStore";

import DetailsModal from "./DetailsModal";
import Status from "./Status";
import AryDefaultStatusBadge from "../../../components/AryDefaultStatusBadge/AryDefaultStatusBadge";

const StandardsTableList = ({ onOrder }) => {
    const headStyle = 'text-uppercase text-secondary text-xxs font-weight-bolder';
    const { DefaultStatusType, StandardOrderType } = enums();
    const [showModal, setShowModal] = useState(false);
    const [currentOrder, setCurrentOrder] = useState(StandardOrderType.name);
    const { STANDARDS_OPTIONS } = envVariables();
    const {
        isStandardsLoading,
        standards,
        standardAsync,
    } = useStandardsStore();

    useEffect(() => {
        if (!!standards) {
            const savedSearch = JSON.parse(localStorage.getItem(STANDARDS_OPTIONS)) || null;
            setCurrentOrder(savedSearch?.order ?? StandardOrderType.name);
        }
    }, [standards]);

    // METHODS

    const onShowModal = (id) => {
        setShowModal(true);
        standardAsync(id);
    }

    const onCloseModal = () => {
        setShowModal(false);
    };

    return (
        <>
            {isStandardsLoading ? (
                <ViewLoading />
            ) : !!standards ? (
                <div className="table-responsive p-0">
                    <table className="table align-items-center mb-0">
                        <thead>
                            <tr>
                                <th>
                                    <div className="d-flex justify-content-start align-items-center gap-1">
                                        <div className="d-flex flex-row">
                                            <AryTableSortIcon
                                                icon={faCaretUp}
                                                isActive={currentOrder === StandardOrderType.name}
                                                title="Asc"
                                                onClick={() => { onOrder(StandardOrderType.name) }}
                                            />
                                            <AryTableSortIcon
                                                icon={faCaretDown}
                                                isActive={currentOrder === StandardOrderType.nameDesc}
                                                title="Desc"
                                                onClick={() => { onOrder(StandardOrderType.nameDesc) }}
                                            />
                                        </div>
                                        <div className={headStyle}>
                                            Standard
                                        </div>
                                    </div>
                                </th>
                                <th>
                                    <div className={headStyle}>
                                        Reduction Days
                                    </div>
                                </th>
                                <th>
                                    <div className="d-flex justify-content-start align-items-center gap-1">
                                        <div className="d-flex flex-row">
                                            <AryTableSortIcon
                                                icon={faCaretUp}
                                                isActive={currentOrder === StandardOrderType.status}
                                                title="Asc"
                                                onClick={() => { onOrder(StandardOrderType.status) }}
                                            />
                                            <AryTableSortIcon
                                                icon={faCaretDown}
                                                isActive={currentOrder === StandardOrderType.statusDesc}
                                                title="Desc"
                                                onClick={() => { onOrder(StandardOrderType.statusDesc) }}
                                            />
                                        </div>
                                        <div className={headStyle}>
                                            Status
                                        </div>
                                    </div>
                                </th>
                                <th>
                                    <div className="d-flex justify-content-start align-items-center gap-1">
                                        <div className="d-flex flex-row">
                                            <AryTableSortIcon
                                                icon={faCaretUp}
                                                isActive={currentOrder === StandardOrderType.update}
                                                title="Asc"
                                                onClick={() => { onOrder(StandardOrderType.update) }}
                                            />
                                            <AryTableSortIcon
                                                icon={faCaretDown}
                                                isActive={currentOrder === StandardOrderType.updateDesc}
                                                title="Desc"
                                                onClick={() => { onOrder(StandardOrderType.updateDesc) }}
                                            />
                                        </div>
                                        <div className={headStyle}>
                                            Info
                                        </div>
                                    </div>
                                </th>
                                <th className={`${headStyle} text-center`}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                standards.map(item => (
                                    <tr key={item.ID}>
                                        <td>
                                            <div className="d-flex flex-column align-items-start">
                                                <h6 className="text-sm mb-0">
                                                    {item.Name}
                                                </h6>
                                                <p className="text-xs text-secondary mb-0">
                                                    {item.Description}
                                                </p>
                                                {/* <p className="text-xs text-secondary mb-0">
                                                    {item.ID}
                                                </p> */}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="text-center text-xs">
                                                { item.MaxReductionDays ?? '0' }
                                            </div>
                                        </td>
                                        <td className="align-middle text-center text-sm">
                                            {/* <Status value={item.Status} /> */}
                                            <AryDefaultStatusBadge value={item.Status} />
                                        </td>
                                        <td>
                                            <div className="d-flex flex-column align-items-start">
                                                <div className="text-xs"><strong>Updated</strong> {getFriendlyDate(item.Updated)} </div>
                                                <div className="text-xs"><strong>By</strong> {item.UpdatedUser}</div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex justify-content-center gap-2">
                                                <a href="#" onClick={() => onShowModal(item.ID)} title="Details">
                                                    <FontAwesomeIcon icon={faClone} />
                                                </a>
                                                {item.Status !== DefaultStatusType.deleted && (
                                                    <Link to={`${item.ID}`} title="Edit">
                                                        <FontAwesomeIcon icon={faEdit} />
                                                    </Link>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
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

export default StandardsTableList;