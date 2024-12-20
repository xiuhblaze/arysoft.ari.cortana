import { useEffect } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import Swal from 'sweetalert2';

import envVariables from "../../helpers/envVariables";
import enums from "../../helpers/enums";
import { useApplicationFormsStore } from "../../hooks/useApplicationFormsStore";
import ApplicationFormToolbar from "./components/ApplicationFormToolbar";
import ApplicationFormTableList from "./components/ApplicationFormTableList";

const ApplicationFormListView = () => {
    const { 
        APPLICATION_FORM_OPTIONS,
        VITE_PAGE_SIZE
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
            pageSize: VITE_PAGE_SIZE,
            pageNumber: 1,
            order: savedSearch?.order ? savedSearch.order : ApplicationFormOrderType.createdDesc
        };
        const search = savedSearch ?? newSearch;

        applicationFormsAsync(search);
        localStorage.setItem(APPLICATION_FORM_OPTIONS, JSON.stringify(search));
    }, []);

    useEffect(() => {
      if (!!applicationFormsErrorMessage) {
        Swal.fire('Applications Form', applicationFormsErrorMessage, 'error');
      }

    }, [applicationFormsErrorMessage]);
    

    // METHODS


    return (
        <Container fluid className="py-4 px-0 px-sm-4">
            <Row>
                <Col>
                    <Card className="mb-4">
                        <Card.Header className="pb-0">
                            <ApplicationFormToolbar />
                        </Card.Header>
                        <Card.Body className="px-0 pt-0 pb-2">
                            <ApplicationFormTableList />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default ApplicationFormListView