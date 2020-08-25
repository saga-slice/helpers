import { put, select, debounce } from 'redux-saga/effects';
import { affirm, isString, isObject } from './helpers';

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
export function refetch (A, name, delay = 100) {

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
export const crudSaga = (opts = {}, extend) => {

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
}