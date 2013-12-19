/**
 * @fileoverview javascript Template
 * https://github.com/hechangmin/jstpl
 * @author  hechangmin@gmail.com
 * @version 1.0.0
 * @date    2013.12
 * Released under the MIT license
 */

;(function(global, undefined){

    var config = {openTag : '<%', closeTag : '%>'},
        cache = {};

    /**
     * @name jstpl
     * @constructor
     * @class  jstpl 模板引擎
     * @param  {json} options 配置开始标签，关闭标签,如果第一个参数不是对象，则自动转调 template
     * @example jstpl({openTag : '<%', closeTag : '%>'});
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

    //模板编译成函数
    var compile = function(str){
        //避免with语法
        var strFn = "var _$_$_$_='',__fn__=(function(__d__){var __v__='';for(var __k__ in __d__){__v__+=('var '+__k__+'=__d__[\"'+__k__+'\"];');};eval(__v__);_$_$_$_+='" + parse(str) + "';__v__=null;})(param);__fn__ = null;return _$_$_$_;";
        return new Function("param", strFn);
    };

    //转义影响正则的字符
    var encodeReg = function (source) {
        return String(source).replace(/([.*+?^=!:${}()|[\]/\\])/g,'\\$1');
    };

    //模板解析
    var parse = function(str){
        var openTag = encodeReg(config['openTag']),
            closeTag = encodeReg(config['closeTag']);

        //移除注释及换行，避免干扰正常解析
        str = String(str).replace(new RegExp("(" + openTag + "[^" + closeTag + "]*)//.*\n","g"), "$1")
            .replace(new RegExp("<!--.*?-->", "g"),"")
            .replace(new RegExp("[\\r\\t\\n]","g"), "");

        return str.replace(new RegExp( openTag + '(.*?)' + closeTag, 'g'), function($, $1){
            return "';" + ($1.indexOf('=') == 0 ? "_$_$_$_+" + $1 + ";" : $1 )+ "_$_$_$_ += '";
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