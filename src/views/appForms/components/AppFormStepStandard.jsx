import { useEffect, useState } from 'react'
import { useAppFormsStore } from '../../../hooks/useAppFormsStore';
import { useAuditCyclesStore } from '../../../hooks/useAuditCyclesStore';
import { Col, Row } from 'react-bootstrap';
import { AryFormikSelectInput } from '../../../components/Forms';
import enums from '../../../helpers/enums';
import FormLoading from '../../../components/Loaders/FormLoading';
import AppFormISO9K from './AppFormISO9K';
import { setStandardData, useAppFormController } from '../context/appFormContext';

const AppFormStepStandard = ({ formik }) => {
    const [ controller, dispatch ] = useAppFormController();
    const { standardData } = controller;
    const { standardBase } = standardData;
    const { StandardBaseType } = enums();
    //const [standardSelected, setStandardSelected] = useState(null);

    const {
        auditCycle
    } = useAuditCyclesStore();

    const {
        appForm
    } = useAppFormsStore();

    // HOOKS

    // useEffect(() => {

    //     if (!!appForm) {
    //         setStandardData(dispatch, {
    //             ...standardData,
    //             standardBase: appForm.Standard?.StandardBase,
    //         });
    //         //setStandardSelected(appForm.Standard?.StandardBase);
    //     }
    // }, [appForm]);

    // METHODS

    // const onStandardSelectChange = (e) => {
    //     const selectedValue = e.target.value;
    //     formik.setFieldValue('standardSelect', selectedValue);
    //     setStandardData(dispatch, {
    //         ...standardData,
    //         standardBase: selectedValue,
    //     });
    // };
    
    return (
        <div>
            {/* <Row>
                <Col xs="12">
                    <AryFormikSelectInput
                        name="standardSelect"
                        label="Standard"
                        onChange={ onStandardSelectChange}
                    >
                        <option value="">Select a standard</option>
                        { auditCycle.AuditCycleStandards.map((standard) => (
                            <option key={standard.ID} value={standard.StandardBase}>{standard.StandardName}</option>
                        )) }
                    </AryFormikSelectInput>
                </Col>
            </Row> */}
            {
                (!standardBase || standardBase == StandardBaseType.nothing) &&
                <Row>
                    <Col xs="12">
                        <FormLoading />
                    </Col>
                </Row>
            }
            { standardBase == StandardBaseType.iso9k && <AppFormISO9K formik={formik} /> }
        </div>
    )
}

export default AppFormStepStandard