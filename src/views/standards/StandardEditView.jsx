import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Col, Container, Row } from "react-bootstrap";
import Swal from 'sweetalert2';

import { setNavbarTitle, useArysoftUIController } from "../../context/context";
import { useAuditorsStore } from "../../hooks/useAuditorsStore";
import { useStandardsStore } from "../../hooks/useStandardsStore";
import { ViewLoading } from "../../components/Loaders";
import AuditorSimpleItem from "../auditors/components/AuditorSimpleItem";
import enums from "../../helpers/enums";
import StandardEditCard from "./components/StandardEditCard";

const StandardEditView = () => {
    const { id } = useParams();
    const [controller, dispatch] = useArysoftUIController();
    const navigate = useNavigate();
    const { DefaultStatusType } = enums();

    // CUSTOM HOOKS

    const {
        isStandardLoading,
        standard,
        standardErrorMessage,

        standardAsync,
        standardSaveAsync,
        standardDeleteAsync,
        standardClear,
    } = useStandardsStore();

    const {
        isAuditorsLoading,
        auditors,
        auditorsAsync
    } = useAuditorsStore();

    // HOOKS

    useEffect(() => {
        if (!!id) standardAsync(id);
    }, [id]);

    useEffect(() => {
        if (!!standard) {
            setNavbarTitle(dispatch, standard.Name);

            auditorsAsync({
                standardID: standard.ID,
                pageSize: 0
            });
        }
    }, [standard]);

    useEffect(() => {
        if (!!standardErrorMessage) {
            Swal.fire('Standards', standardErrorMessage, 'error');
        }
    }, [standardErrorMessage]);

    // METHODS

    return (
        <Container fluid className="py-4 px-0 px-sm-4">
            {
                isStandardLoading || isAuditorsLoading ? (
                    <ViewLoading />
                ) : !!standard && !!auditors && (
                    <Row>
                        <Col xs="12" sm="6" xxl="6">
                            <StandardEditCard />
                        </Col>
                        <Col xs="12" sm="6" xxl="6">
                            <h6>Auditors</h6>
                            {   
                                auditors.length > 0 &&
                                     auditors.map(item => {
                                        const auditorStandard = standard.Auditors.find(x => x.AuditorID == item.ID);
                                        const classCard = `d-inline-block mb-2 me-2 ${auditorStandard?.Status == DefaultStatusType.active ? '' : 'opacity-6'}`;
                                        return (
                                            <Card key={item.ID} className={ classCard }>
                                                <Card.Body className="p-2">
                                                    <AuditorSimpleItem item={item} size="sm" />
                                                </Card.Body>
                                            </Card>
                                        )
                                     }
                                    )
                            }
                        </Col>
                    </Row>
                )
            }
        </Container>
    )
}

export default StandardEditView;