import { useEffect, useState } from "react";
import envVariables from "../helpers/envVariables";
import { useSelector } from "react-redux";
import enums from "../helpers/enums";

const { VITE_PAGE_SIZE } = envVariables();

export const useViewNavigation = ({
    LS_OPTIONS, // nombre del localStorage
    DefultOrder, // orden por defecto de tipo OrderType
    itemsAsync, // metodo que obtiene los registros
}) => {

    const { UserSettingSearchModeType } = enums();

    // HOOKS

    const {
        userSettings,
    } = useSelector(state => state.auth);

    const [currentOrder, setCurrentOrder] = useState(DefultOrder);
    const [currentPageSize, setCurrentPageSize] = useState(userSettings?.pageSize ?? VITE_PAGE_SIZE);

    useEffect(() => {
        console.log('useViewNavigation.useEffect[]: called');
        if (userSettings?.searchMode == UserSettingSearchModeType.onScreen) {
            localStorage.removeItem(LS_OPTIONS);
        }
    }, []);
    

    useEffect(() => {
        //console.log('useEffect[]: currentPageSize', currentPageSize);
        if (!!userSettings.pageSize && userSettings.pageSize !== currentPageSize) {
            //console.log('useEffect[]: userSettings.pageSize', userSettings.pageSize);
            onSearch();
            setCurrentPageSize(userSettings.pageSize);
        }
    }, [userSettings.pageSize]);
    
    // METHODS

    const getSavedSearch = () => {
        return JSON.parse(localStorage.getItem(LS_OPTIONS)) || null;
    }; // getSavedSearch

    const onOrderChange = (order = DefultOrder) => {
        const savedSearch = JSON.parse(localStorage.getItem(LS_OPTIONS)) || null;
        const search = {
            ...savedSearch,
            pageSize: userSettings?.pageSize ?? VITE_PAGE_SIZE,
            order: order
        };

        itemsAsync(search);

        localStorage.setItem(LS_OPTIONS, JSON.stringify(search));
        setCurrentOrder(order);
    }; // onOrderChange

    const onPageChange = (page = 1) => {
        const savedSearch = JSON.parse(localStorage.getItem(LS_OPTIONS)) || null;
        const search = {
            ...savedSearch,
            pageSize: userSettings?.pageSize ?? VITE_PAGE_SIZE,
            pageNumber: page,
        };

        itemsAsync(search);
        localStorage.setItem(LS_OPTIONS, JSON.stringify(search));
    }; // onPageChange

    const onSearch = (options) => {
        const savedSearch = JSON.parse(localStorage.getItem(LS_OPTIONS)) || null;
        const newSearch = {
            pageSize: userSettings?.pageSize ?? VITE_PAGE_SIZE,
            //pageSize: savedSearch?.pageSize ?? userSettings?.pageSize ?? VITE_PAGE_SIZE,
            pageNumber: 1,
            order: savedSearch?.order ?? DefultOrder,
        };
        const search = !!options || !!savedSearch
            ? {
                ...savedSearch,
                ...options,
                pageSize: userSettings?.pageSize ?? VITE_PAGE_SIZE,
                pageNumber: 1,
            }
            : newSearch;
        
        itemsAsync(search);
        setCurrentOrder(savedSearch?.order ?? DefultOrder);
        localStorage.setItem(LS_OPTIONS, JSON.stringify(search));
    }; // onSearch

    const onCleanSearch = () => {
        //const savedSearch = JSON.parse(localStorage.getItem(LS_OPTIONS)) || null;
        const search = {
            //pageSize: savedSearch?.pageSize ?? userSettings?.pageSize ?? VITE_PAGE_SIZE,
            pageSize: userSettings?.pageSize ?? VITE_PAGE_SIZE,
            pageNumber: 1,
            order: DefultOrder,
        };

        itemsAsync(search);
        localStorage.setItem(LS_OPTIONS, JSON.stringify(search));
    }; // onClearSearch

    return {
        currentOrder,

        getSavedSearch,
        onOrderChange,
        onPageChange,
        onSearch,
        onCleanSearch,
    };
}; // useViewNavigation