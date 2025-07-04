import { Col, ListGroup, Modal, Row } from 'react-bootstrap';
import { faBars, faLandmark, faPlus, faSpinner, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useMemo, useState } from 'react';
import Select from 'react-select';
import Swal from 'sweetalert2';

import { setNacecodesList, useAppFormController } from '../context/appFormContext';
import { useAppFormsStore } from '../../../hooks/useAppFormsStore';
import consoleLog from '../../../helpers/consoleLog';
import enums from '../../../helpers/enums'
import getSelectSearchOptions from '../../../helpers/getSelectSearchOptions';
import getSelectSearchOptionSelected from '../../../helpers/getSelectSearchOptionSelected';
import nacecodeAccreditedStatusProps from '../../nacecodes/helpers/nacecodeAccreditedStatusProps';
import useNacecodesStore from '../../../hooks/useNaceCodesStore';
import getCode from '../helpers/getCode';

const AppFormEditNaceCodes = ({ ...props }) => {

    const [ controller, dispatch ] = useAppFormController();
    const { nacecodesList } = controller;

    const { 
        NaceCodeAccreditedType,
        NaceCodeOnlyOptionType,
        NacecodeOrderType,
    } = enums();

    // CUSTOM HOOKS

    const {
        isNacecodeLoading,
        nacecodes,
        nacecodesErrorMessage,

        nacecodesAsync,
    } = useNacecodesStore();

    const {
        appForm,
        naceCodeAddAsync,
        naceCodeDelAsync,
    } = useAppFormsStore();

    // HOOKS

    const [nacecodesSectorsList, setNacecodesSectorsList] = useState([]);    
    const [nacecodesSubtreeList, setNacecodesSubtreeList] = useState([]);
    const [nacecodeSubtreeSelected, setNacecodeSubtreeSelected] = useState(null);

    const [nacecodeSelected, setNacecodeSelected] = useState(null);
    const [isAdding, setIsAddging] = useState(false); 
    const [isDeleting, setIsDeleting] = useState(null);

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        // Cargar lista de nacecodes para seleccionar
        nacecodesAsync({
            // onlyOption: NaceCodeOnlyOptionType.sectors,
            pageSize: 0,
            includeDeleted: false,
            order: NacecodeOrderType.sector,
        });
        
    }, []);

    useEffect(() => {
        if (!!nacecodes) {
            // consoleLog('AppFormEditNaceCodes.useEffect[]: nacecodes');

            const sectors = nacecodes.filter(nc => nc.Sector != null && !nc.Division && !nc.Group && !nc.Class);
            setNacecodesSectorsList(sectors);
        }
    }, [nacecodes]);
    

    // METHODS

    const onClickAdd = (itemSelected, isSector = true) => {
        // consoleLog('AppFormEditNaceCodes.onClickAdd[]: itemSelected', itemSelected, isSector);
        setIsAddging(true);
        naceCodeAddAsync(itemSelected)
            .then(data => {
                if (!!data) {
                    const myNacecode = nacecodes.find(i => i.ID == itemSelected);
                    if (!!myNacecode) {
                        setNacecodesList(dispatch, [
                            ...nacecodesList,
                            myNacecode,
                        ]);
                    }
                    if (isSector) {
                        setNacecodeSelected(null);
                    } else {
                        setNacecodeSubtreeSelected(null);
                        setShowModal(false);
                    }
                }
                setIsAddging(false);
            }).catch(err => {
                console.log(err);
                Swal.fire('Add sector (NACE code)', err, 'error');
                setIsAddging(false);
                if (!isSector) setShowModal(false);
            });
    }; // onClickAdd

    const onClickRemove = (id) => {
        setIsDeleting(id);
        naceCodeDelAsync(id)
            .then(data => {
                if (!!data) {
                    setNacecodesList(dispatch, nacecodesList.filter(item => item.ID != id));
                }
                setIsDeleting(null);
            }).catch(err =>{
                console.log(err);
                Swal.fire('Remove NACE code', err, 'error');
                setIsDeleting(null);
            });
    }; // onClickRemove

    // const getCode = (item) => {
    //     return `${item.Sector.toString().padStart(2, '0')}.`
    //         + `${item.Division != null && item.Division != undefined ? item.Division.toString().padStart(2, '0') + '.' : ''}`
    //         + `${item.Group != null && item.Group != undefined ? item.Group.toString().padStart(2, '0') + '.' : ''}`
    //         + `${item.Class != null && item.Class != undefined ? item.Class.toString().padStart(2, '0') + '.' : ''}`;
    // };

    const getNacecodeDescription = (item, isSector = true) => {
        const accretiditation = item.AccreditedStatus == NaceCodeAccreditedType.accredited 
            ? ' (accredited)' 
            : item.AccreditedStatus == NaceCodeAccreditedType.mustAccredited 
                ? ' (must accredited)'
                : '';

        return `${getCode(item)} ${ item.Description }${ accretiditation }`;
    };

    const getNacecodeList = useMemo(() => {
        return nacecodesSectorsList //nacecodes
            .map(nc => { 
                return { 
                    ID: nc.ID, 
                    Description: getNacecodeDescription(nc)
                }
            });
    }, [nacecodesSectorsList]);

    // MODAL

    const onShowModal = (item) => {
        setShowModal(true);
        setNacecodesSubtreeList(
            nacecodes.filter(nc => nc.Sector == item.Sector)
        );
    };

    const getNacecodeSubtreeList = useMemo(() => {
        return nacecodesSubtreeList //nacecodes
            .map(nc => { 
                return { 
                    ID: nc.ID, 
                    Description: getNacecodeDescription(nc, false)
                }
            });
    }, [nacecodesSubtreeList]);

    const onCloseModal = () => {
        setNacecodesSubtreeList([]);
        setShowModal(false);
    };
    
    return (
        <Row {...props}>
            <Col xs="8" sm="10">
                <label className="form-label">Sector</label>
                <Select name="nacecodesSelect"
                    options={ getSelectSearchOptions(getNacecodeList, 'ID', 'Description') }
                    value={ getSelectSearchOptionSelected(getNacecodeList, 'ID', 'Description', nacecodeSelected) }
                    onChange={item => setNacecodeSelected(item.value)}
                    placeholder={ isNacecodeLoading ? 'Loading...' : 'select' }
                />
            </Col>
            <Col xs="4" sm="2">
                <div className="d-grid gap-1 align-items-end">
                    <label className="form-label">&nbsp;</label>
                    <button type="button" 
                        className="btn btn-link text-dark px-2"
                        onClick={() => onClickAdd(nacecodeSelected)}
                        disabled={isAdding}
                    >
                        { isAdding ? <FontAwesomeIcon icon={ faSpinner } spin /> : 'ADD' }
                    </button>
                </div>
            </Col>
            <Col xs="12">
                {
                    !!nacecodesList && nacecodesList.length > 0 && 
                    <ListGroup variant="flush" className="mb-3">
                        {
                            nacecodesList
                                //.sort((a, b) => a.Description.localeCompare(b.Description))
                                .map(item => 
                                    <ListGroup.Item key={item.ID} className="bg-transparent border-0 py-1 px-0 text-xs">
                                        <div className='d-flex justify-content-between align-items-center'>
                                            <span>
                                                <FontAwesomeIcon icon={ faLandmark } className="me-2" />
                                                <span className="text-dark font-weight-bold">
                                                    {getCode(item)} {item.Description}
                                                </span>
                                            </span>
                                            <div className="d-flex justify-content-end gap-2">
                                                <button
                                                    type="button"
                                                    className="btn btn-link p-1 mb-0 text-secondary"
                                                    onClick={() => onShowModal(item)}
                                                    title="Edit"
                                                >
                                                    <FontAwesomeIcon icon={ faBars } />
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-link p-1 mb-0 text-secondary"
                                                    onClick={() => onClickRemove(item.ID)}
                                                    title="Delete"
                                                    disabled={isDeleting == item.ID}
                                                >
                                                    {
                                                        isDeleting == item.ID 
                                                            ? <FontAwesomeIcon icon={ faSpinner } spin />
                                                            : <FontAwesomeIcon icon={ faTrashCan } size="lg" />
                                                    }
                                                </button>
                                            </div>
                                        </div>
                                    </ListGroup.Item>
                                )
                        }
                    </ListGroup>
                }
                <Modal show={showModal} onHide={onCloseModal}>
                    <Modal.Header>
                        <Modal.Title>NACE code - Subtree</Modal.Title> 
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col xs="12">
                                <label className="form-label">Sector</label>
                                <Select name="nacecodesSubtreeSelect"
                                    options={ getSelectSearchOptions(getNacecodeSubtreeList, 'ID', 'Description') }
                                    value={ getSelectSearchOptionSelected(getNacecodeSubtreeList, 'ID', 'Description', nacecodeSubtreeSelected) }
                                    onChange={item => setNacecodeSubtreeSelected(item.value)}
                                    placeholder={ isNacecodeLoading ? 'Loading...' : 'select' }
                                />
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="button"
                            className="btn bg-gradient-dark mb-0"
                            onClick={() => onClickAdd(nacecodeSubtreeSelected, false)}
                        >
                            Add
                        </button>
                        <button type="button" className="btn btn-link text-secondary mb-0" onClick={onCloseModal}>
                            Close
                        </button>
                    </Modal.Footer>
                </Modal>
            </Col>
        </Row>
    )
}

export default AppFormEditNaceCodes