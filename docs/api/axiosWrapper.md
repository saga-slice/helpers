## Members

<dl>
<dt><a href="#instance">instance</a></dt>
<dd><p>Axios instance</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#makeRequest">makeRequest(instance, method, path, payload, options)</a></dt>
<dd><p>Cancellable request caller. Implements a cancel-able api to
be used by sagas so that they can work with <code>takeLatest</code> and
cancel the previous request before calling again.</p>
<p>When the method is a <code>GET</code>, the argument <code>payload</code> becomes <code>options</code>
<a href="https://github.com/redux-saga/redux-saga/issues/651#issuecomment-262375964">https://github.com/redux-saga/redux-saga/issues/651#issuecomment-262375964</a></p>
</dd>
<dt><a href="#get">get(path, options)</a></dt>
<dd></dd>
<dt><a href="#put">put(path, payload, options)</a></dt>
<dd></dd>
<dt><a href="#post">post(path, payload, options)</a></dt>
<dd></dd>
<dt><a href="#delete">delete(path, payload, options)</a></dt>
<dd></dd>
<dt><a href="#addAuthorization">addAuthorization(token)</a></dt>
<dd><p>Sets authorization header on axios instance</p>
</dd>
<dt><a href="#removeAuthorization">removeAuthorization()</a></dt>
<dd><p>Removes authorization header on axios instance</p>
</dd>
<dt><a href="#addHeader">addHeader(name, value)</a></dt>
<dd><p>Adds a header value</p>
</dd>
<dt><a href="#removeAuthorization">removeAuthorization(name)</a></dt>
<dd><p>Removes a header value</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#ApiHelper">ApiHelper</a></dt>
<dd></dd>
</dl>

<a name="instance"></a>

## instance
Axios instance

**Kind**: global variable  
<a name="makeRequest"></a>

## makeRequest(instance, method, path, payload, options)
Cancellable request caller. Implements a cancel-able api to
be used by sagas so that they can work with `takeLatest` and
cancel the previous request before calling again.

When the method is a `GET`, the argument `payload` becomes `options`
https://github.com/redux-saga/redux-saga/issues/651#issuecomment-262375964

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| instance | <code>object</code> | Instance of Axios via `axios.create()` |
| method | <code>string</code> | Request Method |
| path | <code>string</code> | Request URL path |
| payload | <code>\*</code> | Request payload. Optional if method is GET. |
| options | <code>object</code> | Axios options |

<a name="get"></a>

## get(path, options)
**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | Request URL path |
| options |  | Axios options |

<a name="put"></a>

## put(path, payload, options)
**Kind**: global function  

| Param | Description |
| --- | --- |
| path | Request URL path |
| payload | Request payload |
| options | Axios options |

<a name="post"></a>

## post(path, payload, options)
**Kind**: global function  

| Param | Description |
| --- | --- |
| path | Request URL path |
| payload | Request payload |
| options | Axios options |

<a name="delete"></a>

## delete(path, payload, options)
**Kind**: global function  

| Param | Description |
| --- | --- |
| path | Request URL path |
| payload | Request payload |
| options | Axios options |

<a name="addAuthorization"></a>

## addAuthorization(token)
Sets authorization header on axios instance

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>string</code> | Bearer auth token |

<a name="removeAuthorization"></a>

## removeAuthorization()
Removes authorization header on axios instance

**Kind**: global function  
<a name="addHeader"></a>

## addHeader(name, value)
Adds a header value

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | header name |
| value | <code>string</code> | header value |

<a name="removeAuthorization"></a>

## removeAuthorization(name)
Removes a header value

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | header name |

<a name="ApiHelper"></a>

## ApiHelper
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| get | <code>function</code> | perform get request |
| post | <code>function</code> | perform post request |
| put | <code>function</code> | perform put request |
| delete | <code>function</code> | perform delete request |
| addAuthorization | <code>function</code> | add bearer token auth header |
| removeAuthorization | <code>function</code> | remove bearer token auth header |
| addHeader | <code>function</code> | adds a header |
| removeHeader | <code>function</code> | remove a header |

