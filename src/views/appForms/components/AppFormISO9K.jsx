import { useRef, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { Field } from 'formik'

import AppFormEditNaceCodes from './AppFormEditNaceCodes'
import { AryFormikTextArea, AryFormikTextInput } from '../../../components/Forms'

const AppFormISO9K = ({ formik, readonly = false, ...props }) => {

    // HOOKS

    const anyCriticalComplaintRef = useRef(null);

    const [showAnyCriticalComplaintComments, setShowAnyCriticalComplaintComments] = useState(false);

    return (
        <div {...props}>
            <Row>
                <Col xs="12">
                    <div className="mb-3">
                        <div className="bg-light border-radius-md p-3 pb-0">
                            <AppFormEditNaceCodes readonly={readonly} />
                        </div>
                        <Field name="nacecodesCountHidden" type="hidden" value={formik.values.nacecodesCountHidden} />
                        {
                            formik.touched.nacecodesCountHidden && formik.errors.nacecodesCountHidden &&
                            <span className="text-danger text-xs">{formik.errors.nacecodesCountHidden}</span>
                        }
                    </div>
                </Col>
                <Col xs="12">
                    <AryFormikTextArea
                        name="activitiesScopeInput"
                        label="Process activities/scope"
                        disabled={readonly}
                        rows={3}
                    />
                </Col>
                <Col xs="12">
                    <Row>
                        <Col xs="12">
                            <label className="form-label">Process/services</label>
                        </Col>
                        <Col xs="12" sm="3">
                            <AryFormikTextInput
                                name="processServicesCountInput"                            
                                placeholder="0"
                                className="text-end"
                                helpText="Number of process/services"
                                disabled={readonly}
                            />
                        </Col>
                        <Col xs="12" sm="9">
                            <AryFormikTextArea
                                name="processServicesDescriptionInput"
                                helpText="Description of process/services"
                                disabled={readonly}
                            />
                        </Col>
                    </Row>
                </Col>
                <Col xs="12">
                    <AryFormikTextArea
                        name="legalRequirementsInput"
                        label="Legal requirements associated with product/service"
                        disabled={readonly}
                        rows={3}
                    />
                </Col>
                <Col xs="12">
                    <div className="bg-light border-radius-md p-3 pb-0 mb-3">
                        <Row>
                            <Col xs="12">
                                <div className="form-check form-switch">
                                    <input type="checkbox"
                                        id="anyCriticalComplaintCheck"
                                        className="form-check-input"
                                        onChange={(e) => {
                                            const isChecked = e.target.checked;
                                            formik.setFieldValue('anyCriticalComplaintCheck', isChecked);
                                            setShowAnyCriticalComplaintComments(isChecked);
                                        }}
                                        checked={formik.values.anyCriticalComplaintCheck}
                                        disabled={readonly}
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor="anyCriticalComplaintCheck"
                                    >
                                        Any critical complaint?
                                    </label>
                                </div>
                            </Col>
                        </Row>
                        <Row ref={anyCriticalComplaintRef}
                            style={{
                                maxHeight: showAnyCriticalComplaintComments
                                    ? `${anyCriticalComplaintRef?.current?.scrollHeight ?? 0}px`
                                    : '0px',
                                overflow: 'hidden',
                                transition: 'max-height 0.5s ease-in-out',
                            }}
                        >
                            <Col xs="12">
                                <AryFormikTextArea
                                    name="criticalComplaintCommentsInput"
                                    label="Comments"
                                    disabled={readonly}
                                />
                            </Col>
                        </Row>
                    </div>
                </Col>
                <Col xs="12">
                    <Row>
                        <Col xs="12">
                            <label className="form-label">Process automation level</label>
                        </Col>
                        <Col xs="12" sm="3">
                            <AryFormikTextInput
                                name="automationLevelPercentInput"
                                placeholder="0%"
                                className="text-end"
                                helpText="Percentage (%)"
                                disabled={readonly}
                            />
                        </Col>
                        <Col xs="12" sm="9">
                            <AryFormikTextArea
                                name="automationLevelJustificationInput"
                                placeholder="Justification"
                                helpText="Degree of implementation of processes in which labor is little involved"
                                disabled={readonly}
                            />
                        </Col>
                    </Row>
                </Col>
                <Col xs="12">
                    <div className="bg-light border-radius-md p-3 pb-0 mb-3">
                        <Row>
                            <Col xs="12">
                                <div className="form-check form-switch">
                                    <input type="checkbox"
                                        id="isDesignResponsibilityCheck"
                                        className="form-check-input"
                                        onChange={(e) => {
                                            const isChecked = e.target.checked;
                                            formik.setFieldValue('isDesignResponsibilityCheck', isChecked);
                                        }}
                                        checked={formik.values.isDesignResponsibilityCheck}
                                        disabled={readonly}
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor="isDesignResponsibilityCheck"
                                    >
                                        Design responsibility
                                    </label>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12">
                                <AryFormikTextArea
                                    name="designResponsibilityJustificationInput"
                                    label="Justification"
                                    helpText="If you're NOT responsible for design, explain why and who is in charge of this process"
                                    disabled={readonly}
                                />
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default AppFormISO9K