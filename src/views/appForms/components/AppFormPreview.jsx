import { Col, Container, Row } from "react-bootstrap";

import { useAppFormController } from "../context/appFormContext";
import { useOrganizationsStore } from "../../../hooks/useOrganizationsStore";
import AppFormPreviewStandardLoading from "./AppFormPreviewStandardLoading";
import enums from "../../../helpers/enums";
import isNullOrEmpty from "../../../helpers/isNullOrEmpty";
import standardBaseProps from "../../standards/helpers/standardBaseProps";
import { useEffect, useRef } from "react";
import getSmallHour from "../../../helpers/getSmallHour";
//import ReactToPrint from 'react-to-print';
import { useReactToPrint } from "react-to-print";

import logoARI from "../../../assets/img/lgoARI.png";
import { faCircleCheck, faGlobe, faGlobeAmericas, faPrint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import getCode from "../helpers/getCode";
import languagesProps from "../../../helpers/languagesProps";

const shiftText = [
    '',
    'Morning',
    'Evening',
    'Night',
    'Mixed'
];

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

    const headerStyle = 'col-3 text-xs text-wrap font-weight-bold bg-light';
    const bodyStyle = 'text-xs text-dark text-wrap';
    const separatorStyle = { height: '.25rem' };
    const internalTableStyle= 'table table-sm table-borderless pt-0 mb-0'; 
    const bodyWithTableStyle = `${bodyStyle} pt-0`;

    // HOOKS

    const contentRef = useRef(null);
    const reactToPrint = useReactToPrint({ contentRef });

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
                    <div className="d-flex justify-content-between align-items-center">
                        <h6 className="font-weight-bold mb-0">Application form</h6> 
                        <div>
                            <button 
                                type="button"
                                className="btn btn-link text-dark mb-0"
                                onClick={() => reactToPrint()}
                            >
                                <FontAwesomeIcon icon={ faPrint } className="me-1" />
                                Print
                            </button>
                        </div>
                    </div>
                    <div ref={ contentRef }>
                        <div className="d-none d-print-block">
                            <div className="d-flex jutify-content-start align-items-center">
                                <img src={ logoARI } alt="logoARI" className="me-4" style={{ maxHeight: '1in' }} />
                                <h5 className="">Application Form <br />
                                    <small className="text-secondary ms-2">{ 
                                        standardBaseProps[!!standardData?.standardBase 
                                            ? standardData.standardBase
                                            : 0]
                                        .label 
                                    }</small>
                                </h5>
                            </div>
                        </div>
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
                                                <span className="ms-1">
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
                                                    {/* <p className="text-xs text-secondary mb-0">
                                                        Main: {site.IsMainSite ? 'Yes' : 'No'}, Employees: {site.EmployeesCount}
                                                    </p> */}
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
                                                return <div key={contact.ID} className="mb-1">
                                                    <p className="text-xs text-dark mb-0">
                                                        <span className={ contact.IsMainContact ? 'font-weight-bold' : '' }> 
                                                            {contact.FullName}
                                                        </span> - { contact.Position }
                                                    </p>
                                                    <div className="d-flex justify-content-start gap-2 text-xs mb-0">
                                                        { !isNullOrEmpty(contact.Email) ? <span>Email: {contact.Email}</span> : null }
                                                        { !isNullOrEmpty(contact.Phone) ? <span>Phone: {contact.Phone}</span> : null }
                                                    </div>
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
                                                                    {getCode(nacecode)} {nacecode.Description}
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
                                                            <th className="col-2 text-center">Number</th>
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
                                                            <th className="col-2"></th>
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
                                            <td className={ bodyWithTableStyle }>
                                                <table className={ internalTableStyle }>
                                                    <thead>
                                                        <tr>
                                                            <th className="col-2 text-center">%</th>
                                                            <th>Justification</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td className="text-center">
                                                                { formik?.values?.automationLevelPercentInput 
                                                                    ? formik?.values?.automationLevelPercentInput
                                                                    : '' }
                                                            </td>
                                                            <td>
                                                                { ShowFormatTextInput(formik?.values?.automationLevelJustificationInput) }
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className={ headerStyle }>Design responsibility</td>
                                            <td className={ bodyWithTableStyle }>
                                                <table className={ internalTableStyle }>
                                                    <thead>
                                                        <tr>
                                                            <th className="col-2"></th>
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
                                    <td className={ bodyStyle }>
                                        { languagesProps
                                            .find(i => 
                                                i.value == formik?.values?.auditLanguageSelect)?.esLabel ?? ''
                                        }
                                    </td>
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
                                <tr style={separatorStyle}></tr>
                                <tr>
                                    <td className={ headerStyle }>Sites</td>
                                    <td className={ bodyStyle }>
                                        <span className="font-weight-bold">Total employees: { sitesList.reduce((acc, item) => acc + item.EmployeesCount, 0) }</span>
                                    </td>
                                </tr>
                                {
                                    !!sitesList && sitesList.length > 0 ?
                                    sitesList.map(item => (
                                        <tr key={item.ID}>
                                            <td className={ headerStyle }>
                                                <div className={ item.IsMainSite ? 'font-weight-bold mb-2' : 'mb-2'} >{ item.Description }</div>
                                                <div className="font-weight-normal">{ item.Address }</div>
                                            </td>
                                            <td className={ bodyStyle }>
                                                <table className={ internalTableStyle }>
                                                    <thead>
                                                        <tr>
                                                            <th>Shifts</th>
                                                            <th>Employees</th>
                                                            <th>Shift</th>
                                                            <th>Core process/Activities</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            item.Shifts.map(shift => (
                                                                <tr key={shift.ID}>
                                                                    <td className="text-start">{shiftText[shift.Type]}</td>
                                                                    <td className="text-center">{shift.NoEmployees}</td>
                                                                    <td className="text-center">
                                                                        { getSmallHour(shift.ShiftStart)} - {getSmallHour(shift.ShiftEnd) }
                                                                        { !!shift.ShiftStart2 || !!shift.ShiftEnd2 ? 
                                                                            <><br />
                                                                                { getSmallHour(shift.ShiftStart2)} - {getSmallHour(shift.ShiftEnd2) }
                                                                            </>
                                                                            : null
                                                                        }
                                                                    </td> 
                                                                    <td className="text-wrap">{shift.ActivitiesDescription}</td>
                                                                </tr>
                                                            ))  
                                                        }
                                                    </tbody>
                                                    <tfoot>
                                                        <tr>
                                                            <th colSpan="4">Site employees: {item.EmployeesCount}</th>
                                                        </tr>
                                                    </tfoot>
                                                </table>
                                            </td>
                                        </tr>
                                    )) : null
                                }
                                <tr style={separatorStyle}></tr>
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
                                                    <th className="col-2"></th>
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
                        <div className="d-none d-print-block">
                            <div className="d-flex justify-content-center flex-column">
                                <h6 className="text-center text-sm">
                                    This application will be in force for a validity of 10 days,
                                    counting from the date of issurance of this document.
                                </h6>
                                <p className="text-secondary text-center text-xs mx-4">
                                    The contents of this documentl, if any, are confidential and solely intended 
                                    or the use of the addressee. If you receive this document by error, then we 
                                    kindly request you to notify the sender thereof immediately, and to delete the 
                                    e-mail and the attachments without printing, copying or distributing any of those. 
                                    The publication, copying whole or in part or use or dissemination in any other way 
                                    of the e-mail and attachments by others than the intended person(s) is prohibited. 
                                    The sender cannot guarantee the security of electronic communication and is not 
                                    liable for any negative consequence of the use of electronic communication, 
                                    including but not limited to, damage as a result of in or non-complete delivery.
                                </p>
                                <p className="text-center text-xs">
                                    <a href="https://aarrin.com" target="_blank">
                                        <FontAwesomeIcon icon={ faGlobeAmericas } className="opacity-6 text-dark me-2" />
                                        aarrin.com
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default AppFormPreview;