import { useState } from "react";
import enums from "../../../helpers/enums";
import envVariables from "../../../helpers/envVariables";
import { useStandardsStore } from "../../../hooks/useStandardsStore";
import { useEffect } from "react";
import { ViewLoading } from "../../../components/Loaders";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClone, faEdit } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const StandardsTableList = () => {
  const headStyle = 'text-uppercase text-secondary text-xxs font-weight-bolder';
  const { DefaultStatusType, StandardOrderType } = enums();
  const [showModal, setShowModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(StandardOrderType.name);
  const { STANDARDS_OPTIONS } = envVariables();
  const {
    isStandardsLoading,
    standards,
    standardAsync,
  } = useStandardsStore();

  useEffect(() => {
    if (!!standards) {
      const savedSearch = JSON.parse(localStorage.getItem(STANDARDS_OPTIONS)) || null;
      setCurrentOrder(savedSearch.order);
    }
  }, [standards]);

  // METHODS

  const onShowModal = (id) => {    
    setShowModal(true);
    standardAsync(id);
  }

  const onCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      { isStandardsLoading ? (
        <ViewLoading />
        ) : !!standards ? (
          <div className="table-responsive p-0">
            <table className="table align-items-center mb-0">
              <tbody>
                {
                  standards.map( item => (
                    <tr key={ item.StandardID }>
                      <td>
                        { item.Name }
                      </td>
                      <td>
                        { item.Description }
                      </td>
                      <td>
                        <div className="d-flex justify-content-center gap-2">
                          <a href="#" onClick={ () => onShowModal(item.StandardID) } title="Details">
                            <FontAwesomeIcon icon={ faClone } />
                          </a>
                          { item.Status !== DefaultStatusType.deleted && (
                            <Link to={ `${ item.StandardID }` } title="Edit">
                              <FontAwesomeIcon icon={ faEdit } />
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        ) : null
      }
    </>
  )
}

export default StandardsTableList;