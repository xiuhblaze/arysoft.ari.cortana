import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClone, faEdit } from "@fortawesome/free-solid-svg-icons";

import AryDefaultStatusBadge from "../../../components/AryDefaultStatusBadge/AryDefaultStatusBadge";
import enums from "../../../helpers/enums"

const StandardsTableItem = ({ item, className, onShowModal, hideActions = false, ...props }) => {
    const {
        DefaultStatusType,
    } = enums();
    
    return (
        <tr { ...props }>
            <td>
                <div className="d-flex flex-column align-items-start">
                    <h6 className="text-sm mb-0">
                        {item.Name}
                    </h6>
                    <p className="text-xs text-secondary mb-0">
                        {item.Description}
                    </p>
                </div>
            </td>
            <td>
                <div className="text-center text-xs">
                    { item.MaxReductionDays ?? '0' }
                </div>
            </td>
            <td>
                <div className="d-flex flex-column align-items-start gap-1">
                    <div className="d-flex justify-content-between text-xs w-100">
                        <span>Auditors:</span>
                        {/* <span className="badge bg-gradient-light text-dark">{ item.AuditorsCount }</span>  */}
                        <span className="text-dark font-weight-bold">{ item.AuditorsCount }</span>
                    </div>
                    <div className="d-flex justify-content-between text-xs w-100">
                        <span>Certificates:</span>
                        {/* <span className="badge bg-gradient-light text-dark">{ item.CertificatesCount }</span>  */}
                        <span className="text-dark font-weight-bold">{ item.CertificatesCount }</span>
                    </div>
                    <div className="d-flex justify-content-between text-xs w-100">
                        <span>Organizations:</span>
                        {/* <span className="badge bg-gradient-light text-dark">{ item.OrganizationsCount }</span>  */}
                        <span className="text-dark font-weight-bold">{ item.OrganizationsCount }</span>
                    </div>
                    {/* <p className="text-xs mb-0">
                        Certificates: <span className="font-weight-bold">{ item.CertificatesCount }</span>
                    </p>
                    <p className="text-xs mb-0">
                        Organizations: <span className="font-weight-bold">{ item.OrganizationsCount }</span>
                    </p> */}
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