(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('assert'), require('saga-slice'), require('axios'), require('redux-saga')) :
typeof define === 'function' && define.amd ? define(['exports', 'assert', 'saga-slice', 'axios', 'redux-saga'], factory) :
(global = global || self, factory(global.SagaSliceTool = {}, global.assert, global.sagaSlice, global.axios, global.reduxSaga));
}(this, (function (exports, assert, sagaSlice, axios, reduxSaga) { 'use strict';

assert = assert && assert.hasOwnProperty('default') ? assert['default'] : assert;

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

var createSymbol = function createSymbol(name) {
  return "@@redux-saga/" + name;
};

var CANCEL =
/*#__PURE__*/
createSymbol('CANCEL_PROMISE');
var IO =
/*#__PURE__*/
createSymbol('IO');
var MULTICAST =
/*#__PURE__*/
createSymbol('MULTICAST');

var undef = function undef(v) {
  return v === null || v === undefined;
};
var notUndef = function notUndef(v) {
  return v !== null && v !== undefined;
};
var func = function func(f) {
  return typeof f === 'function';
};
var string = function string(s) {
  return typeof s === 'string';
};
var array = Array.isArray;
var object = function object(obj) {
  return obj && !array(obj) && typeof obj === 'object';
};
var pattern = function pattern(pat) {
  return pat && (string(pat) || symbol(pat) || func(pat) || array(pat) && pat.every(pattern));
};
var channel = function channel(ch) {
  return ch && func(ch.take) && func(ch.close);
};
var stringableFunc = function stringableFunc(f) {
  return func(f) && f.hasOwnProperty('toString');
};
var symbol = function symbol(sym) {
  return Boolean(sym) && typeof Symbol === 'function' && sym.constructor === Symbol && sym !== Symbol.prototype;
};
var multicast = function multicast(ch) {
  return channel(ch) && ch[MULTICAST];
};

function delayP(ms, val) {
  if (val === void 0) {
    val = true;
  }

  var timeoutId;
  var promise = new Promise(function (resolve) {
    timeoutId = setTimeout(resolve, ms, val);
  });

  promise[CANCEL] = function () {
    clearTimeout(timeoutId);
  };

  return promise;
}

var identity = function identity(v) {
  return v;
};
function check(value, predicate, error) {
  if (!predicate(value)) {
    throw new Error(error);
  }
}

var kThrow = function kThrow(err) {
  throw err;
};

var kReturn = function kReturn(value) {
  return {
    value: value,
    done: true
  };
};

function makeIterator(next, thro, name) {
  if (thro === void 0) {
    thro = kThrow;
  }

  if (name === void 0) {
    name = 'iterator';
  }

  var iterator = {
    meta: {
      name: name
    },
    next: next,
    throw: thro,
    return: kReturn,
    isSagaIterator: true
  };

  if (typeof Symbol !== 'undefined') {
    iterator[Symbol.iterator] = function () {
      return iterator;
    };
  }

  return iterator;
}

var TAKE = 'TAKE';
var PUT = 'PUT';
var RACE = 'RACE';
var CALL = 'CALL';
var FORK = 'FORK';
var SELECT = 'SELECT';

var makeEffect = function makeEffect(type, payload) {
  var _ref;

  return _ref = {}, _ref[IO] = true, _ref.combinator = false, _ref.type = type, _ref.payload = payload, _ref;
};
function take(patternOrChannel, multicastPattern) {
  if (patternOrChannel === void 0) {
    patternOrChannel = '*';
  }

  if ( arguments.length) {
    check(arguments[0], notUndef, 'take(patternOrChannel): patternOrChannel is undefined');
  }

  if (pattern(patternOrChannel)) {
    return makeEffect(TAKE, {
      pattern: patternOrChannel
    });
  }

  if (multicast(patternOrChannel) && notUndef(multicastPattern) && pattern(multicastPattern)) {
    return makeEffect(TAKE, {
      channel: patternOrChannel,
      pattern: multicastPattern
    });
  }

  if (channel(patternOrChannel)) {
    return makeEffect(TAKE, {
      channel: patternOrChannel
    });
  }

  {
    throw new Error("take(patternOrChannel): argument " + patternOrChannel + " is not valid channel or a valid pattern");
  }
}
function put(channel$1, action) {
  {
    if (arguments.length > 1) {
      check(channel$1, notUndef, 'put(channel, action): argument channel is undefined');
      check(channel$1, channel, "put(channel, action): argument " + channel$1 + " is not a valid channel");
      check(action, notUndef, 'put(channel, action): argument action is undefined');
    } else {
      check(channel$1, notUndef, 'put(action): argument action is undefined');
    }
  }

  if (undef(action)) {
    action = channel$1; // `undefined` instead of `null` to make default parameter work

    channel$1 = undefined;
  }

  return makeEffect(PUT, {
    channel: channel$1,
    action: action
  });
}
function race(effects) {
  var eff = makeEffect(RACE, effects);
  eff.combinator = true;
  return eff;
} // this match getFnCallDescriptor logic

var validateFnDescriptor = function validateFnDescriptor(effectName, fnDescriptor) {
  check(fnDescriptor, notUndef, effectName + ": argument fn is undefined or null");

  if (func(fnDescriptor)) {
    return;
  }

  var context = null;
  var fn;

  if (array(fnDescriptor)) {
    context = fnDescriptor[0];
    fn = fnDescriptor[1];
    check(fn, notUndef, effectName + ": argument of type [context, fn] has undefined or null `fn`");
  } else if (object(fnDescriptor)) {
    context = fnDescriptor.context;
    fn = fnDescriptor.fn;
    check(fn, notUndef, effectName + ": argument of type {context, fn} has undefined or null `fn`");
  } else {
    check(fnDescriptor, func, effectName + ": argument fn is not function");
    return;
  }

  if (context && string(fn)) {
    check(context[fn], func, effectName + ": context arguments has no such method - \"" + fn + "\"");
    return;
  }

  check(fn, func, effectName + ": unpacked fn argument (from [context, fn] or {context, fn}) is not a function");
};

function getFnCallDescriptor(fnDescriptor, args) {
  var context = null;
  var fn;

  if (func(fnDescriptor)) {
    fn = fnDescriptor;
  } else {
    if (array(fnDescriptor)) {
      context = fnDescriptor[0];
      fn = fnDescriptor[1];
    } else {
      context = fnDescriptor.context;
      fn = fnDescriptor.fn;
    }

    if (context && string(fn) && func(context[fn])) {
      fn = context[fn];
    }
  }

  return {
    context: context,
    fn: fn,
    args: args
  };
}

var isNotDelayEffect = function isNotDelayEffect(fn) {
  return fn !== delay;
};

function call(fnDescriptor) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  {
    var arg0 = typeof args[0] === 'number' ? args[0] : 'ms';
    check(fnDescriptor, isNotDelayEffect, "instead of writing `yield call(delay, " + arg0 + ")` where delay is an effect from `redux-saga/effects` you should write `yield delay(" + arg0 + ")`");
    validateFnDescriptor('call', fnDescriptor);
  }

  return makeEffect(CALL, getFnCallDescriptor(fnDescriptor, args));
}
function fork(fnDescriptor) {
  {
    validateFnDescriptor('fork', fnDescriptor);
  }

  for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    args[_key3 - 1] = arguments[_key3];
  }

  return makeEffect(FORK, getFnCallDescriptor(fnDescriptor, args));
}
function select(selector) {
  if (selector === void 0) {
    selector = identity;
  }

  for (var _len5 = arguments.length, args = new Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
    args[_key5 - 1] = arguments[_key5];
  }

  if ( arguments.length) {
    check(arguments[0], notUndef, 'select(selector, [...]): argument selector is undefined');
    check(selector, func, "select(selector, [...]): argument " + selector + " is not a function");
  }

  return makeEffect(SELECT, {
    selector: selector,
    args: args
  });
}
var delay =
/*#__PURE__*/
call.bind(null, delayP);

var done = function done(value) {
  return {
    done: true,
    value: value
  };
};

var qEnd = {};
function safeName(patternOrChannel) {
  if (channel(patternOrChannel)) {
    return 'channel';
  }

  if (stringableFunc(patternOrChannel)) {
    return String(patternOrChannel);
  }

  if (func(patternOrChannel)) {
    return patternOrChannel.name;
  }

  return String(patternOrChannel);
}
function fsmIterator(fsm, startState, name) {
  var stateUpdater,
      errorState,
      effect,
      nextState = startState;

  function next(arg, error) {
    if (nextState === qEnd) {
      return done(arg);
    }

    if (error && !errorState) {
      nextState = qEnd;
      throw error;
    } else {
      stateUpdater && stateUpdater(arg);
      var currentState = error ? fsm[errorState](error) : fsm[nextState]();
      nextState = currentState.nextState;
      effect = currentState.effect;
      stateUpdater = currentState.stateUpdater;
      errorState = currentState.errorState;
      return nextState === qEnd ? done(arg) : effect;
    }
  }

  return makeIterator(next, function (error) {
    return next(null, error);
  }, name);
}

function debounceHelper(delayLength, patternOrChannel, worker) {
  for (var _len = arguments.length, args = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
    args[_key - 3] = arguments[_key];
  }

  var action, raceOutput;
  var yTake = {
    done: false,
    value: take(patternOrChannel)
  };
  var yRace = {
    done: false,
    value: race({
      action: take(patternOrChannel),
      debounce: delay(delayLength)
    })
  };

  var yFork = function yFork(ac) {
    return {
      done: false,
      value: fork.apply(void 0, [worker].concat(args, [ac]))
    };
  };

  var yNoop = function yNoop(value) {
    return {
      done: false,
      value: value
    };
  };

  var setAction = function setAction(ac) {
    return action = ac;
  };

  var setRaceOutput = function setRaceOutput(ro) {
    return raceOutput = ro;
  };

  return fsmIterator({
    q1: function q1() {
      return {
        nextState: 'q2',
        effect: yTake,
        stateUpdater: setAction
      };
    },
    q2: function q2() {
      return {
        nextState: 'q3',
        effect: yRace,
        stateUpdater: setRaceOutput
      };
    },
    q3: function q3() {
      return raceOutput.debounce ? {
        nextState: 'q1',
        effect: yFork(action)
      } : {
        nextState: 'q2',
        effect: yNoop(raceOutput.action),
        stateUpdater: setAction
      };
    }
  }, 'q1', "debounce(" + safeName(patternOrChannel) + ", " + worker.name + ")");
}
function debounce(delayLength, pattern, worker) {
  for (var _len6 = arguments.length, args = new Array(_len6 > 3 ? _len6 - 3 : 0), _key6 = 3; _key6 < _len6; _key6++) {
    args[_key6 - 3] = arguments[_key6];
  }

  return fork.apply(void 0, [debounceHelper, delayLength, pattern, worker].concat(args));
}

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
 * @param {*} state Mutable draft state from immer
 * @param {*} payload Action payload
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
 * @param {*} state Mutable draft state from immer
 * @param {*} payload Action payload
 */

var readOneSuccess = function readOneSuccess(state, payload) {
  state.isLoading = false;
  state.data[payload.id] = _objectSpread2({}, state.data[payload.id] || {}, {}, payload);
};
/**
 * Handles creating a single item
 * @function
 * @param {*} state Mutable draft state from immer
 * @param {*} payload Action payload
 */

var createSuccess = function createSuccess(state, payload) {
  state.isLoading = false;
  state.data[payload.id] = payload;
};
/**
 * Handles updating a single item
 * @function
 * @param {*} state Mutable draft state from immer
 * @param {*} payload Action payload
 */

var updateSuccess = function updateSuccess(state, payload) {
  state.isLoading = false;
  state.data[payload.id] = _objectSpread2({}, state.data[payload.id] || {}, {}, payload);
};
/**
 * Handles deleting a single item
 * @function
 * @param {*} state Mutable draft state from immer
 * @param {*} payload Action payload
 */

var deleteSuccess = function deleteSuccess(state, payload) {
  state.isLoading = false;
  delete state.data[payload.id];
};
/**
 * Handles fail actions
 * @function
 * @param {*} state Mutable draft state from immer
 * @param {*} payload Action payload
 */

var failReducer = function failReducer(state, error) {
  state.isLoading = false;
  state.error = error;
};
/**
 * Handles setting loading state when fetching
 * @function
 * @param {*} state Mutable draft state from immer
 * @param {*} payload Action payload
 */

var loadingReducer = function loadingReducer(state) {
  state.isLoading = true;
};
/**
 * Handles unsetting loading state without manipulate other aspects of state
 * @function
 * @param {*} state Mutable draft state from immer
 * @param {*} payload Action payload
 */

var notLoadingReducer = function notLoadingReducer(state) {
  state.isLoading = false;
};
/**
 * Set current item for when working in different screens
 * and need to maintain that screen's context. Payload accepts
 * an Object to set as current; Number or String as id to set from data.
 * @function
 * @param {*} state Mutable draft state from immer
 * @param {*} payload Action payload
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
 * @param {*} state Mutable draft state from immer
 * @param {*} payload Action payload
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
 * @param {object} extend Extra state parameters
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
 * @param {object} extend Extra state parameters
 * @param {boolean} done Flag to create `done` actions / reducers
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
 * Cancellable request caller. Implements a cancel-able api to
 * be used by sagas so that they can work with `takeLatest` and
 * cancel the previous request before calling again.
 *
 * When the method is a `GET`, the argument `payload` becomes `options`
 * https://github.com/redux-saga/redux-saga/issues/651#issuecomment-262375964
 *
 * @param {object} instance Instance of Axios via `axios.create()`
 * @param {string} method Request Method
 * @param {string} path Request URL path
 * @param {*} payload Request payload. Optional if method is GET.
 * @param {object} options Axios options
 */

var makeRequest = function makeRequest(instance, method, path) {
  var source = axios.CancelToken.source();
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

  request[reduxSaga.CANCEL] = function () {
    return source.cancel('request was cancelled by sagas');
  };

  return request;
};
/**
 * @typedef AxiosWrapperInstance
 * @property {function} get perform get request
 * @property {function} post perform post request
 * @property {function} put perform put request
 * @property {function} delete perform delete request
 * @property {function} addAuthorization add bearer token auth header
 * @property {function} removeAuthorization remove bearer token auth header
 * @property {function} addHeader adds a header
 * @property {function} removeHeader remove a header
 */

/**
 * API creator builds an Axios API that uses a cancellable request caller.
 * Accepts default Axios options
 *
 * @param {object} options Axios options
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
  var instance = axios.create(options);

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
     * @param {string} path Request URL path
     * @param options Axios options
     */
    get: makeRequest.bind(makeRequest, instance, 'get'),

    /**
     * @function put
     * @param path Request URL path
     * @param payload Request payload
     * @param options Axios options
     */
    put: makeRequest.bind(makeRequest, instance, 'put'),

    /**
     * @function patch
     * @param path Request URL path
     * @param payload Request payload
     * @param options Axios options
     */
    patch: makeRequest.bind(makeRequest, instance, 'patch'),

    /**
     * @function post
     * @param path Request URL path
     * @param payload Request payload
     * @param options Axios options
     */
    post: makeRequest.bind(makeRequest, instance, 'post'),

    /**
     * @function delete
     * @param path Request URL path
     * @param payload Request payload
     * @param options Axios options
     */
    "delete": makeRequest.bind(makeRequest, instance, 'delete'),

    /**
     * Sets authorization header on axios instance
     * @function addAuthorization
     * @param {string} token Bearer auth token
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
     * @param {string} name header name
     * @param {string} value header value
     */
    addHeader: addHeader,

    /**
     * Removes a header value
     * @function removeHeader
     * @param {string} name header name
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
 * @param {object} instance Cancellable axios instances
 * @param {string} method Request method
 * @param {string} path URL Path
 * @param {any} payload Request payload
 * @param {function} success Success action
 * @param {function} fail Fail action
 * @param {function} done? Done action
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
 * Creates an object with generators that make API calls
 * using the passed `instance`.
 *
 * @param {object} instance Cancellable axios instance
 * @returns {object} API generators for saga calls
 */


var SagaApi = (function (instance) {
  return {
    /**
     * Wrapper for makeCall.bind(makeCall, instance, 'get'),
     * @generator
     * @param {string} path Request URL path
     * @param {function} successAction Redux action to dispatch on success
     * @param {function} failAction Redux action to dispatch on fail
     * @param {function} [doneAction=undefined] Redux action to dispatch when completed
     */
    get: makeCall.bind(makeCall, instance, 'get'),

    /**
     * Wrapper for makeCall.bind(makeCall, instance, 'post'),
     * @generator
     * @param {string} path Request URL path
     * @param {*} payload Request payload
     * @param {function} successAction Redux action to dispatch on success
     * @param {function} failAction Redux action to dispatch on fail
     * @param {function} [doneAction=undefined] Redux action to dispatch when completed
     */
    post: makeCall.bind(makeCall, instance, 'post'),

    /**
     * Wrapper for makeCall.bind(makeCall, instance, 'put'),
     * @generator
     * @param {string} path Request URL path
     * @param {*} payload Request payload
     * @param {function} successAction Redux action to dispatch on success
     * @param {function} failAction Redux action to dispatch on fail
     * @param {function} [doneAction=undefined] Redux action to dispatch when completed
     */
    put: makeCall.bind(makeCall, instance, 'put'),

    /**
     * Wrapper for makeCall.bind(makeCall, instance, 'patch'),
     * @generator
     * @param {string} path Request URL path
     * @param {*} payload Request payload
     * @param {function} successAction Redux action to dispatch on success
     * @param {function} failAction Redux action to dispatch on fail
     * @param {function} [doneAction=undefined] Redux action to dispatch when completed
     */
    patch: makeCall.bind(makeCall, instance, 'patch'),

    /**
     * Wrapper for makeCall.bind(makeCall, instance, 'delete'),
     * @generator
     * @param {string} path Request URL path
     * @param {*} payload Request payload
     * @param {function} successAction Redux action to dispatch on success
     * @param {function} failAction Redux action to dispatch on fail
     * @param {function} [doneAction=undefined] Redux action to dispatch when completed
     */
    "delete": makeCall.bind(makeCall, instance, 'delete')
  };
});

/**
 * Creates cancellable axios API and a saga API
 * @function
 * @param {object} options Axios configuration
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
  return sagaSlice.createModule({
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

exports.createApis = createApis;
exports.createSuccess = createSuccess;
exports.crudInitialState = crudInitialState;
exports.crudReducers = crudReducers;
exports.crudSaga = crudSaga;
exports.crudSlice = crudSlice;
exports.deleteSuccess = deleteSuccess;
exports.failReducer = failReducer;
exports.loadingReducer = loadingReducer;
exports.noop = noop;
exports.notLoadingReducer = notLoadingReducer;
exports.readAllSuccess = readAllSuccess;
exports.readOneSuccess = readOneSuccess;
exports.refetch = refetch;
exports.resetCurrent = resetCurrent;
exports.setCurrent = setCurrent;
exports.updateSuccess = updateSuccess;

Object.defineProperty(exports, '__esModule', { value: true });

})));
