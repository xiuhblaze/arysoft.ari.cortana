
import { Col, Row } from 'react-bootstrap';
import enums from '../../../helpers/enums';
import FormLoading from '../../../components/Loaders/FormLoading';
import AppFormISO9K from './AppFormISO9K';
import { useAppFormController } from '../context/appFormContext';

const AppFormStepStandard = ({ formik, readonly = false, ...props }) => {
    const [ controller, dispatch ] = useAppFormController();
    const { standardData } = controller;
    const { standardBase } = standardData;
    const { StandardBaseType } = enums();
    
    return (
        <div {...props}>
            {
                (!standardBase || standardBase == StandardBaseType.nothing) &&
                <Row>
                    <Col xs="12">
                        <FormLoading />
                    </Col>
                </Row>
            }
            { standardBase == StandardBaseType.iso9k && <AppFormISO9K formik={formik} readonly={readonly} /> }
        </div>
    )
}

export default AppFormStepStandard;