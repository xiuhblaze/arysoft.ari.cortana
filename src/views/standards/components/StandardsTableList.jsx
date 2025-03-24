import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp, faClone, faEdit } from "@fortawesome/free-solid-svg-icons";

import enums from "../../../helpers/enums";
import envVariables from "../../../helpers/envVariables";
import AryTableSortIcon from "../../../components/AryTableSortIcon/AryTableSortIcon";
import { ViewLoading } from "../../../components/Loaders";
import { useStandardsStore } from "../../../hooks/useStandardsStore";

import StandardDetailsModal from "./StandardDetailsModal";
import StandardsTableItem from "./StandardsTableItem";

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
                                        Info
                                    </div>
                                </th>
                                <th>
                                    <div className="d-flex justify-content-center align-items-center gap-1">
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
                                {/* <th>
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
                                </th> */}
                                <th className={`${headStyle} text-center`}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                standards.map(item => (
                                    <StandardsTableItem 
                                        key={item.ID}
                                        item={item}
                                        onShowModal={onShowModal}
                                    />
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            ) : null
            }
            <StandardDetailsModal show={showModal} onHide={onCloseModal} />
        </>
    )
}

export default StandardsTableList;