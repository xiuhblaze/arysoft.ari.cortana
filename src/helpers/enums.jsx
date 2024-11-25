
const enums = () => {

    const DefaultStatusType = Object.freeze({
        nothing: 0,
        active: 1,
        inactive: 2,
        deleted: 3,
    });

    const ApplicationFormStatusType = Object.freeze({
        nothing: 0,
        new: 1,
        send: 2,
        salesReview: 3,
        applicantReview: 4,
        salesEvaluation: 5,
        acceptedClient: 6,
        rejectedClient: 7,
        acreditedAuditor: 8,
        // Todo: Faltan estados
        active: 9,
        // Todo: Faltan estados
        cancel: 10,
        deleted: 11,
    });

    const ApplicationFormOrderType = Object.freeze({
        nothing: 0,
        organization: 1,
        created: 2,
        organizationDesc: 3,
        createdDesc: 4,
    });

    const ContactOrderType = Object.freeze({
        nothing: 0,
        firstName: 1,
        isMainContact: 2,
        updated: 3,
        firstNameDesc: 4,
        isMainContactDesc: 5,
        updatedDesc: 6,
    });

    const NacecodeOrderType = Object.freeze({
        nothing: 0,
        sector: 1,
        description: 2,
        updated: 3,
        sectorDesc: 4,
        descriptionDesc: 5,
        updatedDesc: 6
    });

    const OrganizationStatusType = Object.freeze({
        nothing: 0,
        new: 1,
        approved: 2,
        active: 3,
        inactive: 4,
        deleted: 5,
    });

    const OrganizationOrderType = Object.freeze({
        nothing: 0,
        name: 1,
        legalEntity: 2,
        status: 3,
        updated: 4,
        nameDesc: 5,
        legalEntityDesc: 6,
        statusDesc: 7,
        updatedDesc: 8,
    });

    const StandardOrderType = Object.freeze({
        nothing: 0,
        name: 1,
        status: 2,
        update: 3,
        nameDesc: 4,
        statusDesc: 5,
        updateDesc: 6,
    });

    const SiteOrderType = Object.freeze({
        nothing: 0,
        description: 1,
        isMainSite: 2,
        status: 3,
        updated: 4,
        descriptionDesc: 5,
        isMainSiteDesc: 6,
        statusDesc: 7,
        updatedDesc: 8,
    });

    return {
        DefaultStatusType,

        ApplicationFormStatusType,
        ApplicationFormOrderType,
        ContactOrderType,
        NacecodeOrderType,
        OrganizationStatusType,
        OrganizationOrderType,
        SiteOrderType,
        StandardOrderType,
    }
};

export default enums;