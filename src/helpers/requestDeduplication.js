/**
 * Sistema de deduplication para evitar llamadas duplicadas a APIs
 * Mantiene un registro de peticiones pendientes y las reutiliza
 */

class RequestDeduplicator {
    constructor() {
        this.pendingRequests = {};
    }

    /**
     * Ejecuta una función async y deduplica basándose en una clave
     * Si ya hay una petición pendiente con la misma clave, retorna esa promesa
     * @param {string} key - Clave única para identificar la petición
     * @param {Function} requestFn - Función que retorna una promesa
     * @returns {Promise} La promesa de la petición
     */
    async execute(key, requestFn) {
        // Si ya hay una petición pendiente con esta clave, retorna esa promesa
        if (this.pendingRequests[key]) {
            //console.log(`[Deduplication] Reutilizando petición en caché: ${key}`);
            return this.pendingRequests[key];
        }

        //console.log(`[Deduplication] Nueva petición: ${key}`);

        // Crear la promesa y guardarla
        const promise = requestFn()
            .then(result => {
                // Limpiar la petición completada
                delete this.pendingRequests[key];
                return result;
            })
            .catch(error => {
                // Limpiar la petición con error
                delete this.pendingRequests[key];
                throw error;
            });

        // Guardar la promesa pendiente
        this.pendingRequests[key] = promise;
        return promise;
    }

    /**
     * Genera una clave única basada en los parámetros
     * @param {string} endpoint - El endpoint de la API
     * @param {Object} params - Parámetros de la petición
     * @returns {string} Clave única
     */
    generateKey(endpoint, params = {}) {
        return `${endpoint}:${JSON.stringify(params)}`;
    }

    /**
     * Limpia todas las peticiones pendientes
     */
    clearAll() {
        this.pendingRequests = {};
    }

    /**
     * Limpia una petición específica
     * @param {string} key - Clave de la petición a limpiar
     */
    clear(key) {
        delete this.pendingRequests[key];
    }
}

export default RequestDeduplicator;
