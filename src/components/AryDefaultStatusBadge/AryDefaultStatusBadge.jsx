import defaultStatusProps from "../../helpers/defaultStatusProps";

const AryDefaultStatusBadge = ({ value, title, size='sm', ...props }) => {

    return (
        <div { ...props } className={`badge badge-${ size } bg-gradient-${ defaultStatusProps[value].bgColor }`}>
            { defaultStatusProps[value].label }
        </div>
    )
};

export default AryDefaultStatusBadge;