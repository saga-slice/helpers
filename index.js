import assert from 'assert';
import { createModule } from 'saga-slice';
import { crudSaga } from './lib/sagaHelpers';
import { crudReducers, crudInitialState } from './lib/reducerHelpers';

/**
 * Creates a saga slice with opinionated CRUD functionality
 * @function
 * @param {object} options Options to pass to saga helper
 * @param {string} options.name Required. Slice name
 * @param {string} options.singular Required. Singular resource name
 * @param {string} options.plural Required. Plural resource name
 * @param {object} options.sagaApi Required. Saga API instance
 * @param {object} options.initialState Extra initial state values
 * @param {object} options.reducers Extra reducers
 * @param {function} options.sagas Extra sagas
 *
 * @return {SagaSlice} A saga slice module
 *
 * @example
 *
 */
export const crudSlice = (opts) => {

    const {
        name,
        initialState,
        singular,
        plural,
        reducers,
        sagas,
        sagaApi
    } = opts;

    // Required
    assert(!!name && name.constructor === String, 'must provide a valid name');
    assert(!!singular && singular.constructor === String, 'must provide a valid singular CRUD route');
    assert(!!plural && plural.constructor === String, 'must provide a valid plural CRUD route');
    assert(!!sagaApi && sagaApi.constructor === Object, 'must provide a valid sagaApi');

    // Optional
    assert(!reducers || (reducers && reducers.constructor === Object), 'reducers must be an object');
    assert(!initialState || (initialState && initialState.constructor === Object), 'initialState must be an object');
    assert(!sagas || (sagas && sagas.constructor === Function), 'sagas must be a function');

    return createModule({
        name,
        initialState: crudInitialState(initialState || {}),
        reducers: crudReducers(reducers || {}),
        sagas: crudSaga({
            sagaApi,
            singular,
            plural
        }, sagas)
    });
};

export * from './lib/api/index';
export * from './lib/reducerHelpers';
export * from './lib/sagaHelpers';
