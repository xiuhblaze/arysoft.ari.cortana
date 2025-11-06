import { Field } from "formik";
import { Col, ListGroup, Row } from "react-bootstrap"
import { setADCList, useProposalController } from "../context/ProposalContext";
import { useADCsStore } from "../../../hooks/useADCsStore";
import { useProposalsStore } from "../../../hooks/useProposalsStore";
import { useState } from "react";
import enums from "../../../helpers/enums";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuilding, faSpinner, faTrashCan } from "@fortawesome/free-solid-svg-icons";

const ProposalEditADCs = ({ formik, readonly = false, ...props }) => {
    const [controller, dispatch] = useProposalController();
    const { adcList } = controller;
    const { ADCStatusType } = enums();

    // CUSTOM HOOKS

    const { adcs } = useADCsStore();

    const {
        adcAddAsync,
        adcRemoveAsync,
    } = useProposalsStore();

    // HOOKS

    const [adcSelected, setADCSelected] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [isDeleting, setIsDeleting] = useState(null);

    // METHODS

    const onADCSelected = (e) => {
        setADCSelected(e.target.value);
    }; // onADCSelected

    const onClickAdd = () => {
        if (readonly) { return; }
        if (isNullOrEmpty(adcSelected)) { return; }

        setIsAdding(true);

        if (adcsList.some(i => i.ID == adcSelected)) {
            Swal.fire('Add ADC', `The ADC is already added`, 'warning');
            setIsAdding(false);
            return;
        }

        adcAddAsync(adcSelected)
            .then(data => {
                if (!!data) {
                    const myADC = adcs.find(i => i.ID == adcSelected);

                    if (!!myADC) {
                        setADCList(dispatch, [
                            ...adcsList,
                            myADC,
                        ]);
                    }
                    setADCSelected(null);
                }
                setIsAdding(false);
            }).catch(err => {
                console.log('onClickAdd', err);
                Swal.fire('Add ADC', err, 'error');
                setIsAdding(false);
            });
    }; // onClickAdd

    return (
        <Row {...props}>
            <Col xs="12">
                <div className="mb-3">
                    <div className="bg-light border-radius-md p-3 pb-0">
                        <Row>
                            {
                                readonly ? (
                                    <Col xs="8" sm="10">
                                        <label className="form-label">Audit Day Calculation registers</label>
                                    </Col>
                                ) : (
                                    <>
                                        <Col xs="8" sm="10">
                                            <label className="form-label">Audit Day Calculation registers</label>
                                            <select
                                                className="form-select"
                                                value=""
                                                onChange={(e) => {
                                                    console.log('ProposalEditADCs.onChange', e.target.value);
                                                }}
                                            >
                                                <option value="">(select a ADC)</option>
                                                {
                                                    !!adcs && adcs.length > 0 && adcs.map(adc => (
                                                        <option
                                                            key={adc.ID}
                                                            value={adc.ID}
                                                            disabled={adc.Status != ADCStatusType.active}
                                                        >
                                                            [{adc.AppFormStandardName}] {adc.Description}
                                                        </option>
                                                    ))
                                                }
                                            </select>
                                        </Col>
                                        <Col xs="4" sm="2">
                                            <div className="d-grid gap-1 align-items-end">
                                                <label className="form-label">&nbsp;</label>
                                                <button type="button"
                                                    className="btn btn-link text-dark px-2"
                                                    onClick={onClickAdd}
                                                    disabled={isAdding || readonly}
                                                >
                                                    {isAdding ? <FontAwesomeIcon icon={faSpinner} spin /> : 'ADD'}
                                                </button>
                                            </div>
                                        </Col>
                                    </>
                                )
                            }
                            <Col xs="12">
                                {
                                    !!adcList && adcList.length > 0 ? (
                                        <ListGroup variant="flush" className="mb-3">
                                            {
                                                adcList.map(item =>
                                                    <ListGroup.Item key={item.ID}
                                                        className={`bg-transparent border-0 py-1 px-0 text-xs${item.Status != ADCStatusType.active ? ' opacity-6' : ''}`}
                                                        title={item.Status != ADCStatusType.active ? 'Inactive' : ''}
                                                    >
                                                        <div className='d-flex justify-content-between align-items-center'>
                                                            <span className="d-flex flex-row flex-wrap align-items-center">
                                                                <span className="text-dark font-weight-bold">
                                                                    {item.Description}
                                                                </span>
                                                                {/* <span className="text-secondary ms-2">
                                                                    <FontAwesomeIcon icon={faBuilding} className="me-1" />
                                                                    {item.Address}
                                                                </span>
                                                                <span className="text-secondary ms-2">
                                                                    <FontAwesomeIcon icon={faUsers} className="me-1" />
                                                                    Employees {item.EmployeesCount}
                                                                </span> */}
                                                            </span>
                                                            <button
                                                                type="button"
                                                                className="btn btn-link px-1 py-0 mb-0 text-secondary"
                                                                onClick={() => onClickRemove(item.ID)}
                                                                title="Delete"
                                                                disabled={isDeleting == item.ID || readonly}
                                                            >
                                                                {
                                                                    isDeleting == item.ID
                                                                        ? <FontAwesomeIcon icon={faSpinner} spin />
                                                                        : <FontAwesomeIcon icon={faTrashCan} size="lg" />
                                                                }
                                                            </button>
                                                        </div>
                                                    </ListGroup.Item>
                                                )
                                            }
                                        </ListGroup>
                                    ) : (<span>No ADCs added</span>)
                                }
                            </Col>
                        </Row>
                        <Field name="adcsCountHidden" type="hidden" value={formik.values.adcsCountHidden} />
                        {
                            formik.touched.adcsCountHidden && formik.errors.adcsCountHidden &&
                            <span className="text-danger text-xs">{formik.errors.adcsCountHidden}</span>
                        }
                    </div>
                </div>
            </Col>
        </Row>
    )
}

export default ProposalEditADCs;