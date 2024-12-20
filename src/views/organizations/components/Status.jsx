import statusProps from "../helpers/StatusProps";

export const Status = ({ value, ...props }) => {

  return (
    <div { ...props } className={ `badge badge-sm bg-gradient-${ statusProps[value].bgColor }` } >
      { statusProps[value].label }
    </div>
  )
}

export default Status;