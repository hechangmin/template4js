/**
 * @fileoverview javascript Template
 * https://github.com/hechangmin/jstpl
 * @author  hechangmin@gmail.com
 * @version 1.0.0
 * @date    2013.12
 * Released under the MIT license
 */

;(function(global, undefined){

    var config = {openTag : '<%', closeTag : '%>', escape : true},
        cache = {};

    /**
     * @name jstpl
     * @constructor
     * @class  jstpl 模板引擎
     * @param  {json} options 配置开始标签，关闭标签,如果第一个参数不是对象，则自动转调 template
     * @example jstpl({openTag : '<%', closeTag : '%>', escape : true});
     */
    var jstpl = function(options) {
        if (undefined !== options) {
            if('string' === typeof options){
                return jstpl.template.apply(this, arguments);
            }
            for (var option in options) {
                config[option] = options[option];
            }
        }
    };

    /**
     * @description {Sting} 版本
     * @field
     */
    jstpl.version = '1.0.0';

    if (global.jstpl) {
        return;
    } else {
        global.jstpl = jstpl;
    }

    /**
     * @description template
     * @param {string} 元素ID 或 模板内容
     * @param {json} data 模板数据 若空，则返回模板函数
     * @return 模板解析结果
     */
    jstpl.template = function(str, data){
        var isDomId = !/[^a-zA-Z10-9_-]/.test(str), element, fn, tpl;

        if(isDomId){                    // 是元素id的格式
            if(global.document){        // 是浏览器环境
                if(cache[str]){         // 有缓存
                    fn = cache[str];
                }else{
                    element = document.getElementById(str);
                    tpl = element.value || element.innerHTML;
                    fn = cache[str] = arguments.callee(tpl)
                }
            }else{
                throw 'param error : [non browser, nonsupport element id]';
                return;
            }
        }else{
            fn = compile(str);
        }
        return data ? fn( data ) : fn;
    };

    /**
     * 添加模板辅助方法
     * @name    template.helper
     * @param   {String}    名称
     * @param   {Function}  方法
     */
    jstpl.addHelper = function (name, helper) {
        jstpl.helper[name] = helper;
    };

    jstpl.helper = {
        escape : function(strParam){
            var m = {
                "<": "&#60;",
                ">": "&#62;",
                '"': "&#34;",
                "'": "&#39;",
                "&": "&#38;"
            };
            return String(strParam).replace(/[&<>"']/g, function (s) {
                return m[s];
            });
        }
    };

    //模板编译成函数
    var compile = function(str){
        //避免with语法
        var strFn = "var _$jstpl='',__fn__=(function(__d__){var __v__='';for(var __k__ in __d__){__v__+=('var '+__k__+'=__d__[\"'+__k__+'\"];');};eval(__v__);_$jstpl+='" + parse(str) + "';__v__=null;})(param);__fn__ = null;return _$jstpl;";
        return new Function("param", strFn);
    };

    //转义影响正则的字符
    var encodeReg = function (source) {
        return String(source).replace(/([.*+?^=!:${}()|[\]/\\])/g,'\\$1');
    };

    //模板解析
    var parse = function(str){
        var openTag = encodeReg(config['openTag']),
            closeTag = encodeReg(config['closeTag']),
            escape = config['escape'];

        //移除注释及换行，避免干扰正常解析
        str = String(str).replace(new RegExp("(" + openTag + "[^" + closeTag + "]*)//.*\n","g"), "$1")
            .replace(new RegExp("<!--.*?-->", "g"),"")
            .replace(new RegExp("[\\r\\t\\n]","g"), "");

        return str.replace(new RegExp( openTag + '(.*?)' + closeTag, 'g'), function($, $1){

            var s = $1;

            if($1.indexOf('=') == 0){
                s = s.substr(1);
                s = escape ? 'jstpl.helper.escape(' + s + ')' : s;
                s =  '_$jstpl+=' + s + ";";
            }

            return "';" + s + "_$jstpl += '";
        });
    };

    if ('function' === typeof define) {
        define(function() {
            return jstpl;
        });
    } else if ('undefined' !== typeof exports) {
        module.exports = jstpl;
    }
})(window);