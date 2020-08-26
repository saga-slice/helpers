# Reducer Helpers

The following helpers are available for use with your saga slices. When used in combination with the other helpers, it makes development of new sagas much quicker.

### `readAllSuccess(state, payload)`

* Sets the `isFetching` state to `false`.
* Maps the response payload into an object formatted like `{ [item.id]: item }`

```javascript
state.data = Object.values(payload || {})
    .reduce((a, c) => ({
        ...a,
        [c.id]: c
    }), {});
```

### `readOneSuccess(state, payload)`

* Sets the `isFetching` state to `false`.
* Maps response to data by id

```javascript
state.data[payload.id] = {
    ...(state.data[payload.id] || {}),
    ...payload
};
```

### `createSuccess(state, payload)`

* Sets the `isFetching` state to `false`
* Maps response to data by id

```javascript
state.data[payload.id] = payload;
```

### `updateSuccess(state, payload)`

* Sets the `isFetching` state to `false`.
* Maps response to data by id

```javascript
state.data[payload.id] = {
    ...(state.data[payload.id] || {}),
    ...payload
};
```

### `deleteSuccess(state, payload)`

* Sets the `isFetching` state to `false`.
* Deletes item from `data`

```javascript
delete state.data[payload.id];
```

### `failReducer(state, payload)`

* Sets the `isFetching` state to `false`.

```javascript
state.isFetching = false;
state.error = payload;
```

### `loadingReducer(state, payload)`

* Sets the `isFetching` state to `true`.

### `notLoadingReducer(state, payload)`

* Sets the `isFetching` state to false.

### `setCurrent(state, payload)`

* If passed a number or string, sets `state.current` to an item in `state.data`
* If passed an object, sets `state.current` to `payload`

```javascript
if (payload.constructor === Object) {
    state.current = payload;
}

if (payload.constructor === Number || payload.constructor === String) {
    state.current = state.data[payload];
}
```

### `resetCurrent(state, payload)`

* Sets `state.current` to `null`

### `crudInitialState(extendState)`

Returns a state object structured to work with other helper functions. You can extend or overwrite the current state elements by passing an extended state. This function returns:

```javascript
const initialState = {

    isFetching: false,
    current: null,
    data: {},
    error: null,
    ...(extendState || {})
}
```

### `crudReducers(extend, doneReducers) => CrudReducerInstance`

* Generates a map of reducers for CRUD use
* Can be extended or overwritten by passing `extend` option
* Done reducers are created if `doneRecuders` is set to true

```javascript
const actions = crudReducers({
    // ... more reducers
}, true) // <-- creates `done` actions

const {
    setCurrent,
    resetCurrent,
    readAll, // loadingReducer
    readOne, // loadingReducer
    create, // loadingReducer
    update, // loadingReducer
    patch, // loadingReducer
    delete, // loadingReducer
    readAllSuccess,
    readOneSuccess,
    createSuccess,
    updateSuccess,
    patchSuccess
    deleteSuccess,
    readAllFail, // failReducer
    readOneFail, // failReducer
    createFail, // failReducer
    updateFail, // failReducer
    patchFail, // failReducer
    deleteFail, // failReducer
    readAllDone, // only if doneReducers is true, noop
    readOneDone, // only if doneReducers is true, noop
    createDone, // only if doneReducers is true, noop
    updateDone, // only if doneReducers is true, noop
    deleteDone, // only if doneReducers is true, noop
} = actions;
```

### `lifecycleReducers(name, reducers)`

* Creates a map of reducers specific to an ajax request lifecycle similar to what you see in `crudReducers`, but only for 1 method call.
* `reducers` is an optional parameter. If the reducers are not specified, it will be provided a default. The reducers are overwritten using `main` for the main action, `success` for success action, `fail` for fail action, and `done` can be a boolean or a function.

| Param | Type | Required | Description | Default |
| :--- | :--- | :--- | :--- | :--- |
| name | `string` | yes | name of action | n/a |
| reducers | `object` | no | object of reducers | empty object |
| reducers.main | `function` | no | main reducer created from name argument as `name` | `loadingReducer` |
| reducers.success | `function` | no | success reducer created from name argument as `nameSuccess` | `notLoadingReducer` |
| reducers.fail | `function` | no | fail reducer created from name argument as `nameFail` | `failReducer` |
| reducers.done | `function` \| `boolean` | no | optional done reducer is boolean or reducer function create as `nameDone` | `false` or `noop` |

Example:

```javascript
const {
    getTodo,
    getTodoSuccess,
    getTodoFail,
    getTodoDone
} = lifecycleReducers('getTodo', {
    success: (state, payload) => state.data = payload,
    done: true
})
```

### `noop()`

* Does nothing. Used for declaring reducers.

