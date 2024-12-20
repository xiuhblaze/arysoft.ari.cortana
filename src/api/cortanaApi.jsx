import axios from "axios";
import envVariables from "../helpers/envVariables";

const { VITE_API_URL, VITE_TOKEN } = envVariables();

export const cortanaApi = axios.create({
  baseURL: `${ VITE_API_URL }`,
});

// Interceptors

cortanaApi.interceptors.request.use(config => {
  config.headers = {
    ...config.headers,
    'Authorization': 'bearer ' + localStorage.getItem(VITE_TOKEN)
  };

  return config;
});

export default cortanaApi;