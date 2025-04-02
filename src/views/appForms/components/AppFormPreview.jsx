import { Col, Container, Row } from "react-bootstrap"
import { useOrganizationsStore } from "../../../hooks/useOrganizationsStore";
import { useAppFormController } from "../context/appFormContext";
import standardBaseProps from "../../standards/helpers/standardBaseProps";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuilding } from "@fortawesome/free-solid-svg-icons";
import enums from "../../../helpers/enums";
import isNullOrEmpty from "../../../helpers/isNullOrEmpty";

const AppFormPreview = () => {
    const [ controller, dispatch ] = useAppFormController();
    const { 
        contactsList,
        standardData,
        sitesList,        
    } = controller;
    const { DefaultStatusType } = enums();
    const { organization } = useOrganizationsStore();

    const headerStyle = 'text-xs font-weight-bold bg-light';
    const bodyStyle = 'text-xs text-dark text-wrap';

    return (
        <Container className="p-0">
            <Row>
                <Col xs="12">
                    <h6 className="text-sm font-weight-bold">App Form Preview</h6>
                    <table className="table table-borderless table-hover">
                        <tbody>
                            <tr>
                                <td className={ headerStyle }>Standard</td>
                                <td className={ bodyStyle }>
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
                            <tr style={{ height: '.25rem' }}></tr>           
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
                        </tbody>
                    </table>
                </Col>
            </Row>
        </Container>
    )
}

export default AppFormPreview;