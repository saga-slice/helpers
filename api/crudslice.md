# crudSlice

## crudSlice\(options\) ⇒ `SagaSlice`

This helper implements all the CRUD helpers in this library and instantiates them into a saga slice. Almost identical to the example you saw in [`crudSaga`](crudsaga.md#extended-example), this brings all of these helpers into 1 master helper. The reason for splitting up the helpers and giving access to them is because sometimes you don't want an entire CRUD, or, sometimes you're not following REST standard and want to have more flexibility. That's OK, so we split it up. In the cases where you're following REST and want a quick CRUD saga workflow, you use `crudSlice`

**Returns**: `SagaSlice` - A saga slice module

| Param | Type | Description |
| :--- | :--- | :--- |
| options | `object` | Options to pass to saga helper |
| options.name | `string` | Required. Slice name |
| options.sagaApi | `object` | Required. Saga API instance |
| options.initialState | `object` | Extra initial state values |
| options.reducers | `object` | Extra reducers |
| options.sagas | `function` | Extra sagas |

**Example**

```javascript
const { crudSlice } from 'saga-slice-helpers';
const { sagaApi } from './myApiFile';


export default crudSlice({
    name: 'todos',
    sagaApi,
    initialState: { done: [], incomplete: [] },
    takers: {
        readAll: takeLatest
    },
    // OR
    takers: 'takeLatest' // Will apply takeLatest to all sagas
    reducers: {
        setByStatus: (state, todos) => {
            state.done = todos.filter(t => t.status === 'done');
            state.incomplete = todos.filter(t => t.status === 'incomplete');
        }
    },
    sagas: (A) => {
        [A.readAllDone]: {
            saga* ({ payload: { data } }) {
                if (data) {
                    yield put(A.setByStatus(Object.values(data)));
                }
            }
        }
    }
});
```

