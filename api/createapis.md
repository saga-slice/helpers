# createApis

## `createApis(axiosOptions)`

* Build an Axios API that implements a cancellable request caller that can be cancelled by redux sagas. 
* Accepts default Axios options.
* Returns an object with `{ api, sagaApi }` where `api` is the cancellable axios API, and `sagaAPi` is an abstraction that uses `api` to simplify make API calls using redux sagas \([see below](createapis.md#sagaapi)\).

Sample usage:

```javascript
const { api, sagaApi } = createApis({
    baseUrl: 'http://myserver.com',
    timeout: 1000
});

const req = api.get('/todos');

req.then(console.log);

if (true) {
    // Manually cancel this request
    req.cancel()
}
```

## `api`

The base api object allows you to make regular API calls from anywhere in your app. This is basic axios stuff, with an added `cancel` function with every request.

### `api.get(path, options)` <a id="getpath-options"></a>

| Param | Type | Description |
| :--- | :--- | :--- |
| path | `string` | Request URL path |
| options |  | Axios options |

### `api.put(path, payload, options)` <a id="putpath-payload-options"></a>

| Param | Description |
| :--- | :--- |
| path | Request URL path |
| payload | Request payload |
| options | Axios options |

### `api.patch(path, payload, options)` <a id="patchpath-payload-options"></a>

| Param | Description |
| :--- | :--- |
| path | Request URL path |
| payload | Request payload |
| options | Axios options |

### `api.post(path, payload, options)` <a id="postpath-payload-options"></a>

| Param | Description |
| :--- | :--- |
| path | Request URL path |
| payload | Request payload |
| options | Axios options |

### `api.delete(path, payload, options)` <a id="deletepath-payload-options"></a>

| Param | Description |
| :--- | :--- |
| path | Request URL path |
| payload | Request payload |
| options | Axios options |

### `api.addAuthorization(token)` <a id="addauthorizationtoken"></a>

Sets authorization header on axios instance

| Param | Type | Description |
| :--- | :--- | :--- |
| token | `string` | Bearer auth token |

### `api.removeAuthorization()` <a id="removeauthorization"></a>

Removes authorization header on axios instance

### `api.addHeader(name, value)` <a id="addheadername-value"></a>

Adds a header value

**Kind**: global function

| Param | Type | Description |
| :--- | :--- | :--- |
| name | `string` | header name |
| value | `string` | header value |

### `api.removeHeader(name)` <a id="removeauthorizationname"></a>

Removes a header value

| Param | Type | Description |
| :--- | :--- | :--- |
| name | `string` | header name |

## `sagaApi`

Saga API is a helper to reduce the amount of code one writes when make an ajax call. Here is your typical ajax call:

```javascript
try {
    const { data } = await axios.get('/todos');
    return data;
}
cathch(e) {
    console.log(e);
}
```

If we were to do this inside of sagas it would look like this:

```javascript
function* () {
    try {
        const { data } = yield axios.get('/todos');
        yield put(fetchSuccess(data));
    }
    cathch(e) {
        yield put(fetchFailed(e));
    }
    
    yield put(fetchDone());
}
```

As you can tell, this can get repetitive, hence why this abstraction was built. Simply put, you pass it a path, payload, success action, fail action, and optional done action. It will handle try catching for you:

```javascript
yield sagaApi.put('/todos/1', { done: true }, updateSuccess, updateFail, udpateDone?);
```

{% hint style="info" %}
One thing to note, if you decide to add a saga for done action, you will receive a payload of `{ data, error }` so you can decide if you want to do anything with the data.
{% endhint %}

### `sagaApi.get(path, successAction, failAction, [doneAction?])` <a id="get"></a>

| Param | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| path | `string` | yes | Request URL path |
| successAction | `function` | yes | Redux action to dispatch on success |
| failAction | `function` | yes | Redux action to dispatch on fail |
| \[doneAction\] | `function` | no | Redux action to dispatch when completed |

### `sagaApi.post(path, payload, successAction, failAction, [doneAction?])` <a id="post"></a>

| Param | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| path | `string` | yes | Request URL path |
| payload | `*` | yes | Request payload |
| successAction | `function` | yes | Redux action to dispatch on success |
| failAction | `function` | yes | Redux action to dispatch on fail |
| \[doneAction\] | `function` | no | Redux action to dispatch when completed |

### `sagaApi.put(path, payload, successAction, failAction, [doneAction?])` <a id="put"></a>

| Param | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| path | `string` | yes | Request URL path |
| payload | `*` | yes | Request payload |
| successAction | `function` | yes | Redux action to dispatch on success |
| failAction | `function` | yes | Redux action to dispatch on fail |
| \[doneAction\] | `function` | no | Redux action to dispatch when completed |

### `sagaApi.patch(path, payload, successAction, failAction, [doneAction?])` <a id="patch"></a>

| Param | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| path | `string` | yes | Request URL path |
| payload | `*` | yes | Request payload |
| successAction | `function` | yes | Redux action to dispatch on success |
| failAction | `function` | yes | Redux action to dispatch on fail |
| \[doneAction\] | `function` | no | Redux action to dispatch when completed |

### `sagaApi.delete(path, payload, successAction, failAction, [doneAction?])` <a id="delete"></a>

| Param | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| path | `string` | yes | Request URL path |
| payload | `*` | yes | Request payload |
| successAction | `function` | yes | Redux action to dispatch on success |
| failAction | `function` | yes | Redux action to dispatch on fail |
| \[doneAction\] | `function` | no | Redux action to dispatch when completed |

###  <a id="delete"></a>

