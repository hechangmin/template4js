
var App ={
    main : function(){
        App.initPage();
        App.initEvent();
    },

    initPage : function(){
        var data = App.getData(),
            html,
            fn;

        // (1) 传入的是dom ID
        
        html = template('tpl',data);    
        

        // (2) 传入的是模板字符串
        var tpl = '\
            <ul>\
            <% for (var i = 0, l = list.length; i < l; i ++) { %>\
                <li><%=list[i].index%> user : <%=list[i].user%> | site：<%=list[i].site%></li>\
            <% } %>\
            </ul>';

        //html = template(tpl,data);    

        document.getElementById('content').innerHTML = html;
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