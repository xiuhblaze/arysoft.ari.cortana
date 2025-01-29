
const enums = () => {

    const DefaultStatusType = Object.freeze({
        nothing: 0,
        active: 1,
        inactive: 2,
        deleted: 3,
    });

    const DefaultValidityStatusType = Object.freeze({
        nothing: 0,
        success: 1,
        warning: 2,
        danger: 3,
    });

    // Application Forms

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

    // Auditors

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

    // Auditors Documents

    const AuditorDocumentType = Object.freeze({
        nothing: 0,
        certificate: 1,
        course: 2,
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
        updatedDesc: 4,
    });

    // Categories Auditors Documents

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

    // Certificates 

    const CertificateFilterDateType = Object.freeze({
        nothing: 0,
        startDate: 1,
        dueDate: 2,
        prevAuditDate: 3,
        nextAuditDate: 4,
    });

    const CertificatesValidityStatusType = Object.freeze({
        nothing: 0,
        success: 1,    // Todos los certificados activos son vigentes
        warning: 2,    // Al menos un certificado esta por vencer
        danger: 3      // Al menos un certificado esta vencido
    });

    const CertificateOrderType = Object.freeze({
        nothing: 0,
        date: 1,
        status: 2,
        expireStatus: 3,
        dateDesc: 4,
        statusDesc: 5,
        expireStatusDesc: 6,
    });

    const CertificateStatusType = Object.freeze({
        nothing: 0,
        active: 1,
        suspended: 2,
        expired: 3,
        canceled: 4,
        deleted: 5,
    });

    // Contacts
       
    const ContactOrderType = Object.freeze({
        nothing: 0,
        firstName: 1,
        isMainContact: 2,
        updated: 3,
        firstNameDesc: 4,
        isMainContactDesc: 5,
        updatedDesc: 6,
    });

    // NACE Codes

    const NacecodeOrderType = Object.freeze({
        nothing: 0,
        sector: 1,
        description: 2,
        updated: 3,
        sectorDesc: 4,
        descriptionDesc: 5,
        updatedDesc: 6
    });

    // Organizations

    const OrganizationStatusType = Object.freeze({
        nothing: 0,
        prospect: 1,
        active: 2,
        inactive: 3,
        deleted: 4,
    });

    const OrganizationOrderType = Object.freeze({
        nothing: 0,
        folio: 1,
        name: 2,
        legalEntity: 3,
        status: 4,
        certificatesValidityStatus: 5,
        updated: 6,
        folioDesc: 7,
        nameDesc: 8,
        legalEntityDesc: 9,
        statusDesc: 10,
        certificatesValidityStatusDesc: 11,
        updatedDesc: 12,
    });

    const OrganizationStandardOrderType = Object.freeze({
        nothing: 0,
        organization: 1,
        standard: 2,
        updated: 3,
        organizationDesc: 4,
        standardDesc: 5,
        updatedDesc: 6,
    });

    // Shifts

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

    // Sites

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

    // Standards

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
        DefaultValidityStatusType,

        ApplicationFormOrderType,
        ApplicationFormStatusType,
        AuditorDocumentOrderType,
        AuditorDocumentRequiredType,
        AuditorDocumentType,
        AuditorDocumentValidityType,
        AuditorIsLeaderType,
        AuditorOrderType,
        AuditorStandardOrderType,
        CatAuditorDocumentOrderType,
        CatAuditorDocumentPeriodicityType,
        CatAuditorDocumentSubCategoryType,
        CatAuditorDocumentType,
        CertificateFilterDateType,
        CertificateOrderType,
        CertificateStatusType,
        CertificatesValidityStatusType,
        ContactOrderType,
        NacecodeOrderType,
        OrganizationOrderType,
        OrganizationStatusType,
        OrganizationStandardOrderType,
        ShiftOrderType,
        ShiftType,
        SiteOrderType,
        StandardOrderType,
    }
};

export default enums;