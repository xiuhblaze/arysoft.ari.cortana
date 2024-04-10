import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Col, Container, Row } from "react-bootstrap";
import Swal from 'sweetalert2';

import envVariables from "../../helpers/envVariables";
import { setNavbarTitle, useArysoftUIController } from "../../context/context";
import enums from "../../helpers/enums";

import AryPagination from "../../components/AryPagination/AryPagination";
import NaceTableList from "./components/NaceTableList";
import ToolbarForm from "./components/ToolbarForm";
import useNacecodesStore from "../../hooks/useNaceCodesStore";

export const ListView = () => {
  const navigate = useNavigate();
  const { 
    NACECODES_OPTIONS, 
    VITE_PAGE_PAGESIZE,
  } = envVariables();
  const [controller, dispatch] = useArysoftUIController();
  const { NacecodeOrderType } = enums();
  const {
    nacecodesMeta,
    nacecode,
    nacecodeCreatedOk,
    nacecodeErrorMessage,
    nacecodesAsync,
  } = useNacecodesStore();


  useEffect(() => {
    const savedSearch = JSON.parse(localStorage.getItem(NACECODES_OPTIONS)) || null;
    const newSearch = {
      pageSize: savedSearch?.pageSize ? savedSearch.pageSize : VITE_PAGE_PAGESIZE,      
      pageNumber: 1,
      order: savedSearch?.order ? savedSearch.order : NacecodeOrderType.sector,
    };

    const search = !!savedSearch ? savedSearch : newSearch;

    nacecodesAsync(search);
    localStorage.setItem(NACECODES_OPTIONS, JSON.stringify(search));

    setNavbarTitle(dispatch, null);
  }, []);
  
  useEffect(() => {
    if (nacecodeCreatedOk) {
      navigate(`/nace-codes/${ nacecode.ID }`);
    }
  }, [nacecodeCreatedOk]);

  useEffect(() => {
    if (!!nacecodeErrorMessage) {
      Swal.fire('Nace codes', nacecodeErrorMessage, 'error');
    }    
  }, [nacecodeErrorMessage]);
  

  // Methods

  const onClickGoPage = (page = 1) => {
    const savedSearch = JSON.parse(localStorage.getItem(NACECODES_OPTIONS)) || null;
    const search = {
      ...savedSearch,
      pageNumber: page,
    };

    nacecodesAsync(search);
    localStorage.setItem(NACECODES_OPTIONS, JSON.stringify(search));
  };

  const onClickOrderList = (order = AdminOrdenType.fechaInicioDesc) => {
    //console.log('onClickOrderList', order);

    const savedSearch = JSON.parse(localStorage.getItem(NACECODES_OPTIONS)) || null;
    const search = {
      ...savedSearch,
      order: order
    }

    nacecodesAsync(search);
    localStorage.setItem(NACECODES_OPTIONS, JSON.stringify(search));
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
              { !!nacecodesMeta && (
                <AryPagination
                  currentPage={ nacecodesMeta.CurrentPage } 
                  totalPages={ nacecodesMeta.TotalPages }
                  onClickGoPage={ onClickGoPage }
                />
              ) }
              <NaceTableList />              
              { !!nacecodesMeta && (
                <AryPagination
                  currentPage={ nacecodesMeta.CurrentPage } 
                  totalPages={ nacecodesMeta.TotalPages }
                  totalCount={ nacecodesMeta.TotalCount }
                  showStatistics
                  onClickGoPage={ onClickGoPage }
                  className="mt-2"
                />
              ) }
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
};

export default ListView;
