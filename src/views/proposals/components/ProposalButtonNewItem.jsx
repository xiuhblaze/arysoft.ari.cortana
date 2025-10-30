import { faWindowMaximize } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react"
import { ProposalControllerProvider } from "../context/ProposalContext";
import ProposalModalEditItem from "./ProposalModalEditItem";

const ProposalButtonNewItem = () => {

    // HOOKS

    const [showModal, setShowModal] = useState(false)

    // METHODS

    const onShowModal = () => {
        // console.log('onShowModal: show new proposal');
        setShowModal(true);
    }; // onShowModal

    const onHideModal = () => {
        // console.log('onHideModal: hide');
        setShowModal(false);
    }; // onHideModal

    return (
        <div>
            <button
                type="button"
                className="btn btn-link text-dark p-0 mb-0"
                title="New proposal"
                onClick={onShowModal}
            >
                <FontAwesomeIcon icon={ faWindowMaximize } size="lg" />
            </button>
            <ProposalControllerProvider>
                <ProposalModalEditItem 
                    show={ showModal } 
                    onHide={ onHideModal } 
                />
            </ProposalControllerProvider>
        </div>
    )
}

export default ProposalButtonNewItem