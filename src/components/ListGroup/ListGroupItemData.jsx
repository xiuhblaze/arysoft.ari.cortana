import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const ListGroupItemData = ({ label, icon, children, ...props }) => {
    const myIcon = icon ?? faChevronRight;
    return (
        <div {...props} className="d-flex flex-row justify-content-start gap-2">
            <div className="text-dark">
                <FontAwesomeIcon icon={myIcon} fixedWidth />
            </div>
            <div className="">
                <span>{label}</span>
                <strong className="text-dark ms-2">{children}</strong>                
            </div>
        </div>
    )
}

export default ListGroupItemData;