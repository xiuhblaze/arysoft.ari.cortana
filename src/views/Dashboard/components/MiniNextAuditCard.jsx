import { useEffect, useState } from "react"
import { Card, Col, Row } from "react-bootstrap"
import { differenceInDays } from "date-fns"
import { faMagnifyingGlass, faSpinner } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { useAuditsStore } from "../../../hooks/useAuditsStore"
import { useAuthStore } from "../../../hooks/useAuthStore"
import { useUsersStore } from "../../../hooks/useUsersStore"
import enums from "../../../helpers/enums"
import AuditModalEditItem from "../../audits/components/AuditModalEditItem"
import aryDateTools from "../../../helpers/aryDateTools"

const MiniNextAuditCard = () => {

    const {
        UserType
    } = enums();

    const { getLocalDate } = aryDateTools();

    // CUSTOM HOOKS

    const {
        user: authUser,
    } = useAuthStore();

    const { 
        isUserLoading,
        user,
        userAsync,
        usersErrorMessage,
    } = useUsersStore();

    const {
        getNextAuditAsync,
    } = useAuditsStore();

    // HOOKS

    const [nextAudit, setNextAudit] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {       

        if (!!authUser)
        {
            userAsync(authUser.id);
        }
    }, []);

    useEffect(() => {

        if (!!user)
        {
            if ((user.Type == UserType.superAdmin || user.Type == UserType.admin || user.Type == UserType.auditor) 
                && user.OwnerID) {

                setIsLoading(true);
                getNextAuditAsync(user.OwnerID, null, UserType.auditor)
                    .then(data => {
                        if (!!data) {
                            // console.log('MiniNextAuditCard.useEffect[]: data', data);
                            setNextAudit(data);
                        }
                        setIsLoading(false);
                    })
                    .catch(error => {
                        console.log(error);
                        setNextAudit(null);
                        setIsLoading(false);
                    });
            }
        }

    }, [user]);
    
    useEffect(() => {
        if (!!usersErrorMessage) {
            console.log(`MiniNextAuditCard(error): ${ usersErrorMessage }`);
        }
    }, [usersErrorMessage]);

    // METHODS

    const onShowModal = () => {
        if (!!nextAudit) {
            setShowModal(true);
        }
    }; // onShowModal

    const onCloseModal = () => {
            setShowModal(false);
    };

    return (
        <>
        <Card>
            <Card.Body className="p-3">
                <Row>
                    <Col xs="8">
                        <div className="numbers">
                            <p className="text-sm mb-0 text-capitalize font-weight-bold">
                                {
                                    isUserLoading || isLoading ? 'Loading...'
                                    : !!nextAudit ? 'Next audit'
                                    : 'No next audits'
                                }
                            </p>
                            <h5 
                                className="font-weight-bolder mb-0"
                                title={ !!nextAudit ? getLocalDate(new Date(nextAudit.StartDate), false) : null }
                            >
                                { !!nextAudit 
                                    ? differenceInDays(getLocalDate(nextAudit.StartDate, false), (new Date()).setHours(0, 0, 0, 0)) 
                                    : <FontAwesomeIcon icon={ faSpinner } className="text-secondary" size="sm" spin /> } 
                                <span className="text-info text-sm font-weight-bolder ms-1">days left</span>
                            </h5>
                        </div>
                    </Col>
                    <Col xs="4" className="d-flex align-items-center justify-content-end">
                        <div className="icon icon-shape bg-gradient-info shadow text-white border-radius-md d-flex align-items-center justify-content-center"
                            style={{ cursor: 'pointer' }}
                            onClick={onShowModal}
                            title="Show next audit"
                        >
                            <FontAwesomeIcon icon={ faMagnifyingGlass } size="lg" className="opacity-10" aria-hidden="true" />
                        </div>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
        {
            !!nextAudit && (
                <AuditModalEditItem
                    id={ nextAudit.ID }
                    show={showModal}
                    onHide={onCloseModal}
                />
            )
        }
        </>
    )
}

export default MiniNextAuditCard