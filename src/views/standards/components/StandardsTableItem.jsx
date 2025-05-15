import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClone, faEdit, faLandmark } from "@fortawesome/free-solid-svg-icons";

import AryDefaultStatusBadge from "../../../components/AryDefaultStatusBadge/AryDefaultStatusBadge";
import enums from "../../../helpers/enums"
import standardBaseProps from "../helpers/standardBaseProps";

const StandardsTableItem = ({ item, className, onShowModal, hideActions = false, ...props }) => {
    const {
        DefaultStatusType,
    } = enums();
    
    return (
        <tr { ...props }>
            {
                !hideActions &&
                <td>
                    <div className="d-flex justify-content-center gap-2">
                        { item.Status !== DefaultStatusType.deleted && (
                            <Link to={`${item.ID}`} title="Edit">
                                <FontAwesomeIcon icon={faEdit} />
                            </Link>
                        )}
                    </div>
                </td>
            }
            <td>
                <div className="d-flex align-items-center me-2">
                    <div>
                        <div className={`icon icon-sm icon-shape bg-gradient-${item.Status === DefaultStatusType.active ? 'info' : 'secondary'} border-radius-md d-flex align-items-center justify-content-center me-2`} >
                            <FontAwesomeIcon icon={faLandmark} className="opacity-10 text-white" aria-hidden="true" />
                        </div>
                    </div>
                    <div className="d-flex flex-column align-items-start">
                        <h6 className="text-sm mb-0">
                            {item.Name}
                        </h6>
                        <p className="text-xs text-secondary mb-0">
                            {item.Description}
                        </p>
                        <p className="text-xs mb-0">
                            Base: <span className="badge bg-gradient-secondary text-white">{ !!item.StandardBase ? standardBaseProps[item.StandardBase].label : '' }</span>
                        </p>
                    </div>
                </div>
            </td>
            <td>
                <div className="d-flex flex-column align-items-start gap-1">
                    <div className="d-flex flex-row align-items-start gap-2">
                        <div className="d-flex justify-content-start text-xs font-weight-bold gap-1 w-100">
                            <span>Auditors:</span>
                            <span className="text-dark font-weight-bold">{ item.AuditorsCount }</span>
                        </div>
                        <div className="d-flex justify-content-between text-xs font-weight-bold gap-1 w-100">
                            <span>Certificates:</span>
                            <span className="text-dark font-weight-bold">{ item.CertificatesCount }</span>
                        </div>
                        <div className="d-flex justify-content-between text-xs font-weight-bold gap-1 w-100">
                            <span>Organizations:</span>
                            <span className="text-dark font-weight-bold">{ item.OrganizationsCount }</span>
                        </div>
                    </div>
                    <p className="text-start text-xs mb-0">
                        Reduction days: <span className="text-dark font-weight-bold">{ item.MaxReductionDays ?? '0' }</span>
                    </p>
                </div>
            </td>
            <td className="align-middle text-center text-sm">
                <AryDefaultStatusBadge value={item.Status} />
            </td>
            {
                !hideActions &&
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
            }
        </tr>
    )
}

export default StandardsTableItem