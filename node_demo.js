var http = require('http'),
    template = require('./lib/template.js'),

    contentType = 'text/html;charset=utf-8',
    data = {list : [{
        index : 1,
        user : 'baidu',
        site : '<a href="http://www.baidu.com" target="_blank">http://www.baidu.com</a>'
    },{
        index : 2,
        user : '<span style="color:red;">qq</span>',
        site : '<a href="http://www.qq.com" target="_blank">http://www.qq.com</a>'
    },{
        index : 3,
        user : 'ali',
        site : "http://www.taobao.com"
    }]};

http.createServer(function(req, res){
    res.setHeader("Content-Type", contentType);
    res.end(template('./assets/demo.tpl', data));
}).listen(8899);

console.log('server is start, please access port 8899.')