import { useState } from "react";
import { ViewLoading } from "../../../components/Loaders";
import { useApplicationFormsStore } from "../../../hooks/useApplicationFormsStore"
import ApplicationFormBadgeStatus from "./ApplicationFormBadgeStatus";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClone, faEdit } from "@fortawesome/free-solid-svg-icons";
import enums from "../../../helpers/enums";
import { Link } from "react-router-dom";
import ApplicationFormTableItem from "./ApplicationFormTableItem";
import ApplicationFormDetailsModal from "./ApplicationFormDetailsModal";

const ApplicationFormTableList = () => {
    const headStyle = 'text-uppercase text-secondary text-xxs font-weight-bolder';
    const { ApplicationFormStatusType } = enums();

    // CUSTOM HOOKS

    const {
        isApplicationFormsLoading,
        applicationForms,
        applicationFormAsync,
    } = useApplicationFormsStore();

    // HOOKS

    const [showModal, setShowModal] = useState(false);

    // METHODS

    const onShowModal = (id) => {
        setShowModal(true);

        // console.log(id);
        applicationFormAsync(id);
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
                                    <th className={ `${headStyle} text-center` }>Status</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                { applicationForms.map(item => ( <ApplicationFormTableItem 
                                    key={ item.ID }
                                    item={ item } 
                                    onShowModal={ onShowModal }
                                />))}
                            </tbody>
                        </table>
                    </div>
                ) : null
            }
            <ApplicationFormDetailsModal show={ showModal } onHide={ onCloseModal } />
        </>
    )
}

export default ApplicationFormTableList