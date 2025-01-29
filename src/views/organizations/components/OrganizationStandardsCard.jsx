import { Card, ListGroup } from "react-bootstrap";
import { useOrganizationsStore } from "../../../hooks/useOrganizationsStore"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLandmark } from "@fortawesome/free-solid-svg-icons";
import { ViewLoading } from "../../../components/Loaders";
import OrganizationStandardsCardItem from "./OrganizationStandardsCardItem";
import OrganizationStandardEditItem from "./OrganizationStandardEditItem";

const OrganizationStandardsCard = ({ readOnly = false, ...props }) => {

    // CUSTOM HOOKS

    const {
        isOrganizationLoading,
        organization,
    } = useOrganizationsStore();

    return (
        <Card {...props}>
            <Card.Header className="pb-0 p-3">
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                        <FontAwesomeIcon icon={ faLandmark } size="lg" className="text-dark me-2" />
                        Standards
                    </h5>
                    { !readOnly && <OrganizationStandardEditItem /> }
                </div>
            </Card.Header>
            <Card.Body className="p-3">
                {
                    isOrganizationLoading ? (
                        <ViewLoading />
                    ) : !!organization && organization.Standards != null && organization.Standards.length > 0 ? (
                        <ListGroup className="mb-3">
                            {
                                organization.Standards.map(item => (
                                    <OrganizationStandardsCardItem
                                        key={item.ID}
                                        item={item}
                                        readOnly={ readOnly }
                                    />
                                ))
                            }
                        </ListGroup>
                    ) : null
                }
            </Card.Body>
        </Card>
    )
}

export default OrganizationStandardsCard