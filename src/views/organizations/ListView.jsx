import { useEffect } from "react";
import { useNavigate } from "react-router-dom"
import Swal from 'sweetalert2';

import envVariables from "../../helpers/envVariables";
import { setNavbarTitle, useArysoftUIController } from "../../context/context";
import enums from "../../helpers/enums";

import { useOrganizationsStore } from "../../hooks/useOrganizationsStore";
import { Card, Col, Container, Row } from "react-bootstrap";
import AryPagination from "../../components/AryPagination/AryPagination";
import OrganizationsTableList from "./components/OrganizationsTableList";
import Toolbar from "./components/Toolbar";

const ListView = () => {
  //const navigate = useNavigate();
  const {
    ORGANIZATIONS_OPTIONS,
    VITE_PAGE_PAGESIZE,
  } = envVariables();
  const [controller, dispatch] = useArysoftUIController();
  const { OrganizationOrderType } = enums();
  const {
    organizationsMeta,
    organization,
    organizationCreatedOk,
    organizationsErrorMessage,
    organizationsAsync,
  } = useOrganizationsStore();

  useEffect(() => {
    const savedSearch = JSON.parse(localStorage.getItem(ORGANIZATIONS_OPTIONS)) || null;
    const newSearch = {
      pageSize: savedSearch?.pageSize ? savedSearch.pageSize : VITE_PAGE_PAGESIZE,      
      pageNumber: 1,
      order: savedSearch?.order ? savedSearch.order : OrganizationOrderType.name,
    };

    const search = !!savedSearch ? savedSearch : newSearch;

    organizationsAsync(search);
    localStorage.setItem(ORGANIZATIONS_OPTIONS, JSON.stringify(search));

    setNavbarTitle(dispatch, null);
  }, []);
  
  // useEffect(() => {
  //   if (organizationCreatedOk) {
  //     navigate(`/organizations/${ organization.OrganizationID }`);
  //   }
  // }, [organizationCreatedOk]);

  useEffect(() => {
    if (!!organizationsErrorMessage) {
      Swal.fire('Organizations', organizationsErrorMessage, 'error');
    }    
  }, [organizationsErrorMessage]);

  // METHODS

  const onClickGoPage = (page = 1) => {
    const savedSearch = JSON.parse(localStorage.getItem(ORGANIZATIONS_OPTIONS)) || null;
    const search = {
      ...savedSearch,
      pageNumber: page,
    };

    organizationsAsync(search);
    localStorage.setItem(ORGANIZATIONS_OPTIONS, JSON.stringify(search));
  };

  const onClickOrderList = (order = OrganizationOrderType.name) => {
    const savedSearch = JSON.parse(localStorage.getItem(ORGANIZATIONS_OPTIONS)) || null;
    const search = {
      ...savedSearch,
      order: order
    }

    organizationsAsync(search);
    localStorage.setItem(ORGANIZATIONS_OPTIONS, JSON.stringify(search));
  };

  return (
    <Container fluid className="py-4 px-0 px-sm-4">
      <Row>
        <Col>
          <Card className="mb-4">
            <Card.Header className="pb-0">
              <Toolbar />
            </Card.Header>
            <Card.Body className="px-0 pt-0 pb-2">
              { !!organizationsMeta && (
                <AryPagination
                  currentPage={ organizationsMeta.CurrentPage } 
                  totalPages={ organizationsMeta.TotalPages }
                  onClickGoPage={ onClickGoPage } 
                />
              )}
              <OrganizationsTableList onOrder={ onClickOrderList } />
              { !!organizationsMeta && (
                <AryPagination
                  currentPage={ organizationsMeta.CurrentPage } 
                  totalPages={ organizationsMeta.TotalPages }
                  totalCount={ organizationsMeta.TotalCount }
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

export default ListView