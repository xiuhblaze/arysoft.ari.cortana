import React from 'react'
import { Col, Row } from 'react-bootstrap';
import { AryFormikSelectInput, AryFormikTextInput } from '../../../components/Forms';

const auditLanguageOptions = [
    { value: '', label: '(select a language)' },
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
];

const AppFormStepGeneral = ({ formik, ...props }) => {

    return (
        <div {...props}>
            <Row>
                <Col xs="12">
                    <AryFormikSelectInput
                        name="auditLanguageSelect"
                        label="Audit language"
                    >
                        {auditLanguageOptions.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </AryFormikSelectInput>
                </Col>
            </Row>
            <div className="bg-light border-radius-md p-3 pb-0 mb-3">
                <Row>
                    <Col xs="12" className="mb-3">
                        <h6 className="text-sm text-dark mb-0">Current certifications</h6>
                        <p className="text-xs text-dark mb-0">
                            You can specify if there is more than one certification <strong className="text-warning">separated by commas</strong>
                        </p>
                    </Col>
                    <Col xs="12">
                        <AryFormikTextInput
                            name="currentStandardsInput"
                            label="Current standards"
                        />
                    </Col>
                    <Col xs="12">
                        <AryFormikTextInput
                            name="currentCertificationsByInput"
                            label="Certified by"
                        />
                    </Col>
                    <Col xs="12">
                        <AryFormikTextInput
                            name="currentCertificationsExpirationInput"
                            label="Expiration date"
                        />
                    </Col>
                </Row>
            </div>
            <Row>
                <Col xs="12">
                    <AryFormikTextInput
                        name="outsourcedProcessInput"
                        label="Outsourced process related with product/service"
                        helpText="It refers to those that are part of the main process of the company and are subcontracted by a supplier as an extension of the company"
                    />
                </Col>
            </Row>
            <Row>
                <Col xs="12">
                    <div className="bg-light border-radius-md p-3 pb-0 mb-3">
                        <Row>
                            <Col xs="12">
                                <div className="form-check form-switch">
                                    <input type="checkbox" 
                                        id="anyConsultancyCheck" 
                                        className="form-check-input" 
                                        onChange={ (e) => {
                                            const isChecked = e.target.checked;
                                            formik.setFieldValue('anyConsultancyCheck', isChecked);
                                        }}
                                        checked={ formik.values.anyConsultancyCheck }
                                    />
                                    <label 
                                        className="form-check-label"
                                        htmlFor="anyConsultancyCheck"
                                    >
                                        Do you received any consultancy?
                                    </label>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12">
                                <AryFormikTextInput
                                    name="anyConsultancyByInput"
                                    label="By"
                                />
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
        </div>
    )
};

export default AppFormStepGeneral;