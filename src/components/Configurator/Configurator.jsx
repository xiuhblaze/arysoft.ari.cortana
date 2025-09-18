import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faClose, faCog } from "@fortawesome/free-solid-svg-icons"
import { Button, Card } from "react-bootstrap"

import { 
  useArysoftUIController, 
  setOpenConfigurator,
} from "../../context/context"

const openConfiguratorStyle = 'fixed-plugin show';
const closeConfiguratorStyle = 'fixed-plugin';

export const Configurator = ({ help }) => {
  const [ controller, dispatch ] = useArysoftUIController();
  const { openConfigurator } = controller;

  const onCloseConfigurator = () => setOpenConfigurator(dispatch, false);
  
  return (
    <div className={ openConfigurator ? openConfiguratorStyle : closeConfiguratorStyle } >
      {/* <a className="fixed-plugin-button text-dark position-fixed px-3 py-2">
        <FontAwesomeIcon icon={ faCog } className="py-2" />
      </a> */}
      <Card className="shadow-lg">
        <Card.Header className="pb-0 pt-3">
          <div className="float-start">
            <h5 className="mt-3 mb-0">ARI IT - Configurator</h5>
            <p>See options</p>
          </div>
          <div className="float-end mt-4">
            <Button variant="link" className="text-dark p-0 fixed-plugin-close-button" onClick={ onCloseConfigurator }>
              <FontAwesomeIcon icon={ faClose } />
            </Button>
          </div>
        </Card.Header>
        <hr className="horizontal dark my-1"></hr>
        { !!help && 
          <Card.Body className="pt-sm-3 pt-0">
            { help }
          </Card.Body>
        }
      </Card>
    </div>
  )
}

export default Configurator;