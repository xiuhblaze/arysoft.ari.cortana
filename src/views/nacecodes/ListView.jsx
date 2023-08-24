import { Card, Col, Container, Row } from "react-bootstrap";
import NaceTableList from "./components/NaceTableList";
import useNacecodesStore from "../../hooks/useNaceCodesStore";
import { useEffect } from "react";


export const ListView = () => {

  const {
    nacecodeErrorMessage,

    nacecodesAsync,
  } = useNacecodesStore();


  useEffect(() => {
    const newSearch = {
      pageSize: 20,
      pageNumber: 1,
    };
    nacecodesAsync(newSearch);
  }, []);
  

  return (
    <Container fluid className="py-4 px-0 px-sm-4">
      <Row>
        <Col>
          <Card className="mb-4">
            <Card.Header className="pb-0">
              <h6>(toolbar goes here)</h6>
            </Card.Header>
            <Card.Body className="px-0 pt-0 pb-2">
              <NaceTableList />              
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
};

export default ListView;
