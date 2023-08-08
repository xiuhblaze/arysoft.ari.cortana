import { faFaceSmile } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const InfoHorizontalCard = ({ icon, children }) => {
  const iconFig = icon?.icon ?? faFaceSmile;
  const iconColor = icon?.color ?? 'white';
  const iconBgColor = icon?.bgColor ?? 'primary';

  return (
    <div className="p-3 info-horizontal">
      <div className={`icon icon-shape rounded-circle bg-gradient-${ iconBgColor } shadow d-flex align-items-center justify-content-center`}>
        <FontAwesomeIcon icon={ iconFig } className={ `text-${ iconColor }` } />
      </div>
      <div className="description ps-3">
        { children }
      </div>
    </div>
  )
}

export default InfoHorizontalCard;