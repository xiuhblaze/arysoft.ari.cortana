import { Col, Container, Row } from "react-bootstrap";

import { useAppFormController } from "../context/appFormContext";
import { useOrganizationsStore } from "../../../hooks/useOrganizationsStore";
import AppFormPreviewStandardLoading from "./AppFormPreviewStandardLoading";
import enums from "../../../helpers/enums";
import isNullOrEmpty from "../../../helpers/isNullOrEmpty";
import standardBaseProps from "../../standards/helpers/standardBaseProps";
import { useEffect } from "react";
import getSmallHour from "../../../helpers/getSmallHour";

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

    // METHODS

    const ShowFormatTextInput = (value, separator = '\n') => {
        return value != null 
            ? value.split(separator).map((item, index) => {
                return <div key={index} className="text-wrap">{item}</div>
            })
            : null
    } // ShowFormatTextInput

    useEffect(() => {
        console.log('AppFormPreview.useEffect[].sitesList:',sitesList);
    }, [sitesList]);

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
                            {/* <tr>
                                <td className={ headerStyle }>
                                    Main site<br />
                                    Domicilio completo
                                </td>
                                <td className={ bodyStyle }>
                                    <table className={ internalTableStyle }>
                                        <thead>
                                            <tr>
                                                <th>Shifts</th>
                                                <th>Employees</th>
                                                <th>Shift</th>
                                                <th>Core process<br />Activities</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="text-center">1</td>
                                                <td className="text-center">45</td>
                                                <td className="text-center">9 - 17</td>
                                                <td className="text-wrap">Sed id elit sit amet mauris aliquet sollicitudin.</td>
                                            </tr>
                                            <tr>
                                                <td className="text-center">2</td>
                                                <td className="text-center">17</td>
                                                <td className="text-center">17 - 23</td>
                                                <td className="text-wrap">
                                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed id elit sit amet mauris aliquet sollicitudin. Nulla faucibus ante sed gravida congue. Vestibulum pellentesque pharetra porttitor.
                                                </td>
                                            </tr>
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td colSpan="5"><strong>Total employees</strong> 45</td>  
                                            </tr>
                                        </tfoot>
                                    </table>
                                </td>
                            </tr> */}
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