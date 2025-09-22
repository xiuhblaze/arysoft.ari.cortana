import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faClose, faCog, faSave } from "@fortawesome/free-solid-svg-icons"
import { Button, Card, Col, Row } from "react-bootstrap"
import * as Yup from 'yup';

import {
    useArysoftUIController,
    setOpenConfigurator,
} from "../../context/context"
import enums from "../../helpers/enums";
import envVariables from "../../helpers/envVariables";
import { useAuthStore } from "../../hooks/useAuthStore";
import { useEffect, useState } from "react";
import { AryFormikSelectInput, AryFormikTextInput } from "../Forms";
import { useUserSettingsStore } from "../../hooks/useUserSettingsStore";
import { Form, Formik } from "formik";
import Swal from "sweetalert2";

const openConfiguratorStyle = 'fixed-plugin show';
const closeConfiguratorStyle = 'fixed-plugin';

export const Configurator = () => {
    const [controller, dispatch] = useArysoftUIController();
    const { openConfigurator, helpContent } = controller;
    const { VITE_PAGE_SIZE } = envVariables();
    const { 
        DefaultStatusType,
        UserSettingSearchModeType,
    } = enums();

    const onCloseConfigurator = () => setOpenConfigurator(dispatch, false);

    const helpTexts = [
        'Select a search mode',
        'Keeps current search only while the screen is visible',
        'Keeps current search only while the session is active',
        'Keeps current search indefinitely',
    ]
    const formDefaultValues = {
        pageSizeInput: VITE_PAGE_SIZE,
        searchModeSelect: UserSettingSearchModeType.onSession,
    };
    const validationSchema = Yup.object().shape({
        pageSizeInput: Yup.number()
            .typeError("Must be a number")
            .positive("Must be greater than zero")
            .required("Page size is required"),
        searchModeSelect: Yup.string()
            .required("Search mode is required"),
    });
    
    // CUSTOM HOOKS

    const {
        user,
        userSettings : authUserSettings,
        setUserSettingsLocalStorage,
    } = useAuthStore();

    const {
        isUserSettingCreating,
        isUserSettingSaving,
        userSettingCreatedOk,
        userSettingSavedOk,
        userSetting,

        userSettingsAsync,
        userSettingCreateAsync,
        userSettingSaveAsync,
        userSettingClear,
    } = useUserSettingsStore();

    // HOOKS

    const [initialValues, setInitialValues] = useState(formDefaultValues);
    const [searchMode, setSearchMode] = useState(UserSettingSearchModeType.nothing);

    useEffect(() => {
        if (!!authUserSettings) {
            
            setInitialValues({
                pageSizeInput: authUserSettings.pageSize ?? VITE_PAGE_SIZE,
                searchModeSelect: authUserSettings.searchMode ?? UserSettingSearchModeType.onSession,
            });

            setSearchMode(authUserSettings.searchMode ?? UserSettingSearchModeType.onSession);
        }
    }, [authUserSettings]);

    useEffect(() => {
        if (!!userSettingCreatedOk) {

            Swal.fire('Settings', `User settings created successfully`, 'success');
            if (!!userSetting) {
                const allSettings = {
                    ID: userSetting.ID,
                    ...JSON.parse(userSetting.Settings),
                };

                setUserSettingsLocalStorage(allSettings);
                userSettingClear();
                updateLocalStorage(allSettings);
            }
            onCloseConfigurator();
        }
    }, [userSettingCreatedOk]);

    useEffect(() => {
        if (!!userSettingSavedOk) {
            
            Swal.fire('Settings', `User settings updated successfully`, 'success');
            if (!!userSetting) {
                const allSettings = {
                    ID: userSetting.ID,
                    ...JSON.parse(userSetting.Settings),
                };

                setUserSettingsLocalStorage(allSettings);
                userSettingClear();
                updateLocalStorage(allSettings);
            }
            onCloseConfigurator();
        }
    }, [userSettingSavedOk]);
    

    // METHODS

    const onFormSubmit = (values) => {
        const settings = {
            pageSize: Number(values.pageSizeInput),
            searchMode: values.searchModeSelect,
        };
        
        if (!!authUserSettings) {
            const toSave = {
                ID: authUserSettings.ID,
                Settings: JSON.stringify(settings),
                Status: DefaultStatusType.active,
            };

            userSettingSaveAsync(toSave);            
        } else {
            const toCreate = {
                UserID: user.id,
                Settings: JSON.stringify(settings),
            };            

            userSettingCreateAsync(toCreate);
        }
    }; // onFormSubmit

    const updateLocalStorage = (settings) => {

        switch (settings.searchMode) {
            case UserSettingSearchModeType.onSession:
                console.log('onSession - borrar localStorage');
                break;
            case UserSettingSearchModeType.onScreen:
                console.log('onScreen - borrar localStorage y no guardar en localStorage');
                break;
            case UserSettingSearchModeType.indefinitely:
                console.log('indefinitely - utilizar como está actualmente');
                break;
        }
    }; // updateLocalStorage
    

    return (
        <div className={openConfigurator ? openConfiguratorStyle : closeConfiguratorStyle} >
            {/* <a className="fixed-plugin-button text-dark position-fixed px-3 py-2">
                <FontAwesomeIcon icon={ faCog } className="py-2" />
            </a> */}
            <Card className="shadow-lg">
                <Card.Header className="pb-0 pt-3">
                    <div className="float-start">
                        <h5 className="mt-3 mb-0">ARI IT - Configurator</h5>
                        <p>See options</p>
                    </div>
                    <div className="float-end mt-4">
                        <Button variant="link" className="text-dark p-0 fixed-plugin-close-button" onClick={onCloseConfigurator}>
                            <FontAwesomeIcon icon={faClose} />
                        </Button>
                    </div>
                </Card.Header>
                <hr className="horizontal dark my-1" />
                <Card.Body className="pt-sm-3 pt-0">
                    
                    <Formik
                        initialValues={ initialValues }
                        validationSchema={ validationSchema }
                        onSubmit={ onFormSubmit }
                        enableReinitialize
                    >
                        { formik => (
                            <Form>
                                <Row>
                                    <Col xs="12">
                                        <AryFormikTextInput name="pageSizeInput"
                                            label="Page size"
                                            type="number"
                                            helpText="The number of records to show per page"
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs="12">
                                        <AryFormikSelectInput name="searchModeSelect"
                                            label="Search mode"                                            
                                            onChange={ (e) => {
                                                const searchMode = e.target.value;
                                                setSearchMode(searchMode);
                                                formik.setFieldValue('searchModeSelect', searchMode);
                                            }}
                                            helpText={ helpTexts[searchMode] }
                                        >
                                            <option value={UserSettingSearchModeType.onScreen}>On screen</option>
                                            <option value={UserSettingSearchModeType.onSession}>On session</option>
                                            <option value={UserSettingSearchModeType.indefinitely}>Indefinitely</option>
                                        </AryFormikSelectInput>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs="12">
                                        <div className="d-flex justify-content-end">
                                            <button type="submit"
                                                className="btn bg-gradient-dark mb-0"
                                                disabled={ isUserSettingSaving || isUserSettingCreating }
                                            >
                                                <FontAwesomeIcon icon={ faSave } className="me-1" size="lg" />
                                                Save
                                            </button>
                                        </div>
                                    </Col>
                                </Row>
                            </Form>
                        )}
                    </Formik>
                </Card.Body>
            </Card>
        </div>
    )
}

export default Configurator;