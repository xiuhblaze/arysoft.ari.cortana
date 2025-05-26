import { Field } from "formik";
import { Col, Row } from "react-bootstrap";

import AppFormEditSites from "./AppFormEditSites";
import AppFormEditContacts from "./AppFormEditContacts";

const AppFormStepOrganization = ({ formik, readonly = false, ...props }) => {
    return (
        <Row {...props}>
            <Col xs="12">
                <Row>
                    <Col xs="12">
                        <div className="mb-3">
                            <div className="bg-light border-radius-md p-3 pb-0">
                                <AppFormEditSites readonly={readonly} />
                            </div>
                            <Field name="sitesCountHidden" type="hidden" value={formik.values.sitesCountHidden} />
                            {
                                formik.touched.sitesCountHidden && formik.errors.sitesCountHidden &&
                                <span className="text-danger text-xs">{formik.errors.sitesCountHidden}</span>
                            }
                        </div>
                    </Col>
                    <Col xs="12">
                        <div className="mb-3">
                            <div className="bg-light border-radius-md p-3 pb-0">
                                <AppFormEditContacts readonly={readonly} />
                            </div>
                            <Field name="contactsCountHidden" type="hidden" value={formik.values.contactsCountHidden} />
                            {
                                formik.touched.contactsCountHidden && formik.errors.contactsCountHidden &&
                                <span className="text-danger text-xs">{formik.errors.contactsCountHidden}</span>
                            }
                        </div>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default AppFormStepOrganization;