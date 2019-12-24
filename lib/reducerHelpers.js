/**
 * Handles mapping a successful fetch into IDs
 * @function
 * @arg {*} state Mutable draft state from immer
 * @arg {*} payload Action payload
 */
export const readAllSuccess = (state, payload) => {

    state.isLoading = false;
    state.data = Object.values(payload || {})
        .reduce((a, c) => ({
            ...a,
            [c.id]: c
        }), {});
};

/**
 * Handles fetching a single item
 * @function
 * @arg {*} state Mutable draft state from immer
 * @arg {*} payload Action payload
 */
export const readOneSuccess = (state, payload) => {

    state.isLoading = false;
    state.data[payload.id] = {
        ...(state.data[payload.id] || {}),
        ...payload
    };
};

/**
 * Handles creating a single item
 * @function
 * @arg {*} state Mutable draft state from immer
 * @arg {*} payload Action payload
 */
export const createSuccess = (state, payload) => {

    state.isLoading = false;
    state.data[payload.id] = payload;
};

/**
 * Handles updating a single item
 * @function
 * @arg {*} state Mutable draft state from immer
 * @arg {*} payload Action payload
 */
export const updateSuccess = (state, payload) => {

    state.isLoading = false;
    state.data[payload.id] = {
        ...(state.data[payload.id] || {}),
        ...payload
    };
};

/**
 * Handles deleting a single item
 * @function
 * @arg {*} state Mutable draft state from immer
 * @arg {*} payload Action payload
 */
export const deleteSuccess = (state, payload) => {

    state.isLoading = false;
    delete state.data[payload.id];
};


/**
 * Handles fail actions
 * @function
 * @arg {*} state Mutable draft state from immer
 * @arg {*} payload Action payload
 */
export const failReducer = (state, error) => {

    state.isLoading = false;
    state.error = error;
};

/**
 * Handles setting loading state when fetching
 * @function
 * @arg {*} state Mutable draft state from immer
 * @arg {*} payload Action payload
 */
export const loadingReducer = state => {

    state.isLoading = true;
};

/**
 * Handles unsetting loading state without manipulate other aspects of state
 * @function
 * @arg {*} state Mutable draft state from immer
 * @arg {*} payload Action payload
 */
export const notLoadingReducer = state => {

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
export const setCurrent = (state, payload) => {

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
export const resetCurrent = state => {

    state.current = null;
};

/**
 * Placeholder do-nothing function
 * @function
 */
export const noop = () => {};

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
export const crudInitialState = extend => ({

    isLoading: false,
    current: null,
    data: {},
    error: null,
    ...(extend || {})
});

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
export const crudReducers = (extend = {}, done) => ({

    readAllSuccess,
    readOneSuccess,
    createSuccess,
    updateSuccess,
    patchSuccess: updateSuccess,
    deleteSuccess,
    setCurrent,
    resetCurrent,

    readAll: loadingReducer,
    readOne: loadingReducer,
    create: loadingReducer,
    update: loadingReducer,
    patch: loadingReducer,
    delete: loadingReducer,

    readAllFail: failReducer,
    readOneFail: failReducer,
    createFail: failReducer,
    updateFail: failReducer,
    patchFail: failReducer,
    deleteFail: failReducer,

    ...(done ? {
        readAllDone: noop,
        readOneDone: noop,
        createDone: noop,
        updateDone: noop,
        patchDone: noop,
        deleteDone: noop
    } : {}),

    ...extend
});
