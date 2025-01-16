import { useDispatch, useSelector } from "react-redux";
import { formatISO } from "date-fns";

import {
    onCertificatesLoading,
    setCertificates,

    onCertificateLoading,
    setCertificate,
    clearCertificates,

    onCertificateCreating,
    isCertificateCreated,
    onCertificateSaving,
    isCertificateSaved,
    onCertificateDeleting,
    isCertificateDeleted,

    setCertificatesErrorMessage,
    clearCertificatesErrorMessage,
    clearCertificate,
} from "../store/slices/certificatesSlice";

import envVariables from "../helpers/envVariables";
import cortanaApi from "../api/cortanaApi";
import getError from "../helpers/getError";
import isString from "../helpers/isString";

const CERTIFICATES_ROUTE = '/certificates';
const { VITE_PAGE_SIZE } = envVariables();

const getSearchQuery = (options = {}) => {
    let query = '';

    query = `?pagesize=${options?.pageSize ?? VITE_PAGE_SIZE}`;
    query += options?.pageNumber ? `&pagenumber=${options.pageNumber}` : '&pagenumber=1';

    query += options?.organizationID ? `&organizationid=${options.organizationID}` : '';
    query += options?.standardID ? `&standardid=${options.standardID}` : '';
    query += options?.text ? `&text=${options.text}` : '';    
    query += options?.startDate ? `&startdate=${formatISO(new Date(options.startDate), { representation: 'date' })}` : '';
    query += options?.endDate ? `&enddate=${formatISO(new Date(options.endDate), { representation: 'date' })}` : '';
    query += options?.dateType ? `&datetype=${options.dateType}` : '';
    query += options?.validityStatus ? `&validitystatus=${options.validityStatus}` : '';
    query += options?.status ? `&status=${options.status}` : '';
    query += options?.includeDeleted ? `&includeDeleted=${options.includeDeleted}` : '';

    query += options?.order ? `&order=${options.order}` : '';
    return query;
};

export const useCertificatesStore = () => {
    const dispatch = useDispatch();
    const {
        isCertificatesLoading,
        certificates,
        certificatesMeta,

        isCertificateLoading,
        isCertificateCreating,
        certificateCreatedOk,
        isCertificateSaving,
        certificateSavedOk,
        isCertificateDeleting,
        certificateDeletedOk,
        certificate,

        certificatesErrorMessage
    } = useSelector(state => state.certificates)

    const { user } = useSelector(state => state.auth);
    
    // Methods

    const setError = (value) => {

        if (isString(value)) {
            dispatch(setCertificatesErrorMessage(value));    
        } else if (isString(value.message)) {
            dispatch(setCertificatesErrorMessage(value.message));
        } else {
            console.error('Unknow error data: ', value);
            return null;
        }
        setTimeout(() => {
            dispatch(clearCertificatesErrorMessage());
        }, 10);
    }; // setError

    //* Export Methods

    /**
     * Obtiene un listado de registros de acuerdo a los filtros establecidos, estableciendo pagesize = 0, devuelve todos los registros.
     * @param {Text, Status, Order, PageSize, PageMumber} options Objeto con las opciones para filtrar busquedas
     */
    const certificatesAsync = async (options = {}) => {
        dispatch(onCertificatesLoading());

        try {
            const query = getSearchQuery(options);
            const resp = await cortanaApi.get(`${CERTIFICATES_ROUTE}${query}`);
            const { Data, Meta } = await resp.data;

            dispatch(setCertificates({
                certificates: Data,
                certificatesMeta: Meta
            }));
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    const certificatesClear = () => {
        dispatch(clearCertificates());
    };

    /**
     * Obtiene un registro de acuerdo al identificador recibido
     * @param {guid} id Identificador del registro a obtener
     * @returns null
     */
    const certificateAsync = async (id) => {
        dispatch(onCertificateLoading());

        if (!id) {
            setError('You must specify the ID');
            return;
        }

        try {
            const resp = await cortanaApi.get(`${CERTIFICATES_ROUTE}/${id}`);
            const { Data } = await resp.data;

            dispatch(setCertificate(Data));
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    /**
     * Crea un registro en limpio con sus propiedades en blanco
     * @param {OrganizationID} identificador de la organizacion asociada al certificateo
     */
    const certificateCreateAsync = async (item) => {
        dispatch(onCertificateCreating());

        try {
            const params = {
                ...item,
                UpdatedUser: user.username,
            };
            const resp = await cortanaApi.post(CERTIFICATES_ROUTE, params);
            const { Data } = await resp.data;

            dispatch(setCertificate(Data));
            dispatch(isCertificateCreated());
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    const certificateSaveAsync = async (item, file) => {
        dispatch(onCertificateSaving());

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

            const resp = await cortanaApi.put(`${CERTIFICATES_ROUTE}`, formData, { headers });
            const { Data } = await resp.data;

            dispatch(setCertificate(Data));
            dispatch(isCertificateSaved());

        } catch(error) {
            const infoError = getError(error);
            setError(infoError);
        }
    }; // certificateSaveAsync

    /**
     * Elimina o marca como eliminado a un registro de la base de datos
     * @param {guid} id identificador del registro a eliminar
     */
    const certificateDeleteAsync = async (id) => {
        dispatch(onCertificateDeleting());

        const toDelete = {
            CertificateID: id,
            UpdatedUser: user.username,
        }

        try {
            const resp = await cortanaApi.delete(`${CERTIFICATES_ROUTE}/${id}`, { data: toDelete });

            console.log('certificateDeleteAsync.resp', resp);

            dispatch(isCertificateDeleted());
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    }

    //! No esta terminado...
    const certificateDeleteFileAsync = async (id) => {

        const toDeleteFile = {
            ID: id,
            UpdatedUser: user.username,
        };

        try {
            const resp = await cortanaApi.delete(`${CERTIFICATES_ROUTE}/${id}/documentfile`, { data: toDeleteFile });
            const { Data } = await resp.data;

            // console.log('certificateDeleteFileAsync.Data', Data)

            if (!!Data) {
                setCertificate({
                    ...certificate,
                    PhotoFilename: null,
                })
            }
            
            return Data;
        } catch (error) {
            const infoError = getError(error);
            setError(infoError);
        }

        return null;
    }; // certificateDeleteFileAsync

    const certificateClear = () => {
        dispatch(clearCertificate());
    }

    return {
        // properties
        isCertificatesLoading,
        certificates,
        certificatesMeta,

        isCertificateLoading,
        isCertificateCreating,
        certificateCreatedOk,
        isCertificateSaving,
        certificateSavedOk,
        isCertificateDeleting,
        certificateDeletedOk,
        certificate,

        certificatesErrorMessage,

        // methods
        certificatesAsync,
        certificatesClear,
        
        certificateAsync,
        certificateCreateAsync,
        certificateSaveAsync,
        certificateDeleteAsync,
        certificateDeleteFileAsync,
        certificateClear,
    }
};
