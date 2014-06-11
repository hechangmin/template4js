<!doctype html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
</head>
<body>
    <div id='content'>
        <ul>
        <% for (var i = 0, l = list.length; i < l; i ++) { %>
            <li><%=list[i].index%>. 用户: <%=list[i].user%>； 网站：<%=list[i].site%></li>
        <% } %>
        </ul>
    </div>
</body>
</html>