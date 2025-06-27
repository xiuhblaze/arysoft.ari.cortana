import { useEffect, useState } from 'react';

import { Card, Col, Container, ListGroup, Row } from 'react-bootstrap';
import { faSave, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Form, Formik } from 'formik';
import { format } from 'date-fns';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from "yup";
import Swal from 'sweetalert2';

import { AryFormikSelectInput, AryFormikTextInput } from '../../components/Forms';
import { setNavbarTitle, useArysoftUIController } from '../../context/context';
import { useUsersStore } from '../../hooks/useUsersStore';
import { ViewLoading } from '../../components/Loaders';
import AryDefaultStatusBadge from '../../components/AryDefaultStatusBadge/AryDefaultStatusBadge';
import AryLastUpdatedInfo from '../../components/AryLastUpdatedInfo/AryLastUpdatedInfo';
import enums from '../../helpers/enums';
import UserRolesAdmin from './components/UserRolesAdmin';
import userTypeProps from './helpers/userTypeProps';
import aryDateTools from '../../helpers/aryDateTools';

const UsersEditView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [controller, dispatch] = useArysoftUIController(); 

    const {
        DefaultStatusType,
        UserType,
    } = enums();

    const {
        getFriendlyDate,
        getLocalDate,
    } = aryDateTools();

    const formDefaultValues = {
        usernameInput: '',
        passwordInput: '',
        confirmPasswordInput: '',
        emailInput: '',
        firstNameInput: '',
        lastNameInput: '',
        typeSelect: '',
        statusCheck: false,
    };
    const validationSchema = Yup.object({
        usernameInput: Yup.string()
            .required('Username is required')
            .max(50, 'Username must be less than 50 characters'),
        passwordInput: Yup.string()
            .min(8, 'Password must be at least 8 characters'),
        confirmPasswordInput: Yup.string() // solo si passwordInput tiene valor que coincida con confirmPasswordInput
            .oneOf([Yup.ref('passwordInput'), null], 'Passwords must match')
            .when('passwordInput', {
                is: (passwordInput) => !!passwordInput,
                then: schema => schema.required('Confirm password is required'),
            }),
        emailInput: Yup.string()
            .email('Email must be a valid email address')
            .max(255, 'Email must be less than 255 characters')
            .required('Email is required'),
        firstNameInput: Yup.string()
            .max(50, 'First name must be less than 50 characters')
            .required('First name is required'),
        lastNameInput: Yup.string()
            .max(50, 'Last name must be less than 50 characters')
            .required('Last name is required'),
        typeSelect: Yup.string()
            .required('Type is required'),
    });

    // CUSTOM HOOKS

    const {
        isUserLoading,
        isUserSaving,
        userSavedOk,
        user,
        usersErrorMessage,

        userAsync,
        userSaveAsync,
        userClear,
    } = useUsersStore();

    // HOOKS

    const [initialValues, setInitialValues] = useState(formDefaultValues);

    useEffect(() => {
        if (!!id) userAsync(id);
    }, [id]);

    useEffect(() => {
        if (!!user) {
            setInitialValues({
                usernameInput: user.Username ?? '',
                passwordInput: '',
                confirmPasswordInput: '',
                emailInput: user.Email ?? '',
                firstNameInput: user.FirstName ?? '',
                lastNameInput: user.LastName ?? '',
                typeSelect: user.Type ?? UserType.nothing,
                statusCheck: user.Status == DefaultStatusType.active
                    || user.Status == DefaultStatusType.nothing,
            });

            setNavbarTitle(dispatch, user.Username);
        }
    }, [user]);

    useEffect(() => {
        if (userSavedOk) {
            Swal.fire('User', `The changes were made successfully`, 'success');
            userClear();
            navigate('/users/');
        }
    }, [userSavedOk]);
    
    useEffect(() => {
        if (!!usersErrorMessage) {
            Swal.fire('User', usersErrorMessage, 'error');
        }
    }, [usersErrorMessage]);
    
    // METHODS

    const onFormSubmit = (values) => {

        const toSave = {
            ID: user.ID,
            Username: values.usernameInput,
            Password:  values.passwordInput,
            Email: values.emailInput,
            FirstName: values.firstNameInput,
            LastName: values.lastNameInput,
            Type: values.typeSelect,
            Status: values.statusCheck ? DefaultStatusType.active : DefaultStatusType.inactive,
        };
        
        userSaveAsync(toSave);
    }; // onFormSubmit

    const onCancelButton = () => {
        userClear();
        navigate('/users/');
    };

    return (
        <Container fluid className="py-4 px-0 px-sm-4">
            <Row>
                <Col xs="12" xxl="8">
                    <Card>
                        {
                            isUserLoading ? (
                                <ViewLoading />
                            ) : !!user ? (
                                <Formik
                                    initialValues={initialValues}
                                    validationSchema={validationSchema}
                                    onSubmit={onFormSubmit}
                                    enableReinitialize
                                >
                                    {formik => (
                                        <Form>
                                            <Card.Header className="d-flex flex-column flex-sm-row justify-content-between align-items-center pb-0">
                                                <h6>
                                                    <FontAwesomeIcon icon={ faUser } className="me-2" />
                                                    User
                                                </h6>
                                                <div>
                                                    <AryDefaultStatusBadge value={user.Status} />
                                                </div>
                                            </Card.Header>
                                            <Card.Body>
                                                <Row>
                                                    <Col xs="12" sm="8">
                                                        <Row>
                                                            <Col xs="12">
                                                                <AryFormikTextInput
                                                                    name="usernameInput"
                                                                    label="Username"
                                                                    type="text"
                                                                />
                                                            </Col>
                                                            <Col xs="12">
                                                                <div className="bg-light border-radius-md p-3 pb-0 mb-3">
                                                                    <Row>
                                                                        <Col xs="12" sm="6">
                                                                            <AryFormikTextInput
                                                                                name="passwordInput"
                                                                                label="Password"
                                                                                type="password"
                                                                            />
                                                                        </Col>
                                                                        <Col xs="12" sm="6">
                                                                            <AryFormikTextInput
                                                                                name="confirmPasswordInput"
                                                                                label="Confirm password"
                                                                                type="password"
                                                                            />
                                                                        </Col>
                                                                    </Row>
                                                                    <Row>
                                                                        <Col xs="12">
                                                                            <div className="text-xs text-secondary mt-1 me-2 mb-3">
                                                                                Left blank to keep the same password
                                                                            </div>
                                                                        </Col>
                                                                    </Row>
                                                                </div>
                                                            </Col>
                                                            <Col xs="12">
                                                                <AryFormikTextInput
                                                                    name="emailInput"
                                                                    label="E-Mail"
                                                                    type="text"
                                                                />
                                                            </Col>
                                                            <Col xs="12" sm="6">
                                                                <AryFormikTextInput
                                                                    name="firstNameInput"
                                                                    label="First name"
                                                                    type="text"
                                                                />
                                                            </Col>
                                                            <Col xs="12" sm="6">
                                                                <AryFormikTextInput
                                                                    name="lastNameInput"
                                                                    label="Last name"
                                                                    type="text"
                                                                />
                                                            </Col>
                                                            <Col xs="12">
                                                                <AryFormikSelectInput
                                                                    name="typeSelect"
                                                                    label="Type"
                                                                >
                                                                    {
                                                                        userTypeProps.map((option) => (
                                                                            <option key={option.id} value={option.id}>{option.label}</option>
                                                                        ))
                                                                    }
                                                                </AryFormikSelectInput>
                                                            </Col>
                                                            <Col xs="12" sm="4">
                                                                <div className="form-check form-switch mb-3">
                                                                    <input id="statusCheck" name="statusCheck"
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        onChange={formik.handleChange}
                                                                        checked={formik.values.statusCheck}
                                                                    />
                                                                    <label 
                                                                        className="form-check-label text-secondary mb-0"
                                                                        htmlFor="statusCheck"
                                                                    >
                                                                        Active
                                                                    </label>
                                                                </div>
                                                            </Col>
                                                            <Col xs="12">
                                                                <ListGroup>
                                                                    <ListGroup.Item
                                                                        className="border-0 py-0 ps-0 text-xs"
                                                                        title={ user.LastAccess ? format(getLocalDate(user.LastAccess), "dd/MM/yyyy HH:mm:ss") : null }
                                                                    >
                                                                        <strong>Last access: </strong> 
                                                                        { !!user.LastAccess ? getFriendlyDate(new Date(user.LastAccess), true) : '(never)' }
                                                                    </ListGroup.Item>
                                                                    <ListGroup.Item
                                                                        className="border-0 py-0 ps-0 text-xs"
                                                                        title={ user.LastPasswordChange ? format(getLocalDate(user.LastPasswordChange), "dd/MM/yyyy HH:mm:ss") : null }
                                                                    >
                                                                        <strong>Last password change: </strong> 
                                                                        { !!user.LastPasswordChange ? getFriendlyDate(new Date(user.LastPasswordChange), true) : '(never)' }
                                                                    </ListGroup.Item>
                                                                </ListGroup>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                    <Col xs="12" sm="4">
                                                        <div className="bg-gray-100 rounded-3 p-3 gap-2 mb-3">
                                                            <UserRolesAdmin />
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                            <Card.Footer>
                                                <div className="d-flex justify-content-between align-items-center w-100">
                                                    <div className="text-secondary">
                                                        <AryLastUpdatedInfo item={user} />
                                                    </div>
                                                    <div className="d-flex justify-content-end gap-2">
                                                        <button type="submit" 
                                                            className="btn bg-gradient-dark mb-0"
                                                            disabled={isUserSaving}
                                                        >
                                                            <FontAwesomeIcon icon={faSave} className="me-1" size="lg" />
                                                            Save
                                                        </button>
                                                        <button type="button" className="btn btn-link text-secondary mb-0" onClick={onCancelButton}>
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            </Card.Footer>
                                        </Form>
                                    )}
                                </Formik>
                            ) : null
                        }
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default UsersEditView