import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClone, faEdit } from "@fortawesome/free-solid-svg-icons";

import ApplicationFormBadgeStatus from "./ApplicationFormBadgeStatus";
import enums from "../../../helpers/enums";

const ApplicationFormTableItem = ({ item, onShowModal }) => {
    const { ApplicationFormStatusType } = enums();

    return (
        <tr>
            <td>{ item.OrtanizationName }</td>
            <td>{item.StandardName}</td>
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
