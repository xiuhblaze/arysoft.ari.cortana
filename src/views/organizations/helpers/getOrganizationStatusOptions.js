import enums from "../../../helpers/enums";

const getOrganizationStatusOptions = (status, isAdmin = false) => {

    const { OrganizationStatusType } = enums();
    const statusOptions = [];

    switch (status) {
        case OrganizationStatusType.nothing:
            statusOptions.push({ value: OrganizationStatusType.applicant, label: 'Applicant' });
            break;
        case OrganizationStatusType.applicant:
            statusOptions.push({ value: OrganizationStatusType.applicant, label: 'Applicant' });
            if (isAdmin) {
                statusOptions.push({ value: OrganizationStatusType.active, label: 'Active' });
            }
            break;            
        case OrganizationStatusType.active:
            statusOptions.push({ value: OrganizationStatusType.active, label: 'Active' });
            statusOptions.push({ value: OrganizationStatusType.inactive, label: 'Inactive' });
            break;
        case OrganizationStatusType.inactive:
            statusOptions.push({ value: OrganizationStatusType.active, label: 'Active' });
            statusOptions.push({ value: OrganizationStatusType.inactive, label: 'Inactive' });
            break;
        case OrganizationStatusType.deleted:
            statusOptions.push({ value: OrganizationStatusType.deleted, label: 'Deleted' });
            if (isAdmin) {
                statusOptions.push({ value: OrganizationStatusType.applicant, label: 'Applicant' });
            }
            break;
    }

    return statusOptions;
};

export default getOrganizationStatusOptions;