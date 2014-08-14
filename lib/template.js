/**
 * javascript Template
 * https://github.com/hechangmin/jstpl
 * @author  hechangmin@gmail.com
 * @version 2.2.9
 * @date    2014.8
 *
 * Released under the MIT license
 */

(function template4js(){
    var isNode = typeof exports !== 'undefined',
        cache = {},
        escRulesMap = {
            "<" : "&#60;",
            ">" : "&#62;",
            '"' : "&#34;",
            "'" : "&#39;",
            "&" : "&#38;"
        },
        config = {
            openTag  : '<%',
            closeTag : '%>'
        };
    
    var helper = {
        esc : function(str){
            if(str && str.replace){
                str = str.replace(/[&<>"']/g, function (s1) {
                    return escRulesMap[s1];
                });
            }
            return str;
        }
    };

    if (typeof Function.prototype.bind === "undefined") {
        Function.prototype.bind = function(thisArg) {
            var f = this,
                slice = Array.prototype.slice,
                args = slice.call(arguments, 1);

            return function() {
                return f.apply(thisArg, args.concat(slice.call(arguments)));
            }
        };
    }

    function debug(msg){
        if ("undefined" != typeof console) {
            console.log.apply(null, arguments);
        }
    }

    function include(resId){
        var fs, element, content = '';

        try{
            if(isNode){
                fs = require('fs');
                content = fs.readFileSync(resId, 'utf-8');
            }else{
                element = document.getElementById(resId);
                content = element.value || element.innerHTML;
            }
            return content;
        }catch(err){
            throw err;
        }
    }

    function configure(opts){
        for(var key in opts){
            config[key] = opts[key];
        }
    }

    function getFunction(resId){
        var strContent, strParseRet;

        if(!cache[resId]){
            strContent = include(resId);
            strParseRet = preParse(strContent);
            cache[resId] = compile(strParseRet).bind(null, helper);
        }
        return cache[resId];
    };

    function template(resId, data, options){
        var fnContent, strRet;

        options && configure(options);

        try{
            fnContent = getFunction(resId);

            if(data){
                strRet = fnContent(data);
            }else{
                debug('data is undefined');
            }
        }catch(err){
            throw err;
        }

        return strRet;
    };

    function getSubTpl(source){
        var reSubTpl = new RegExp(config.openTag + '\\s*include\\(\\s*[\'"]([^\'"]+)[\'"]\\s*\\)\\s*' + config.closeTag, "g");

        return source.replace(reSubTpl,
            function($, $1){
                if($1){
                    return preParse(include($1));    
                }
        });
    }

    function compile(source){
        var strFn = "var f='',__fn__=(function(__d__){var __v__='';for(var __k__ in __d__){__v__+=('var '+__k__+'=__d__[\"'+__k__+'\"];');};eval(__v__);f+='";
        strFn += source;
        strFn += "';__v__=null;})(param);__fn__ = null;return f;";
        return new Function("helper", "param", strFn);
    }

    function preParse(source){
        source = source.replace(new RegExp("<!--.*?-->", "g"),"")
            .replace(new RegExp("[\\r\\t\\n]","g"), "")
            .replace(new RegExp(config.openTag+"(?:(?!"+config.closeTag+")[\\s\\S])*"+config.closeTag+"|((?:(?!"+config.openTag+")[\\s\\S])+)","g"),function ($, $1) {
                var str = $;

                if($1){
                    str = $1.replace(/'/g,'\\\'');
                }

                return str;
            });
        source = getSubTpl(source);
        return parse(source);
    }

    function parse(source){
        return source.replace(new RegExp(config.openTag + '(.*?)' + config.closeTag, 'g'), function($, $1){
            var s = $1;

            if(/^-/g.test($1)){
                s = s.substr(1);
                s = 'helper.esc(' + s + ')';
                s =  'f+=' + s + ";";
            }else if(/^=/g.test($1)){
                s =  'f+=' + s.substr(1) + ";";
            }

            return "';" + s + "f += '";
        });
    }

    if('function' === typeof define){
        define(function() {
            return template;
        });
    }else if(isNode){
        module.exports = template;
    }else{
        window.template = template;
    }
})();