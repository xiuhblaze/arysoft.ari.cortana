import { Badge } from 'react-bootstrap'
import { faClone, faEdit, faFile, faFileCircleExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
import AryDefaultStatusBadge from '../../../components/AryDefaultStatusBadge/AryDefaultStatusBadge'
import catAuditorDocumentPeriodicityProps from '../helpers/catAuditorDocumentPeriodicityProps'
import catAuditorDocumentSubCategoryProps from '../helpers/catAuditorDocumentSubCategoryProps'
import catAuditorDocumentTypeProps from '../helpers/catAuditorDocumentTypeProps'
import enums from '../../../helpers/enums'
import isNullOrEmpty from '../../../helpers/isNullOrEmpty'

const CatAuditorDocumentsTableItem = ({ item, className, onShowModal, hideActions = false, ...props }) => {
    const {
        CatAuditorDocumentSubCategoryType
    } = enums();

    return (
        <tr {...props}>
            <td>
                <div className="d-flex align-items-center me-2">
                    <div>
                        <div 
                            className={`icon icon-sm icon-shape bg-gradient-${ item.IsRequired ? 'info' : 'secondary'} border-radius-md d-flex align-items-center justify-content-center me-2`} 
                            title={ item.IsRequired ? 'Is requierd' : 'Not required'}
                        >
                            <FontAwesomeIcon icon={ item.IsRequired ? faFileCircleExclamation : faFile } className="opacity-10 text-white" aria-hidden="true" />
                        </div>
                    </div>
                    <div className="d-flex align-items-start flex-column justify-content-top">
                        {
                            !isNullOrEmpty(item.Name) &&
                            <h6 className="mb-0 text-sm text-dark text-gradient">
                                { item.SubCategory != CatAuditorDocumentSubCategoryType.nothing ? (
                                    <span>Sub-Category {catAuditorDocumentSubCategoryProps[item.SubCategory].label} - </span>
                                ) : null }
                                { item.Name }
                            </h6>
                        }
                        { 
                            !isNullOrEmpty(item.Description) &&
                            <p className="text-xs font-weight-bold mb-0 text-wrap">
                                { item.Description }
                            </p>
                        }
                    </div>
                </div>
            </td>
            <td>
                <p className="text-xs text-wrap mb-0">
                    { catAuditorDocumentTypeProps[item.DocumentType].label }
                </p>
            </td>
            <td>
                { !!item.WarningEvery && !!item.WarningPeriodicity ? (
                    <p className="text-xs font-weight-bold text-wrap">
                        Warn { item.WarningEvery }
                        { ` ${catAuditorDocumentPeriodicityProps[item.WarningPeriodicity].label}${ item.WarningEvery > 1 ? 's' : ''} before` }
                    </p>
                ) : (
                    <p className="text-xs text-secondary text-wrap">
                        (not setting)
                    </p>
                )}
            </td>
            <td>
                { !!item.UpdateEvery && !!item.UpdatePeriodicity ? (
                    <p className="text-xs font-weight-bold text-wrap">                    
                        Update every { item.UpdateEvery }
                        { ` ${catAuditorDocumentPeriodicityProps[item.UpdatePeriodicity].label}${ item.UpdateEvery > 1 ? 's' : ''}` }
                    </p>
                ) : (
                    <p className="text-xs text-secondary text-wrap">
                        (not setting)
                    </p>
                )}
            </td>
            <td className="text-center text-sm">
                <Badge bg="secondary">
                    { item.Order }
                </Badge>
            </td>
            <td>
                <AryDefaultStatusBadge value={ item.Status } />
            </td>
            {
                !hideActions &&
                <td>
                    <div className="d-flex justify-content-center gap-2">
                        <a href="#" onClick={onShowModal} title="Details">
                            <FontAwesomeIcon icon={faClone} />
                        </a>
                        <Link to={item.ID} title="Edit">
                            <FontAwesomeIcon icon={faEdit} />
                        </Link>
                    </div>
                </td>
            }
        </tr>
    )
}

export default CatAuditorDocumentsTableItem