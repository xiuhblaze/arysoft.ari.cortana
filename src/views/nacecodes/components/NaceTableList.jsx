import { useEffect, useState } from "react";

import { Spinner } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClone, faEdit } from "@fortawesome/free-solid-svg-icons";

import envVariables from "../../../helpers/envVariables";
import enums from "../../../helpers/enums";
import useNacecodesStore from "../../../hooks/useNaceCodesStore";

import Code from "./Code";
import Status from "./Status";
import DetailsModal from "./DetailsModal";
import { Link } from "react-router-dom";
import { ViewLoading } from "../../../components/Loaders";

export const NaceTableList = () => {
  const headStyle = 'text-uppercase text-secondary text-xxs font-weight-bolder';
  const { NacecodeOrderType, DefaultStatusType } = enums();
  const [showModal, setShowModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(NacecodeOrderType.sector);
  const { NACECODES_OPTIONS } = envVariables();
  const {
    isNacecodesLoading,
    nacecodes,
    nacecodeAsync,
  } = useNacecodesStore();

  useEffect(() => {
    if (!!nacecodes) {
      const savedSearch = JSON.parse(localStorage.getItem(NACECODES_OPTIONS)) || null;
      setCurrentOrder(savedSearch.order);
    }
  }, [nacecodes]);
  

  // METHODS

  const onShowModal = (id) => {    
    setShowModal(true);
    nacecodeAsync(id);
  }

  const onCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
    {
      isNacecodesLoading ? (
        <ViewLoading />
      ) : !!nacecodes ? (
        <div className="table-responsive p-0">
          <table className="table align-items-center mb-0">
            <thead>
              <tr>
                <th className={ `${headStyle} text-end` }>Code</th>
                <th className={ headStyle }>Description</th>
                <th className={ `${headStyle} text-center` }>Status</th>
                <th className={ `${headStyle} text-center` }>Action</th>
              </tr>
            </thead>
            <tbody>
              { nacecodes.map( item => (
                <tr key={ item.NaceCodeID } className={ item.Status === DefaultStatusType.deleted ? 'opacity-6' : ''}>
                  <td className="text-sm text-secondary font-weight-bold text-end">
                    <Code 
                      sector={ item.Sector }
                      division={ item.Division }
                      group={ item.Group }
                      classs={ item.Class }
                    />
                  </td>
                  <td className="text-sm h6 text-wrap">
                    { item.Description }
                  </td>
                  <td className="text-sm text-center"><Status value={ item.Status } /></td>
                  <td>
                    <div className="d-flex justify-content-center gap-2">
                      <a href="#" onClick={ () => onShowModal(item.NaceCodeID) } title="Details">
                        <FontAwesomeIcon icon={ faClone } />
                      </a>
                      { item.Status !== DefaultStatusType.deleted && (
                        <Link to={ `${ item.NaceCodeID }` } title="Edit">
                          <FontAwesomeIcon icon={ faEdit } />
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null
    }
    <DetailsModal show={ showModal } onHide={ onCloseModal } />
    </>
  )
}

export default NaceTableList;