import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faFile, faPlay, faStop } from '@fortawesome/free-solid-svg-icons';
import auditStepProps from '../helpers/auditStepProps';
import enums from '../../../helpers/enums';
import auditStatusProps from '../helpers/auditStatusProps';
import AuditEditItem from './AuditEditItem';
import { useAuditCyclesStore } from '../../../hooks/useAuditCyclesStore';

const StandardItem = ({ standard, ...props }) => {
    const { DefaultStatusType } = enums();
    const itemStyle = standard.Status != DefaultStatusType.active ? 'opacity-5' : '';
    return (
        <div {...props} className={ itemStyle }>
            { standard.StandardName } - { auditStepProps[standard.Step].label}
        </div>
    )
} // StandardItem

const AuditItem = ({ item, ...props }) => {

    // if (!auditCycle) {
    //     console.log('AuditItem: auditCycle is empty');
    //     return;
    // }

    return (
        <div {...props} className="d-flex justify-content-start align-items-top bg-gray-100 rounded-2 p-2 me-2 mb-3">
            <div>
                <FontAwesomeIcon 
                    icon={ auditStatusProps[item.Status].icon }
                    className={`text-${ auditStatusProps[item.Status].variant} mx-2`} 
                    title={ auditStatusProps[item.Status].label }
                />
            </div>
            <div className="ms-2">
                <h6 className="text-dark text-sm font-weight-bold mb-0">
                    {item.Description}
                </h6>
                <p className="text-xs text-secondary mb-0">
                    <FontAwesomeIcon icon={ faPlay } className="text-success me-1" />
                    <span className="font-weight-bold">{ new Date(item.StartDate).toLocaleDateString() }</span>
                    <span className="mx-2">|</span>
                    <FontAwesomeIcon icon={ faStop } className="text-primary me-1" />
                    <span className="font-weight-bold">{ new Date(item.EndDate).toLocaleDateString() }</span>
                </p>
                <div className="font-weight-bold text-xs text-secondary mb-0">
                    {
                        !!item.Standards && item.Standards.length > 0 ?
                        <span className="font-weight-bold">
                            { item.Standards.map(standard => <StandardItem key={standard.ID} standard={standard} />) }
                        </span>
                        : null
                    }
                </div>
                <p className="text-secondary text-xs mb-0">Auditors: { item.AuditorsCount ?? 0 }, Documents: { item.DocumentsCount ?? 0 }, Has witness: { !!item.HasWitness ? 'yes':'no'}, </p> 
            </div>
            <div>
                <AuditEditItem id={ item.ID } />
            </div>
        </div>
    )
}

export default AuditItem