import { Col, Row } from 'react-bootstrap';

import { AryFormikSelectInput, AryFormikTextInput } from '../../../components/Forms';
import languagesProps from '../../../helpers/languagesProps';

const AppFormStepGeneral = ({ formik, readonly = false, ...props }) => {

    return (
        <div {...props}>
            <Row>
                <Col xs="12">
                    <AryFormikSelectInput
                        name="auditLanguageSelect"
                        label="Audit language"
                        disabled={readonly}
                    >
                        {
                            languagesProps.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))
                        }
                    </AryFormikSelectInput>
                </Col>
            </Row>
            <div className="bg-light border-radius-md p-3 pb-0 mb-3">
                <Row>
                    <Col xs="12" className="mb-3">
                        <h6 className="text-sm text-dark mb-0">Current certifications</h6>
                        <p className="text-xs text-dark mb-0">
                            You can specify if there is more than one certification <span className="text-info">separated by commas</span>
                        </p>
                    </Col>
                    <Col xs="12">
                        <AryFormikTextInput
                            name="currentStandardsInput"
                            label="Current standards"
                            placeholder="ISO 9001, ISO 14001, ..."
                            disabled={readonly}
                        />
                    </Col>
                    <Col xs="12">
                        <AryFormikTextInput
                            name="currentCertificationsByInput"
                            label="Certified by"
                            placeholder="Company name, company name 2, ..."
                            disabled={readonly}
                        />
                    </Col>
                    <Col xs="12">
                        <AryFormikTextInput
                            name="currentCertificationsExpirationInput"
                            label="Expiration date"
                            placeholder="dd/mm/yyyy, dd/mm/yyyy, ..."
                            disabled={readonly}
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
                        disabled={readonly}
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
                                        disabled={readonly}
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
                                    disabled={readonly}
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