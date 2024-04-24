import { useState } from "react";
import { ViewLoading } from "../../../components/Loaders";
import { useApplicationFormsStore } from "../../../hooks/useApplicationFormsStore"
import ApplicationFormBadgeStatus from "./ApplicationFormBadgeStatus";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClone, faEdit } from "@fortawesome/free-solid-svg-icons";
import enums from "../../../helpers/enums";
import { Link } from "react-router-dom";

const ApplicationFormTableList = () => {
    const headStyle = 'text-uppercase text-secondary text-xxs font-weight-bolder';
    const { ApplicationFormStatusType } = enums();

    // CUSTOM HOOKS

    const {
        isApplicationFormsLoading,
        applicationForms
    } = useApplicationFormsStore();

    // HOOKS

    const [showModal, setShowModal] = useState(false);

    // METHODS

    const onShowModal = (id) => {
        setShowModal(true);
        // organizationAsync(id);
    }

    const onCloseModal = () => {
        setShowModal(false);
    };

    return (
        <>
            {
                isApplicationFormsLoading ? (
                    <ViewLoading />
                ) : !!applicationForms ? (
                    <div className="table-responsive p-0">
                        <table className="table align-items-center mb-0">
                            <thead>
                                <tr>
                                    <th className={ headStyle }>Organization</th>
                                    <th className={ headStyle }>Standard</th>
                                    <th className={ headStyle }>Services</th>
                                    <th className={ headStyle }>Status</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    applicationForms.map(item => {
                                        return (
                                            <tr key={item.ID}>
                                                <td>{item.OrtanizationName}</td>
                                                <td>{item.StandardName}</td>
                                                <td>{item.Services}</td>
                                                <td><ApplicationFormBadgeStatus status={item.Status} /></td>
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
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                ) : null
            }
        </>
    )
}

export default ApplicationFormTableList