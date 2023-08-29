import { useEffect, useState } from "react";

import { Spinner } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClone, faEdit } from "@fortawesome/free-solid-svg-icons";

import envVariables from "../../../helpers/envVariables";
import enums from "../../../helpers/enums";
import useNacecodesStore from "../../../hooks/useNaceCodesStore";

import Code from "./Code";
import Status from "./Status";

export const NaceTableList = () => {
  const headStyle = 'text-uppercase text-secondary text-xxs font-weight-bolder';
  const { NacecodeOrderType } = enums();
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
  
  return (
    <>
    {
      isNacecodesLoading ? (
        <div className="text-center">
          <div className="w-100 m-auto" style={{ paddingTop: 'calc(25vh - 50px)', paddingBottom: '25vh', width: '3rem', height: '3rem' }}>
            <Spinner animation="border" variant="info" role="status">
              <span className="visually-hidden">Cargando...</span>
            </Spinner>
          </div>
        </div>
      ) : !!nacecodes ? (
        <div className="table-responsive p-0">
          <table className="table align-items-center mb-0">
            <thead>
              <tr>
                <th className={ `${headStyle} text-center` }>Code</th>
                <th className={ headStyle }>Description</th>
                <th className={ `${headStyle} text-center` }>Status</th>
                <th className={ `${headStyle} text-center` }>Action</th>
              </tr>
            </thead>
            <tbody>
              { nacecodes.map( item => (
                <tr key={ item.NaceCodeID }>
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
                      <FontAwesomeIcon icon={ faClone } />
                      <FontAwesomeIcon icon={ faEdit } />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null
    }
    </>
  )
}

export default NaceTableList;