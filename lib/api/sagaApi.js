import assert from 'assert';
import { call, put } from 'redux-saga/effects';

// works for generators, functions, and custom function types (jest)
const isFunction = (fn) => !!fn &&
    fn.constructor === Function &&
    fn.call.constructor === Function
;

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
    assert(method.constructor === String, 'valid method required');
    assert(!!path && path.constructor === String, 'valid path required');

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

    assert(!!success && isFunction(success), 'success must be a function');
    assert(!!fail && isFunction(fail), 'fail must be a function');

    // validate not exist or is a function
    assert(!done || isFunction(done), 'done must be a function');

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
export default (instance) => ({

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
