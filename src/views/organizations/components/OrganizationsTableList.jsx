import { useEffect, useState } from "react";
import enums from "../../../helpers/enums";
import envVariables from "../../../helpers/envVariables";
import { useOrganizationsStore } from "../../../hooks/useOrganizationsStore";
import { ViewLoading } from "../../../components/Loaders";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuilding, faClone, faEdit, faGlobe, faPhone } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const OrganizationsTableList = () => {
  const headStyle = 'text-uppercase text-secondary text-xxs font-weight-bolder';
  const { OrganizationStatusType, OrganizationOrderType } = enums();
  const [showModal, setShowModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(OrganizationOrderType.name);
  const { ORGANIZATIONS_OPTIONS } = envVariables();
  const {
    isOrganizationLoading,
    organizations,
    organizationAsync,
  } = useOrganizationsStore();

  useEffect(() => {
    if (!!organizations) {
      const savedSearch = JSON.parse(localStorage.getItem(ORGANIZATIONS_OPTIONS)) || null;
      setCurrentOrder(savedSearch.order);
    }
  }, [organizations]);

  // METHODS

  const onShowModal = (id) => {    
    setShowModal(true);
    organizationAsync(id);
  }

  const onCloseModal = () => {
    setShowModal(false);
  };
  

  return (
    <>
      { isOrganizationLoading ? (
        <ViewLoading />
      ) : !!organizations ? (
        <div className="table-responsive p-0">
          <table className="table align-items-center mb-0">
            <thead>

            </thead>
            <tbody>
              {
                organizations.map( item => {
                  const iconStyle = `icon icon-sm icon-shape ${ item.Status === OrganizationStatusType.active ? 'bg-gradient-info' : 'bg-gradient-secondary' } border-radius-md d-flex align-items-center justify-content-center me-3`;

                  return (
                    <tr key={ item.OrganizationID }>
                      <td>
                        <div className="d-flex px-2 py-1">
                          <div>
                            <div className={ iconStyle }>
                              <FontAwesomeIcon icon={ faBuilding } size="lg" className="opacity-10 text-white" aria-hidden="true" />
                            </div>
                          </div>
                          <div className="d-flex flex-column justify-content-center">
                            <h6 className="mb-0 text-sm">{ item.Name }</h6>
                            <p className="text-xs text-secondary mb-0">
                              { item.LegalEntity }
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex flex-column align-items-start">
                          { !!item?.Website && (
                            <a href={ `http://${ item.Website }`} target="_blank" className="text-xs font-weight-bold mb-0">
                              <FontAwesomeIcon icon={ faGlobe } className="me-1" />
                              { item.Website }
                            </a>
                          )}
                          { !!item?.Phone && (
                            <a href={ `tel:${ item.Phone }` } className="text-xs text-secondary mb-0">
                              <FontAwesomeIcon icon={ faPhone } className="me-1" />
                              { item.Phone }
                            </a>
                          )} 
                        </div>
                      </td>

                      <td>
                          <div className="d-flex justify-content-center gap-2">
                            <a href="#" onClick={ () => onShowModal(item.OrganizationID) } title="Details">
                              <FontAwesomeIcon icon={ faClone } />
                            </a>
                            { item.Status !== OrganizationStatusType.deleted && (
                              <Link to={ `${ item.OrganizationID }` } title="Edit">
                                <FontAwesomeIcon icon={ faEdit } />
                              </Link>
                            )}
                          </div>
                        </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>
      ) : null }
    </>
  )
}

export default OrganizationsTableList