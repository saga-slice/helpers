import { AxiosRequestConfig, AxiosInstance, AxiosResponse } from 'axios';
import { SagaSlice, SagaObject, ModuleOpts } from 'saga-slice';
/**
 * Cancellable request caller. Implements a cancel-able api to
 * be used by sagas so that they can work with `takeLatest` and
 * cancel the previous request before calling again.
 *
 * When the method is a `GET`, the argument `payload` becomes `options`
 *
 * https://github.com/redux-saga/redux-saga/issues/651#issuecomment-262375964
 *
 * @arg {string} path Request URL path
 * @arg {*} payload Request payload. Optional if method is GET.
 * @arg {object} options Axios options
 *
 * @returns {Promise<AxiosResponse>}
 */
interface makeRequest {
    (path: string, ...rest: any[]): Promise<AxiosResponse>;
}
/**
 * An API for making cancellable xhr calls and other simple configurations
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
interface AxiosWrapperInstance {
    get: makeRequest;
    put: makeRequest;
    patch: makeRequest;
    post: makeRequest;
    delete: makeRequest;
    addAuthorization: {
        (authorization: string): void;
    };
    removeAuthorization: {
        (): void;
    };
    addHeader: {
        (name: string, value: string): void;
    };
    removeHeader: {
        (name: string): void;
    };
    instance: AxiosInstance;
}
/**
 * Generator function that wraps an API call within a try catch.
 * @arg {string} path URL Path
 * @arg {any} payload Request payload. Skip if GET.
 * @arg {function} success Success action
 * @arg {function} fail Fail action
 * @arg {function} done? Done action
 */
interface makeCall {
    (path: string, ...rest: any[]): Promise<AxiosResponse>;
}
interface SagaApiInstance {
    get: makeCall;
    post: makeCall;
    put: makeCall;
    patch: makeCall;
    delete: makeCall;
}
/**
 * Creates cancellable axios API and a saga API
 * @function
 * @arg {AxiosRequestConfig} options Axios configuration
 */
export declare const createApis: (options: AxiosRequestConfig) => {
    api: AxiosWrapperInstance;
    sagaApi: SagaApiInstance;
};
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
export declare const refetch: (A: any, name: string, delay: number) => SagaObject;
interface SagaApiOpts extends Pick<ModuleOpts, 'name' | 'takers' | 'sagas'> {
    sagaApi: any;
}
interface ExtendSagasFn {
    (actions: any): {
        [type: string]: SagaObject;
    };
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
export declare const crudSaga: (opts: SagaApiOpts, extend: ExtendSagasFn) => {
    (actions: any): {
        [type: string]: SagaObject;
    };
};
interface anyObject {
    [key: string]: any;
}
interface reducerFunction {
    (state: anyObject, payload: anyObject): void;
}
/**
 * Handles mapping a successful fetch into IDs
 */
export declare const readAllSuccess: reducerFunction;
/**
 * Handles fetching a single item
 */
export declare const readOneSuccess: reducerFunction;
/**
 * Handles creating a single item
 */
export declare const createSuccess: reducerFunction;
/**
 * Handles updating a single item
 */
export declare const updateSuccess: reducerFunction;
/**
 * Handles deleting a single item
 */
export declare const deleteSuccess: reducerFunction;
/**
 * Handles fail actions
 */
export declare const failReducer: reducerFunction;
/**
 * Handles setting loading state when fetching
 */
export declare const loadingReducer: reducerFunction;
/**
 * Handles unsetting loading state without manipulate other aspects of state
 */
export declare const notLoadingReducer: reducerFunction;
/**
 * Set current item for when working in different screens
 * and need to maintain that screen's context. Payload accepts
 * an Object to set as current; Number or String as id to set from data.
 */
export declare const setCurrent: reducerFunction;
/**
 * Set current item to null
 */
export declare const resetCurrent: reducerFunction;
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
export declare const crudInitialState: {
    (extend: anyObject): typeof extend & {
        isFetching: boolean;
        current: any;
        data: anyObject;
        error: any;
    };
};
interface CrudReducersInstance {
    readAll: any;
    readOne: any;
    create: any;
    update: any;
    patch: any;
    delete: any;
    readAllSuccess: any;
    readOneSuccess: any;
    createSuccess: any;
    updateSuccess: any;
    patchSuccess: any;
    deleteSuccess: any;
    setCurrent: any;
    resetCurrent: any;
    readAllFail: any;
    readOneFail: any;
    createFail: any;
    updateFail: any;
    patchFail: any;
    deleteFail: any;
    readAllDone?: any;
    readOneDone?: any;
    createDone?: any;
    updateDone?: any;
    patchDone?: any;
    deleteDone?: any;
}
/**
 * Creates an opinionated reducer object for handling common CRUD operates
 * @function
 * @arg {object} extend Extra state parameters
 * @arg {boolean} done Flag to create `done` actions / reducers
 * @returns {CrudReducersInstance} Reducer object for saga slice
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
export declare const crudReducers: (extend: anyObject, done?: boolean) => typeof extend & CrudReducersInstance;
interface LifecycleReducerOpts {
    main: reducerFunction;
    success: reducerFunction;
    fail: reducerFunction;
    done?: reducerFunction | boolean;
}
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
 * - fail: `failReducer`
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
export declare const lifecycleReducers: (name: string, reducers: LifecycleReducerOpts) => anyObject;
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
export declare const crudSlice: (opts: SagaApiOpts & ModuleOpts) => SagaSlice;
export {};
