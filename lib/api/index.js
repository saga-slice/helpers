import AxiosWrapper from './axiosWrapper';
import SagaApi from './sagaApi';

/**
 *
 * @typedef ApiHelpers
 * @property {AxiosWrapper} api
 * @property {SagaApi} sagaApi
 */
const store = {
    api: null,
    sagaApi: null
};

/**
 * Initialize cancellable axios API and a saga API
 * into a memory store for use throughout your app
 * @function
 * @param {object} options Axios configuration
 */
export const initialize = (options) => {

    store.api = AxiosWrapper(options);
    store.sagaApi = SagaApi(store.api);
}

export default store;