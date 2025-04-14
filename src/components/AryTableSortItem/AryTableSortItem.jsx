import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';

import AryTableSortIcon from '../AryTableSortIcon/AryTableSortIcon';

const AryTableSortItem = ({ activeAsc, activeDesc, onOrderAsc, onOrderDesc, ...props }) => {
    return (
        <div {...props} className="d-flex flex-row">
            <AryTableSortIcon
                icon={faCaretUp}
                isActive={activeAsc}
                title="Ascending"
                onClick={onOrderAsc}
            />
            <AryTableSortIcon
                icon={faCaretDown}
                isActive={activeDesc}
                title="Descending"
                onClick={onOrderDesc}
            />
        </div>
    );
};

export default AryTableSortItem;