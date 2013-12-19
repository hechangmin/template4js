
var App ={
    main : function(){
        App.initPage();
        App.initEvent();
    },

    initPage : function(){
        var list = App.getData();
        var html = jstpl('tpl',list);
        var dom = document.getElementById('content');
        dom.innerHTML = html;
    },

    initEvent : function(){

    },

    getData : function(){
        data = {list : [{
            index : 1,
            user : 'baidu',
            site : 'http://www.baidu.com'
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