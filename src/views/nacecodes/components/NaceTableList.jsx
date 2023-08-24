import { Spinner } from "react-bootstrap";
import useNacecodesStore from "../../../hooks/useNaceCodesStore";
import Code from "./Code";

export const NaceTableList = () => {

  const {
    isNacecodesLoading,
    nacecodes,
  } = useNacecodesStore();
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
            <tbody>
              { nacecodes.map( item => (
                <tr key={ item.NaceCodeID }>
                  <td>
                    <Code 
                      sector={ item.Sector }
                      division={ item.Division }
                      group={ item.Group }
                      classs={ item.Class }
                    />
                  </td>
                  <td>{ item.Description }</td>
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