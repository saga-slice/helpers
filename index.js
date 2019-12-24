import assert from 'assert';
import { createModule } from 'saga-slice';
import { crudSaga } from './lib/sagaHelpers';
import { crudReducers, crudInitialState } from './lib/reducerHelpers';

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
export const crudSlice = (opts) => {

    const {
        name,
        initialState,
        reducers,
        sagas,
        sagaApi,
        takers
    } = opts;

    // Required
    assert(!!name && name.constructor === String, 'must provide a valid name');
    assert(!!sagaApi && sagaApi.constructor === Object, 'must provide a valid sagaApi');

    // Optional
    assert(!reducers || (reducers && reducers.constructor === Object), 'reducers must be an object');
    assert(!initialState || (initialState && initialState.constructor === Object), 'initialState must be an object');
    assert(!sagas || (sagas && sagas.constructor === Function), 'sagas must be a function');
    assert(!takers || (takers && [Object, String].includes(takers.constructor)), 'takers must be an object or "takeEvery"');

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

export * from './lib/api/index';
export * from './lib/reducerHelpers';
export * from './lib/sagaHelpers';
