import { Col, Container, ListGroup, Row } from "react-bootstrap";
import { useProposalController } from "../context/ProposalContext"
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

import logoARI from "../../../assets/img/lgoARI.png";
import hojaMembretadaEncabezado from "../../../assets/img/imgHojaMembretadaEncabezado.png";
import hojaMembretadaPie from "../../../assets/img/imgHojaMembretadaPie.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobeAmericas, faPrint } from "@fortawesome/free-solid-svg-icons";
import isNullOrEmpty from "../../../helpers/isNullOrEmpty";
import ProposalPreviewADC from "./ProposalPreviewADC";
import ProposalPreviewJustification from "./ProposalPreviewJustification";
import ShowFormatTextInput from "../../../components/General/ShowFormatTextInput";

const ProposalPreview = ({ formik }) => {
    const [ controller, dispatch ] = useProposalController();
    const { 
        organizationData,
        proposalData,
        contactList,
    } = controller;

    const headerStyle = 'col-3 text-xs text-wrap font-weight-bold bg-light';
    const bodyStyle = 'text-xs text-dark text-wrap';
    const separatorStyle = { height: '.25rem' };
    const internalTableStyle= 'table table-sm table-borderless pt-0 mb-0'; 
    const bodyWithTableStyle = `${bodyStyle} pt-0`;

    const borderTablePrintStyle = 'd-none d-print-block mx-print-3';

    // HOOKS

    const contentRef = useRef(null);
    const reactToPrint = useReactToPrint({ contentRef });

    // METHODS

    const getSubTitle = () => {
        if (!!proposalData) {
            if (!!proposalData.ADCs && proposalData.ADCs.length > 1) {
                return <span>Integral Proposal<br />
                    { proposalData.ADCs.map(adc => adc.AppFormStandardName).join(' | ') }
                </span>
            } else {
                return proposalData.ADCs[0].AppFormStandardName;
            }
        }
    };

    return (
        <Container className="p-0">
            <Row>
                <Col xs="12">
                    <div className="d-flex justify-content-between align-items-center">
                        <h6 className="font-weight-bold mb-0">Proposal <br />
                            <small className="text-ari">{ getSubTitle() }</small>
                        </h6> 
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
                            <div className="d-flex justify-content-start align-items-center">
                                <img src={ logoARI } alt="logoARI" className="ms-3 me-4" style={{ maxHeight: '1in' }} />
                                <h5 className="">Proposal <br />
                                    <small className="text-ari">{ getSubTitle() }</small>
                                </h5>
                            </div>
                        </div>
                        <table className="table table-borderless table-hover tabla-with-print-border">
                            <tbody>
                                <tr>
                                    <td className={ headerStyle }>Organization name</td>
                                    <td className={ `${bodyStyle} font-weight-bold` }>
                                        { !!organizationData ? organizationData.OrganizationName : null }
                                    </td>  
                                </tr>
                                <tr>
                                    <td className={ headerStyle }>Legal entity</td>
                                    <td className={ bodyStyle }>
                                        { 
                                            !!organizationData && !!organizationData.Companies && organizationData.Companies.length > 0 &&
                                            organizationData.Companies
                                                .map(company => <div key={company.ID}>
                                                <span className="text-dark">{ company.Name }</span>
                                                <span className="ms-1">
                                                    { company.LegalEntity }
                                                </span>

                                            </div>)
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <td className={ headerStyle }>Site address</td>
                                    <td className={ bodyStyle }>
                                        { 
                                            !!proposalData && proposalData.Sites?.length > 0 
                                            && proposalData.Sites.map(site => {                                            
                                                return <div key={site.ID}>
                                                    <p className="text-xs text-dark mb-0">
                                                        <span className={ site.IsMainSite ? 'font-weight-bold' : '' }> 
                                                            {site.Description}
                                                        </span> - { isNullOrEmpty(site.Address) ? '(no address)' : site.Address }
                                                    </p>
                                                </div>
                                            })
                                        }
                                    </td>
                                </tr>
                                <tr style={separatorStyle}></tr>
                                <tr>
                                    <td className={ headerStyle }>Website</td>
                                    <td className={ bodyStyle }>{ !!organizationData ? organizationData.Website : null }</td>
                                </tr>
                                <tr>
                                    <td className={ headerStyle }>Phone number</td>
                                    <td className={ bodyStyle }>{ !!organizationData ? organizationData.Phone : null }</td>
                                </tr>
                                <tr>
                                    <td className={ headerStyle }>Contact</td>
                                    <td className={ bodyStyle }>
                                        {
                                            contactList?.length > 0 && contactList.map(contact => {
                                                return <div key={contact.ID} className="mb-1">
                                                    <p className="text-xs text-dark mb-0">
                                                        <span className={ contact.IsMainContact ? 'font-weight-bold' : '' }> 
                                                            {contact.FullName}
                                                        </span> - { contact.Position }
                                                    </p>
                                                    <div className="d-flex justify-content-start gap-2 text-xs mb-0">
                                                        { !isNullOrEmpty(contact.Email) ? <span>Email: {contact.Email}</span> : null }
                                                        { !isNullOrEmpty(contact.Phone) ? <span>Phone: {contact.Phone}</span> : null }
                                                    </div>
                                                </div>
                                            })
                                        }
                                    </td>
                                </tr>
                                <tr style={separatorStyle}></tr>
                                <tr>
                                    <td className={ headerStyle }>Scope</td>
                                    <td className={ bodyStyle }>
                                        { !!proposalData && proposalData.Scopes.length > 0 ? (
                                            proposalData.Scopes.map((scope, index) => 
                                                <div key={index} className="text-xs text-dark mb-0">
                                                    { ShowFormatTextInput(scope) }
                                                </div>
                                            )
                                        ) : null }</td>
                                </tr>
                                <tr>
                                    <td className={ headerStyle }>Number of employees</td>
                                    <td className={ bodyStyle }>
                                        { 
                                            !!proposalData && proposalData.ADCs.length > 0
                                                ? proposalData.ADCs[0].TotalEmployees 
                                                : null 
                                        }
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <ProposalPreviewADC />
                        <ProposalPreviewJustification formik={ formik } />
                        <div className="d-none d-print-block">
                            <ul className="list-group list-group-flush text-xs mb-4">
                                <li className="list-group-item bg-transparent text-end border-0 py-0 pb-1">
                                    {/* TODO: Validar si estan incuidos los gastos de viaje y impuestos */}
                                    Travel expenses are not included
                                </li>
                                <li className="list-group-item bg-transparent text-end border-0 py-0 pb-1"> 
                                    Only major nonconformities will be on site (0.5 or 1 additional 
                                    dit day), cost not included in this proposal
                                </li>
                                <li className="list-group-item bg-transparent text-end border-0 py-0 pb-1">
                                    <strong>No hidden costs</strong>
                                </li>
                                <li className="list-group-item bg-transparent text-end border-0 py-0 pb-1">
                                    This proposal is effect for term of 3 months, from the issued 
                                    date of this document
                                </li>
                                <li className="list-group-item bg-transparent text-end border-0 py-0 pb-1">
                                    Every year an adjustment calculation will be made to the cost of 
                                    this proposal, based on the actual number of employees in the 
                                    organization
                                </li>
                            </ul>
                        </div>
                        <table className="table table-borderless table-hover mx-print-3">
                            <tbody>
                                <tr>
                                    <td className={ headerStyle }>Signature</td>
                                    <td className={`${bodyStyle} border-bottom` }></td>
                                </tr>
                                <tr>
                                    <td className={ headerStyle }>Name</td>
                                    <td className={ `${bodyStyle} font-weight-bold` }>
                                        { formik?.values?.signerNameInput }
                                    </td>
                                </tr>
                                <tr>
                                    <td className={ headerStyle }>Position</td>
                                    <td className={ bodyStyle }>{ formik?.values?.signerPositionInput }</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="d-none d-print-block">
                            <p className="text-sm text-dark text-center">
                                I do accept the terms showed in this proposal. This proposal is linked to Contract Agreement.
                            </p>
                            <h5 className="text-sm text-dark mx-print-3 my-4">
                                Sincerely,<br />
                                <strong>American Registration Inc., S.C.</strong><br />
                                Sales Department – México
                            </h5>
                            <p className="text-xs mx-print-3 mx-print-3">
                                The contents of this document, are confidential and solely intended for the use of 
                                the addressee. If you receive this proposal by error, then we kindly request you to 
                                notify the sender thereof immediately, and to delete the e-mail and the attachments 
                                without printing, copying or distributing any of those.<br/>
                                The publication, copying whole or in part or use or dissemination in any other way 
                                of the e-mail and attachments by others than the intended person(s) is prohibited. 
                                The sender cannot guarantee the security of electronic communication and is not liable
                                for any negative consequence of the use of electronic communication, including but not 
                                limited to, damage as a result of in or non-complete delivery.
                            </p>
                            <p className="text-center text-xs">
                                <a href="https://aarrin.com" target="_blank">
                                    <FontAwesomeIcon icon={ faGlobeAmericas } className="opacity-6 text-dark me-2" />
                                    aarrin.com
                                </a>
                            </p>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default ProposalPreview