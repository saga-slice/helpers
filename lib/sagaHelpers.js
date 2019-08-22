import { put, select, debounce } from 'redux-saga/effects';
import store from './api/index';

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
 * @param {string} singular Singular resource name
 * @param {string} plural Plural resource name
 *
 * @return {function} Function that accepts redux actions object
 *
 * @example
 *
 * const sagas = crudSaga('todo', 'todos', (A) => ({
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
export const crudSaga = (singular, plural, extend) => A => ({

    [A.readAll]: {
        *saga () {

            yield store.sagaApi.get(`/${plural}`, A.readAllSuccess, A.readAllFail, A.readAllDone);
        }
    },
    [A.readOne]: {
        *saga ({ payload: id }) {

            yield store.sagaApi.get(`/${singular}/${id}`, A.createSuccess, A.createFail, A.createDone);
        }
    },
    [A.create]: {
        *saga ({ payload }) {

            yield store.sagaApi.post(`/${singular}`, payload, A.createSuccess, A.createFail, A.createDone);
        }
    },
    [A.update]: {
        *saga ({ payload }) {

            const { id, changeset } = payload;
            yield store.sagaApi.put(`/${singular}/${id}`, changeset, A.updateSuccess, A.updateFail, A.updateDone);
        }
    },
    [A.delete]: {
        *saga ({ payload: id }) {

            yield store.sagaApi.delete(`/${singular}/${id}`, null, A.deleteSuccess, A.deleteFail, A.deleteDone);
        }
    },

    ...(extend ? extend(A) : {})
});
