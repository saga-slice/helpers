import { createModule } from 'saga-slice';
import { crudSaga } from './lib/sagas';
import { crudReducers, crudInitialState } from './lib/reducers';
import {
    affirm,
    isString,
    isObject,
    isFunction,
    isNotEmpty,
    isNotUndefined
} from './lib/helpers';

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
    })

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
export * from './lib/reducers';
export * from './lib/sagas';
