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
import getErrorMessages from "../helpers/getErrorMessages";
import enums from "../helpers/enums";
import cortanaApi from "../api/cortanaApi";
import getError from "../helpers/getError";

const { VITE_DEFAULT_PAGESIZE } = envVariables();

const getSearchQuery = (options = {}) => {
    let query = '';

    query = `?pagesize=${options?.pageSize ?? VITE_DEFAULT_PAGESIZE}`;
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
    const {
        EstatusType,
        ContactsOrdenType
    } = enums();

    // Methods

    const setError = (message) => {

        if (message.length === 0) return;

        dispatch(setContactsErrorMessage(message));
        setTimeout(() => {
            dispatch(clearContactsErrorMessage());
        }, 10);
    };

    //* Export Methods

    /**
     * Obtiene un listado de registros de acuerdo a los filtros establecidos, estableciendo pagesize = 0, devuelve todos los registros.
     * @param {Text, Status, Order, PageSize, PageMumber} options Objeto con las opciones para filtrar busquedas
     */
    const contactsAsync = async (options = {}) => {
        dispatch(onContactsLoading());

        try {
            const query = getSearchQuery(options);
            const resp = await cortanaApi.get(`/contacts${query}`);
            const { Data, Meta } = await resp.data;

            dispatch(setContacts({
                contacts: Data,
                contactsMeta: Meta
            }));
        } catch (error) {
            const message = getErrorMessages(error);
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
            const resp = await cortanaApi.get(`/contacts/${id}`);
            const { Data } = await resp.data;

            dispatch(setContact(Data));
        } catch (error) {
            const message = getErrorMessages(error);
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
            const resp = await cortanaApi.post('/contacts', params);
            const { Data } = await resp.data;

            dispatch(setContact(Data));
            dispatch(isContactCreated());
        } catch (error) {
            const message = getErrorMessages(error);
            setError(message);
        }
    };

    /**
     * Llama al endpoint para actualizar la información de un registro existente en la base de datos
     * @param {ID, Name, Description, Status, UpdatedUser} item Objeto tipo Contact
     */
    const contactSaveAsync = async (item) => {
        dispatch(onContactSaving());

        const toSave = {
            ...item,
            UpdatedUser: user.username,
        }
        try {
            const resp = await cortanaApi.put(`/contacts/${toSave.ID}`, toSave);
            const { Data } = await resp.data;

            dispatch(setContact(Data));
            dispatch(isContactSaved());
        } catch (error) {
            const message = getErrorMessages(error);
            setError(message);
        }
    };

    const contactSaveWithFileAsync = async (item, file) => {
        dispatch(onContactSaving());

        const toSave = {
            ...item,
            UpdatedUser: user.username,
        };

        console.log(file);

        try {
            const formData = new FormData();
            const headers = {
                'Content-Type': 'multipart/form-data'
            };  
            const data = JSON.stringify(toSave);

            formData.append('data', data);
            formData.append('file', file);

            const resp = await cortanaApi.put('/contacts/contact-with-file', formData, { headers });
            const { Data } = await resp.data;

            dispatch(setContact(Data));
            dispatch(isContactSaved());

        } catch(error) {
            const infoError = getErrorMessages(error);
            setError(infoError);
        }
    }; // contactSaveWithFileAsync

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
            const resp = await cortanaApi.delete(`/contacts/${id}`, { data: toDelete });
            dispatch(isContactDeleted());
        } catch (error) {
            //console.log(error);
            const message = getErrorMessages(error);
            setError(message);
        }
    }

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
        contactSaveWithFileAsync,
        contactDeleteAsync,
        contactClear,
    }
};
