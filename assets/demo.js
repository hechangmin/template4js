
var App ={
    main : function(){
        App.initPage();
        App.initEvent();
    },

    initPage : function(){
        var data = App.getData(),
            html,
            fn;

        // (1) 传入的是元素ID
        html = template('tpl',data);

        // (2) ID 和 数据 分开传
        // fn = template('tpl');
        // html = fn(data);

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