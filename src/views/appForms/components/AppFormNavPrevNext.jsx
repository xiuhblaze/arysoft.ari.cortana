import { Col, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

import navOptions from '../helpers/appFormNavOptions';

const AppFormNavPrevNext = ({navOption, setNavOption}) => {

    // METHODS

    const onClickBack = () => {

        if (navOption == navOptions.general) {
            setNavOption(navOptions.standard);
        } else if (navOption == navOptions.standard) {
            setNavOption(navOptions.organization);
        }        
    }; // onClickBack

    const onClickNext = () => {

        if (navOption == navOptions.organization) {
            setNavOption(navOptions.standard);
        } else if (navOption == navOptions.standard) {
            setNavOption(navOptions.general);
        }
    }; // onClickNext

    return (
        <Row>
            <Col xs="12">
                <div className="d-flex justify-content-between align-items-center">                                                                        
                    <button 
                        type="button"
                        className={`btn btn-link text-${ navOption == navOptions.organization ? 'secondary' : 'dark' } px-0`}
                        onClick={ onClickBack }
                        disabled={ navOption == navOptions.organization }
                    >
                        <FontAwesomeIcon icon={ faChevronLeft } className="me-1"/>
                        Back
                    </button>
                    <button 
                        type="button"
                        className={`btn btn-link text-${ navOption == navOptions.general ? 'secondary' : 'dark' } px-0`}
                        onClick={ onClickNext }
                        disabled={ navOption == navOptions.general }
                    >
                        Next
                        <FontAwesomeIcon icon={ faChevronRight } className="ms-1" />
                    </button>
                </div>
            </Col>
        </Row>
    );
}; 

export default AppFormNavPrevNext