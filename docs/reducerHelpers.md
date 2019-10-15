## Functions

<dl>
<dt><a href="#readAllSuccess">readAllSuccess(state, payload)</a></dt>
<dd><p>Handles mapping a successful fetch into IDs</p>
</dd>
<dt><a href="#readOneSuccess">readOneSuccess(state, payload)</a></dt>
<dd><p>Handles fetching a single item</p>
</dd>
<dt><a href="#createSuccess">createSuccess(state, payload)</a></dt>
<dd><p>Handles creating a single item</p>
</dd>
<dt><a href="#updateSuccess">updateSuccess(state, payload)</a></dt>
<dd><p>Handles updating a single item</p>
</dd>
<dt><a href="#deleteSuccess">deleteSuccess(state, payload)</a></dt>
<dd><p>Handles deleting a single item</p>
</dd>
<dt><a href="#failReducer">failReducer(state, payload)</a></dt>
<dd><p>Handles fail actions</p>
</dd>
<dt><a href="#loadingReducer">loadingReducer(state, payload)</a></dt>
<dd><p>Handles setting loading state when fetching</p>
</dd>
<dt><a href="#notLoadingReducer">notLoadingReducer(state, payload)</a></dt>
<dd><p>Handles unsetting loading state without manipulate other aspects of state</p>
</dd>
<dt><a href="#setCurrent">setCurrent(state, payload)</a></dt>
<dd><p>Set current item for when working in different screens
and need to maintain that screen&#39;s context. Payload accepts
an Object to set as current; Number or String as id to set from data.</p>
</dd>
<dt><a href="#resetCurrent">resetCurrent(state, payload)</a></dt>
<dd><p>Set current item to null</p>
</dd>
<dt><a href="#noop">noop()</a></dt>
<dd><p>Placeholder do-nothing function</p>
</dd>
<dt><a href="#crudInitialState">crudInitialState(extend)</a> ⇒ <code>object</code></dt>
<dd><p>Creates an opinionated initial state for handling common CRUD operates</p>
</dd>
<dt><a href="#crudReducers">crudReducers(extend, done)</a> ⇒ <code>object</code></dt>
<dd><p>Creates an opinionated reducer object for handling common CRUD operates</p>
</dd>
<dt><a href="#lifecycleReducers">lifecycleReducers(name, reducers)</a> ⇒ <code>object</code></dt>
<dd><p>Creates saga actions for async functions. This includes the
<code>success</code>, <code>fail,</code> and optional <code>done</code> actions to use in
the function&#39;s lifecycle.</p>
<p>Accepts custom reducers via the <code>reducers</code> object where you
pass <code>{ main, success, fail, done }</code>. All are optional, <code>done</code>
will only be created if passed <code>true</code> or a reducer function.
Reducer options fallback to the following reducer helpers:</p>
<ul>
<li>main: <code>loadingReducer</code></li>
<li>success: <code>silentSuccessReducer</code></li>
<li>fail: <code>failReduver</code></li>
<li>done: <code>noop</code></li>
</ul>
</dd>
</dl>

<a name="readAllSuccess"></a>

## readAllSuccess(state, payload)
Handles mapping a successful fetch into IDs

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| state | <code>\*</code> | Mutable draft state from immer |
| payload | <code>\*</code> | Action payload |

<a name="readOneSuccess"></a>

## readOneSuccess(state, payload)
Handles fetching a single item

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| state | <code>\*</code> | Mutable draft state from immer |
| payload | <code>\*</code> | Action payload |

<a name="createSuccess"></a>

## createSuccess(state, payload)
Handles creating a single item

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| state | <code>\*</code> | Mutable draft state from immer |
| payload | <code>\*</code> | Action payload |

<a name="updateSuccess"></a>

## updateSuccess(state, payload)
Handles updating a single item

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| state | <code>\*</code> | Mutable draft state from immer |
| payload | <code>\*</code> | Action payload |

<a name="deleteSuccess"></a>

## deleteSuccess(state, payload)
Handles deleting a single item

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| state | <code>\*</code> | Mutable draft state from immer |
| payload | <code>\*</code> | Action payload |

<a name="failReducer"></a>

## failReducer(state, payload)
Handles fail actions

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| state | <code>\*</code> | Mutable draft state from immer |
| payload | <code>\*</code> | Action payload |

<a name="loadingReducer"></a>

## loadingReducer(state, payload)
Handles setting loading state when fetching

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| state | <code>\*</code> | Mutable draft state from immer |
| payload | <code>\*</code> | Action payload |

<a name="notLoadingReducer"></a>

## notLoadingReducer(state, payload)
Handles unsetting loading state without manipulate other aspects of state

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| state | <code>\*</code> | Mutable draft state from immer |
| payload | <code>\*</code> | Action payload |

<a name="setCurrent"></a>

## setCurrent(state, payload)
Set current item for when working in different screens
and need to maintain that screen's context. Payload accepts
an Object to set as current; Number or String as id to set from data.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| state | <code>\*</code> | Mutable draft state from immer |
| payload | <code>\*</code> | Action payload |

<a name="resetCurrent"></a>

## resetCurrent(state, payload)
Set current item to null

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| state | <code>\*</code> | Mutable draft state from immer |
| payload | <code>\*</code> | Action payload |

<a name="noop"></a>

## noop()
Placeholder do-nothing function

**Kind**: global function  
<a name="crudInitialState"></a>

## crudInitialState(extend) ⇒ <code>object</code>
Creates an opinionated initial state for handling common CRUD operates

**Kind**: global function  
**Returns**: <code>object</code> - Initial state object  

| Param | Type | Description |
| --- | --- | --- |
| extend | <code>object</code> | Extra state parameters |

**Example**  
```js
const slice = createModule({
    // ...
    initial: crudInitialState({
        extendedState: true
    })
    // ...
});
```
<a name="crudReducers"></a>

## crudReducers(extend, done) ⇒ <code>object</code>
Creates an opinionated reducer object for handling common CRUD operates

**Kind**: global function  
**Returns**: <code>object</code> - Reducer object for saga slice  

| Param | Type | Description |
| --- | --- | --- |
| extend | <code>object</code> | Extra state parameters |
| done | <code>boolean</code> | Flag to create `done` actions / reducers |

**Example**  
```js
const slice = createModule({
    // ...
    reducers: crudReducers({
        // ... more reducers
    }, true) // <-- creates `done` actions
    // ...
});

const { actions } = slice;
const {
    setCurrent,
    resetCurrent,
    readAll,
    readOne,
    create,
    update,
    patch,
    delete,
    readAllSuccess,
    readOneSuccess,
    createSuccess,
    updateSuccess,
    patchSuccess
    deleteSuccess,
    readAllFail,
    readOneFail,
    createFail,
    updateFail,
    patchFail,
    deleteFail,
    readAllDone,
    readOneDone,
    createDone,
    updateDone,
    deleteDone
} = actions;
```
<a name="lifecycleReducers"></a>

## lifecycleReducers(name, reducers) ⇒ <code>object</code>
Creates saga actions for async functions. This includes the
`success`, `fail,` and optional `done` actions to use in
the function's lifecycle.

Accepts custom reducers via the `reducers` object where you
pass `{ main, success, fail, done }`. All are optional, `done`
will only be created if passed `true` or a reducer function.
Reducer options fallback to the following reducer helpers:
- main: `loadingReducer`
- success: `silentSuccessReducer`
- fail: `failReduver`
- done: `noop`

**Kind**: global function  
**Returns**: <code>object</code> - object of reducer functions  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | name of action |
| reducers | <code>object</code> | object of reducers |
| reducers.main | <code>function</code> | main reducer created from name argument as `name` |
| reducers.success | <code>function</code> | success reducer created from name argument as `nameSuccess` |
| reducers.fail | <code>function</code> | fail reducer created from name argument as `nameFail` |
| reducers.done | <code>function</code> \| <code>boolean</code> | optional done reducer is boolean or reducer function create as `nameDone` |

**Example**  
```js
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
