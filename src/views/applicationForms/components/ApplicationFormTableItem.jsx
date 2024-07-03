import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuilding, faClone, faEdit, faUser, faUserGroup, faUsers } from "@fortawesome/free-solid-svg-icons";

import ApplicationFormBadgeStatus from "./ApplicationFormBadgeStatus";
import enums from "../../../helpers/enums";

const ApplicationFormTableItem = ({ item, onShowModal }) => {
    const { ApplicationFormStatusType } = enums();

    return (
        <tr>
            <td>
                <div className="d-flex px-2 py-1">
                    <div>
                        <img src="/files/organizations/lgoArysoft2019.png" className="avatar avatar-sm me-3" alt="Organization logo" />
                    </div>
                    <div className="d-flex flex-column justify-content-center">
                        <h6 className="mb-0 text-sm">{item.OrganizationName}</h6>
                        <div className="d-flex flex-row justify-content-start gap-2 text-xs text-secondary mb-0">
                            <span>
                                <FontAwesomeIcon icon={ faBuilding } className="me-1" />
                                Sites: <strong>2</strong></span> 
                            <span>
                                <FontAwesomeIcon icon={ faUsers } className="me-1" />
                                Total Employees: <strong>241</strong></span>
                            <span>
                                <FontAwesomeIcon icon={ faUser } className="me-1" />
                                Contact: <strong>Adrian Castillo</strong></span>
                        </div>
                    </div>
                </div>
            </td>
            <td>
                <p className="text-xs font-weight-bold mb-0">{item.StandardName}</p>
                <p className="text-xs text-secondary mb-0">Organization</p>
            </td>
            <td>{item.Services}</td>
            <td className="text-center">
                <ApplicationFormBadgeStatus status={item.Status} />
            </td>
            <td>
                <div className="d-flex justify-content-center gap-2">
                    <a href="#" onClick={() => onShowModal(item.ID)} title="Details">
                        <FontAwesomeIcon icon={faClone} />
                    </a>
                    {item.Status !== ApplicationFormStatusType.deleted && (
                        <Link to={`${item.ID}`} title="Edit">
                            <FontAwesomeIcon icon={faEdit} />
                        </Link>
                    )}
                </div>
            </td>
        </tr>
    );
};

export default ApplicationFormTableItem;
