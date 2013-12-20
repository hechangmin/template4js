
var App ={
    main : function(){
        App.initPage();
        App.initEvent();
    },

    initPage : function(){
        var list = App.getData(),
            dom = document.getElementById('content'),
            html,
            fn;

        // (1) 传入的是元素ID
        // html = jstpl('tpl',list);

        // (2) ID 和 数据 分开传
        fn = jstpl('tpl');
        html = fn(list);

        // (3) 传入的不是模板ID 而是模板内容
        //fn = jstpl('<ul><% for (var i = 0, l = list.length; i < l; i ++) { %><li><%=list[i].index%>. 用户: <%=list[i].user%>； 网站：<%=list[i].site%></li><% } %></ul>');
        //html = fn(list);

        dom.innerHTML = html;
    },

    initEvent : function(){

    },

    getData : function(){
        data = {list : [{
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
        }]};
        return data;
    }
}