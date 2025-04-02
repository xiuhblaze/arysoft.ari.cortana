import { useEffect, useState } from 'react'
import { Col, ListGroup, Row } from 'react-bootstrap'
import Select from 'react-select';

import enums from '../../../helpers/enums'
import useNacecodesStore from '../../../hooks/useNaceCodesStore';
import getSelectSearchOptions from '../../../helpers/getSelectSearchOptions';
import getSelectSearchOptionSelected from '../../../helpers/getSelectSearchOptionSelected';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLandmark, faPlus, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { useAppFormsStore } from '../../../hooks/useAppFormsStore';
import Swal from 'sweetalert2';
import { setNacecodesList, useAppFormController } from '../context/appFormContext';

const AppFormEditNaceCodes = ({ ...props }) => {

    const [ controller, dispatch ] = useAppFormController();
    const { nacecodesList } = controller;

    const { 
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

    const [nacecodeSelected, setNacecodeSelected] = useState(null);
    // const [nacecodesList, setNacecodesList] = useState([]);
    const [disabledButtons, setDisabledButtons] = useState(false);

    useEffect(() => {
        //console.log('AppFormEditNaceCodes: useEffect: void');

        // Cargar lista de nacecodes para seleccionar
        nacecodesAsync({
            onlyOption: NaceCodeOnlyOptionType.sectors,
            pageSize: 0,
            includeDeleted: false,
            order: NacecodeOrderType.sector,
        });

        // if (!!appForm && !!appForm?.Nacecodes && appForm.Nacecodes.length > 0) {
        //     setNacecodesList(dispatch, appForm.Nacecodes
        //         .map(nace => (
        //             { 
        //                 ID: nace.ID,
        //                 Sector: nace.Sector,
        //                 // Division: nace.Division,
        //                 // Group: nace.Group,
        //                 // Class: nace.Class,
        //                 Description: nace.Description 
        //             }
        //         ))
        //     );
        // }
    }, []);

    // METHODS

    const onClickAdd = () => {
        setDisabledButtons(true);
        naceCodeAddAsync(nacecodeSelected)
            .then(data => {
                //console.log('data', data);
                if (!!data) {
                    
                    const myNacecode = nacecodes.find(i => i.ID == nacecodeSelected);

                    //console.log('AppFormEditNaceCodes: onClickAdd: myNacecode', myNacecode);

                    if (!!myNacecode) {
                        setNacecodesList(dispatch, [
                            ...nacecodesList,
                            { 
                                ID: myNacecode.ID,
                                Sector: myNacecode.Sector,
                                Description: myNacecode.Description 
                            },
                        ]);
                    }

                    //onChange(nacecodesList.length + 1);
                    setNacecodeSelected(null);
                    // console.log('AppFormEditNaceCodes: onClickAdd: nacecodesList', nacecodesList);
                }
            }).catch(err => {
                console.log(err);
                Swal.fire('Add NACE code', err, 'error');
            });
        setDisabledButtons(false);
    }; // onClickAdd

    const onClickRemove = (id) => {
        setDisabledButtons(true);
        naceCodeDelAsync(id)
            .then(data => {
                //console.log('data', data);
                if (!!data) {
                    setNacecodesList(dispatch, nacecodesList.filter(item => item.ID != id));
                    //onChange(nacecodesList.length < 1 ? 0 : nacecodesList.length - 1);
                }
            }).catch(err =>{
                console.log(err);
                Swal.fire('Remove NACE code', err, 'error');
            });
        setDisabledButtons(false);
    }; // onClickRemove
    
    return (
        <Row {...props}>
            <Col xs="8" sm="9">
                <label className="form-label">Sector</label>
                <Select name="nacecodesSelect"
                    options={ 
                        getSelectSearchOptions(nacecodes
                            .map(nc => { 
                                return { 
                                    ID: nc.ID, 
                                    Description: `${nc.Sector.toString().padStart(2, '0')}. ${nc.Description}` 
                                }
                            }),
                            'ID',
                            'Description'
                        )
                    }
                    value={ getSelectSearchOptionSelected(nacecodes
                        .map(nc => { 
                            return { 
                                ID: nc.ID, 
                                Description: `${nc.Sector.toString().padStart(2, '0')}. ${nc.Description}` 
                            }
                        }), 
                        'ID', 
                        'Description', 
                        nacecodeSelected)
                    }
                    onChange={item => setNacecodeSelected(item.value)}
                    placeholder={ isNacecodeLoading ? 'Loading...' : 'select' }
                />
            </Col>
            <Col xs="4" sm="3">
                <div className="d-grid gap-1 align-items-end">
                    <label className="form-label">&nbsp;</label>
                    <button type="button" 
                        className="btn bg-gradient-secondary text-white"
                        onClick={onClickAdd}
                        disabled={disabledButtons}
                    >
                        Add
                    </button>
                </div>
            </Col>
            <Col xs="12">
                {
                    !!nacecodesList && nacecodesList.length > 0 && 
                    <ListGroup variant="flush" className="mb-3">
                        {
                            nacecodesList
                                .sort((a, b) => a.Description.localeCompare(b.Description))
                                .map(item => 
                                    <ListGroup.Item key={item.ID} className="bg-transparent border-0 py-1 ps-0 text-xs">
                                        <div className='d-flex justify-content-between align-items-center'>
                                            <span>
                                                <FontAwesomeIcon icon={ faLandmark } className="me-2" />
                                                <span className="text-dark font-weight-bold">
                                                    {item.Sector.toString().padStart(2, '0')}. {item.Description}
                                                </span>
                                            </span>
                                            <button
                                                type="button"
                                                className="btn btn-link p-0 mb-0 text-secondary"
                                                onClick={() => onClickRemove(item.ID)}
                                                title="Delete"
                                                disabled={disabledButtons}
                                            >
                                                <FontAwesomeIcon icon={faTrashCan} size="lg" />
                                            </button>
                                        </div>
                                    </ListGroup.Item>
                                )
                        }
                    </ListGroup>
                }
            </Col>
        </Row>
    )
}

export default AppFormEditNaceCodes