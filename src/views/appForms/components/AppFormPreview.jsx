import { Col, Container, Row } from "react-bootstrap"

const AppFormPreview = ({ appForm }) => {
    return (
        <Container>
            <Row>
                <Col xs="12">
                    <h6 className="text-sm font-weight-bold">App Form Preview</h6>
                </Col>
            </Row>
        </Container>
    )
}

export default AppFormPreview;