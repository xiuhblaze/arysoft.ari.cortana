import { useDispatch, useSelector } from "react-redux";

import {
    onNotesLoading,
    setNotes,

    onNoteLoading,
    setNote,
    clearNotes,

    onNoteCreating,
    isNoteCreated,
    onNoteSaving,
    isNoteSaved,
    onNoteDeleting,
    isNoteDeleted,

    setNotesErrorMessage,
    clearNotesErrorMessage,
    clearNote,
} from "../store/slices/notesSlice";

import envVariables from "../helpers/envVariables";
import cortanaApi from "../api/cortanaApi";
import getError from "../helpers/getError";
import isString from "../helpers/isString";

const NOTE_URL = '/notes';
const { VITE_PAGE_SIZE } = envVariables();

const getSearchQuery = (options = {}) => {
    let query = '';

    query = `?pagesize=${options?.pageSize ?? VITE_PAGE_SIZE}`;
    query += options?.pageNumber ? `&pagenumber=${options.pageNumber}` : '&pagenumber=1';

    query += options?.ownerID ? `&ownerid=${options.ownerID}` : '';
    query += options?.text ? `&text=${options.text}` : '';
    query += options?.status ? `&status=${options.status}` : '';
    query += options?.includeDeleted ? `&includeDeleted=${options.includeDeleted}` : '';

    query += options?.order ? `&order=${options.order}` : '';
    return query;
}; // getSearchQuery

export const useNotesStore = () => {
    const dispatch = useDispatch();
    const {
        isNotesLoading,
        notes,
        notesMeta,

        isNoteLoading,
        isNoteCreating,
        noteCreatedOk,
        isNoteSaving,
        noteSavedOk,
        isNoteDeleting,
        noteDeletedOk,
        note,

        notesErrorMessage
    } = useSelector(state => state.notes)

    const { user } = useSelector(state => state.auth);

    // Methods

    const setError = (value) => {    
            if (isString(value)) {
                dispatch(setNotesErrorMessage(value));    
            } else if (isString(value.message)) {
                dispatch(setNotesErrorMessage(value.message));
            } else {
                console.error('Unknow error data: ', value);
                return null;
            }            
            setTimeout(() => {
                dispatch(clearNotesErrorMessage());
            }, 10);
        }; // setError

    //* Export Methods

    /**
     * Obtiene un listado de registros de acuerdo a los filtros establecidos, estableciendo pagesize = 0, devuelve todos los registros.
     * @param {Text, DocumentType, SubCategory, Status, Order, PageSize, PageMumber} options Objeto con las opciones para filtrar busquedas
     */
    const notesAsync = async (options = {}) => {
        dispatch(onNotesLoading());

        try {
            const query = getSearchQuery(options);
            const resp = await cortanaApi.get(`${NOTE_URL}${query}`);
            const { Data, Meta } = await resp.data;

            dispatch(setNotes({
                notes: Data,
                notesMeta: Meta
            }));
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    }; // notesAsync

    const notesClear = () => {
        dispatch(clearNotes());
    };

    /**
     * Obtiene un registro de acuerdo al identificador recibido
     * @param {guid} id Identificador del registro a obtener
     * @returns null
     */
    const noteAsync = async (id) => {
        dispatch(onNoteLoading());

        if (!id) {
            setError('You must specify the ID');
            return;
        }

        try {
            const resp = await cortanaApi.get(`${NOTE_URL}/${id}`);
            const { Data } = await resp.data;

            dispatch(setNote(Data));
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    }; // noteAsync

    /**
     * Crea un registro en limpio con sus propiedades en blanco
     * @param {OwnerID, Text} identificador de la organizacion asociada al noteo
     */
    const noteCreateAsync = async (item) => {
        dispatch(onNoteCreating());

        try {
            const params = {
                ...item,
                UpdatedUser: user.username,
            };
            const resp = await cortanaApi.post(NOTE_URL, params);
            const { Data } = await resp.data;

            dispatch(setNote(Data));
            dispatch(isNoteCreated());
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    }; // noteCreateAsync

    /**
     * Llama al endpoint para actualizar la información de un registro existente en la base de datos
     * @param {ID, OwnerID, Text, Status } item Objeto tipo Note
     */
    const noteSaveAsync = async (item) => {
        dispatch(onNoteSaving());

        const toSave = {
            ...item,
            UpdatedUser: user.username,
        }
        try {
            const resp = await cortanaApi.put(`${NOTE_URL}/${toSave.ID}`, toSave);
            const { Data } = await resp.data;

            dispatch(setNote(Data));
            dispatch(isNoteSaved());
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    }; // noteSaveAsync

    /**
     * Elimina o marca como eliminado a un registro de la base de datos
     * @param {guid} id identificador del registro a eliminar
     */
    const noteDeleteAsync = async (id) => {
        dispatch(onNoteDeleting());

        const toDelete = {
            NoteID: id,
            UpdatedUser: user.username,
        }

        try {
            const resp = await cortanaApi.delete(`${NOTE_URL}/${id}`, { data: toDelete });
            dispatch(isNoteDeleted());
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    } // noteDeleteAsync

    const noteClear = () => {
        dispatch(clearNote());
    } // noteClear

    return {
        // properties
        isNotesLoading,
        notes,
        notesMeta,

        isNoteLoading,
        isNoteCreating,
        noteCreatedOk,
        isNoteSaving,
        noteSavedOk,
        isNoteDeleting,
        noteDeletedOk,
        note,

        notesErrorMessage,

        // methods
        notesAsync,
        notesClear,
        
        noteAsync,
        noteCreateAsync,
        noteSaveAsync,
        noteDeleteAsync,
        noteClear,
    }
};
