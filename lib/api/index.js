import AxiosWrapper from './axiosWrapper';
import SagaApi from './sagaApi';

/**
 * Creates cancellable axios API and a saga API
 * @function
 * @arg {object} options Axios configuration
 */
export const createApis = (options) => {

    const api = AxiosWrapper(options);
    return {

        api,
        sagaApi: SagaApi(api)
    };
};

export default createApis;