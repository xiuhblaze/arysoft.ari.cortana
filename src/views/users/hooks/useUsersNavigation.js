import { useState } from "react";
import enums from "../../../helpers/enums";
import envVariables from "../../../helpers/envVariables";
import { useUsersStore } from "../../../hooks/useUsersStore";

const useUsersNavigation = () => {
    const {
        USERS_OPTIONS,
        VITE_PAGE_SIZE,
    } = envVariables();

    const { UserOrderType } = enums();

    const {
        usersAsync,
    } = useUsersStore();

    // HOOKS

    const [currentOrder, setCurrentOrder] = useState(UserOrderType.username);

    // METHODS

    const getSavedSearch = () => {
        return JSON.parse(localStorage.getItem(USERS_OPTIONS)) || null;
    }

    const onOrderChange = (order = UserOrderType.username) => {
        const savedSearch = JSON.parse(localStorage.getItem(USERS_OPTIONS)) || null;
        const search = {
            ...savedSearch,
            order: order
        };

        usersAsync(search);

        localStorage.setItem(USERS_OPTIONS, JSON.stringify(search));
        setCurrentOrder(order);
    }; // onOrderChange

    const onPageChange = (page = 1) => {
        const savedSearch = JSON.parse(localStorage.getItem(USERS_OPTIONS)) || null;
        const search = {
            ...savedSearch,
            pageNumber: page,
        };

        usersAsync(search);
        localStorage.setItem(USERS_OPTIONS, JSON.stringify(search));
    };

    const onSearch = (options) => {
        const savedSearch = JSON.parse(localStorage.getItem(USERS_OPTIONS)) || null;
        const newSearch = {
            pageSize: savedSearch?.pageSize ?? VITE_PAGE_SIZE,
            pageNumber: 1,
            order: savedSearch?.order ?? UserOrderType.username,
        };
        const search = !!options || !!savedSearch
            ? {
                ...savedSearch,
                ...options,
                pageNumber: 1,
            }
            : newSearch;
        
        usersAsync(search);
        setCurrentOrder(savedSearch?.order ?? UserOrderType.username);
        localStorage.setItem(USERS_OPTIONS, JSON.stringify(search));
    }; // onSearch

    const onCleanSearch = () => {
        const savedSearch = JSON.parse(localStorage.getItem(USERS_OPTIONS)) || null;
        const search = {
            pageSize: savedSearch?.pageSize ?? VITE_PAGE_SIZE,
            pageNumber: 1,
            order: UserOrderType.username,
        };

        usersAsync(search);
        localStorage.setItem(USERS_OPTIONS, JSON.stringify(search));
    }; // onClearSearch

    return {
        currentOrder,

        getSavedSearch,
        onOrderChange,
        onPageChange,
        onSearch,
        onCleanSearch,
    };
};

export default useUsersNavigation;