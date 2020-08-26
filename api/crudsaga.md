# crudSaga

## crudSaga\(options, extend\) ⇒ `function`

This helper implements an entire REST sagas flow based on minimal configuration. As long as your endpoint follows standard REST, this helper can establish a basic starting point for CRUD functionality. It is extensible, and its defaults can be overwritten. The only requirements are a name and a `sagaApi`.

**Returns**: `function` - Function that accepts redux actions object

| Param | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| options | `object` | Yes | Options to pass to saga helper |
| options.name | `string` | Yes | REST resource name |
| options.sagaApi | `string` | Yes | A `sagaApi` instance |
| extend | `function` | No | A function to pass actions and add extra sagas |

#### Simple Example:

```javascript
const { createModule } from 'saga-slice';
const { crudInitialState, crudReducers } from 'saga-slice-helpers';
const { sagaApi } from './myApiFile';

const name = 'todos'; // should be rest api endpoint name
const initialState = crudInitialState();
const reducers = crudReducers();
const sagas = crudSaga({ name, sagaApi });

const { actions } = createModule({ name, initialState, reducers, sagas });
```

#### Extended Example:

```javascript
const { takeLatest } from 'redux-sagas/effects';
const { createModule } from 'saga-slice';
const { crudInitialState, crudReducers, lifecycleReducers } from 'saga-slice-helpers';
const { sagaApi } from './myApiFile';
const { history } from './utils';

const name = 'todos'; // should be rest api endpoint name
const initialState = crudInitialState();
const reducers = crudReducers({
    ...lifecycleReducers('associateUser')
});
const sagas = crudSaga({ 
    name, 
    sagaApi
}, (A) => ({
    [A.deleteDone]: function* () {
        yield history.push('/todos');
    },
    [A.associateUser]: function* ({ payload }) {
        const { userId, todoId } = payload;
        yield sagaApi.put(
            `/todos/${todoId}/user/${userId}`,
            A.associateUserSuccess,
            A.associateUserFail
        )
    }
}));

const { actions } = createModule({ name, initialState, reducers, sagas });
```

### REST implementation

crudSaga will implement the following based on `name: 'todos'`:

| Action Type | Method | Path | Success | Fail | Done |
| :--- | :--- | :--- | :--- | :--- | :--- |
| readAll | GET | `/todos` | readAllSuccess | readAllFail | readAllDone |
| readOne | GET | `/todos/{id}` | readOneSuccess | readOneFail | readOneDone |
| create | POST | `/todos` | createSuccess | createFail | createDone |
| update | PUT | `/todos/{id}` | updateSuccess | updateFail | updateDone |
| patch | PATCH | `/todos/{id}` | patchSuccess | patchFail | patchDone |
| delete | DELETE | `/todos/{id}` | deleteSuccess | deleteFail | deleteDone |

