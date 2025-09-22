import { useState } from 'react';
import enums from '../../../helpers/enums';
import { useUsersStore } from '../../../hooks/useUsersStore';
import useUsersNavigation from '../hooks/useUsersNavigation';
import { ViewLoading } from '../../../components/Loaders';
import UserTableItem from './UserTableItem';
import AryTableSortItem from '../../../components/AryTableSortItem/AryTableSortItem';

const UserTableList = () => {
    const headStyle = 'text-uppercase text-secondary text-xxs font-weight-bolder';
    const { UserOrderType } = enums();

    // CUSTOM HOOKS

    const {
        isUsersLoading,
        users,
    } = useUsersStore();

    const {
        currentOrder,
        onSearch,
        onOrderChange
    } = useUsersNavigation();

    // HOOKS

    const [userID, setUserID] = useState(null);

  return (
    <div>
        { isUsersLoading ? (
            <ViewLoading />
        ) : !!users ? (
            <div className="table-responsive p-0">
                <table className="table align-items-center mb-0">
                    <thead>
                        <tr>
                            <th></th>
                            <th>
                                <div className="d-flex justify-content-start align-items-center gap-1">
                                    <AryTableSortItem
                                        activeAsc={currentOrder === UserOrderType.username}
                                        activeDesc={currentOrder === UserOrderType.usernameDesc}
                                        onOrderAsc={() => { onOrderChange(UserOrderType.username) }}
                                        onOrderDesc={() => { onOrderChange(UserOrderType.usernameDesc) }}
                                    />
                                    <div className={headStyle}>User</div>
                                </div>
                            </th>
                            <th className={headStyle}>Info</th>
                            <th className={headStyle}>Roles</th>
                            <th className={headStyle}>Last</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        { users.map(item => <UserTableItem 
                            key={item.ID} 
                            item={item}
                        />)}
                    </tbody>
                </table>
            </div>
        ) : null }
    </div>
  )
}

export default UserTableList