import { memo, useEffect, useState } from "react";

import { Spinner } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClone, faEdit, faLandmark } from "@fortawesome/free-solid-svg-icons";

import envVariables from "../../../helpers/envVariables";
import enums from "../../../helpers/enums";
import useNacecodesStore from "../../../hooks/useNaceCodesStore";

import Code from "./Code";
import Status from "./Status";
import DetailsModal from "./DetailsModal";
import { Link } from "react-router-dom";
import { ViewLoading } from "../../../components/Loaders";
import isNullOrEmpty from "../../../helpers/isNullOrEmpty";
import nacecodeAccreditedStatusProps from "../helpers/nacecodeAccreditedStatusProps";

export const NaceTableList = memo(() => {
    const headStyle = 'text-uppercase text-secondary text-xxs font-weight-bolder';
    const { NacecodeOrderType, DefaultStatusType } = enums();
    const [showModal, setShowModal] = useState(false);
    const [currentOrder, setCurrentOrder] = useState(NacecodeOrderType.sector);
    const { NACECODES_OPTIONS } = envVariables();
    const {
        isNacecodesLoading,
        nacecodes,
        nacecodeAsync,
    } = useNacecodesStore();

    useEffect(() => {
        if (!!nacecodes) {
            const savedSearch = JSON.parse(localStorage.getItem(NACECODES_OPTIONS)) || null;
            setCurrentOrder(savedSearch?.order ?? NacecodeOrderType.sector);
        }
    }, [nacecodes]);


    // METHODS

    const onShowModal = (id) => {
        setShowModal(true);
        nacecodeAsync(id);
    }

    const onCloseModal = () => {
        setShowModal(false);
    };

    return (
        <>
            {
                isNacecodesLoading ? (
                    <ViewLoading />
                ) : !!nacecodes ? (
                    <div className="table-responsive p-0">
                        <table className="table align-items-center mb-0">
                            <thead>
                                <tr>
                                    <th className={`${headStyle} text-start`}>Code</th>
                                    <th className={headStyle}>NACE Description</th>
                                    <th className={`${headStyle} text-center`}>Status</th>
                                    <th className={`${headStyle} text-center`}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {nacecodes.map(item => (
                                    <tr key={item.ID} className={item.Status === DefaultStatusType.deleted ? 'opacity-6' : ''}>
                                        <td>
                                            <div className="d-flex justify-content-start align-items-center">
                                                <div 
                                                    className={`icon icon-sm icon-shape bg-gradient-${ nacecodeAccreditedStatusProps[item.AccreditedStatus ?? 0].variant } border-radius-md me-2 d-flex align-items-center justify-content-center`}
                                                    title={ nacecodeAccreditedStatusProps[item.AccreditedStatus ?? 0].description }
                                                >
                                                    <FontAwesomeIcon icon={ faLandmark } className="text-white" aria-hidden="true" style={{ minWidth: '32px' }} />
                                                </div>
                                                <Code
                                                    sector={item.Sector}
                                                    division={item.Division}
                                                    group={item.Group}
                                                    classs={item.Class}
                                                />
                                            </div>
                                        </td>
                                        <td>
                                            <h6 className="text-sm text-wrap mb-0">{item.Description}</h6>
                                            {
                                                !isNullOrEmpty(item.AccreditationInfo) 
                                                    ? <p className="text-xs text-wrap mb-0">
                                                        <strong>Accreditation info:</strong>&nbsp;
                                                        {item.AccreditationInfo}
                                                    </p> 
                                                    : null
                                            }
                                        </td>
                                        <td className="text-sm text-center"><Status value={item.Status} /></td>
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
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : null
            }
            <DetailsModal show={showModal} onHide={onCloseModal} />
        </>
    )
});

export default NaceTableList;