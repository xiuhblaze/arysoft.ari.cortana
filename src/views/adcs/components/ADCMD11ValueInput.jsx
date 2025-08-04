import { faFileUpload, faPercent } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { updateADCSite, useADCController } from '../context/ADCContext';

const ADCMD11ValueInput = ({ item, name, formik, ...props }) => {
//console.log('item', item);
    const decreaseList = [
        { value: 0, label: '0' },
        { value: 10, label: '10' },
        { value: 20, label: '20' },
    ];
    const [controller, dispatch] = useADCController();  
    const { adcData, adcSiteList } = controller;

    // HOOKS
    
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        value: item.MD11 ?? '0',
        file: null,
        error: null,
    });

    // METHODS

    const onChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });

        updateADCSite(dispatch, {
            ID: item.ID,
            MD11: Number(value),
        });
    }; // onChange

    const onClick = () => {
        console.log('open file dialog');
        onShowModal();
    };

    const onShowModal = () => {
        setShowModal(true);
    };

    const onHideModal = () => {
        setShowModal(false);
    };

    return (
        <>
            <div {...props}>
                <div className="input-group">
                    <select
                        name="value"
                        onChange={ onChange }
                        className="form-select text-end ari-pe-2"
                        value={formData.value.toString() ?? '0'}
                    >
                        { decreaseList.map((item, index) => (
                            <option key={index} value={item.value} className="text-end">{item.label}</option>
                        )) }
                    </select>
                    <span className="input-group-text ari-input-group-text-end text-sm">
                        <FontAwesomeIcon icon={ faPercent } title="Percentage" />
                    </span>
                    <button 
                        type="button"
                        className="btn btn-outline-light ari-btn-outline-light-2 px-3 mb-0"
                        onClick={ onClick }
                    >
                        <FontAwesomeIcon icon={ faFileUpload } title="Upload MD11 file evidence" />
                    </button>
                </div>
            </div>
            <Modal show={ showModal } onHide={ onHideModal } centered>
                <Modal.Header >
                    <Modal.Title>
                        <FontAwesomeIcon icon={ faFileUpload } className="me-3" size="lg" />
                        Upload MD11 file evidence
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h6 className="text-sm text-dark text-gradient text-wrap mb-0">
                        { item.SiteDescription }
                    </h6>
                    <p className="text-xs text-secondary text-wrap mb-0">
                        Upload file evidence for the MD11 of this site
                    </p>
                    <hr className="horizontal dark my-3" />
                    <label className="form-label">File evidence:</label>
                    <input type="file" name="file" 
                        className="form-control" 
                        accept=".png, .jpg, .pdf, .doc, .docx, .xls, .xlsx, .zip, .rar, .7z"
                    />
                </Modal.Body>
                <Modal.Footer>
                    <div className="d-flex justify-content-end ms-auto ms-sm-0 mb-3 mb-sm-0 gap-2">
                        <button type="button"
                            className="btn bg-gradient-dark mb-0"
                            onClick={ onHideModal }
                        >
                            Close
                        </button>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ADCMD11ValueInput;