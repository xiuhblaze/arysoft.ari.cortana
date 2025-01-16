
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

    const AuditorStandardOrderType = Object.freeze({
        nothing: 0,
        auditor: 1,
        standard: 2,
        updated: 3,
        auditorDesc: 4,
        standardDesc: 5,
        updatedDesc: 6
    });

    const AuditorOrderType = Object.freeze({
        nothing: 0,
        firstName: 1,
        isLeader: 2,
        updated: 3,
        firstNameDesc: 4,
        isLeaderDesc: 5,
        updatedDesc: 6,
    });

    const AuditorIsLeaderType = Object.freeze({
        nothing: 0,
        leader: 1,
        regular: 2,
    });

    const AuditorDocumentType = Object.freeze({
        nothing: 0,
        certificate: 1,
        course : 2,
        exam: 3,
        other: 4,
    });

    const AuditorDocumentValidityType = Object.freeze({
        nothing: 0,
        success: 1,    // Toda la documentacion esta en orden
        warning: 2,    // Al menos un documento esta por vencer
        danger: 3      // Al menos un documento esta vencido
    });

    const AuditorDocumentRequiredType = Object.freeze({
        nothing: 0,
        success: 1,    // Toda la documentación requerida se encuentra
        danger: 2      // Falta al menos un documento requerido
    });

    const AuditorDocumentOrderType = Object.freeze({
        nothing: 0,
        startDate: 1,
        updated: 2,
        startDateDesc: 3,
        updatedDesc : 4,
    });

    const CatAuditorDocumentType = Object.freeze({
        nothing: 0,
        hiring: 1,
        evaluation: 2,
        training: 3
    });
   
    const CatAuditorDocumentSubCategoryType = Object.freeze({
        nothing: 0,
        civ: 1,
        k: 2,
        l: 3
    });
   
    const CatAuditorDocumentPeriodicityType = Object.freeze({
        nothing: 0,
        days: 1,
        months: 2,
        years: 3
    });

    const CatAuditorDocumentOrderType = Object.freeze({
        nothing: 0,
        documentType: 1,
        order: 2,
        updated: 3,
        documentTypeDesc: 4,
        orderDesc: 5,
        updatedDesc: 6,
    });

    const CertificateValidityStatusType = Object.freeze({
        nothing: 0,
        success: 1,    // Todos los certificados activos son vigentes
        warning: 2,    // Al menos un certificado esta por vencer
        danger: 3      // Al menos un certificado esta vencido
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

    const ShiftOrderType = Object.freeze({
        nothing: 0,
        type: 1,
        noEmployees: 2,
        status: 3,
        updated: 4,
        typeDesc: 5,
        noEmployeesDesc: 6,
        statusDesc: 7,
        updatedDesc: 8
    });

    const ShiftType = Object.freeze({
        nothing: 0,
        morning: 1,
        evening: 2,
        night: 3,
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

    const StandardOrderType = Object.freeze({
        nothing: 0,
        name: 1,
        status: 2,
        update: 3,
        nameDesc: 4,
        statusDesc: 5,
        updateDesc: 6,
    });

    return {
        DefaultStatusType,

        ApplicationFormOrderType,
        ApplicationFormStatusType,
        AuditorStandardOrderType,
        AuditorOrderType,
        AuditorIsLeaderType,
        AuditorDocumentType,
        AuditorDocumentValidityType,
        AuditorDocumentRequiredType,
        AuditorDocumentOrderType,
        CatAuditorDocumentType,
        CatAuditorDocumentSubCategoryType,
        CatAuditorDocumentPeriodicityType,
        CatAuditorDocumentOrderType,
        CertificateValidityStatusType,
        ContactOrderType,
        NacecodeOrderType,
        OrganizationOrderType,
        OrganizationStatusType,
        ShiftOrderType,
        ShiftType,
        SiteOrderType,
        StandardOrderType,
    }
};

export default enums;