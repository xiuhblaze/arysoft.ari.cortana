import { faFile, faFileUpload, faPercent } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { updateADCSite, useADCController } from '../context/ADCContext';
import envVariables from '../../../helpers/envVariables';
import { useAuditCyclesStore } from '../../../hooks/useAuditCyclesStore';
import getRandomNumber from '../../../helpers/getRandomNumber';
import { useOrganizationsStore } from '../../../hooks/useOrganizationsStore';

const ADCMD11ValueInput = ({ adcSite, name, formik, ...props }) => {
    const {
            VITE_FILES_URL,
            URL_ORGANIZATION_FILES,
        } = envVariables();

    const decreaseList = [
        { value: 0, label: '0' },
        { value: 10, label: '10' },
        { value: 20, label: '20' },
    ];
    const [controller, dispatch] = useADCController();  
    const { adcData, adcSiteList } = controller;

    const {
        organization
    } = useOrganizationsStore();

    const {
        auditCycle
    } = useAuditCyclesStore();

    // HOOKS
    
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        value: adcSite.MD11 ?? '0',
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
            ID: adcSite.ID,
            MD11: Number(value),
        });
    }; // onChange

    const onChangeFile = (e) => {
        //const { name, value } = e.target;
        const file = e.target.files[0];

        console.log('onChangeFile', file);

        setFormData({
            ...formData,
            file: file,
        });

        updateADCSite(dispatch, {
            ID: adcSite.ID,
            MD11File: file, //! FALTA MANDAR ESTO AL BACKEND
        });
    }; // onChangeFile

    const onClick = () => {
        // console.log('open file dialog');
        onShowModal();
    };

    const onShowModal = () => {
        setShowModal(true);
    };

    const onHideModal = () => {
        setShowModal(false);
    };

    const onSaveFile = (e) => {
        
        console.log('onSaveFile', e);
        console.log('formData', formData);

        // onHideModal();
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
                        { decreaseList.map((adcSite, index) => (
                            <option key={index} value={adcSite.value} className="text-end">{adcSite.label}</option>
                        )) }
                    </select>
                    <span className="input-group-text ari-input-group-text-end text-sm">
                        <FontAwesomeIcon icon={ faPercent } title="Percentage" />
                    </span>
                    <button 
                        type="button"
                        className="btn btn-outline-light
                         ari-btn-outline-light-2 px-3 mb-0"
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
                        { adcSite.SiteDescription }
                    </h6>
                    <p className="text-xs text-secondary text-wrap mb-0">
                        Upload file evidence for the MD11 of this site
                    </p>
                    {
                        !!adcSite.MD11Filename ? (
                            <>
                                <p className="text-xs text-secondary text-wrap mt-3 mb-0">
                                    See current file:
                                </p>
                                <a
                                    href={`${VITE_FILES_URL}${URL_ORGANIZATION_FILES}/${organization.ID}/Cycles/${auditCycle.ID}/ADC/${adcSite.MD11Filename}?v=${getRandomNumber(4)}`}
                                    target="_blank"
                                    className="btn btn-link text-dark mb-0 py-2 text-center"
                                    title="View current file"
                                >
                                    <FontAwesomeIcon icon={faFile} size="xl" />
                                    <span className=" text-sm ms-2">
                                        { adcSite.MD11Filename }
                                    </span>
                                </a>
                            </>
                        ) : null
                    }
                    <hr className="horizontal dark my-3" />
                    <label className="form-label" htmlFor="file">File evidence:</label>
                    <input type="file" name="file" 
                        className="form-control" 
                        accept=".pdf, .doc, .docx, .xls, .xlsx, .zip, .rar, .7z"
                        onChange={ onChangeFile }
                    />
                    {
                        !!adcSite.MD11Filename ? (
                        <div className="text-xs text-secondary mt-1 me-2">
                            If you want to upload a new file, click on the input form and select file,
                            <span className="text-dark">the new one will overwrite the current one.</span>
                        </div>
                        ) : null
                    }
                </Modal.Body>
                <Modal.Footer>
                    <div className="d-flex justify-content-end ms-auto ms-sm-0 mb-3 mb-sm-0 gap-2">
                        <button type="button"
                            className="btn bg-gradient-dark mb-0"
                            onClick={ onSaveFile }
                        >
                            Save
                        </button>
                        <button type="button" 
                            className="btn btn-link text-secondary mb-0" 
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