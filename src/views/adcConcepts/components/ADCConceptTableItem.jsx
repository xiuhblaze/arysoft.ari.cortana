import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPuzzlePiece } from "@fortawesome/free-solid-svg-icons";

import defaultStatusProps from "../../../helpers/defaultStatusProps";
import enums from "../../../helpers/enums";
import { Link } from "react-router-dom";

const ADCConceptTableItem = ({ item, className, ...props }) => {
    const { ADCConceptUnitType } = enums();
    
    return (
        <tr {...props} className={className}>
            <td>
                <div className="d-flex justify-content-center align-items-center">
                    <Link to={ item.ID } title="Edit" className="mx-2">
                        <FontAwesomeIcon icon={ faEdit } />
                    </Link>
                </div>
            </td>
            <td>
                <p className="text-center text-xs font-weight-bold text-wrap mb-0">
                    {item.IndexSort}
                </p>
            </td>
            <td>
                <div className="d-flex align-items-center me-2">
                    <div>
                        <div className={`icon icon-sm icon-shape bg-gradient-${ defaultStatusProps[item.Status].variant } border-radius-md me-2 d-flex align-items-center justify-content-center`}>
                            <FontAwesomeIcon icon={ faPuzzlePiece } className="text-white" aria-hidden="true" />
                        </div>
                    </div>
                    <div className="d-flex flex-column align-items-start">
                        <h6 className="mb-0 text-sm text-wrap">{item.Description}</h6>
                        <p className="text-xs text-secondary text-wrap mb-0">
                            { item.ExtraInfo }
                        </p>
                    </div>
                </div>
            </td>
            <td>
                <p className="text-xs text-center font-weight-bold text-wrap mb-0">
                    {item.StandardName}
                </p>
            </td>
            <td>
                {
                    !!item.Increase ? (
                        <p className="text-xs font-weight-bold mb-1">
                            { item.WhenTrue ? (
                                <span className="me-1">
                                    <span className="badge bg-gradient-success text-white">Yes</span> Increase:
                                </span>
                            ) : ( 
                                <span className="me-1">
                                    <span className="badge bg-gradient-primary text-white">No</span> Increase:
                                </span>
                            )}
                            { item.Increase } { item.IncreaseUnit == ADCConceptUnitType.days ? 'Days' : '%' }
                        </p>
                    ) : null
                }
                {
                    !!item.Decrease ? (
                        <p className="text-xs font-weight-bold mb-0">
                            { !item.WhenTrue ? (
                                <span className="me-1">
                                    <span className="badge bg-gradient-success text-white">Yes</span> Decrease:
                                </span>
                            ) : (
                                <span className="me-1">
                                    <span className="badge bg-gradient-primary text-white">No</span> Decrease:
                                </span>
                            ) }
                            {item.Decrease} { item.DecreaseUnit == ADCConceptUnitType.days ? 'Days' : '%' }
                        </p>
                    ) : null
                }
            </td>
            <td>
                <div className="d-flex justify-content-center align-items-center mx-1">
                    <Link to={ item.ID } title="Edit" className="mx-2">
                        <FontAwesomeIcon icon={ faEdit } />
                    </Link>
                </div>
            </td>
        </tr>
    );
}; // ADCConceptTableItem

export default ADCConceptTableItem;