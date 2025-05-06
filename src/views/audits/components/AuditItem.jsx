import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCity, faClone, faEdit, faEye, faFile, faPlay, faStop } from '@fortawesome/free-solid-svg-icons';
import auditStepProps from '../helpers/auditStepProps';
import enums from '../../../helpers/enums';
import auditStatusProps from '../helpers/auditStatusProps';
import AuditEditItem from './AuditEditItem';
import { useAuditCyclesStore } from '../../../hooks/useAuditCyclesStore';

const { 
    AuditStatusType,
    DefaultStatusType,
} = enums();

const StandardItem = ({ standard, ...props }) => {
    const itemStyle = standard.Status != DefaultStatusType.active ? 'opacity-5' : '';
    return (
        <div {...props} className={ itemStyle }>
            { standard.StandardName } - { auditStepProps[standard.Step].label}
        </div>
    )
} // StandardItem

const AuditItem = ({ item, ...props }) => {

    const itemStatusStyle = item.Status == AuditStatusType.canceled ? 'opacity-6' : ''; 

    return (
        <div {...props} className={`d-flex justify-content-start align-items-top bg-gray-100 rounded-2 p-2 me-2 mb-2 gap-2 ${itemStatusStyle}`}>
            <div>
                <FontAwesomeIcon 
                    icon={ auditStatusProps[item.Status].icon }
                    className={`text-${ auditStatusProps[item.Status].variant}`} 
                    title={ auditStatusProps[item.Status].label }
                />
            </div>
            <div>
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
                <div className="font-weight-bold text-xs text-dark mb-0">
                    {
                        !!item.Standards && item.Standards.length > 0 ?
                        <span className="font-weight-bold">
                            { item.Standards.map(standard => <StandardItem key={standard.ID} standard={standard} />) }
                        </span>
                        : null
                    }
                </div>
                <p className="text-secondary text-xs mb-0">
                    Auditors: <span className={`badge text-bg-${ !!item.AuditorsCount && item.AuditorsCount > 0 ? 'secondary text-white' : 'light'} me-2`}>{ item.AuditorsCount ?? 0 }</span>
                    Documents: <span className={`badge text-bg-${ !!item.DocumentsCount && item.DocumentsCount > 0 ? 'secondary text-white' : 'light'} me-2`}>{ item.DocumentsCount ?? 0 }</span>  
                    Sites: <span className={`badge text-bg-${ !!item.SitesCount && item.SitesCount > 0 ? 'secondary text-white' : 'light'} me-2`}>{ item.SitesCount ?? 0 }</span>
                    { item.HasWitness ? <span className="text-secondary me-2">
                        <FontAwesomeIcon icon={ faEye } className="me-1" />Has Witness
                    </span> : null }
                    { item.IsMultisite ? <span className="text-dark me-2">
                        <FontAwesomeIcon icon={ faCity } className="me-1" />
                        Is Multisite
                    </span> : null }
                </p>
            </div>
            <div>
                <AuditEditItem id={ item.ID } />
            </div>
        </div>
    )
}

export default AuditItem