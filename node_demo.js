var http = require('http');

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
}]};

var jstpl = require('./lib/jstpl.min.js').init;

var server = http.createServer(function(req, res){
    var contentType = 'text/html;charset=utf-8';
    res.setHeader("Content-Type", contentType);

    var html = jstpl('./demo/demo.tpl', data);

    res.end(html);

}).listen(8899);