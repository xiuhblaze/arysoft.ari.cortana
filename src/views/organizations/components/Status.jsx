import organizationStatusProps from "../helpers/organizationStatusProps";

export const Status = ({ value, ...props }) => {

  return (
    <div { ...props } className={ `badge badge-sm bg-gradient-${ organizationStatusProps[value].bgColor }` } >
      { organizationStatusProps[value].label }
    </div>
  )
}

export default Status;