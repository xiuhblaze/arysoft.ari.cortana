import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

import { setNavbarTitle, useArysoftUIController } from "../../context/context";
import envVariables from "../../helpers/envVariables";
import enums from "../../helpers/enums";

import { useStandardsStore } from "../../hooks/useStandardsStore";
import { Card, Col, Container, Row } from "react-bootstrap";
import StandardsTableList from "./components/StandardsTableList";
import AryPagination from "../../components/AryPagination/AryPagination";
import ToolbarForm from "./components/ToolbarForm";

const ListView = () => {
  const navigate = useNavigate();
  const {
    STANDARDS_OPTIONS,
    VITE_PAGE_PAGESIZE,
  } = envVariables();
  const [controller, dispatch] = useArysoftUIController();
  const { DefaultStatusType, StandardOrderType } = enums();
  const {
    standardsMeta,
    standard,
    standardCreatedOk,
    standardErrorMessage,
    standardsAsync,
  } = useStandardsStore();

  useEffect(() => {
    const savedSearch = JSON.parse(localStorage.getItem(STANDARDS_OPTIONS)) || null;
    const newSearch = {
      pageSize: savedSearch?.pageSize ? savedSearch.pageSize : VITE_PAGE_PAGESIZE,      
      pageNumber: 1,
      order: savedSearch?.order ? savedSearch.order : StandardOrderType.name,
    };

    const search = !!savedSearch ? savedSearch : newSearch;

    standardsAsync(search);
    localStorage.setItem(STANDARDS_OPTIONS, JSON.stringify(search));

    setNavbarTitle(dispatch, null);
  }, []);
  
  useEffect(() => {
    if (standardCreatedOk) {
      navigate(`/standards/${ standard.ID }`);
    }
  }, [standardCreatedOk]);

  useEffect(() => {
    if (!!standardErrorMessage) {
      Swal.fire('Standards', standardErrorMessage, 'error');
    }    
  }, [standardErrorMessage]);

  // METHODS

  const onClickGoPage = (page = 1) => {
    const savedSearch = JSON.parse(localStorage.getItem(STANDARDS_OPTIONS)) || null;
    const search = {
      ...savedSearch,
      pageNumber: page,
    };

    standardsAsync(search);
    localStorage.setItem(STANDARDS_OPTIONS, JSON.stringify(search));
  };

  const onClickOrderList = (order = StandardOrderType.name) => {
    const savedSearch = JSON.parse(localStorage.getItem(STANDARDS_OPTIONS)) || null;
    const search = {
      ...savedSearch,
      order: order
    }

    standardsAsync(search);
    localStorage.setItem(STANDARDS_OPTIONS, JSON.stringify(search));
  };

  return (
    <Container fluid className="py-4 px-0 px-sm-4">
      <Row>
        <Col>
          <Card className="mb-4">
            <Card.Header className="pb-0">
              <ToolbarForm />
            </Card.Header>
            <Card.Body className="px-0 pt-0 pb-2">
              { !!standardsMeta && (
                  <AryPagination
                    currentPage={ standardsMeta.CurrentPage } 
                    totalPages={ standardsMeta.TotalPages }
                    onClickGoPage={ onClickGoPage } 
                  />
              )}
              <StandardsTableList onOrder={ onClickOrderList } />
              { !!standardsMeta && (
                  <AryPagination
                    currentPage={ standardsMeta.CurrentPage } 
                    totalPages={ standardsMeta.TotalPages }
                    totalCount={ standardsMeta.TotalCount }
                    showStatistics="true"
                    onClickGoPage={ onClickGoPage } 
                    className="mt-2"
                  />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default ListView;