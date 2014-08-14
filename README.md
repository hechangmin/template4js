#template4js#

The JavaScript template engine, support for running NodeJS and browser environment.

##installation##

npm install template4js

##usage##

```html
<ul>
<% for (var i = 0, l = list.length; i < l; i ++) { %>
    <li><%=list[i].index%>user: <%=list[i].user%> | site:<%=list[i].site%></li>
<% } %>
</ul>
```
-----------------
```js
var template = require('template4js'),
    http = require('http');

var data = {list : [{
        index : 1,
        user : 'baidu',
        site : '<a href="http://www.baidu.com" target="_blank">http://www.baidu.com</a>'
    },{
        index : 2,
        user : 'qq',
        site : 'http://www.qq.com'
    },{
        index : 3,
        user : 'ali',
        site : "http://www.taobao.com"
    }
]};

var server = http.createServer(function(req, res){
    var contentType = 'text/html;charset=utf-8';
    res.setHeader("Content-Type", contentType);
    res.end(template('./assets/demo.tpl', data));
}).listen(80);
```
-----------------
* <%=var%> : output variable
* <%-var%> : output escaping after the variables
* <% include('./static/template/header.tpl') %> : Nested template

>Please read demo.html or node_demo.js.

##License##

Released under the MIT license

_*[hechangmin@gmail.com](mailto://hechangmin@gmail.com)*_
