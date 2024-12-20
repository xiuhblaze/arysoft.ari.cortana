import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export const AryTableSortIcon = ({ isActive, icon, onClick, ...props}) => {
  return (
    <>
      {
        isActive ? (
          <FontAwesomeIcon
            { ...props }
            icon={ icon }
            className={ `text-dark ${ props.className ?? '' }` }
          />
        ) : (
          <FontAwesomeIcon
            { ...props }
            icon={ icon }
            className={ `text-secondary ${ props.className ?? '' }` }
            onClick={ onClick }
            style={{ cursor: 'pointer' }}
          />
        )
      }
    </>
  )
}

export default AryTableSortIcon;