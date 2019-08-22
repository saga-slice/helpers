## Functions

<dl>
<dt><a href="#refetch">refetch(A, name, delay)</a> ⇒ <code>object</code></dt>
<dd><p>Fetchings whatever is in <code>state.current</code> again in order to
refresh a resource after an association or other out of context action.
This function is debounced by 100ms default to prevent api spam.</p>
</dd>
<dt><a href="#crudSaga">crudSaga(singular, plural)</a> ⇒ <code>function</code></dt>
<dd><p>Creates crud saga boilerplate clojure for sagas slice</p>
</dd>
</dl>

<a name="refetch"></a>

## refetch(A, name, delay) ⇒ <code>object</code>
Fetchings whatever is in `state.current` again in order to
refresh a resource after an association or other out of context action.
This function is debounced by 100ms default to prevent api spam.

**Kind**: global function  
**Returns**: <code>object</code> - An object to add to a saga slice  

| Param | Type | Description |
| --- | --- | --- |
| A | <code>object</code> | Actions object |
| name | <code>string</code> | Name of state scope to grab current |
| delay | <code>number</code> | Debounce time |

**Example**  
```js
createModule({
    // ...
    sagas: A => {
         [A.associationDone]: refetch(A, 'todos'),
         [A.disassociationDone]: refetch(A, 'todos')
    }
    // ...
})
```
<a name="crudSaga"></a>

## crudSaga(singular, plural) ⇒ <code>function</code>
Creates crud saga boilerplate clojure for sagas slice

**Kind**: global function  
**Returns**: <code>function</code> - Function that accepts redux actions object  

| Param | Type | Description |
| --- | --- | --- |
| singular | <code>string</code> | Singular resource name |
| plural | <code>string</code> | Plural resource name |

**Example**  
```js
const sagas = crudSaga('todo', 'todos', (A) => ({
     [A.assignToUser]: {
         * saga({ payload }) {
             // do stuff
         }
     }
}));

export default createModule({
    ...,
    sagas,
    ...
})
```
