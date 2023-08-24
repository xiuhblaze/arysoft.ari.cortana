import axios from "axios";
import envVariables from "../helpers/envVariables";

const { VITE_API_URL } = envVariables();

export const cortanaApi = axios.create({
  baseURL: `${ VITE_API_URL }`,
});

export default cortanaApi;