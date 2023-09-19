import { useDispatch, useSelector } from "react-redux";

import cortanaApi from "../api/cortanaApi";

import { 
  onNacecodesLoading, 
  setNacecodes, 

  onNacecodeLoading,
  onNacecodeCreating,
  isNacecodeCreated,
  onNacecodeSaving,
  isNacecodeSaved,
  onNacecodeDeleting,
  isNacecodeDeleted,
  setNacecode,

  setNacecodesErrorMessage,
} from "../store/slices/nacecodesSlice";

import enums from "../helpers/enums";
import envVariables from "../helpers/envVariables";
import getErrorMessages from "../helpers/getErrorMessages";

const NACECODES_URI = '/nacecodes';
const { VITE_DEFAULT_PAGESIZE } = envVariables();

const getSearhQuery = (options = {}) => {
  let query = '';

  query = `?pagesize=${ options?.pageSize ?? VITE_DEFAULT_PAGESIZE }`;
  query += options?.pageNumber ? `&pagenumber=${ options.pageNumber }` : '&pagenumber=1';

  query += options?.text?.length > 0 ? `&text=${ options.text }` : '';
  query += options?.status ? `&status=${ options.status }` : '';
  query += options?.includeDeleted ? `&includeDeleted=${ options.includeDeleted }` : '';

  query += options?.order ? `&order=${ options.order }` : '';
    
  return query;
};

export const useNacecodesStore = () => {
  const dispatch = useDispatch();
  const {
    isNacecodesLoading,
    nacecodes,
    nacecodesMeta,
    
    isNacecodeLoading,
    isNacecodeCreating,
    nacecodeCreatedOk,
    isNacecodeSaving,
    nacecodeSavedOk,
    isNacecodeDeleting,
    nacecodeDeletedOk,
    nacecode,

    nacecodeErrorMessage,
  } = useSelector(state => state.nacecodes);
  const { user } = useSelector(state => state.auth);
  const { DefaultStatusType } = enums();

  // METHODS

  const setError = (message) => {
    if (message.length === 0) return;
    dispatch(setNacecodesErrorMessage(message));
    setTimeout(() => {
      dispatch(setNacecodesErrorMessage(null));
    }, 10);
  };

  //* Export Methods

  /**
   * Llama al endpoint que obtiene un listado de nacecodes de acuerdo
   * a los filtros enviados
   * @param {
   *   text: string,
   *   status: [nothing, active, inactive, deleted], order: [nothing, sector, description, updated, sectorDesc, descriptionDesc, updatedDesc]} options valores por los cuales filtrar los nacecodes
   * @returns void - guarda en el store un listado de nacecodes obtenidos
   */
  const nacecodesAsync = async (options = {}) => {
    dispatch(onNacecodesLoading());

    const query = getSearhQuery(options);

    try {
      const resp = await cortanaApi.get(`${ NACECODES_URI }${ query }`);
      const { Data, Meta } = await resp.data;

      dispatch(setNacecodes({
        nacecodes: Data,
        nacecodesMeta: Meta,
      }));
    } catch (error) {
      const message = getErrorMessages(error);
      setError(message);
    }
  };

  /**
   * Llama al endpoint para obtener un registro por medio del ID
   * @param {Guid} id Identificador del registro a consultar
   * @returns void - se carga en el Store
   */
  const nacecodeAsync = async (id) => {
    dispatch(onNacecodeLoading());

    if (!id) { setError('You must specify the ID'); return; }

    try {
      const resp = await cortanaApi.get(`${ NACECODES_URI }/${ id }`);
      const { Data } = await resp.data;
      
      dispatch(setNacecode(Data));
    } catch (error) {
      const message = getErrorMessages(error);
      setError(message);
    }
  };

  /**
   * Llama al endpoint para crear un registro vacio en la BDD para ser
   * llenado, devuelve el registro en el Store
   */
  const nacecodeCreateAsync = async () => {
    dispatch(onNacecodeCreating());

    const emptyNacecode = {
      // Name: '',
      // Description: '',
      // Status: DefaultStatusType.nothing,
      UpdatedUser: user.username,
    };

    try {
      const resp = await cortanaApi.post(`${ NACECODES_URI }`, emptyNacecode);
      const { Data } = await resp.data;
      
      dispatch(setNacecode(Data));
      dispatch(isNacecodeCreated());
    } catch (error) {
      const message = getErrorMessages(error);
      setError(message);
    }
  };

  /**
   * Llama al endpoint para actualizar los datos de un registro, si es uno nuevo
   * lo marca con su primer estado
   * @param {NacecodeID, Sector, Division, Group, Class, Description, Status, UpdatedUser} item nacecode a actualizar en la BDD
   */
  const nacecodeSaveAsync = async (item) => {    
    dispatch(onNacecodeSaving());

    const toSave = {
      ...item,
      UpdatedUser: user.username,
    }

    try {
      const resp = await cortanaApi.put(`${ NACECODES_URI }/${ item.NaceCodeID }`, toSave);
      const { Data } = await resp.data;
      
      dispatch(isNacecodeSaved(Data));

    } catch (error) {
      const message = getErrorMessages(error);
      setError(message);     
    }

  };

  /**
   * Llama al endpoint para eliminar el registro indicado por el ID
   * @param {Guid} id Identificador del registro a eliminar
   */
  const nacecodeDeleteAsync = async (id) => {
    dispatch(onNacecodeDeleting());

    const toDelete = {
      NaceCodeID: id,
      UpdatedUser: user.username,
    }

    try {
      await cortanaApi.delete(`${ NACECODES_URI }/${ id }`, { data: toDelete });
      dispatch(isNacecodeDeleted());
    } catch (error) {
      const message = getErrorMessages(error);
      setError(message);     
    }
  };

  const nacecodeClear = () => {
    dispatch(setNacecode(null));
  };

  return {
    //* Properties
    // Collection
    isNacecodesLoading,
    nacecodes,
    nacecodesMeta,
    // Element
    isNacecodeLoading,
    isNacecodeCreating,
    nacecodeCreatedOk,
    isNacecodeSaving,
    nacecodeSavedOk,
    isNacecodeDeleting,
    nacecodeDeletedOk,
    nacecode,
    // Error
    nacecodeErrorMessage,
    
    //* Methods
    nacecodesAsync,
    nacecodeAsync,
    nacecodeCreateAsync,
    nacecodeSaveAsync,
    nacecodeDeleteAsync,
    nacecodeClear,
  };
};

export default useNacecodesStore;