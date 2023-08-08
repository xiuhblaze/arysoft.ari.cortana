import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceSmile } from '@fortawesome/free-solid-svg-icons';

export const InfoCard = ({ icon, title,  children, ...props }) => {
  const iconFig = icon?.icon ?? faFaceSmile;
  const iconSize = icon?.size ?? "xl";
  const iconColor = icon?.color ?? "primary";
  const titleText = title?.text ?? '(none)';
  const titleColor = title?.color ?? 'dark';

  return (
    <div 
      { ...props }
      className="info"
    >
      <div className="icon icon-shape text-center">
        <FontAwesomeIcon icon={ iconFig } size={ iconSize } className={ `text-${iconColor}` } />
      </div>
      <h5 className={ titleColor }>{ titleText }</h5>
      { children }
    </div>
  )
}

export default InfoCard;
