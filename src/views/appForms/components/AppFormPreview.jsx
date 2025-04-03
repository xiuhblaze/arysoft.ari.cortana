import { Col, Container, Row } from "react-bootstrap"
import { useOrganizationsStore } from "../../../hooks/useOrganizationsStore";
import { useAppFormController } from "../context/appFormContext";
import standardBaseProps from "../../standards/helpers/standardBaseProps";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuilding } from "@fortawesome/free-solid-svg-icons";
import enums from "../../../helpers/enums";
import isNullOrEmpty from "../../../helpers/isNullOrEmpty";
import { useEffect } from "react";
import AppFormPreviewStandardLoading from "./AppFormPreviewStandardLoading";

const AppFormPreview = ({formik}) => {
    const [ controller, dispatch ] = useAppFormController();
    const { 
        contactsList,
        nacecodesList,
        standardData,
        sitesList,        
    } = controller;
    const { DefaultStatusType, StandardBaseType } = enums();
    const { organization } = useOrganizationsStore();

    const headerStyle = 'text-xs text-wrap font-weight-bold bg-light';
    const bodyStyle = 'text-xs text-dark text-wrap';
    const separatorStyle = { height: '.25rem' };
    const internalTableStyle= 'table table-sm table-borderless pt-0 mb-0'; 
    const bodyWithTableStyle = `${bodyStyle} pt-0`;

    // METHODS

    const ShowFormatTextInput = (value, separator = '\n') => {
        return value != null 
            ? value.split(separator).map((item, index) => {
                return <div key={index} className="text-wrap">{item}</div>
            })
            : null
    } // ShowFormatTextInput

    return (
        <Container className="p-0">
            <Row>
                <Col xs="12">
                    <h6 className="text-sm font-weight-bold">Application form preview</h6>
                    <table className="table table-borderless table-hover">
                        <tbody>
                            <tr>
                                <td className={ headerStyle }>Standard</td>
                                <td className={ `${bodyStyle} font-weight-bold` }>
                                    { 
                                        standardBaseProps[!!standardData?.standardBase 
                                            ? standardData.standardBase 
                                            : 0]
                                        .label 
                                    }
                                </td>  
                            </tr>
                            <tr>
                                <td className={ headerStyle }>Organization</td>
                                <td className={ bodyStyle }>{ organization.Name }</td>
                            </tr>
                            <tr>
                                <td className={ headerStyle }>Legal entity</td>
                                <td className={ bodyStyle }>
                                    { 
                                        !!organization.Companies && organization.Companies.length > 0 &&
                                        organization.Companies
                                            .filter(company => company.Status == DefaultStatusType.active)
                                            .map(company => <div key={company.ID}>
                                            <span className="text-dark">{ company.Name }</span>
                                            <span className="text-secondary ms-1">
                                                <FontAwesomeIcon icon={ faBuilding } className="me-1" />
                                                { company.LegalEntity }
                                            </span>

                                        </div>)
                                    }
                                </td>
                            </tr>
                            <tr>
                                <td className={ headerStyle }>Site address</td>
                                <td className={ bodyStyle }>
                                    { 
                                        sitesList?.length > 0 && sitesList.map(site => {                                            
                                            return <div key={site.ID}>
                                                <p className="text-xs text-dark mb-0">
                                                    <span className={ site.IsMainSite ? 'font-weight-bold' : '' }> 
                                                        {site.Description}
                                                    </span> - { isNullOrEmpty(site.Address) ? '(no address)' : site.Address }
                                                </p>
                                                <p className="text-xs text-secondary mb-0">
                                                    Main: {site.IsMainSite ? 'Yes' : 'No'}, Employees: {site.EmployeesCount}
                                                </p>
                                            </div>
                                        })
                                    }
                                </td>
                            </tr>
                            <tr style={separatorStyle}></tr>
                            <tr>
                                <td className={ headerStyle }>Website</td>
                                <td className={ bodyStyle }>{ organization.Website}</td>
                            </tr>
                            <tr>
                                <td className={ headerStyle }>Phone number</td>
                                <td className={ bodyStyle }>{ organization.Phone }</td>
                            </tr>
                            <tr>
                                <td className={ headerStyle }>Contact</td>
                                <td className={ bodyStyle }>
                                    {
                                        contactsList?.length > 0 && contactsList.map(contact => {
                                            return <div key={contact.ID}>
                                                <p className="text-xs text-dark mb-0">
                                                    <span className={ contact.IsMainContact ? 'font-weight-bold' : '' }> 
                                                        {contact.FullName}
                                                    </span> - { contact.Position }
                                                </p>
                                                <p className="text-xs text-secondary mb-0">
                                                    Main: {contact.IsMainContact ? 'Yes' : 'No'}
                                                </p>
                                            </div>
                                        })
                                    }
                                </td>
                            </tr>
                            <tr style={separatorStyle}></tr>
                            {
                                (!standardData 
                                    || !standardData.standardBase 
                                    || standardData.standardBase == StandardBaseType.nothing) && 
                                <>
                                    <tr>
                                        <td>
                                            <span className="text-xs font-weight-bold">Standard...</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan="2" className="p-0">
                                            <AppFormPreviewStandardLoading title="select a standard..." />
                                        </td>
                                    </tr>
                                </>
                            }
                            {/* ISO 9K */}
                            { standardData?.standardBase == StandardBaseType.iso9k &&
                                <>
                                    <tr>
                                        <td className={ headerStyle }>Sector</td>
                                        <td className={ bodyStyle }>
                                            {
                                                nacecodesList?.length > 0 && nacecodesList.map(nacecode => {
                                                    return <div key={nacecode.ID}>
                                                        <p className="text-xs text-dark mb-0">
                                                            <span> 
                                                                {nacecode.Sector.toString().padStart(2, '0')}. {nacecode.Description}
                                                            </span>
                                                        </p>
                                                    </div>
                                                })
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className={ headerStyle }>Process activities/scope</td>
                                        <td className={ bodyStyle }>{ formik?.values?.activitiesScopeInput ?? '' }</td>
                                    </tr>
                                    <tr>
                                        <td className={ headerStyle }>Process/services</td>
                                        <td className={ bodyWithTableStyle }>
                                            <table className={ internalTableStyle }>
                                                <thead>
                                                    <tr>
                                                        <th>Number</th>
                                                        <th>Description</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td className="text-center">{formik?.values?.processServicesCountInput ?? '0'}</td>
                                                        <td>{ ShowFormatTextInput(formik?.values?.processServicesDescriptionInput) }</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className={ headerStyle }>Legal requirements associated with product/service</td>
                                        <td className={ bodyStyle }>{ formik?.values?.legalRequirementsInput ?? '' }</td>
                                    </tr>
                                    <tr>
                                        <td className={ headerStyle }>Any critical complaint?</td>
                                        <td className={ bodyWithTableStyle }>
                                            <table className={ internalTableStyle }>
                                                <thead>
                                                    <tr>
                                                        <th></th>
                                                        <th>Comments</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td className="text-center">{!!formik?.values?.anyCriticalComplaintCheck ? 'Yes' : 'No'}</td>
                                                        <td>
                                                            { !!formik?.values?.anyCriticalComplaintCheck && ShowFormatTextInput(formik?.values?.criticalComplaintCommentsInput) }
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className={ headerStyle }>Process automation level</td>
                                        <td className={ bodyStyle }>{ formik?.values?.automationLevelInput ?? '' }</td>
                                    </tr>
                                    <tr>
                                        <td className={ headerStyle }>Design responsibility</td>
                                        <td className={ bodyWithTableStyle }>
                                            <table className={ internalTableStyle }>
                                                <thead>
                                                    <tr>
                                                        <th></th>
                                                        <th>Justification</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td className="text-center">{!!formik?.values?.isDesignResponsibilityCheck ? 'Yes' : 'No'}</td>
                                                        <td>
                                                            { ShowFormatTextInput(formik?.values?.designResponsibilityJustificationInput) }
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </> 
                            }
                            <tr style={separatorStyle}></tr>
                            <tr>
                                <td className={ headerStyle }>Audit language</td>
                                <td className={ bodyStyle }>{ formik?.values?.auditLanguageSelect ?? '' }</td>
                            </tr>
                            <tr>
                                <td className={ headerStyle }>Current certifications</td>
                                <td className={ bodyWithTableStyle }>
                                    <table className={ internalTableStyle }>
                                        <thead>
                                            <tr>
                                                <th>Standard(s)</th>
                                                <th>Certified by</th>
                                                <th>Expiration</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    { ShowFormatTextInput(formik?.values?.currentStandardsInput, ',') }
                                                </td>
                                                <td>
                                                    { ShowFormatTextInput(formik?.values?.currentCertificationsByInput, ',') }
                                                </td>
                                                <td>
                                                    { ShowFormatTextInput(formik?.values?.currentCertificationsExpirationInput, ',') }
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td className={ headerStyle }>Outsourced process related with product/service</td>
                                <td className={ bodyStyle }>{ formik?.values?.outsourcedProcessInput ?? '' }</td>
                            </tr>
                            <tr>
                                <td className={ headerStyle }>Do you received any consultancy?</td>
                                <td className={ bodyWithTableStyle }>
                                    <table className={ internalTableStyle }>
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th>By</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="text-center">{!!formik?.values?.anyConsultancyCheck ? 'Yes' : 'No'}</td>
                                                <td>
                                                    { formik?.values?.anyConsultancyByInput }
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </Col>
            </Row>
        </Container>
    )
}

export default AppFormPreview;