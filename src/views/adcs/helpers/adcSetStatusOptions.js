import enums from "../../../helpers/enums";
import adcStatusProps from "./adcStatusProps";

const adcSetStatusOptions = (adcCurrentStatus) => {

    const { ADCStatusType } = enums();

    const currentOption = {
        value: adcStatusProps[adcCurrentStatus].value,
        label: adcStatusProps[adcCurrentStatus].label
    };

    switch (adcCurrentStatus) {
        case ADCStatusType.nothing:
        case ADCStatusType.new:
            return [
                currentOption,
                { value: ADCStatusType.review, label: 'Review' },
                { value: ADCStatusType.cancel, label: 'Cancel' },
            ];

        case ADCStatusType.review:
            return [
                currentOption,
                { value: ADCStatusType.rejected, label: 'Reject' },
                { value: ADCStatusType.active, label: 'Approve' },
                { value: ADCStatusType.cancel, label: 'Cancel' },
            ];

        case ADCStatusType.rejected:
            return [
                currentOption,
                { value: ADCStatusType.review, label: 'Review' },
                { value: ADCStatusType.cancel, label: 'Cancel' },
            ];

        case ADCStatusType.active:
            return [
                currentOption,
                { value: ADCStatusType.inactive, label: 'Inactive' },
                { value: ADCStatusType.cancel, label: 'Cancel' },
            ];            

        case ADCStatusType.inactive:
            return [
                currentOption,
                { value: ADCStatusType.review, label: 'Review' },
                { value: ADCStatusType.cancel, label: 'Cancel' },
            ];

        case ADCStatusType.cancel:
            return [
                currentOption,
                { value: ADCStatusType.new, label: 'New' },
            ];

        case ADCStatusType.deleted:
            return [
                { value: ADCStatusType.deleted, label: 'Deleted' },
            ];
    }
};

export default adcSetStatusOptions;