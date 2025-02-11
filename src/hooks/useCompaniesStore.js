import { useDispatch, useSelector } from "react-redux";

import {
    onCompaniesLoading,
    setCompanies,

    onCompanyLoading,
    setCompany,
    clearCompanies,

    onCompanyCreating,
    isCompanyCreated,
    onCompanySaving,
    isCompanySaved,
    onCompanyDeleting,
    isCompanyDeleted,

    setCompaniesErrorMessage,
    clearCompaniesErrorMessage,
    clearCompany,
} from "../store/slices/companiesSlice";

import envVariables from "../helpers/envVariables";
import cortanaApi from "../api/cortanaApi";
import getError from "../helpers/getError";
import isString from "../helpers/isString";

const COMPANY_URL = '/companies';
const { VITE_PAGE_SIZE } = envVariables();

const getSearchQuery = (options = {}) => {
    let query = '';

    query = `?pagesize=${options?.pageSize ?? VITE_PAGE_SIZE}`;
    query += options?.pageNumber ? `&pagenumber=${options.pageNumber}` : '&pagenumber=1';

    query += options?.organizationID ? `&organizationid=${options.organizationID}` : '';
    query += options?.text ? `&text=${options.text}` : '';
    query += options?.status ? `&status=${options.status}` : '';
    query += options?.includeDeleted ? `&includeDeleted=${options.includeDeleted}` : '';

    query += options?.order ? `&order=${options.order}` : '';
    return query;
};

export const useCompaniesStore = () => {
    const dispatch = useDispatch();
    const {
        isCompaniesLoading,
        companies,
        companiesMeta,

        isCompanyLoading,
        isCompanyCreating,
        companyCreatedOk,
        isCompanySaving,
        companySavedOk,
        isCompanyDeleting,
        companyDeletedOk,
        company,

        companiesErrorMessage
    } = useSelector(state => state.companies)

    const { user } = useSelector(state => state.auth);

    // Methods

    const setError = (value) => {    
        if (isString(value)) {
            dispatch(setCompaniesErrorMessage(value));    
        } else if (isString(value.message)) {
            dispatch(setCompaniesErrorMessage(value.message));
        } else {
            console.error('Unknow error data: ', value);
            return null;
        }            
        setTimeout(() => {
            dispatch(clearCompaniesErrorMessage());
        }, 10);
    }; // setError

    //* Export Methods

    /**
     * Obtiene un listado de registros de acuerdo a los filtros establecidos, estableciendo pagesize = 0, devuelve todos los registros.
     * @param {Type, Status, Order, PageSize, PageMumber} options Objeto con las opciones para filtrar busquedas
     */
    const companiesAsync = async (options = {}) => {
        dispatch(onCompaniesLoading());

        try {
            const query = getSearchQuery(options);
            const resp = await cortanaApi.get(`${COMPANY_URL}${query}`);
            const { Data, Meta } = await resp.data;

            dispatch(setCompanies({
                companies: Data,
                companiesMeta: Meta
            }));
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    const companiesClear = () => {
        dispatch(clearCompanies());
    };

    /**
     * Obtiene un registro de acuerdo al identificador recibido
     * @param {guid} id Identificador del registro a obtener
     * @returns null
     */
    const companyAsync = async (id) => {
        dispatch(onCompanyLoading());

        if (!id) {
            setError('You must specify the ID');
            return;
        }

        try {
            const resp = await cortanaApi.get(`${COMPANY_URL}/${id}`);
            const { Data } = await resp.data;
            
            dispatch(setCompany(Data));
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    /**
     * Crea un registro en limpio con sus propiedades en blanco
     * @param {OrganizationID} identificador de la organizacion asociada a la compañia
     */
    const companyCreateAsync = async (item) => {
        dispatch(onCompanyCreating());

        try {
            const params = {
                ...item,
                UpdatedUser: user.username,
            };
            const resp = await cortanaApi.post(COMPANY_URL, params);
            const { Data } = await resp.data;

            dispatch(setCompany(Data));
            dispatch(isCompanyCreated());
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    /**
     * Llama al endpoint para actualizar la información de un registro existente en la base de datos
     * @param {ID, Name, LegalEntity, COID, Status, UpdatedUser} item Objeto tipo Company
     */
    const companySaveAsync = async (item) => {
        dispatch(onCompanySaving());

        const toSave = {
            ...item,
            UpdatedUser: user.username,
        }
        try {
            const resp = await cortanaApi.put(`${COMPANY_URL}/${toSave.ID}`, toSave);
            const { Data } = await resp.data;

            dispatch(setCompany(Data));
            dispatch(isCompanySaved());
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    /**
     * Elimina o marca como eliminado a un registro de la base de datos
     * @param {guid} id identificador del registro a eliminar
     */
    const companyDeleteAsync = async (id) => {
        dispatch(onCompanyDeleting());

        const toDelete = {
            CompanyID: id,
            UpdatedUser: user.username,
        }

        try {
            const resp = await cortanaApi.delete(`${COMPANY_URL}/${id}`, { data: toDelete });
            dispatch(isCompanyDeleted());
        } catch (error) {
            //console.log(error);
            const message = getError(error);
            setError(message);
        }
    }

    const companyClear = () => {
        dispatch(clearCompany());
    }

    return {
        // properties
        isCompaniesLoading,
        companies,
        companiesMeta,

        isCompanyLoading,
        isCompanyCreating,
        companyCreatedOk,
        isCompanySaving,
        companySavedOk,
        isCompanyDeleting,
        companyDeletedOk,
        company,

        companiesErrorMessage,

        // methods
        companiesAsync,
        companiesClear,
        
        companyAsync,
        companyCreateAsync,
        companySaveAsync,
        companyDeleteAsync,
        companyClear,
    }
};
