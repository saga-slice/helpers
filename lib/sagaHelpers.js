import { put, select, debounce, takeLatest } from 'redux-saga/effects';
import assert from 'assert';

/**
 * Fetchings whatever is in `state.current` again in order to
 * refresh a resource after an association or other out of context action.
 * This function is debounced by 100ms default to prevent api spam.
 *
 * @param {object} A Actions object
 * @param {string} name Name of state scope to grab current
 * @param {number} delay Debounce time
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

                yield put(A.getOne({ payload: id }));
            }
        },
        taker: debounce.bind(debounce, delay)
    }
}

/**
 * Creates crud saga boilerplate clojure for sagas slice
 * @function
 * @param {object} options Options to pass to saga helper
 * @param {string} options.name REST resource name
 * @param {string} options.takers Optional object of takers (defaults to `takeEvery`). Can be string `takeLatest`.
 * @param {string} options.sagaApi A `sagaApi` instance
 * @param {function} extend A function to pass actions and add extra sagas
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
    let { takers = {} } = opts;

    assert(
        !!name && name.constructor === String,
        'options.name: the resource\'s REST name is required'
    );

    assert(
        !!sagaApi && sagaApi.constructor === Object,
        'options.sagaApi: API object is required'
    );

    if (takers === 'takeLatest') {

        takers = [
            'readAll',
            'readOne',
            'create',
            'update',
            'patch',
            'delete',
        ].reduce((acc, cur) => ({
            ...acc,
            [cur]: takeLatest
        }), {});
    }

    return A => ({

        [A.readAll]: {
            *saga () {

                yield sagaApi.get(`/${name}`, A.readAllSuccess, A.readAllFail, A.readAllDone);
            },
            taker: takers.readAll
        },
        [A.readOne]: {
            *saga ({ payload: id }) {

                yield sagaApi.get(`/${name}/${id}`, A.readOneSuccess, A.readOneFail, A.readOneDone);
            },
            taker: takers.readOne
        },
        [A.create]: {
            *saga ({ payload }) {

                yield sagaApi.post(`/${name}`, payload, A.createSuccess, A.createFail, A.createDone);
            },
            taker: takers.create
        },
        [A.update]: {
            *saga ({ payload }) {

                const { id, changeset } = payload;
                yield sagaApi.put(`/${name}/${id}`, changeset, A.updateSuccess, A.updateFail, A.updateDone);
            },
            taker: takers.update
        },
        [A.patch]: {
            *saga ({ payload }) {

                const { id, changeset } = payload;
                yield sagaApi.patch(`/${name}/${id}`, changeset, A.patchSuccess, A.patchFail, A.patchDone);
            },
            taker: takers.patch
        },
        [A.delete]: {
            *saga ({ payload: id }) {

                yield sagaApi.delete(`/${name}/${id}`, null, A.deleteSuccess, A.deleteFail, A.deleteDone);
            },
            taker: takers.delete
        },

        ...(extend ? extend(A) : {})
    });
}