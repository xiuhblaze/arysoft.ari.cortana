import { Col, Container, Row } from "react-bootstrap"
import { useOrganizationsStore } from "../../../hooks/useOrganizationsStore";
import { useAppFormController } from "../context/appFormContext";
import standardBaseProps from "../../standards/helpers/standardBaseProps";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuilding } from "@fortawesome/free-solid-svg-icons";
import enums from "../../../helpers/enums";

const AppFormPreview = () => {
    const [ controller, dispatch ] = useAppFormController();
    const { 
        standardData,
        sitesList,
    } = controller;
    const { DefaultStatusType } = enums();
    const { organization } = useOrganizationsStore();

    return (
        <Container className="p-0">
            <Row>
                <Col xs="12">
                    <h6 className="text-sm font-weight-bold">App Form Preview</h6>
                    <table className="table table-borderless table-hover">
                        <tbody>
                            <tr>
                                <td className="text-xs font-weight-bold bg-light">Standard</td>
                                <td className="text-xs text-dark">
                                    { 
                                        standardBaseProps[!!standardData?.standardBase 
                                            ? standardData.standardBase 
                                            : 0]
                                        .label 
                                    }
                                </td>  
                            </tr>
                            <tr>
                                <td className="text-xs font-weight-bold bg-light">Organization</td>
                                <td className="text-xs text-dark">{ organization.Name }</td>
                            </tr>
                            <tr>
                                <td className="text-xs font-weight-bold bg-light">Legal entity</td>
                                <td className="text-xs text-dark">
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
                                <td className="text-xs font-weight-bold bg-light">Site address</td>
                                <td className="text-xs text-dark text-wrap">
                                    { sitesList?.length > 0 && sitesList.map(site => {
                                        return `${site.Description}, ${site.Address}`
                                    }).join(', ') }
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