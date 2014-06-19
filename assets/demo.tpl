<!doctype html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
</head>
<body>
    <div id='content'>
        <ul>
        <% for (var i = 0, l = list.length; i < l; i ++) { %>
            <li><%=list[i].index%>user: <%=list[i].user%> | site:<%-list[i].site%></li>
        <% } %>
        </ul>
    </div>
</body>
</html>