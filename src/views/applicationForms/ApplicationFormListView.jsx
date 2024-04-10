import { Card, Col, Container, Row } from "react-bootstrap";
import envVariables from "../../helpers/envVariables";
import { useApplicationFormsStore } from "../../hooks/useApplicationFormsStore";
import { useEffect } from "react";
import enums from "../../helpers/enums";

const ApplicationFormListView = () => {
    const { 
        APPLICATION_FORM_OPTIONS,
        VITE_DEFAULT_PAGESIZE
    } = envVariables();
    const { ApplicationFormOrderType } = enums();

    // CUSTOM HOOKS

    const {
        applicationForms,
        applicationFormsMeta,
        applicationFormsErrorMessage,

        applicationFormsAsync,
    } = useApplicationFormsStore();

    // HOOKS

    useEffect(() => {
        const savedSearch = JSON.parse(localStorage.getItem(APPLICATION_FORM_OPTIONS)) || null;
        const newSearch = {
            pageSize: VITE_DEFAULT_PAGESIZE,
            pageNumber: 1,
            order: savedSearch?.order ? savedSearch.order : ApplicationFormOrderType.createdDesc
        };
        const search = savedSearch ?? newSearch;

        applicationFormsAsync(search);
        localStorage.setItem(APPLICATION_FORM_OPTIONS, JSON.stringify(search));
    }, []);
    

    // METHODS

    



    return (
        <Container fluid className="py-4 px-0 px-sm-4">
            <Row>
                <Col>
                    <Card className="mb-4">
                        <Card.Header className="pb-0">
                            Toolbar goes here
                        </Card.Header>
                        <Card.Body className="px-0 pt-0 pb-2">
                            <table className="table align-items-center mb-0">
                                <thead>
                                    <tr>
                                        <th>
                                            <div className="d-flex justify-content-start align-items-center gap-1">
                                                Organization
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    
                                </tbody>
                            </table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default ApplicationFormListView