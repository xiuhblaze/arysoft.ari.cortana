import { useState } from "react";
import enums from "../../../helpers/enums";
import envVariables from "../../../helpers/envVariables";
import { useAuditsStore } from "../../../hooks/useAuditsStore";

export const useAuditNavigation = () => {

    const {
        AUDITS_OPTIONS,
        VITE_PAGE_SIZE,
    } = envVariables();

    const { AuditOrderType } = enums();

    const {
        auditsAsync,
    } = useAuditsStore();

    // HOOKS

    const [currentOrder, setCurrentOrder] = useState(AuditOrderType.dateDesc);

    // METHODS

    const getSavedSearch = () => {
        return JSON.parse(localStorage.getItem(AUDITS_OPTIONS)) || null;
    }

    const onOrderChange = (order = AuditOrderType.dateDesc) => {
        const savedSearch = JSON.parse(localStorage.getItem(AUDITS_OPTIONS)) || null;
        const search = {
            ...savedSearch,
            order: order
        };

        auditsAsync(search);

        localStorage.setItem(AUDITS_OPTIONS, JSON.stringify(search));
        setCurrentOrder(order);
    }; // onOrderChange

    const onPageChange = (page = 1) => {
        const savedSearch = JSON.parse(localStorage.getItem(AUDITS_OPTIONS)) || null;
        const search = {
            ...savedSearch,
            pageNumber: page,
        };

        auditsAsync(search);
        localStorage.setItem(AUDITS_OPTIONS, JSON.stringify(search));
    };

    const onSearch = (options) => {
        const savedSearch = JSON.parse(localStorage.getItem(AUDITS_OPTIONS)) || null;
        const newSearch = {
            pageSize: savedSearch?.pageSize ?? VITE_PAGE_SIZE,
            pageNumber: 1,
            order: savedSearch?.order ?? AuditOrderType.dateDesc,
        };
        const search = !!options || !!savedSearch
            ? {
                ...savedSearch,
                ...options,
                pageNumber: 1,
            }
            : newSearch;
        
        auditsAsync(search);
        setCurrentOrder(savedSearch?.order ?? AuditOrderType.dateDesc);
        localStorage.setItem(AUDITS_OPTIONS, JSON.stringify(search));
    }; // onSearch

    const onCleanSearch = () => {
        //console.log('onCleanSearch');
        const savedSearch = JSON.parse(localStorage.getItem(AUDITS_OPTIONS)) || null;
        const search = {
            pageSize: savedSearch?.pageSize ?? VITE_PAGE_SIZE,
            pageNumber: 1,
            order: AuditOrderType.dateDesc,
        };

        auditsAsync(search);
        localStorage.setItem(AUDITS_OPTIONS, JSON.stringify(search));
        //console.log('onCleanSearch: search', search);
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