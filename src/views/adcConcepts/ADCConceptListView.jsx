
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Card, Col, Container, Row } from 'react-bootstrap';
import enums from '../../helpers/enums';
import envVariables from '../../helpers/envVariables';
import Swal from 'sweetalert2';

import { setNavbarTitle, useArysoftUIController } from '../../context/context';
import { useModuleNavigation } from '../../hooks/useModuleNavigation';
import { useADCConceptsStore } from '../../hooks/useADCConceptsStore';
import ADCConceptTableList from './components/ADCConceptTableList';
import AryPagination from '../../components/AryPagination/AryPagination';
import ADCConceptToolBar from './components/ADCConceptToolBar';
import { useViewNavigation } from '../../hooks/useViewNavigation';

const ADCConceptListView = () => {
    const { ADCCONCEPTS_OPTIONS } = envVariables();
    const { ADCConceptOrderType } = enums();

    // CUSTOM HOOKS

    const [controller, dispatch] = useArysoftUIController();
    const {
        adcConcept,
        adcConceptCreatedOk,
        adcConceptsMeta,
        adcConceptsErrorMessage,
        adcConceptsAsync
    } = useADCConceptsStore();

    // const {
    //     onSearch,
    //     onPageChange,
    // } = useModuleNavigation(adcConceptsAsync, ADCCONCEPTS_OPTIONS, ADCConceptOrderType.standard);
    const {
        onSearch,
        onPageChange
    } = useViewNavigation({
        LS_OPTIONS: ADCCONCEPTS_OPTIONS,
        DefultOrder: ADCConceptOrderType.standard,
        itemsAsync: adcConceptsAsync,
    });

    // HOOKS

    useEffect(() => {
        onSearch();
        setNavbarTitle(dispatch, null);
    }, []);

    // useEffect(() => {        
    //     if (!!adcConceptCreatedOk) {
    //         navigate(`/adc-concepts/${adcConcept.ID}`);
    //     }
    // }, [adcConceptCreatedOk]);

    useEffect(() => {
        if (!!adcConceptsErrorMessage) {
            Swal.fire('ADC Concepts', adcConceptsErrorMessage, 'error');
        }
    }, [adcConceptsErrorMessage]);

    return (
        <Container fluid className="py-4 px-0 px-sm-4">
            <Row>
                <Col>
                    <Card className="mb-4">
                        <Card.Header className="pb-0">
                            <ADCConceptToolBar />
                        </Card.Header>
                        <Card.Body className="px-0 pt-0 pb-2">
                            { !!adcConceptsMeta ? (
                                <AryPagination
                                    currentPage={adcConceptsMeta.CurrentPage}
                                    totalPages={adcConceptsMeta.TotalPages}
                                    onClickGoPage={onPageChange}
                                />
                            ) : null }
                            <ADCConceptTableList />
                            { !!adcConceptsMeta ? (
                                <AryPagination
                                    currentPage={adcConceptsMeta.CurrentPage}
                                    totalPages={adcConceptsMeta.TotalPages}
                                    onClickGoPage={onPageChange}
                                />
                            ) : null }
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
};

export default ADCConceptListView;