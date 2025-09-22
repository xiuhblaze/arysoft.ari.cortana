import enums from "../../../helpers/enums";

export const getAuditStepList = (cycleType, initialStep, periodicity) => {
    const { AuditCycleType, AuditStepType } = enums();

    const auditStepList = [];

    switch (cycleType) {
        case AuditCycleType.initial: {
            // auditStepList.push(AuditStepType.stage1);
            auditStepList.push(AuditStepType.stage2);
            auditStepList.push(AuditStepType.surveillance1);
            auditStepList.push(AuditStepType.surveillance2);
            if (periodicity == 2) {
                auditStepList.push(AuditStepType.surveillance3);
                auditStepList.push(AuditStepType.surveillance4);
                auditStepList.push(AuditStepType.surveillance5);
            }
            break;
        }
        case AuditCycleType.recertification: {
            auditStepList.push(AuditStepType.recertification);
            auditStepList.push(AuditStepType.surveillance1);
            auditStepList.push(AuditStepType.surveillance2);
            if (periodicity == 2) {
                auditStepList.push(AuditStepType.surveillance3);
                auditStepList.push(AuditStepType.surveillance4);
                auditStepList.push(AuditStepType.surveillance5);
            }
            break;
        }
        case AuditCycleType.transfer: {
            if (initialStep == AuditStepType.recertification) {
                auditStepList.push(AuditStepType.recertification);                
                auditStepList.push(AuditStepType.surveillance1);
                auditStepList.push(AuditStepType.surveillance2);
                if (periodicity == 2) {
                    auditStepList.push(AuditStepType.surveillance3);
                    auditStepList.push(AuditStepType.surveillance4);
                    auditStepList.push(AuditStepType.surveillance5);
                }
            } else if (initialStep == AuditStepType.surveillance1) {
                auditStepList.push(AuditStepType.surveillance1);
                auditStepList.push(AuditStepType.surveillance2);
                if (periodicity == 2) {
                    auditStepList.push(AuditStepType.surveillance3);
                    auditStepList.push(AuditStepType.surveillance4);
                    auditStepList.push(AuditStepType.surveillance5);
                }
            } else if (initialStep == AuditStepType.surveillance2) {
                auditStepList.push(AuditStepType.surveillance2);
                if (periodicity == 2) {
                    auditStepList.push(AuditStepType.surveillance3);
                    auditStepList.push(AuditStepType.surveillance4);
                    auditStepList.push(AuditStepType.surveillance5);
                }
            }
            break;
        }
    }

    // const auditStepList = Object.keys(AuditStepType)
    //     .reduce((acc, key) => {
    //         // const annual = 1;
    //         const biannual = 2;
    //         const step = AuditStepType[key];
    //         let addStep = false;

    //         switch (cycleType) {
    //             case AuditCycleType.initial: {
    //                 addStep = (step == AuditStepType.stage1
    //                     || step == AuditStepType.stage2
    //                     || step == AuditStepType.surveillance1
    //                     || step == AuditStepType.surveillance2
    //                     || (step == AuditStepType.surveillance3 && periodicity == biannual)
    //                     || (step == AuditStepType.surveillance4 && periodicity == biannual)
    //                     || (step == AuditStepType.surveillance5 && periodicity == biannual)
    //                 );
    //                 break;
    //             }
    //             case AuditCycleType.recertification: {
    //                 addStep = (step == AuditStepType.recertification                        
    //                     || step == AuditStepType.surveillance1
    //                     || step == AuditStepType.surveillance2
    //                     || (step == AuditStepType.surveillance3 && periodicity == biannual)
    //                     || (step == AuditStepType.surveillance4 && periodicity == biannual)
    //                     || (step == AuditStepType.surveillance5 && periodicity == biannual)
    //                 );
    //                 break;
    //             }
    //             case AuditCycleType.transfer: {
    //                 addStep = ((step == AuditStepType.transfer
    //                     || step == AuditStepType.recertification
    //                     || step == AuditStepType.surveillance1
    //                     || step == AuditStepType.surveillance2
    //                     || (step == AuditStepType.surveillance3 && periodicity == biannual)
    //                     || (step == AuditStepType.surveillance4 && periodicity == biannual)
    //                     || (step == AuditStepType.surveillance5 && periodicity == biannual))
    //                     && (step >= initialStep 
    //                         || initialStep == AuditStepType.surveillance1 
    //                         || initialStep == AuditStepType.surveillance2));
    //                 break;
    //             }                
    //         }

    //         if (addStep) {
    //             acc.push(step);
    //         }

    //         return acc;            
    //     }, []);

    return auditStepList;
}; // getAuditStepList

export default getAuditStepList;