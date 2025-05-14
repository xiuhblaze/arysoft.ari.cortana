import React, { useEffect, useState } from "react";

import { Alert, Col, Modal, Row } from "react-bootstrap"
import { faLock, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";

import { AryFormikTextInput } from "../../../components/Forms";
import { useAuthStore } from "../../../hooks/useAuthStore";

const ChangePwdModal = React.memo(({ show, onHide, ...props }) => {
    
    const formDefaultValues = {
        currentPasswordInput: '',
        passwordInput: '',
        confirmPasswordInput: '',
    };

    const validationSchema = Yup.object({
        currentPasswordInput: Yup.string()
            .required('Current password is required'),
        passwordInput: Yup.string()
            .min(8, 'Password must be at least 8 characters')
            .required('Password is required'),
        confirmPasswordInput: Yup.string()
            .oneOf([Yup.ref('passwordInput'), null], 'Passwords must match')
            .required('Confirm password is required'),
    });

    // CUSTOM HOOKS

    const {
        user,
        changePasswordAsync,
        validatePasswordAsync,
    } = useAuthStore();
    
    // HOOKS

    const [showModal, setShowModal] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);

    useEffect(() => {
        if (!!show) {
            setShowModal(true);
        }        
    }, [show]);

    // METHODS

    const onFormSubmit = (values) => {
        setChangingPassword(true);

        validatePasswordAsync(values.currentPasswordInput)
            .then(data => {
                console.log('validatePasswordAsync', data);
                if (!!data) {
                    onChangePassword(values.currentPasswordInput, values.passwordInput);                    
                } else {
                    setChangingPassword(false);
                    Swal.fire('Error', 'The current password is incorrect', 'error');
                }
            })
            .catch(err => {
                console.log(err);
                setChangingPassword(false);
            });
    }; // onFormSubmit

    const onCloseModal = () => {
        setChangingPassword(false);
        setShowModal(false);
        onHide();
    }; // onCloseModal

    const onChangePassword = (oldPwd, newPwd) => {
        const toChangePwd = {
            OldPassword: oldPwd,
            NewPassword: newPwd,
        };
console.log('onChangePassword', toChangePwd);
        changePasswordAsync(toChangePwd)
            .then(data => {
                if (!!data) {
                    Swal.fire('Change password', 'The password has been changed successfully', 'success');                    
                    onCloseModal();
                }
            })
            .catch(err => {
                console.log(err);
                Swal.fire('Error', 'The password could not be changed', 'error');
            });        
    };

    return (
        <Modal {...props} show={showModal} onHide={onCloseModal}>
            <Modal.Header closeButton>
                <Modal.Title>
                    <FontAwesomeIcon icon={faLock} className="me-2" />
                    Change password
                </Modal.Title>
            </Modal.Header>
            <Formik
                initialValues={formDefaultValues}
                validationSchema={validationSchema}
                onSubmit={onFormSubmit}
            >
                {formik => {
                    return (
                        <Form>
                            <Modal.Body>
                                <Alert variant="info" className="text-white">
                                    Change password for: <strong>{user.username}</strong>
                                </Alert>
                                <Row>
                                    <Col xs="12">
                                        <AryFormikTextInput
                                            name="currentPasswordInput"
                                            label="Current password"
                                            type="password"
                                        />
                                    </Col>
                                </Row>
                                <hr className="horizontal dark mb-3" />
                                <Row>
                                    <Col xs="12">
                                        <AryFormikTextInput
                                            name="passwordInput"
                                            label="New password"
                                            type="password"
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs="12">
                                        <AryFormikTextInput
                                            name="confirmPasswordInput"
                                            label="Confirm new password"
                                            type="password"
                                        />
                                    </Col>
                                </Row>
                            </Modal.Body>
                            <Modal.Footer>
                                <button 
                                    type="submit" 
                                    className="btn bg-gradient-dark mb-0"
                                    disabled={ changingPassword }
                                >
                                    {
                                        changingPassword 
                                            ? <FontAwesomeIcon icon={ faSpinner } className="me-1" size="lg" spin />
                                            : <FontAwesomeIcon icon={ faLock } className="me-1" size="lg" />
                                    }
                                    Change password
                                </button>
                                <button type="button"
                                    className="btn btn-link text-secondary mb-0"
                                    onClick={ onCloseModal }
                                >
                                    Close
                                </button>
                            </Modal.Footer>
                        </Form>
                    )
                }}
            </Formik>
        </Modal>
    )
}, (prevProps, nextProps) => {
    return prevProps.show === nextProps.show;
});

export default ChangePwdModal;