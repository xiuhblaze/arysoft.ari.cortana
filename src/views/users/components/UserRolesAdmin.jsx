import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faStickyNote, faTrash, faTrashCan, faUser } from '@fortawesome/free-solid-svg-icons';
import { Col, ListGroup, Row } from 'react-bootstrap'

import useRolesStore from '../../../hooks/useRolesStore';
import enums from '../../../helpers/enums';
import { useUsersStore } from '../../../hooks/useUsersStore';
import isNullOrEmpty from '../../../helpers/isNullOrEmpty';

const UserRolesAdmin = () => {
    const { RoleOrderType } = enums();
    // CUSTOM HOOKS

    const {
        roles,

        rolesAsync,
    } = useRolesStore();

    const {
        user,

        userRoleAddAsync,
        userRoleDeleteAsync,
    } = useUsersStore();

    // HOOKS
    
    const [roleSelect, setRoleSelect] = useState('');
    const [rolesList, setRolesList] = useState([]);

    useEffect(() => {
        
        rolesAsync({
            text: '',
            status: 1,
            includeDeleted: false,
            order: RoleOrderType.name,
        });
    }, []);

    useEffect(() => {

        if (!!user && user.Roles) {
            setRolesList(user.Roles);
        }
    }, [user]);
    
    // METHODS

    const onRoleSelectChange = (e) => {
        setRoleSelect(e.target.value);
    };

    const onRoleAddClick = () => {

        if (isNullOrEmpty(roleSelect)) return;

        console.log('onRoleAddClick: roleSelect', roleSelect);
        userRoleAddAsync(roleSelect)
            .then(data => {
                if (!!data) {
                    const currentRole = roles.find(i => i.ID == roleSelect);
                    setRoleSelect(''); // Reiniciar el select
                    setRolesList([
                        ...rolesList,
                        currentRole
                    ].sort((a, b) => a.Name.localeCompare(b.Name)));
                }
            })
            .catch(err => {
                console.log(err);
            });
    }; // onRoleAddClick

    const onRoleDeleteClick = (id) => {

        if (!id) {
            setError('You must specify the role ID');
            return;
        }

        userRoleDeleteAsync(id)
            .then(data => {
                if (!!data) {
                    setRolesList(rolesList.filter(i => i.ID != id));
                }
            })
            .catch(err => {
                console.log(err);
            }); 
    };

    return (
        <Row>
            <Col xs="12">
                <h6 className="text-sm">Roles</h6>
            </Col>
            <Col xs="9">
                <select
                    className="form-select"
                    value={roleSelect}
                    onChange={onRoleSelectChange}
                >
                    <option value="">(select role)</option>
                    {
                        roles.map(i => 
                            <option 
                                key={i.ID} 
                                value={i.ID} 
                                title={ i.Description }
                            >
                                {i.Name}
                            </option>
                        )
                    }
                </select>
            </Col>
            <Col xs="3">
                <button 
                    type="button"
                    className="btn btn-link text-dark px-1"
                    onClick={ onRoleAddClick }
                    title="Add selected role"
                >
                    Add
                </button>
            </Col>
            <Col xs="12">
                <h6 className="text-sm text-secondary">Roles assigned to user</h6>
                {
                    !!rolesList && rolesList.length > 0 ?
                    <ListGroup variant="flush">
                        {
                            rolesList.map(item => <ListGroup.Item key={item.ID} className="bg-transparent border-0 py-1 ps-0 text-xs">
                                <div className='d-flex justify-content-between align-items-center'>
                                    <span className="text-xs">
                                        <FontAwesomeIcon icon={ faUser } className="me-2" />
                                        <span className="font-weight-bold">
                                            {item.Name}
                                        </span>
                                    </span>
                                    <div>
                                        {
                                            !isNullOrEmpty(item.Description) 
                                                ? <FontAwesomeIcon icon={ faStickyNote } title={ item.Description } className="text-warning me-2" size="lg" />
                                                : <FontAwesomeIcon icon={ faStickyNote } title="No description" className="text-secondary me-2" size="lg" />
                                        }
                                        <button
                                            type="button"
                                            className="btn btn-link p-0 mb-0 text-secondary"
                                            onClick={() => onRoleDeleteClick(item.ID)}
                                            title="Delete role from user"
                                        >
                                            <FontAwesomeIcon icon={ faTrashCan } size="lg" />
                                        </button>
                                    </div>
                                </div>
                            </ListGroup.Item>)
                        }
                    </ListGroup>
                    : 
                    <>
                        <p className="text-center text-info text-xs">
                            The user must have at least one Role assigned to have access to the application
                        </p>
                        <p className="text-center text-secondary text-xs">
                            (select a role and press the <span className="text-dark font-weight-bold">ADD</span> button to assign one)
                        </p>
                    </>
                }
            </Col>
        </Row>

    )
}

export default UserRolesAdmin;