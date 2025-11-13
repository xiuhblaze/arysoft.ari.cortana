import { faAnglesRight, faCalendarDay } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const ADCShowTotalDays = ({realTotalDays, totalDays, ...props}) => {
  return (
    <div {...props} >
        { 
            !!realTotalDays 
                ? <span>{realTotalDays}<FontAwesomeIcon icon={ faAnglesRight } className="mx-2" /></span> 
                : null 
        }
        <span className="font-weight-bold">
            { totalDays ?? 0 }
        </span>
        <span className="text-xxs ms-1">
            { totalDays == 1 ? 'day' : 'days' }
        </span>
        <span className="px-2" title="Days">
            <FontAwesomeIcon icon={ faCalendarDay } fixedWidth />
        </span>
    </div>
  )
}

export default ADCShowTotalDays