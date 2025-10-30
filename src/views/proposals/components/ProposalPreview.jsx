import { Col, Container, Row } from "react-bootstrap";
import { useProposalController } from "../context/ProposalContext"
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

import logoARI from "../../../assets/img/lgoARI.png";
import hojaMembretadaEncabezado from "../../../assets/img/imgHojaMembretadaEncabezado.png";
import hojaMembretadaPie from "../../../assets/img/imgHojaMembretadaPie.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";

const ProposalPreview = ({ formik }) => {
    const [ controller, dispatch ] = useProposalController();
    const { 
        proposalData,
    } = controller;

    const headerStyle = 'col-3 text-xs text-wrap font-weight-bold bg-light';
    const bodyStyle = 'text-xs text-dark text-wrap';
    const separatorStyle = { height: '.25rem' };
    const internalTableStyle= 'table table-sm table-borderless pt-0 mb-0'; 
    const bodyWithTableStyle = `${bodyStyle} pt-0`;

    // HOOKS

    const contentRef = useRef(null);
    const reactToPrint = useReactToPrint({ contentRef });

    // METHODS

    const ShowFormatTextInput = (value, separator = '\n') => { //! Ver si esto se pone mejor en un JS helper
        return value != null 
            ? value.split(separator).map((item, index) => {
                return <div key={index} className="text-wrap">{item}</div>
            })
            : null
    } // ShowFormatTextInput

    return (
        <Container className="p-0">
            <Row>
                <Col xs="12">
                    <div className="d-flex justify-content-between align-items-center">
                        <h6 className="font-weight-bold mb-0">Proposal</h6> 
                        <div>
                            <button 
                                type="button"
                                className="btn btn-link text-dark mb-0"
                                onClick={() => reactToPrint()}
                            >
                                <FontAwesomeIcon icon={ faPrint } className="me-1" />
                                Print
                            </button>
                        </div>
                    </div>
                    <div ref={ contentRef }>
                        <div 
                            className="d-none d-print-block pt-3"
                            style={{
                                backgroundImage: `url(${hojaMembretadaEncabezado})`,
                                backgroundSize: '100% auto',
                                backgroundPosition: 'top center',
                                width: '100%',
                            }}
                        >
                            <div className="d-flex jutify-content-start align-items-center">
                                <img src={ logoARI } alt="logoARI" className="ms-3 me-4" style={{ maxHeight: '1in' }} />
                                <h5 className="">Proposal <br />
                                    {/* <small className="text-secondary ms-2">{ 
                                        !!proposalData.ADCs && proposalData.ADCs.length == 1
                                            ? proposalData.ADCs.map(adc => adc.AppFormStandardName)
                                            : proposalData.ADCs.length > 1
                                                ? 'Integral Proposal'
                                                : 'No ADCs'
                                    }</small> */}
                                </h5>
                            </div>
                        </div>
                        <table className="table table-borderless table-hover mx-print-3">
                            <tbody>
                                <tr>
                                    <td className={ headerStyle }>Organization name</td>
                                    <td className={ `${bodyStyle} font-weight-bold` }>
                                        { 
                                            
                                        }
                                    </td>  
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default ProposalPreview