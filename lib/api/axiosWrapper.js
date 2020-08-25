import { CancelToken, create } from 'axios';
import { CANCEL } from 'redux-saga';

/**
 * Cancellable request caller. Implements a cancel-able api to
 * be used by sagas so that they can work with `takeLatest` and
 * cancel the previous request before calling again.
 *
 * When the method is a `GET`, the argument `payload` becomes `options`
 * https://github.com/redux-saga/redux-saga/issues/651#issuecomment-262375964
 *
 * @arg {object} instance Instance of Axios via `axios.create()`
 * @arg {string} method Request Method
 * @arg {string} path Request URL path
 * @arg {*} payload Request payload. Optional if method is GET.
 * @arg {object} options Axios options
 */
const makeRequest = (instance, method, path, ...rest) => {

    const source = CancelToken.source();

    const args = [path];

    if (method !== 'get') {

        args.push(rest.shift());
    }

    const options = rest.shift() || {};

    args.push({
        ...options,
        cancelToken: source.token
    });

    const request = instance[method](...args);

    request.cancel = () => source.cancel('request was cancelled by user');
    request[CANCEL] = () => source.cancel('request was cancelled by sagas');

    return request;
};

/**
 * @typedef AxiosWrapperInstance
 * @property {function} get perform get request
 * @property {function} post perform post request
 * @property {function} put perform put request
 * @property {function} patch perform patch request
 * @property {function} delete perform delete request
 * @property {function} addAuthorization add bearer token auth header
 * @property {function} removeAuthorization remove bearer token auth header
 * @property {function} addHeader adds a header
 * @property {function} removeHeader remove a header
 * @property {AxiosInstance} instance axios instance created by `axios.create`
 */

/**
 * API creator builds an Axios API that uses a cancellable request caller.
 * Accepts default Axios options
 *
 * @arg {object} options Axios options
 *
 * @returns {AxiosWrapperInstance} An API for making cancellable xhr calls and other simple configurations
 */
export default (options = {}) => {

    // Extract headers and common from options so
    // dev does not accidentally override headers
    const { headers = {} } = options;
    delete options.headers;
    const commonHeaders = headers.common || {};

    // Default options
    options = {
        baseURL: (window.location || {}).hostname || 'http://axios.baseURL.not.set',
        timeout: 5000,
        ...options,
        headers: {
            ...headers,
            common: {
                'Content-Type': 'application/json',
                ...commonHeaders
            }
        }
    };

    const instance = create(options);


    const addHeader = (name, value) => {

        instance.defaults.headers.common[name] = value;
    };

    const removeHeader = (name) => {

        delete instance.defaults.headers.common[name];
    };

    const addAuthorization = token => {

        addHeader('Authorization', token);
    };

    const removeAuthorization = () => {

        removeHeader('Authorization');
    };

    return {

        /**
         * @function get
         * @arg {string} path Request URL path
         * @arg options Axios options
         */
        get: makeRequest.bind(makeRequest, instance, 'get'),


        /**
         * @function put
         * @arg path Request URL path
         * @arg payload Request payload
         * @arg options Axios options
         */
        put: makeRequest.bind(makeRequest, instance, 'put'),


        /**
         * @function patch
         * @arg path Request URL path
         * @arg payload Request payload
         * @arg options Axios options
         */
        patch: makeRequest.bind(makeRequest, instance, 'patch'),


        /**
         * @function post
         * @arg path Request URL path
         * @arg payload Request payload
         * @arg options Axios options
         */
        post: makeRequest.bind(makeRequest, instance, 'post'),


        /**
         * @function delete
         * @arg path Request URL path
         * @arg payload Request payload
         * @arg options Axios options
         */
        delete: makeRequest.bind(makeRequest, instance, 'delete'),


        /**
         * Sets authorization header on axios instance
         * @function addAuthorization
         * @arg {string} token Bearer auth token
         */
        addAuthorization,


        /**
         * Removes authorization header on axios instance
         * @function removeAuthorization
         */
        removeAuthorization,

        /**
         * Adds a header value
         * @function addHeader
         * @arg {string} name header name
         * @arg {string} value header value
         */
        addHeader,

        /**
         * Removes a header value
         * @function removeHeader
         * @arg {string} name header name
         */
        removeHeader,

        /**
         * Axios instance
         */
        instance
    };
};
