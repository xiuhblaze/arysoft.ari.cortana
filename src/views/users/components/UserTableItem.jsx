import { faEdit, faEnvelope, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import defaultStatusProps from '../../../helpers/defaultStatusProps';
import { Link } from 'react-router-dom';
import userTypeProps from '../helpers/userTypeProps';
import getFriendlyDate from '../../../helpers/getFriendlyDate';

const UserTableItem = ({ item, className, ...props }) => {

    return (
        <tr {...props} className={className}>
            <td className="text-start">
                <Link to={ item.ID } title="Edit" className="mx-2">
                    <FontAwesomeIcon icon={ faEdit } />
                </Link>
            </td>
            <td>
                <div className="d-flex align-items-center me-2">
                    <div>
                        <div 
                            className={`icon icon-sm icon-shape bg-gradient-${ defaultStatusProps[item.Status].variant} border-radius-md me-2 d-flex align-items-center justify-content-center`}
                            title={ defaultStatusProps[item.Status].label }
                        >
                            <FontAwesomeIcon 
                                icon={ faUser }
                                className="text-white" aria-hidden="true"
                            />
                        </div>
                    </div>
                    <div className="d-flex flex-column align-items-start">
                        <h6 className="mb-0 text-sm text-wrap">{item.Username}</h6>
                        <p className="text-xs text-secondary mb-0">
                            { item.OwnerName } - { userTypeProps[item.Type].label }
                        </p>
                    </div>
                </div>
            </td>
            <td>
                <p className="text-sm font-weight-bold text-wrap mb-0">
                    <FontAwesomeIcon icon={ faUser } className="me-1" />
                    { item.FullName }
                </p>
                <p className="text-xs text-wrap mb-0">
                    <FontAwesomeIcon icon={ faEnvelope } className="me-1" />
                    { item.Email }
                </p>
            </td>
            <td>
                <div className="d-flex justify-content-start align-items-center text-sm gap-2">
                    { item.Roles.map(i => 
                        <div 
                            key={i.ID}
                            className="badge bg-gradient-secondary text-white" 
                        >
                            {i.Name}
                        </div>) 
                    }
                </div>
            </td>
            <td>
                <p className="text-xs text-wrap mb-0">
                    { getFriendlyDate(item.LastAccess) }
                </p>
            </td>
            <td className="text-end">
                <Link to={ item.ID } title="Edit" className="mx-2">
                    <FontAwesomeIcon icon={ faEdit } />
                </Link>
            </td>
        </tr>
    )
}

export default UserTableItem