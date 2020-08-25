import { createModule } from 'saga-slice';
import { select, put, debounce, call } from 'redux-saga/effects';
import { create, CancelToken } from 'axios';
import { CANCEL } from 'redux-saga';

/**
 * Assertation function for type checking
 * @param {boolean} affirmative Thing to assert
 * @param {string} message Message to pass to error
 */
const affirm = (affirmative, message = '') => {
    if (!affirmative) {
        throw new Error(message);
    }
};

const isFunction = (val) => typeof val === 'function';
const isString = (val) => typeof val === 'string';
const isNotEmpty = (val) => val && val.length;
const isNotUndefined = (val) => typeof val !== 'undefined';

const isObject = (val) => (
    val !== null &&
    val !== undefined &&
    val.constructor !== Array &&
    typeof val === 'object'
);

/**
 * Fetchings whatever is in `state.current` again in order to
 * refresh a resource after an association or other out of context action.
 * This function is debounced by 100ms default to prevent api spam.
 *
 * @arg {object} A Actions object
 * @arg {string} name Name of state scope to grab current
 * @arg {number} delay Debounce time
 *
 * @returns {object} An object to add to a saga slice
 *
 * @example
 *
 * createModule({
 *     // ...
 *     sagas: A => {
 *          [A.associationDone]: refetch(A, 'todos'),
 *          [A.disassociationDone]: refetch(A, 'todos')
 *     }
 *     // ...
 * })
 */
function refetch (A, name, delay = 100) {

    return {
        saga: function* () {

            const { id } = yield select(state => state[name].current);

            if (!id) {
                console.warn(`no current item set in ${name} state`);
                yield;
            }
            else {

                yield put(A.readOne({ payload: id }));
            }
        },
        taker: debounce.bind(debounce, delay)
    }
}

/**
 * Creates crud saga boilerplate clojure for sagas slice
 * @function
 * @arg {object} options Options to pass to saga helper
 * @param {string} options.name REST resource name
 * @param {string} options.takers Optional object of takers (defaults to `takeEvery`). Can be string `takeLatest`.
 * @param {string} options.sagaApi A `sagaApi` instance
 * @arg {function} extend A function to pass actions and add extra sagas
 *
 * @return {function} Function that accepts redux actions object
 *
 * @example
 *
 * const opts = {
 *      sagaApi,
 *      name: 'users',
 *      takers: {
 *          readAll: takeLatest
 *      }
 * }
 *
 * const sagas = crudSaga(opts, (A) => ({
 *      [A.assignToUser]: {
 *          * saga({ payload }) {
 *              // do stuff
 *          }
 *      }
 * }));
 *
 * export default createModule({
 *     ...,
 *     sagas,
 *     ...
 * })
 */
const crudSaga = (opts = {}, extend) => {

    const { name, sagaApi } = opts;

    affirm(
        isString(name),
        'options.name: the resource\'s REST name is required'
    );

    affirm(
        isObject(sagaApi),
        'options.sagaApi: API object is required'
    );

    return A => ({

        [A.readAll]: function* () {

            yield sagaApi.get(`/${name}`, A.readAllSuccess, A.readAllFail, A.readAllDone);
        },
        [A.readOne]: function* ({ payload: id }) {

            yield sagaApi.get(`/${name}/${id}`, A.readOneSuccess, A.readOneFail, A.readOneDone);
        },
        [A.create]: function* ({ payload }) {

            yield sagaApi.post(`/${name}`, payload, A.createSuccess, A.createFail, A.createDone);
        },
        [A.update]: function* ({ payload }) {

            const { id, changeset } = payload;
            yield sagaApi.put(`/${name}/${id}`, changeset, A.updateSuccess, A.updateFail, A.updateDone);
        },
        [A.patch]: function* ({ payload }) {

            const { id, changeset } = payload;
            yield sagaApi.patch(`/${name}/${id}`, changeset, A.patchSuccess, A.patchFail, A.patchDone);
        },
        [A.delete]: function* ({ payload: id }) {

            yield sagaApi.delete(`/${name}/${id}`, null, A.deleteSuccess, A.deleteFail, A.deleteDone);
        },

        ...(extend ? extend(A) : {})
    });
};

/**
 * Handles mapping a successful fetch into IDs
 * @function
 * @arg {*} state Mutable draft state from immer
 * @arg {*} payload Action payload
 */
const readAllSuccess = (state, payload) => {

    state.isFetching = false;
    state.data = Object.values(payload || {})
        .reduce((a, c) => ({
            ...a,
            [c.id]: c
        }), {});
};

/**
 * Handles fetching a single item
 * @function
 * @arg {*} state Mutable draft state from immer
 * @arg {*} payload Action payload
 */
const readOneSuccess = (state, payload) => {

    state.isFetching = false;
    state.data[payload.id] = {
        ...(state.data[payload.id] || {}),
        ...payload
    };
};

/**
 * Handles creating a single item
 * @function
 * @arg {*} state Mutable draft state from immer
 * @arg {*} payload Action payload
 */
const createSuccess = (state, payload) => {

    state.isFetching = false;
    state.data[payload.id] = payload;
};

/**
 * Handles updating a single item
 * @function
 * @arg {*} state Mutable draft state from immer
 * @arg {*} payload Action payload
 */
const updateSuccess = (state, payload) => {

    state.isFetching = false;
    state.data[payload.id] = {
        ...(state.data[payload.id] || {}),
        ...payload
    };
};

/**
 * Handles deleting a single item
 * @function
 * @arg {*} state Mutable draft state from immer
 * @arg {*} payload Action payload
 */
const deleteSuccess = (state, payload) => {

    state.isFetching = false;
    delete state.data[payload.id];
};


/**
 * Handles fail actions
 * @function
 * @arg {*} state Mutable draft state from immer
 * @arg {*} payload Action payload
 */
const failReducer = (state, error) => {

    state.isFetching = false;
    state.error = error;
};

/**
 * Handles setting loading state when fetching
 * @function
 * @arg {*} state Mutable draft state from immer
 * @arg {*} payload Action payload
 */
const loadingReducer = state => {

    state.isFetching = true;
};

/**
 * Handles unsetting loading state without manipulate other aspects of state
 * @function
 * @arg {*} state Mutable draft state from immer
 * @arg {*} payload Action payload
 */
const notLoadingReducer = state => {

    state.isFetching = false;
};


/**
 * Set current item for when working in different screens
 * and need to maintain that screen's context. Payload accepts
 * an Object to set as current; Number or String as id to set from data.
 * @function
 * @arg {*} state Mutable draft state from immer
 * @arg {*} payload Action payload
 */
const setCurrent = (state, payload) => {

    if (payload.constructor === Object) {

        state.current = payload;
    }

    if (payload.constructor === Number || payload.constructor === String) {

        state.current = state.data[payload];
    }
};

/**
 * Set current item to null
 * @function
 * @arg {*} state Mutable draft state from immer
 * @arg {*} payload Action payload
 */
const resetCurrent = state => {

    state.current = null;
};

/**
 * Placeholder do-nothing function
 * @function
 */
const noop = () => {};

/**
 * Creates an opinionated initial state for handling common CRUD operates
 * @function
 * @arg {object} extend Extra state parameters
 * @returns {object} Initial state object
 *
 * @example
 *
 * const slice = createModule({
 *     // ...
 *     initial: crudInitialState({
 *         extendedState: true
 *     })
 *     // ...
 * });
 *
 */
const crudInitialState = extend => ({

    isFetching: false,
    current: null,
    data: {},
    error: null,
    ...(extend || {})
});

/**
 * Creates an opinionated reducer object for handling common CRUD operates
 * @function
 * @arg {object} extend Extra state parameters
 * @arg {boolean} done Flag to create `done` actions / reducers
 * @returns {object} Reducer object for saga slice
 *
 * @example
 *
 * const slice = createModule({
 *     // ...
 *     reducers: crudReducers({
 *         // ... more reducers
 *     }, true) // <-- creates `done` actions
 *     // ...
 * });
 *
 * const { actions } = slice;
 * const {
 *     setCurrent,
 *     resetCurrent,
 *     readAll,
 *     readOne,
 *     create,
 *     update,
 *     patch,
 *     delete,
 *     readAllSuccess,
 *     readOneSuccess,
 *     createSuccess,
 *     updateSuccess,
 *     patchSuccess
 *     deleteSuccess,
 *     readAllFail,
 *     readOneFail,
 *     createFail,
 *     updateFail,
 *     patchFail,
 *     deleteFail,
 *     readAllDone,
 *     readOneDone,
 *     createDone,
 *     updateDone,
 *     deleteDone
 * } = actions;
 */
const crudReducers = (extend = {}, done) => ({

    readAllSuccess,
    readOneSuccess,
    createSuccess,
    updateSuccess,
    patchSuccess: updateSuccess,
    deleteSuccess,
    setCurrent,
    resetCurrent,

    readAll: loadingReducer,
    readOne: loadingReducer,
    create: loadingReducer,
    update: loadingReducer,
    patch: loadingReducer,
    delete: loadingReducer,

    readAllFail: failReducer,
    readOneFail: failReducer,
    createFail: failReducer,
    updateFail: failReducer,
    patchFail: failReducer,
    deleteFail: failReducer,

    ...(done ? {
        readAllDone: noop,
        readOneDone: noop,
        createDone: noop,
        updateDone: noop,
        patchDone: noop,
        deleteDone: noop
    } : {}),

    ...extend
});

/**
 * Creates saga actions for async functions. This includes the
 * `success`, `fail,` and optional `done` actions to use in
 * the function's lifecycle.
 *
 * Accepts custom reducers via the `reducers` object where you
 * pass `{ main, success, fail, done }`. All are optional, `done`
 * will only be created if passed `true` or a reducer function.
 * Reducer options fallback to the following reducer helpers:
 * - main: `loadingReducer`
 * - success: `notLoadingReducer`
 * - fail: `failReduver`
 * - done: `noop`
 *
 * @function
 * @arg {string} name name of action
 * @arg {LifecycleReducerOpts} reducers object of reducers
 *
 * @returns {object} object of reducer functions
 *
 * @example
 *
 * const {
 *     getTodo,
 *     getTodoSuccess,
 *     getTodoFail,
 *     getTodoDone
 * } = lifecycleReducers('getTodo', {
 *     success: (state, payload) => state.data = payload,
 *     done: true
 * })
 */
const lifecycleReducers = (name, reducers = {}) => {

    affirm(isString(name) && isNotEmpty(name), 'name must be a valid string');
    affirm(isObject(reducers), 'reducers must be an object');

    [
        'main',
        'success',
        'fail'
    ].forEach(key => {

        isNotUndefined(reducers[key]) && (
            affirm(isFunction(reducers[key]), `reducers.${key} must be a function`)
        );
    });


    const rdxs = {
        [name]: reducers.main || loadingReducer,
        [`${name}Success`]: reducers.success || notLoadingReducer,
        [`${name}Fail`]: reducers.fail || failReducer
    };

    if (reducers.done) {
        rdxs[`${name}Done`] = isFunction(reducers.done) ? reducers.done : noop;
    }

    return rdxs;
};

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
var AxiosWrapper = (options = {}) => {

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

/**
 * Generator function that wraps an API call within a try catch.
 * @arg {object} instance Cancellable axios instances
 * @arg {string} method Request method
 * @arg {string} path URL Path
 * @arg {any} payload Request payload
 * @arg {function} success Success action
 * @arg {function} fail Fail action
 * @arg {function} done? Done action
 */
function* makeCall(instance, method, path, ...args) {

    // Arguments are structured as:
    // method, path, payload, success, fail, done
    // However, in the condition that the method is a "get",
    // then we want to omit "payload" and instead have
    // the 3rd and 4th arguments be actions
    affirm(isString(method), 'valid method required');
    affirm(isString(path), 'valid path required');

    const callArgs = [instance[method], path];

    // Extract payload
    if (method !== 'get') {
        callArgs.push(args.shift());
    }

    // Last 2 arguments should be actions
    const success = args.shift();
    const fail = args.shift();

    // last argument is an optional `done` action
    const done = args.shift();

    affirm(isFunction(success), 'success must be a function');
    affirm(isFunction(fail), 'fail must be a function');

    // validate not exist or is a function
    isNotUndefined(done) && affirm(isFunction(done), 'done must be a function');

    let donePayload;

    try {
        const { data } = yield call(...callArgs);

        yield put(success(data));

        donePayload = { data };
    }
    catch (error) {

        yield put(fail(error));

        if (error.response) {

            const { status } = error.response;
            yield put({ type: `sagaApi/${status}`, payload: error.response });
        }

        donePayload = { error };
    }

    // When finished, dispatch done action
    // This is useful for perform redirects or whatever
    if (done) {

        yield put(done(donePayload));
    }
}

/**
 * @typedef SagaApiInstance
 * @property {function} get perform get request
 * @property {function} post perform post request
 * @property {function} put perform put request
 * @property {function} patch perform patch request
 * @property {function} delete perform delete request
 */


/**
 * Creates an object with generators that make API calls
 * using the passed `instance`.
 *
 * @arg {object} instance Cancellable axios instance
 * @returns {SagaApiInstance} API generators for saga calls
 */
var SagaApi = (instance) => ({

    /**
     * Wrapper for makeCall.bind(makeCall, instance, 'get'),
     * @generator
     * @arg {string} path Request URL path
     * @arg {function} successAction Redux action to dispatch on success
     * @arg {function} failAction Redux action to dispatch on fail
     * @arg {function} [doneAction=undefined] Redux action to dispatch when completed
     */
    get: makeCall.bind(makeCall, instance, 'get'),

    /**
     * Wrapper for makeCall.bind(makeCall, instance, 'post'),
     * @generator
     * @arg {string} path Request URL path
     * @arg {*} payload Request payload
     * @arg {function} successAction Redux action to dispatch on success
     * @arg {function} failAction Redux action to dispatch on fail
     * @arg {function} [doneAction=undefined] Redux action to dispatch when completed
     */
    post: makeCall.bind(makeCall, instance, 'post'),

    /**
     * Wrapper for makeCall.bind(makeCall, instance, 'put'),
     * @generator
     * @arg {string} path Request URL path
     * @arg {*} payload Request payload
     * @arg {function} successAction Redux action to dispatch on success
     * @arg {function} failAction Redux action to dispatch on fail
     * @arg {function} [doneAction=undefined] Redux action to dispatch when completed
     */
    put: makeCall.bind(makeCall, instance, 'put'),

    /**
     * Wrapper for makeCall.bind(makeCall, instance, 'patch'),
     * @generator
     * @arg {string} path Request URL path
     * @arg {*} payload Request payload
     * @arg {function} successAction Redux action to dispatch on success
     * @arg {function} failAction Redux action to dispatch on fail
     * @arg {function} [doneAction=undefined] Redux action to dispatch when completed
     */
    patch: makeCall.bind(makeCall, instance, 'patch'),

    /**
     * Wrapper for makeCall.bind(makeCall, instance, 'delete'),
     * @generator
     * @arg {string} path Request URL path
     * @arg {*} payload Request payload
     * @arg {function} successAction Redux action to dispatch on success
     * @arg {function} failAction Redux action to dispatch on fail
     * @arg {function} [doneAction=undefined] Redux action to dispatch when completed
     */
    delete: makeCall.bind(makeCall, instance, 'delete')
});

/**
 * Creates cancellable axios API and a saga API
 * @function
 * @arg {object} options Axios configuration
 */
const createApis = (options) => {

    const api = AxiosWrapper(options);
    return {

        api,
        sagaApi: SagaApi(api)
    };
};

/**
 * Creates a saga slice with opinionated CRUD functionality
 * @function
 * @arg {object} options Options to pass to saga helper
 * @param {string} options.name Required. Slice name
 * @param {string} options.singular Required. Singular resource name
 * @param {string} options.plural Required. Plural resource name
 * @param {object} options.sagaApi Required. Saga API instance
 * @param {object} options.initialState Extra initial state values or overrides
 * @param {object} options.reducers Extra reducers or overrides
 * @param {function} options.sagas Extra sagas or overrides
 *
 * @return {SagaSlice} A saga slice module
 *
 * @example
 *
 * export default crudSlice({
 *      name: 'todos',
 *      singular: 'todo',
 *      plural: 'todos',
 *      sagaApi: createApis({ baseURL: '/api' }).sagaApi,
 *      initialState: { done: [], incomplete: [] },
 *      reducers: {
 *          setByStatus: (state, todos) => {
 *              state.done = todos.filter(t => t.status === 'done');
 *              state.incomplete = todos.filter(t => t.status === 'incomplete');
 *          }
 *      },
 *      sagas: (A) => {
 *          readAllDone: {
 *              saga* ({ payload: { data } }) {
 *                  if (data) {
 *                      yield put(A.setByStatus(Object.values(data)));
 *                  }
 *              }
 *          }
 *      }
 * })
 *
 */
const crudSlice = (opts) => {

    const {
        name,
        initialState,
        reducers,
        sagas,
        sagaApi,
        takers
    } = opts;

    // Required
    affirm(isNotEmpty(name) && isString(name), 'must provide a valid name');
    affirm(isObject(sagaApi), 'must provide a valid sagaApi');
    affirm(isFunction(sagaApi.get), 'must provide a valid sagaApi');

    // Optional
    [
        [reducers, isObject(reducers), 'reducers must be an object'],
        [initialState, isObject(initialState), 'initialState must be an object'],
        [sagas, isFunction(sagas), 'sagas must be a function'],
        [takers, isObject(takers) || isString(takers), 'takers must be an object or "takeEvery"'],
    ].forEach(([val, ...args]) => {

        isNotUndefined(val) && affirm(...args);
    });

    return createModule({
        name,
        initialState: crudInitialState(initialState || {}),
        reducers: crudReducers(reducers || {}),
        sagas: crudSaga({
            name,
            sagaApi,
            takers
        }, sagas)
    });
};

export { createApis, createSuccess, crudInitialState, crudReducers, crudSaga, crudSlice, deleteSuccess, failReducer, lifecycleReducers, loadingReducer, noop, notLoadingReducer, readAllSuccess, readOneSuccess, refetch, resetCurrent, setCurrent, updateSuccess };
