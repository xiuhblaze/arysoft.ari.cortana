import { Col, Row } from "react-bootstrap"
import { AryFormikTextInput } from "../../../components/Forms"
import AppFormEditSites from "./AppFormEditSites"
import { Field } from "formik"

const AppFormOrganizationStep = ({ formik, onSitesChange }) => {
  return (
    <Row>
        <Col xs="12">
            <Row>
                <Col xs="12">
                    <div className="bg-light border-radius-md p-3 pb-0">
                        <AppFormEditSites onChange={ onSitesChange } />
                    </div>
                    <Field name="sitesCountHidden" type="hidden" value={ formik.values.sitesCountHidden } />
                    {
                        formik.touched.sitesCountHidden && formik.errors.sitesCountHidden &&
                        <span className="text-danger text-xs">{formik.errors.sitesCountHidden}</span>
                    }
                </Col>
            </Row>
        </Col>
    </Row>
  )
}

export default AppFormOrganizationStep