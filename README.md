# Get Started

`components/pies/saga-slice.js`

```javascript
import { crudSlice } from 'saga-slice-helpers';

const sagaSlice = crudSlice({
    name: 'pies'
});

export const { actions } = sagaSlice;
export default sagaSlice;
```

`components/pies/Form.jsx`

```jsx
import { actions } from './saga-slice';

export default connect(
    null,
    actions
)((props) => {
    
    const onSubmit = (values) => props.create(values)
    
    return (
        <Form onSubmit={ onSubmit }>
            ...
        </Form>
    );
})
```



