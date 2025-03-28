import { useState } from 'react';

import { faWindowMaximize } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import AppFormModalEditItem from './AppFormModalEditItem';

const AppFormButtonNewItem = () => {
    const [showAppFormModal, setShowAppFormModal] = useState(false);

    const onShowAppFormModal = () => {
        //console.log('onShowAppFormModal: show new app form');
        setShowAppFormModal(true);
    }; // onShowAppFormModal

    const onHideAppFormModal = () => {
        //console.log('onHideAppFormModal: hide');
        setShowAppFormModal(false);
    }; // onHideAppFormModal

    return (
        <div>
            <button
                type="button"
                className="btn btn-link text-dark p-0 mb-0"
                title="New application form"
                onClick={onShowAppFormModal}
            >
                <FontAwesomeIcon icon={faWindowMaximize} size="lg" />
            </button>
            <AppFormModalEditItem 
                show={showAppFormModal}
                onHide={onHideAppFormModal}
            />
        </div>
    )
}

export default AppFormButtonNewItem;
