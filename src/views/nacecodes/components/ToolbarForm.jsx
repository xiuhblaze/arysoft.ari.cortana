import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useNacecodesStore from "../../../hooks/useNaceCodesStore";

export const ToolbarForm = () => {
  const {
    isNacecodeCreating,
    nacecodesAsync,
    nacecodeCreateAsync
  } = useNacecodesStore();

  // Methods

  const onNewItem = () => {
    console.log('New Nace code');
    nacecodeCreateAsync();
  };

  return (
    <div className="d-flex flex-column flex-md-row justify-content-between gap-2">
      <div>
        <button
          className="btn bg-gradient-dark d-flex justify-content-center align-items-center mb-0" 
          onClick={ onNewItem } 
          title="New NACE code"
          disabled={ isNacecodeCreating }
        >
          <FontAwesomeIcon icon={ faPlus } className="me-1" />
          Add
        </button>
      </div>
    </div>
  )
}

export default ToolbarForm;