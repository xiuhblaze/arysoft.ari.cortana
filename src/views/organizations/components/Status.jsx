
export const Status = ({ value, ...props }) => {
  const status = [
    { bgColor: "secondary", label: "-" },
    { bgColor: "warning", label: "New" },
    { bgColor: "success", label: "Approved" },
    { bgColor: "info", label: "Active" },
    { bgColor: "secondary", label: "Inactive" },
    { bgColor: "danger", label: "Deleted" },
  ];
  return (
    <div { ...props } className={ `badge badge-sm bg-gradient-${ status[value].bgColor }` } >{ status[value].label }</div>
  )
}

export default Status;