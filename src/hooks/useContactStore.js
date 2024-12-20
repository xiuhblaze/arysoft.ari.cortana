import { useDispatch, useSelector } from "react-redux";
import { formatISO } from "date-fns";

import {
    onContactsLoading,
    setContacts,

    onContactLoading,
    setContact,
    clearContacts,

    onContactCreating,
    isContactCreated,
    onContactSaving,
    isContactSaved,
    onContactDeleting,
    isContactDeleted,

    setContactsErrorMessage,
    clearContactsErrorMessage,
    clearContact,
} from "../store/slices/contactsSlice";

import envVariables from "../helpers/envVariables";
import cortanaApi from "../api/cortanaApi";
import getError from "../helpers/getError";
import isString from "../helpers/isString";

const CONTACT_URI = '/contacts';
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

export const useContactsStore = () => {
    const dispatch = useDispatch();
    const {
        isContactsLoading,
        contacts,
        contactsMeta,

        isContactLoading,
        isContactCreating,
        contactCreatedOk,
        isContactSaving,
        contactSavedOk,
        isContactDeleting,
        contactDeletedOk,
        contact,

        contactsErrorMessage
    } = useSelector(state => state.contacts)

    const { user } = useSelector(state => state.auth);
    
    // Methods

    const setError = (value) => {
        if (isString(value)) {
            dispatch(setContactsErrorMessage(value));    
        } else if (isString(value.message)) {
            dispatch(setContactsErrorMessage(value.message));
        } else {
            console.error('Unknow error data: ', value);
            return null;
        }
        setTimeout(() => {
            dispatch(clearContactsErrorMessage());
        }, 10);
    }; // setError

    //* Export Methods

    /**
     * Obtiene un listado de registros de acuerdo a los filtros establecidos, estableciendo pagesize = 0, devuelve todos los registros.
     * @param {Text, Status, Order, PageSize, PageMumber} options Objeto con las opciones para filtrar busquedas
     */
    const contactsAsync = async (options = {}) => {
        dispatch(onContactsLoading());

        try {
            const query = getSearchQuery(options);
            const resp = await cortanaApi.get(`${CONTACT_URI}${query}`);
            const { Data, Meta } = await resp.data;

            dispatch(setContacts({
                contacts: Data,
                contactsMeta: Meta
            }));
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    const contactsClear = () => {
        dispatch(clearContacts());
    };

    /**
     * Obtiene un registro de acuerdo al identificador recibido
     * @param {guid} id Identificador del registro a obtener
     * @returns null
     */
    const contactAsync = async (id) => {
        dispatch(onContactLoading());

        if (!id) {
            setError('You must specify the ID');
            return;
        }

        try {
            const resp = await cortanaApi.get(`${CONTACT_URI}/${id}`);
            const { Data } = await resp.data;

            dispatch(setContact(Data));
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    /**
     * Crea un registro en limpio con sus propiedades en blanco
     * @param {OrganizationID} identificador de la organizacion asociada al contacto
     */
    const contactCreateAsync = async (item) => {
        dispatch(onContactCreating());

        try {
            const params = {
                //OrganizationID: item.OrganizationID,
                ...item,
                UpdatedUser: user.username,
            };
            const resp = await cortanaApi.post(CONTACT_URI, params);
            const { Data } = await resp.data;

            dispatch(setContact(Data));
            dispatch(isContactCreated());
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    // /**
    //  * Llama al endpoint para actualizar la información de un registro existente en la base de datos
    //  * @param {ID, Name, Description, Status, UpdatedUser} item Objeto tipo Contact
    //  */
    // const contactSaveAsync = async (item) => {
    //     dispatch(onContactSaving());

    //     const toSave = {
    //         ...item,
    //         UpdatedUser: user.username,
    //     }
    //     try {
    //         const resp = await cortanaApi.put(`${CONTACT_URI}/${toSave.ID}`, toSave);
    //         const { Data } = await resp.data;

    //         dispatch(setContact(Data));
    //         dispatch(isContactSaved());
    //     } catch (error) {
    //         const message = getError(error);
    //         setError(message);
    //     }
    // };

    const contactSaveAsync = async (item, file) => {
        dispatch(onContactSaving());

        const toSave = {
            ...item,
            UpdatedUser: user.username,
        };

        try {
            const formData = new FormData();
            const headers = {
                'Content-Type': 'multipart/form-data'
            };  
            const data = JSON.stringify(toSave);

            formData.append('data', data);
            formData.append('file', file);

            const resp = await cortanaApi.put(`${CONTACT_URI}`, formData, { headers });
            const { Data } = await resp.data;

            dispatch(setContact(Data));
            dispatch(isContactSaved());

        } catch(error) {
            const infoError = getError(error);
            setError(infoError);
        }
    }; // contactSaveAsync

    /**
     * Elimina o marca como eliminado a un registro de la base de datos
     * @param {guid} id identificador del registro a eliminar
     */
    const contactDeleteAsync = async (id) => {
        dispatch(onContactDeleting());

        const toDelete = {
            ContactID: id,
            UpdatedUser: user.username,
        }

        try {
            const resp = await cortanaApi.delete(`${CONTACT_URI}/${id}`, { data: toDelete });

            console.log('contactDeleteAsync.resp', resp);

            dispatch(isContactDeleted());
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    }

    const contactDeleteFileAsync = async (id) => {

        const toDeleteFile = {
            ID: id,
            UpdatedUser: user.username,
        };

        try {
            const resp = await cortanaApi.delete(`${CONTACT_URI}/${id}/photofile`, { data: toDeleteFile });
            const { Data } = await resp.data;

            console.log('contactDeleteFileAsync.Data', Data)

            if (!!Data) {
                setContact({
                    ...contact,
                    PhotoFilename: null,
                })
            }
            
            return Data;
        } catch (error) {
            const infoError = getError(error);
            setError(infoError);
        }

        return null;
    }; // contactDeleteFileAsync

    const contactClear = () => {
        dispatch(clearContact());
    }

    return {
        // properties
        isContactsLoading,
        contacts,
        contactsMeta,

        isContactLoading,
        isContactCreating,
        contactCreatedOk,
        isContactSaving,
        contactSavedOk,
        isContactDeleting,
        contactDeletedOk,
        contact,

        contactsErrorMessage,

        // methods
        contactsAsync,
        contactsClear,
        
        contactAsync,
        contactCreateAsync,
        contactSaveAsync,
        // contactSaveWithFileAsync,
        contactDeleteAsync,
        contactDeleteFileAsync,
        contactClear,
    }
};
