
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

    const AppFormOrderType = Object.freeze({
        nothing: 0,
        created: 1,
        organization: 2,
        createdDesc: 3,
        organizationDesc: 4
    });

    const AppFormStatusType = Object.freeze({
        nothing: 0,            // Nuevo registro temporal
        new: 1,                // Nuevo registro almacenado con la información mínima
        salesReview: 2,        // Ventas revisa y aprueba el appForm recibido por el cliente
        salesRejected: 3,      // Rechazado por ventas, el cliente debe de completar más información
        applicantReview: 4,    // Revisa que todo esté bien y es quien aprueba el appForm
        applicantRejected: 5,  // Rechazado por el revisor del appForm, sales debe de completar más información
        active: 6,             // AppForm activo
        inactive: 7,           // Ya no está en uso este appForm
        cancel: 8,             // En algún momento el appForm fué cancelado
        deleted: 9,           // Eliminación logica
    });

    // Audits cycles

    const AuditCycleType = Object.freeze({
        nothing: 0,
        initial: 1,
        recertification : 2,
        transfer: 3,
    });

    const AuditCycleStandardsOrderType = Object.freeze({
        nothing: 0,
        standard: 1,
        standardDesc: 2,
    });

    const AuditCycleDocumentType = Object.freeze({
        nothing: 0,
        appForm: 1,        // Application form
        acd: 2,            // Audit day calculation
        proposal: 3,
        contract: 4,
        auditProgramme: 5, // Confirmation letter
        //cdc: 6,            // Certification decision checklist - TODO: Ver si se va a quedar aquí
        certificate: 6,
        survey: 7,
        other: 8,          // Cualquier otro documento de interés
        audit: 9,
    });

    // Audits

    const AuditStepType = Object.freeze({
        nothing: 0,
        stage1: 1,
        stage2: 2,
        surveillance1: 3,
        surveillance2: 4,
        recertification: 5,
        transfer: 6,    // Auditoria de transferencia - se realiza cuando un cliente cambia de certificadora, puede recibir cualquier tipo de documentación
        special: 7,     // Auditoria especial - puede recibir cualquier tipo de documentación sin orden aparente, funciona para survey 3...
    });

    const AuditDocumentType = Object.freeze({
        nothing: 0,
        auditPlan: 1,
        oacm: 2,                // Opening and closing meeting
        auditReport: 3,
        fsscIntegrityLetter: 4, // Solo para FSSC
        fsscAuditPlanSigned: 5, // Solo para FSSC
        actionPlan: 6,          // Action plan & evidence
        ncCloseReport: 7,       // Non conformities close report
        techReport: 8,          // No for FSSC
        cdc: 9,                 // Certification decision checklist - TODO: Aqui se queda
        fsscScreenShot: 10,     // Solo para FSSC
        travelExpenses: 11,     // Viaticos
        witnessReport: 12,      // Reporte de testigos
        other: 13,
    });

    const AuditStatusType = Object.freeze({
        nothing: 0,
        scheduled: 1,  // Agendada - Aun no llega su fecha de ejecución, permite subir documentos
        confirmed: 2,  // Confirmada - El cliente ya confirmo la fecha y los auditores, estan en linea los documentos requeridos
        inProcess: 3,  // En proceso - La auditoria esta dentro de las fechas de ejecución
        finished: 4,   // Terminado - Posterior a la fecha de auditoria, es necesario subir la documentación requerida
        completed: 5,  // Completed - Indica que toda la documentación ha sido cubierta
        closed: 6,     // Closed - Audioria terminada, ya no se puede actualizar información 
        canceled: 7,   // Cancelada - En cualquier Status la auditoria puede ser cancelada, es necesario indicar la razón
        deleted: 8     // Eliminada - Registro eliminado logicamente, solo para administradores
    });

    const AuditOrderType = Object.freeze({
        nothing: 0,
        date: 1,
        status: 2,
        dateDesc: 3,
        statusDesc: 4,
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

    // Companies

    const CompanyOrderType = Object.freeze({
        nothing: 0,
        name: 1,
        legalEntity: 2,
        COID: 3,
        updated: 4,
        nameDesc: 5,
        legalEntityDesc: 6,
        COIDDesc: 7,
        updatedDesc: 8,
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

    const NaceCodeOnlyOptionType = Object.freeze({
        nothing: 0,
        sectors: 1,
        divisions: 2,
        groups: 3,
        classes: 4,
    });

    const NaceCodeAccreditedType = Object.freeze({
        nothing: 0,
        accredited: 1,
        mustAccredited: 2,
        notAccredited: 3,
    });

    const NacecodeOrderType = Object.freeze({
        nothing: 0,
        sector: 1,
        description: 2,
        accredited: 3,
        updated: 4,
        sectorDesc: 5,
        descriptionDesc: 6,
        accreditedDesc: 7,
        updatedDesc: 8
    });

    // Organizations

    const OrganizationStatusType = Object.freeze({
        nothing: 0,
        applicant: 1,
        active: 2,
        inactive: 3,
        deleted: 4,
    });

    const OrganizationOrderType = Object.freeze({
        nothing: 0,
        folio: 1,
        name: 2,        
        status: 3,
        folderFolio: 4,
        updated: 5,
        folioDesc: 6,
        nameDesc: 7,
        statusDesc: 8,
        folderFolioDesc: 9,
        updatedDesc: 10,
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

    // Roles

    const RoleOrderType = Object.freeze({
        nothing: 0,
        name: 1,
        updated: 2,
        nameDesc: 3,
        updatedDesc: 4,
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
        mixed: 4,
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

    const StandardBaseType = Object.freeze({
        nothing: 0,
        iso9k: 1,
        iso14K: 2,
        iso22K: 3,
        iso27K: 4,
        iso37K: 5,
        iso45K: 6,
        fssc22K: 7,     // Food Safety System Certification 22000
        haccp: 8,       // Hazard Analysis and Critical Control Points
        gMarkets: 9,    // Global Markets
        sqf: 10,        // Safe Quality Food
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

    // Users

    const UserOrderType = Object.freeze({
        nothing: 0,
        username: 1,
        email: 2,
        updated: 3,
        usernameDesc: 4,
        emailDesc: 5,
        updatedDesc: 6,
    });

    const UserType = Object.freeze({
        nothing: 0,
        superAdmin: 1,
        admin: 2,
        auditor: 3,
        organization: 4,
    });

    return {
        DefaultStatusType,
        DefaultValidityStatusType,

        AppFormOrderType,
        AppFormStatusType,
        AuditCycleStandardsOrderType,
        AuditCycleType,
        AuditCycleDocumentType,
        AuditDocumentType,
        AuditStepType,
        AuditOrderType,
        AuditStatusType,
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
        CompanyOrderType,
        ContactOrderType,
        NaceCodeOnlyOptionType,
        NaceCodeAccreditedType,
        NacecodeOrderType,
        OrganizationOrderType,
        OrganizationStatusType,
        OrganizationStandardOrderType,
        RoleOrderType,
        ShiftOrderType,
        ShiftType,
        SiteOrderType,
        StandardOrderType,
        StandardBaseType,
        UserOrderType,
        UserType,
    }
};

export default enums;