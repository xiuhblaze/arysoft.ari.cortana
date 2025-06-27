import { useState } from "react";
import envVariables from "../helpers/envVariables";

export const useModuleNavigation = (itemsAsync, localStorageKey, defaultOrder) => {

    const { VITE_PAGE_SIZE } = envVariables();

    // HOOKS

    const [currentOrder, setCurrentOrder] = useState(defaultOrder);

    // METHODS

    const getSavedSearch = () => {
        return JSON.parse(localStorage.getItem(localStorageKey)) || null;
    }; // getSavedSearch

    const setCurrentSearch = (search) => {        
        localStorage.setItem(localStorageKey, JSON.stringify(search));
    }; // setCurrentSearch

    const onOrderChange = (order = defaultOrder) => {
        const savedSearch = getSavedSearch(); 
        const search = {
            ...savedSearch,
            order: order
        };
        itemsAsync(search);
        setCurrentSearch(search); 
        setCurrentOrder(order);
    }; // onOrderChange

    const onPageChange = (page = 1) => {
        const savedSearch = getSavedSearch();
        const search = {
            ...savedSearch,
            pageNumber: page,
        };
        itemsAsync(search);
        setCurrentSearch(search);
    }; // onPageChange

    const onSearch = (options) => {
        const savedSearch = getSavedSearch();
        const newSearch = {
            pageSize: savedSearch?.pageSize ?? VITE_PAGE_SIZE,
            pageNumber: 1,
            order: savedSearch?.order ?? defaultOrder,
        };
        const search = !!options || !!savedSearch
            ? {
                ...savedSearch,
                ...options,
                pageNumber: 1,
            }
            : newSearch;
        itemsAsync(search);
        setCurrentOrder(savedSearch?.order ?? defaultOrder);
        setCurrentSearch(search);
    }; // onSearch

    const onCleanSearch = () => {
        const savedSearch = getSavedSearch();
        const search = {
            pageSize: savedSearch?.pageSize ?? VITE_PAGE_SIZE,
            pageNumber: 1,
            order: defaultOrder,
        };
        itemsAsync(search);
        setCurrentSearch(search);
    }; // onClearSearch

    return {
        currentOrder,

        getSavedSearch,
        onOrderChange,
        onPageChange,
        onSearch,
        onCleanSearch,
    };
}; // useModuleNavigation