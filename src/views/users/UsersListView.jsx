import { useEffect } from "react";
import { Card, Container, Row, Col } from "react-bootstrap";
import Swal from "sweetalert2";

import { setHelpContent, setNavbarTitle, useArysoftUIController } from "../../context/context";
import { useUsersStore } from "../../hooks/useUsersStore";
import useUsersNavigation from "./hooks/useUsersNavigation";
import AryPagination from "../../components/AryPagination/AryPagination";
import UserTableList from "./components/UserTableList";
import UsersToolbar from "./components/UsersToolbar";
import { useNavigate } from "react-router-dom";

export const UsersListView = () => {
    
    // CUSTOM HOOKS
    
    const [controller, dispatch] = useArysoftUIController();
    const {
        user,
        userCreatedOk,
        usersMeta,
        usersErrorMessage,
    } = useUsersStore();
    const {
        onSearch,
        onPageChange,
    } = useUsersNavigation();

    // HOOKS

    const navigate = useNavigate();

    useEffect(() => {
        onSearch();

        setNavbarTitle(dispatch, null);
        setHelpContent(dispatch, null);
    }, []);

    useEffect(() => {
        if (!!userCreatedOk) {
            navigate(`/users/${user.ID}`);
        }
    }, [userCreatedOk]);

    useEffect(() => {
        if (!!usersErrorMessage) {
            Swal.fire('Users', usersErrorMessage, 'error');
        }
    }, [usersErrorMessage]);
    
    return (
        <Container fluid className="py-4 px-0 px-sm-4">
            <Row>
                <Col>
                    <Card className="mb-4">
                        <Card.Header>
                            <UsersToolbar />
                        </Card.Header>
                        <Card.Body className="px-0 pt-0 pb-2">
                            {
                                !!usersMeta ? (
                                    <AryPagination
                                        currentPage={usersMeta.CurrentPage}
                                        totalPages={usersMeta.TotalPages}
                                        onClickGoPage={onPageChange}
                                    />
                                ) : null
                            }
                            <UserTableList />
                            {
                                !!usersMeta ? (
                                    <AryPagination
                                        currentPage={usersMeta.CurrentPage}
                                        totalPages={usersMeta.TotalPages}
                                        onClickGoPage={onPageChange}
                                    />
                                ) : null
                            }
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default UsersListView;