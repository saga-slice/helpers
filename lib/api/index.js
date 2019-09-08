import AxiosWrapper from './axiosWrapper';
import SagaApi from './sagaApi';

/**
 * Creates cancellable axios API and a saga API
 * @function
 * @param {object} options Axios configuration
 */
export default (options) => {

    const api = AxiosWrapper(options);
    return {

        api,
        sagaApi: SagaApi(api)
    };
};