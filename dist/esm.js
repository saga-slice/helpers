import assert from 'assert';
import { createModule } from 'saga-slice';
import { put, select, debounce, call } from 'redux-saga/effects';
import { create, CancelToken } from 'axios';
import { CANCEL } from 'redux-saga';

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(source, true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(source).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

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

function refetch(A, name) {
  var delay = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 100;
  return {
    saga:
    /*#__PURE__*/
    regeneratorRuntime.mark(function saga() {
      var _ref, id;

      return regeneratorRuntime.wrap(function saga$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return select(function (state) {
                return state[name].current;
              });

            case 2:
              _ref = _context.sent;
              id = _ref.id;

              if (id) {
                _context.next = 10;
                break;
              }

              console.warn("no current item set in ".concat(name, " state"));
              _context.next = 8;
              return;

            case 8:
              _context.next = 12;
              break;

            case 10:
              _context.next = 12;
              return put(A.readOne({
                payload: id
              }));

            case 12:
            case "end":
              return _context.stop();
          }
        }
      }, saga);
    }),
    taker: debounce.bind(debounce, delay)
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

var crudSaga = function crudSaga() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var extend = arguments.length > 1 ? arguments[1] : undefined;
  var name = opts.name,
      sagaApi = opts.sagaApi;
  assert(!!name && name.constructor === String, 'options.name: the resource\'s REST name is required');
  assert(!!sagaApi && sagaApi.constructor === Object, 'options.sagaApi: API object is required');
  return function (A) {
    var _objectSpread2$1;

    return _objectSpread2((_objectSpread2$1 = {}, _defineProperty(_objectSpread2$1, A.readAll,
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return sagaApi.get("/".concat(name), A.readAllSuccess, A.readAllFail, A.readAllDone);

            case 2:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee);
    })), _defineProperty(_objectSpread2$1, A.readOne,
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2(_ref2) {
      var id;
      return regeneratorRuntime.wrap(function _callee2$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              id = _ref2.payload;
              _context3.next = 3;
              return sagaApi.get("/".concat(name, "/").concat(id), A.readOneSuccess, A.readOneFail, A.readOneDone);

            case 3:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee2);
    })), _defineProperty(_objectSpread2$1, A.create,
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3(_ref3) {
      var payload;
      return regeneratorRuntime.wrap(function _callee3$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              payload = _ref3.payload;
              _context4.next = 3;
              return sagaApi.post("/".concat(name), payload, A.createSuccess, A.createFail, A.createDone);

            case 3:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee3);
    })), _defineProperty(_objectSpread2$1, A.update,
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee4(_ref4) {
      var payload, id, changeset;
      return regeneratorRuntime.wrap(function _callee4$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              payload = _ref4.payload;
              id = payload.id, changeset = payload.changeset;
              _context5.next = 4;
              return sagaApi.put("/".concat(name, "/").concat(id), changeset, A.updateSuccess, A.updateFail, A.updateDone);

            case 4:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee4);
    })), _defineProperty(_objectSpread2$1, A.patch,
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee5(_ref5) {
      var payload, id, changeset;
      return regeneratorRuntime.wrap(function _callee5$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              payload = _ref5.payload;
              id = payload.id, changeset = payload.changeset;
              _context6.next = 4;
              return sagaApi.patch("/".concat(name, "/").concat(id), changeset, A.patchSuccess, A.patchFail, A.patchDone);

            case 4:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee5);
    })), _defineProperty(_objectSpread2$1, A["delete"],
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee6(_ref6) {
      var id;
      return regeneratorRuntime.wrap(function _callee6$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              id = _ref6.payload;
              _context7.next = 3;
              return sagaApi["delete"]("/".concat(name, "/").concat(id), null, A.deleteSuccess, A.deleteFail, A.deleteDone);

            case 3:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee6);
    })), _objectSpread2$1), extend ? extend(A) : {});
  };
};

/**
 * Handles mapping a successful fetch into IDs
 * @function
 * @arg {*} state Mutable draft state from immer
 * @arg {*} payload Action payload
 */
var readAllSuccess = function readAllSuccess(state, payload) {
  state.isLoading = false;
  state.data = Object.values(payload || {}).reduce(function (a, c) {
    return _objectSpread2({}, a, _defineProperty({}, c.id, c));
  }, {});
};
/**
 * Handles fetching a single item
 * @function
 * @arg {*} state Mutable draft state from immer
 * @arg {*} payload Action payload
 */

var readOneSuccess = function readOneSuccess(state, payload) {
  state.isLoading = false;
  state.data[payload.id] = _objectSpread2({}, state.data[payload.id] || {}, {}, payload);
};
/**
 * Handles creating a single item
 * @function
 * @arg {*} state Mutable draft state from immer
 * @arg {*} payload Action payload
 */

var createSuccess = function createSuccess(state, payload) {
  state.isLoading = false;
  state.data[payload.id] = payload;
};
/**
 * Handles updating a single item
 * @function
 * @arg {*} state Mutable draft state from immer
 * @arg {*} payload Action payload
 */

var updateSuccess = function updateSuccess(state, payload) {
  state.isLoading = false;
  state.data[payload.id] = _objectSpread2({}, state.data[payload.id] || {}, {}, payload);
};
/**
 * Handles deleting a single item
 * @function
 * @arg {*} state Mutable draft state from immer
 * @arg {*} payload Action payload
 */

var deleteSuccess = function deleteSuccess(state, payload) {
  state.isLoading = false;
  delete state.data[payload.id];
};
/**
 * Handles fail actions
 * @function
 * @arg {*} state Mutable draft state from immer
 * @arg {*} payload Action payload
 */

var failReducer = function failReducer(state, error) {
  state.isLoading = false;
  state.error = error;
};
/**
 * Handles setting loading state when fetching
 * @function
 * @arg {*} state Mutable draft state from immer
 * @arg {*} payload Action payload
 */

var loadingReducer = function loadingReducer(state) {
  state.isLoading = true;
};
/**
 * Handles unsetting loading state without manipulate other aspects of state
 * @function
 * @arg {*} state Mutable draft state from immer
 * @arg {*} payload Action payload
 */

var notLoadingReducer = function notLoadingReducer(state) {
  state.isLoading = false;
};
/**
 * Set current item for when working in different screens
 * and need to maintain that screen's context. Payload accepts
 * an Object to set as current; Number or String as id to set from data.
 * @function
 * @arg {*} state Mutable draft state from immer
 * @arg {*} payload Action payload
 */

var setCurrent = function setCurrent(state, payload) {
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

var resetCurrent = function resetCurrent(state) {
  state.current = null;
};
/**
 * Placeholder do-nothing function
 * @function
 */

var noop = function noop() {};
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

var crudInitialState = function crudInitialState(extend) {
  return _objectSpread2({
    isLoading: false,
    current: null,
    data: {},
    error: null
  }, extend || {});
};
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

var crudReducers = function crudReducers() {
  var extend = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var done = arguments.length > 1 ? arguments[1] : undefined;
  return _objectSpread2({
    readAllSuccess: readAllSuccess,
    readOneSuccess: readOneSuccess,
    createSuccess: createSuccess,
    updateSuccess: updateSuccess,
    patchSuccess: updateSuccess,
    deleteSuccess: deleteSuccess,
    setCurrent: setCurrent,
    resetCurrent: resetCurrent,
    readAll: loadingReducer,
    readOne: loadingReducer,
    create: loadingReducer,
    update: loadingReducer,
    patch: loadingReducer,
    "delete": loadingReducer,
    readAllFail: failReducer,
    readOneFail: failReducer,
    createFail: failReducer,
    updateFail: failReducer,
    patchFail: failReducer,
    deleteFail: failReducer
  }, done ? {
    readAllDone: noop,
    readOneDone: noop,
    createDone: noop,
    updateDone: noop,
    patchDone: noop,
    deleteDone: noop
  } : {}, {}, extend);
};
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
 * - success: `silentSuccessReducer`
 * - fail: `failReduver`
 * - done: `noop`
 *
 * @function
 * @arg {string} name name of action
 * @arg {object} reducers object of reducers
 * @param {function} reducers.main main reducer created from name argument as `name`
 * @param {function} reducers.success success reducer created from name argument as `nameSuccess`
 * @param {function} reducers.fail fail reducer created from name argument as `nameFail`
 * @param {(function|boolean)} reducers.done optional done reducer is boolean or reducer function create as `nameDone`
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

var lifecycleReducers = function lifecycleReducers(name) {
  var _rdxs;

  var reducers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var rdxs = (_rdxs = {}, _defineProperty(_rdxs, name, reducers.main || loadingReducer), _defineProperty(_rdxs, "".concat(name, "Success"), reducers.success || notLoadingReducer), _defineProperty(_rdxs, "".concat(name, "Fail"), reducers.fail || failReducer), _rdxs);

  if (reducers.done) {
    rdxs["".concat(name, "Done")] = reducers.done instanceof Function ? reducers.done : noop;
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

var makeRequest = function makeRequest(instance, method, path) {
  var source = CancelToken.source();
  var args = [path];

  for (var _len = arguments.length, rest = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
    rest[_key - 3] = arguments[_key];
  }

  if (method !== 'get') {
    args.push(rest.shift());
  }

  var options = rest.shift() || {};
  args.push(_objectSpread2({}, options, {
    cancelToken: source.token
  }));
  var request = instance[method].apply(instance, args);

  request.cancel = function () {
    return source.cancel('request was cancelled by user');
  };

  request[CANCEL] = function () {
    return source.cancel('request was cancelled by sagas');
  };

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


var AxiosWrapper = (function () {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  // Extract headers and common from options so
  // dev does not accidentally override headers
  var _options = options,
      _options$headers = _options.headers,
      headers = _options$headers === void 0 ? {} : _options$headers;
  delete options.headers;
  var commonHeaders = headers.common || {}; // Default options

  options = _objectSpread2({
    baseURL: window.location.hostname,
    timeout: 5000
  }, options, {
    headers: _objectSpread2({}, headers, {
      common: _objectSpread2({
        'Content-Type': 'application/json'
      }, commonHeaders)
    })
  });
  var instance = create(options);

  var addHeader = function addHeader(name, value) {
    instance.defaults.headers.common[name] = value;
  };

  var removeHeader = function removeHeader(name) {
    delete instance.defaults.headers.common[name];
  };

  var addAuthorization = function addAuthorization(token) {
    addHeader('Authorization', token);
  };

  var removeAuthorization = function removeAuthorization() {
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
    "delete": makeRequest.bind(makeRequest, instance, 'delete'),

    /**
     * Sets authorization header on axios instance
     * @function addAuthorization
     * @arg {string} token Bearer auth token
     */
    addAuthorization: addAuthorization,

    /**
     * Removes authorization header on axios instance
     * @function removeAuthorization
     */
    removeAuthorization: removeAuthorization,

    /**
     * Adds a header value
     * @function addHeader
     * @arg {string} name header name
     * @arg {string} value header value
     */
    addHeader: addHeader,

    /**
     * Removes a header value
     * @function removeHeader
     * @arg {string} name header name
     */
    removeHeader: removeHeader,

    /**
     * Axios instance
     */
    instance: instance
  };
});

var _marked =
/*#__PURE__*/
regeneratorRuntime.mark(makeCall);

var isFunction = function isFunction(fn) {
  return !!fn && fn.constructor === Function && fn.call.constructor === Function;
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


function makeCall(instance, method, path) {
  var callArgs,
      _len,
      args,
      _key,
      success,
      fail,
      done,
      donePayload,
      _ref,
      data,
      status,
      _args = arguments;

  return regeneratorRuntime.wrap(function makeCall$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          // Arguments are structured as:
          // method, path, payload, success, fail, done
          // However, in the condition that the method is a "get",
          // then we want to omit "payload" and instead have
          // the 3rd and 4th arguments be actions
          assert(method.constructor === String, 'valid method required');
          assert(!!path && path.constructor === String, 'valid path required');
          callArgs = [instance[method], path]; // Extract payload

          for (_len = _args.length, args = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
            args[_key - 3] = _args[_key];
          }

          if (method !== 'get') {
            callArgs.push(args.shift());
          } // Last 2 arguments should be actions


          success = args.shift();
          fail = args.shift(); // last argument is an optional `done` action

          done = args.shift();
          assert(!!success && isFunction(success), 'success must be a function');
          assert(!!fail && isFunction(fail), 'fail must be a function'); // validate not exist or is a function

          assert(!done || isFunction(done), 'done must be a function');
          _context.prev = 11;
          _context.next = 14;
          return call.apply(void 0, callArgs);

        case 14:
          _ref = _context.sent;
          data = _ref.data;
          _context.next = 18;
          return put(success(data));

        case 18:
          donePayload = {
            data: data
          };
          _context.next = 30;
          break;

        case 21:
          _context.prev = 21;
          _context.t0 = _context["catch"](11);
          _context.next = 25;
          return put(fail(_context.t0));

        case 25:
          if (!_context.t0.response) {
            _context.next = 29;
            break;
          }

          status = _context.t0.response.status;
          _context.next = 29;
          return put({
            type: "sagaApi/".concat(status),
            payload: _context.t0.response
          });

        case 29:
          donePayload = {
            error: _context.t0
          };

        case 30:
          if (!done) {
            _context.next = 33;
            break;
          }

          _context.next = 33;
          return put(done(donePayload));

        case 33:
        case "end":
          return _context.stop();
      }
    }
  }, _marked, null, [[11, 21]]);
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


var SagaApi = (function (instance) {
  return {
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
    "delete": makeCall.bind(makeCall, instance, 'delete')
  };
});

/**
 * Creates cancellable axios API and a saga API
 * @function
 * @arg {object} options Axios configuration
 */

var createApis = function createApis(options) {
  var api = AxiosWrapper(options);
  return {
    api: api,
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

var crudSlice = function crudSlice(opts) {
  var name = opts.name,
      initialState = opts.initialState,
      reducers = opts.reducers,
      sagas = opts.sagas,
      sagaApi = opts.sagaApi,
      takers = opts.takers; // Required

  assert(!!name && name.constructor === String, 'must provide a valid name');
  assert(!!sagaApi && sagaApi.constructor === Object, 'must provide a valid sagaApi'); // Optional

  assert(!reducers || reducers && reducers.constructor === Object, 'reducers must be an object');
  assert(!initialState || initialState && initialState.constructor === Object, 'initialState must be an object');
  assert(!sagas || sagas && sagas.constructor === Function, 'sagas must be a function');
  assert(!takers || takers && [Object, String].includes(takers.constructor), 'takers must be an object or "takeEvery"');
  return createModule({
    name: name,
    initialState: crudInitialState(initialState || {}),
    reducers: crudReducers(reducers || {}),
    sagas: crudSaga({
      name: name,
      sagaApi: sagaApi,
      takers: takers
    }, sagas)
  });
};

export { createApis, createSuccess, crudInitialState, crudReducers, crudSaga, crudSlice, deleteSuccess, failReducer, lifecycleReducers, loadingReducer, noop, notLoadingReducer, readAllSuccess, readOneSuccess, refetch, resetCurrent, setCurrent, updateSuccess };
