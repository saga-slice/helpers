# Saga Slice Helpers

Abstracts on top of [`saga-slice`](https://github.com/damusix/saga-slice). Providers a series of helpers for building CRUD resources using Redux and Sagas.

## Getting Started

### Install dependencies
`npm i --save redux redux-saga immer saga-slice`

See [saga-slice quick setup](https://github.com/damusix/saga-slice#quick-setup) for how to setup your saga slice modules.

### Setting up your API

In order for Axios to work with redux saga takers, we need to implement a cancellable API. We also need a wrapper for that API to work with redux sagas so that sagas can cancel a request if it is implemented with a specific taker. To the set that up, do the following:


`./apis.js`
```js
import { createApis } from 'saga-slice-helpers';

// Pass in an Axios configuration
const appOne = createApis({

    // Defaults to `window.location.hostname`
    baseURL: 'http://localhost:4000',
    headers: {
        common: {
            MyCustomHeader: 'something'
        }
    }
});

//
const appTwo = createApis({

    // Defaults to `window.location.hostname`
    baseURL: 'http://localhost:5000',
    headers: {
        common: {
            MyCustomHeader: 'somethingelse'
        }
    }
});

export default { appOne, appTwo };
```


`createApis` returns 2 objects which can be used throughout your app:

```js
const {
    api,
    sagaApi
} = createApis({ /* ... */ })
```

> See [axiosWrapper docs](./docs/api/axiosWrapper.md).


### Creating a CRUD module:

This library brings the `crudSlice` function which generates a series of actions, reducers, and sagas that use `sagaApi` to preform CRUD operations.

`./myModule.js`:

```js
import { crudSlice } from 'saga-slice-helpers';
import { appOne } from '../previousExample/apis';

export default crudSlice({
    name: 'todos',
    singular: 'todo',
    plural: 'todos',
    sagaApi: appOne.sagaApi
})
```