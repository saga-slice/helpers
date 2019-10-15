## Members

<dl>
<dt><a href="#get">get</a></dt>
<dd><p>Wrapper for makeCall.bind(makeCall, instance, &#39;get&#39;),</p>
</dd>
<dt><a href="#post">post</a></dt>
<dd><p>Wrapper for makeCall.bind(makeCall, instance, &#39;post&#39;),</p>
</dd>
<dt><a href="#put">put</a></dt>
<dd><p>Wrapper for makeCall.bind(makeCall, instance, &#39;put&#39;),</p>
</dd>
<dt><a href="#patch">patch</a></dt>
<dd><p>Wrapper for makeCall.bind(makeCall, instance, &#39;patch&#39;),</p>
</dd>
<dt><a href="#delete">delete</a></dt>
<dd><p>Wrapper for makeCall.bind(makeCall, instance, &#39;delete&#39;),</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#makeCall">makeCall(instance, method, path, payload, success, fail, done)</a></dt>
<dd><p>Generator function that wraps an API call within a try catch.</p>
</dd>
</dl>

<a name="get"></a>

## get
Wrapper for makeCall.bind(makeCall, instance, 'get'),

**Kind**: global variable  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | Request URL path |
| successAction | <code>function</code> | Redux action to dispatch on success |
| failAction | <code>function</code> | Redux action to dispatch on fail |
| [doneAction] | <code>function</code> | Redux action to dispatch when completed |

<a name="post"></a>

## post
Wrapper for makeCall.bind(makeCall, instance, 'post'),

**Kind**: global variable  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | Request URL path |
| payload | <code>\*</code> | Request payload |
| successAction | <code>function</code> | Redux action to dispatch on success |
| failAction | <code>function</code> | Redux action to dispatch on fail |
| [doneAction] | <code>function</code> | Redux action to dispatch when completed |

<a name="put"></a>

## put
Wrapper for makeCall.bind(makeCall, instance, 'put'),

**Kind**: global variable  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | Request URL path |
| payload | <code>\*</code> | Request payload |
| successAction | <code>function</code> | Redux action to dispatch on success |
| failAction | <code>function</code> | Redux action to dispatch on fail |
| [doneAction] | <code>function</code> | Redux action to dispatch when completed |

<a name="patch"></a>

## patch
Wrapper for makeCall.bind(makeCall, instance, 'patch'),

**Kind**: global variable  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | Request URL path |
| payload | <code>\*</code> | Request payload |
| successAction | <code>function</code> | Redux action to dispatch on success |
| failAction | <code>function</code> | Redux action to dispatch on fail |
| [doneAction] | <code>function</code> | Redux action to dispatch when completed |

<a name="delete"></a>

## delete
Wrapper for makeCall.bind(makeCall, instance, 'delete'),

**Kind**: global variable  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | Request URL path |
| payload | <code>\*</code> | Request payload |
| successAction | <code>function</code> | Redux action to dispatch on success |
| failAction | <code>function</code> | Redux action to dispatch on fail |
| [doneAction] | <code>function</code> | Redux action to dispatch when completed |

<a name="makeCall"></a>

## makeCall(instance, method, path, payload, success, fail, done)
Generator function that wraps an API call within a try catch.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| instance | <code>object</code> | Cancellable axios instances |
| method | <code>string</code> | Request method |
| path | <code>string</code> | URL Path |
| payload | <code>any</code> | Request payload |
| success | <code>function</code> | Success action |
| fail | <code>function</code> | Fail action |
| done | <code>function</code> | Done action |

