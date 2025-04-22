import { faSquarePlus } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect } from 'react'
import { useCompaniesStore } from '../../../hooks/useCompaniesStore'
import { faBuilding, faBuildingCircleCheck, faBuildingCircleXmark, faEdit } from '@fortawesome/free-solid-svg-icons'
import { ListGroup } from 'react-bootstrap'
import { ViewLoading } from '../../../components/Loaders'
import { useOrganizationsStore } from '../../../hooks/useOrganizationsStore'
import Swal from 'sweetalert2'
import CompaniesEditItem from './CompaniesEditItem'
import enums from '../../../helpers/enums'
import defaultStatusProps from '../../../helpers/defaultStatusProps'

const CompaniesList = ({ readOnly = false, ...props }) => {
    const { DefaultStatusType } = enums();

    // CUSTOM HOOKS

    const {
        isOrganizationLoading,
        organization,
    } = useOrganizationsStore();

    const {
        isCompaniesLoading,
        companies,
        companiesAsync,
        companiesErrorMessage
    } = useCompaniesStore();

    // HOOKS

    useEffect(() => {
        if (!!organization) {
            companiesAsync({
                organizationID: organization.ID,
                pageSize: 0,
            });
        }
    }, [organization]);

    useEffect(() => {
        if (!!companiesErrorMessage) {
            Swal.fire('Legal entity', companiesErrorMessage, 'success');
        }
    }, [companiesErrorMessage]);    

    return (
        <div {...props}>
            <div className="d-flex justify-content-between align-items-center gap-2 mb-2">
                <div>
                    <h6 className="text-sm mb-0">Legal entities</h6>
                    <p className="text-xs text-secondary mb-0">
                        Any organization can have multiple legal entities, must have at least one.
                    </p>
                </div>
                <CompaniesEditItem />
            </div>
            {
                isCompaniesLoading 
                    ? <ViewLoading />
                    : !!companies && companies.length > 0 
                        ? <table className="table align-items-center mb-0 w-100">                            
                            <tbody>
                                {
                                    companies.map(item => {
                                        return (
                                            <tr key={item.ID} className={`border-0 ${item.Status != DefaultStatusType.active ? 'opacity-6' : ''}`}>
                                                <td className="border-0 pe-0 ps-0">
                                                    <FontAwesomeIcon icon={item.Status == DefaultStatusType.active ? faBuildingCircleCheck : faBuildingCircleXmark } className={`text-${defaultStatusProps[item.Status].variant}`} />
                                                </td>
                                                <td className="border-0">
                                                    <h6 className="text-wrap text-sm mb-0">
                                                        {item.Name}
                                                    </h6>
                                                    <p className="text-xs text-dark mb-0" title="Legal entity">
                                                        {item.LegalEntity}
                                                    </p>
                                                    {
                                                        !!item.COID && 
                                                        <p className="text-xs text-secondary mb-0" title="COID">
                                                            {item.COID}
                                                        </p>
                                                    }
                                                </td>                                                
                                                <td className="text-end border-0 pe-0">
                                                    {
                                                        !readOnly && <CompaniesEditItem id={item.ID} />
                                                    }
                                                </td>
                                            </tr>
                                        )})
                                }
                            </tbody>
                        </table>
                        : <div className="text-center text-sm text-secondary">No legal entities found</div>
            }
            {/* <ListGroup className="w-100" variant="flush">
                            {
                                companies.map(item => {

                                    return (
                                        <ListGroup.Item 
                                            key={item.ID} 
                                            className={`d-flex justify-content-between align-items-center list-group-item-action border-0 px-0 ${ item.Status != DefaultStatusType.active ? 'opacity-6' : '' }`}
                                        >
                                            <span className="text-sm text-dark">
                                                <FontAwesomeIcon icon={ faBuilding } className={`text-${ defaultStatusProps[item.Status].variant } me-1`} />
                                                {item.Name}
                                            </span>
                                            <span className="text-xs text-secondary">{item.LegalEntity}</span>
                                            <span className="text-xs text-secondary">{item.COID}</span>
                                            {
                                                !readOnly && <CompaniesEditItem id={item.ID} />
                                            }
                                        </ListGroup.Item>
                                    )})
                            }
                        </ListGroup> */}
        </div>
    )
}

export default CompaniesList