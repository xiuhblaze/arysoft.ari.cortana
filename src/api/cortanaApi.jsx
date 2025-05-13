import axios from "axios";
import envVariables from "../helpers/envVariables";

const { VITE_API_URL, VITE_TOKEN } = envVariables();

export const cortanaApi = axios.create({
    baseURL: `${VITE_API_URL}`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptors

const token = localStorage.getItem(VITE_TOKEN);

if (!!token) { // Si hay token, agrego el interceptor
    
    cortanaApi.interceptors.request.use(config => {
        config.headers = {
            ...config.headers,
            'Authorization': 'Bearer ' + localStorage.getItem(VITE_TOKEN)
        };

        return config;
    });
}


export default cortanaApi;