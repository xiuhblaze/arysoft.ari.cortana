import certificateValidityStatusProps from "../helpers/certificateValidityStatusProps"

const CertificateStatusBadge = ({ status, size="sm", ...props}) => {
  return (
    <div {...props } 
        className={ `badge badge-${ certificateValidityStatusProps[status].variant}` }
        size={ size }>
    </div>
  )
}

export default CertificateStatusBadge