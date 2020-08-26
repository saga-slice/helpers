# Types

## **createApis**

* Cancellable request caller.
* [https://github.com/redux-saga/redux-saga/issues/651\#issuecomment-262375964](https://github.com/redux-saga/redux-saga/issues/651#issuecomment-262375964)

```typescript
/**
 * @arg {string} path Request URL path
 * @arg {*} payload Request payload. Omit if method is GET.
 * @arg {object} options Axios options
 *
 * @returns {Promise<AxiosResponse>}
 */
interface makeRequest {
    (path: string, ...rest: any[]): Promise<AxiosResponse>;
}

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
 * @param {AxiosRequestConfig} options Axios configuration
 */
declare const createApis: (options: AxiosRequestConfig) => {
    api: AxiosWrapperInstance;
    sagaApi: SagaApiInstance;
};
```

## **refetch**

* Fetch whatever is in `state.current` again in order to refresh a resource after an association or other out of context action.

```typescript
/**
 * @param {object} A Actions object
 * @param {string} name Name of state scope to grab current
 * @param {number} delay Debounce time
 *
 * @returns {object} An object to add to a saga slice
 */
declare const refetch: (A: any, name: string, delay: number) => SagaObject;
```

## **crudSaga**

* Creates crud saga boilerplate clojure for sagas slice

```typescript
interface SagaApiOpts extends Pick<ModuleOpts, 'name' | 'takers' | 'sagas'> {
    sagaApi: any;
}

interface ExtendSagasFn {
    (actions: any): {
        [type: string]: SagaObject;
    };
}

/**
 * @arg {object} options Options to pass to saga helper
 * @param {string} options.name REST resource name
 * @param {string} options.takers Optional object of takers (defaults to `takeEvery`). Can be string `takeLatest`.
 * @param {string} options.sagaApi A `sagaApi` instance
 * @arg {function} extend A function to pass actions and add extra sagas
 *
 * @return {function} Function that accepts redux actions object
 */

declare const crudSaga: (opts: SagaApiOpts, extend: ExtendSagasFn) => {
    (actions: any): {
        [type: string]: SagaObject;
    };
};
```

## **crudInitialState**

* Creates an opinionated initial state for handling common CRUD operates

```typescript
/**
 * @param {object} extend Extra state parameters
 * @returns {object} Initial state object
 */
declare const crudInitialState: {
    (extend: anyObject): typeof extend & {
        isFetching: boolean;
        current: any;
        data: anyObject;
        error: any;
    };
};
```

## **crudReducers**

* Creates an opinionated reducer object for handling common CRUD operations

```typescript
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
 * @param {object} extend Extra state parameters
 * @param {boolean} done Flag to create `done` actions / reducers
 * @returns {CrudReducersInstance} Reducer object for saga slice
 */

declare const crudReducers: (extend: anyObject, done?: boolean) => typeof extend & CrudReducersInstance;
```

## **crudSlice**

* Creates a saga slice with opinionated CRUD functionality

```typescript
/**
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
 */
declare const crudSlice: (opts: SagaApiOpts & ModuleOpts) => SagaSlice;
```

