<a name="crudSlice"></a>

## crudSlice(options) ⇒ <code>SagaSlice</code>
Creates a saga slice with opinionated CRUD functionality

**Kind**: global function  
**Returns**: <code>SagaSlice</code> - A saga slice module  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | Options to pass to saga helper |
| options.name | <code>string</code> | Required. Slice name |
| options.singular | <code>string</code> | Required. Singular resource name |
| options.plural | <code>string</code> | Required. Plural resource name |
| options.sagaApi | <code>object</code> | Required. Saga API instance |
| options.initialState | <code>object</code> | Extra initial state values |
| options.reducers | <code>object</code> | Extra reducers |
| options.sagas | <code>function</code> | Extra sagas |

**Example**  
```js
export default crudSlice({
     name: 'todos',
     singular: 'todo',
     plural: 'todos',
     sagaApi: createApis({ baseURL: '/api' }).sagaApi,
     initialState: { done: [], incomplete: [] },
     reducers: {
         setByStatus: (state, todos) => {
             state.done = todos.filter(t => t.status === 'done');
             state.incomplete = todos.filter(t => t.status === 'incomplete');
         }
     },
     sagas: (A) => {
         readAllDone: {
             saga* ({ payload: { data } }) {
                 if (data) {
                     yield put(A.setByStatus(Object.values(data)));
                 }
             }
         }
     }
})
```
