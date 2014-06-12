/**
 * javascript Template
 * https://github.com/hechangmin/jstpl
 * @author  hechangmin@gmail.com
 * @version 2.0
 * @date    2014.4
 *
 * 同时支持浏览器和node
 * Released under the MIT license
 */

(function template4js(){
    var isNode = typeof exports !== 'undefined',
        cache = {},
        config = {
            openTag        : '<%',
            closeTag       : '%>',
            enabled_escape : true
        },
        mapEscape = {
             "<" : "&#60;",
             ">" : "&#62;",
             '"' : "&#34;",
             "'" : "&#39;",
             "&" : "&#38;"
        };

    function include(strPathOrId){
        var content = '';

        try{
            if(isNode){
                var fs = require('fs');
                content = fs.readFileSync(strPathOrId, 'utf-8');
            }else{
                var element = document.getElementById(strPathOrId);
                content = element.value || element.innerHTML;
            }
            return content;
        }catch(err){
            throw err;
        }
    }

    function configure(config){
        for(var key in config){
            config[key] = config[key];
        }
    }

    function template(strPathOrId, data, config){
        var strContent,
            strParseRet,
            fnContent,
            strRet;

        config && configure(config);

        try{
            if(cache[strPathOrId]){
                fnContent = cache[strPathOrId];
            }else{
                strContent = include(strPathOrId);
                strParseRet = preParse(strContent);
                fnContent = compile(strParseRet);
                cache[strPathOrId] = fnContent;
            }

            if(!data){
                return fnContent;
            }

            strRet = restore(fnContent(data));

        }catch(err){
            throw err;
        }

        return strRet;
    }

    function restore(strParam){
        return strParam.replace(/``/g,'\'');
    }

    function getSubTpl(source){
        var reSubTpl = new RegExp(config.openTag + '\\s*include\\(\\s*[\'"]([^\'"]+)[\'"]\\s*\\)\\s*' + config.closeTag, "g");

        return source.replace(reSubTpl,
            function($, $1){
                return preParse(include($1));
        });
    }

    function compile(source){
        var strFn = "var _$jstpl='',__fn__=(function(__d__){var __v__='';for(var __k__ in __d__){__v__+=('var '+__k__+'=__d__[\"'+__k__+'\"];');};eval(__v__);_$jstpl+='";
        strFn += source;
        strFn += "';__v__=null;})(param);__fn__ = null;return _$jstpl;";

        return new Function("param", strFn);
    }

    function preParse(source){
        source = source.replace(new RegExp("<!--.*?-->", "g"),"")
            .replace(new RegExp("[\\r\\t\\n]","g"), "")
            .replace(new RegExp(config.openTag+"(?:(?!"+config.closeTag+")[\\s\\S])*"+config.closeTag+"|((?:(?!"+config.openTag+")[\\s\\S])+)","g"),function ($, $1) {
                var str = $;

                if($1){
                    str = $1.replace(/'/g,'``');
                }

                return str;
            });
        source = getSubTpl(source);
        return parse(source);
    }

    function parse(source){
        return source.replace(new RegExp(config.openTag + '(.*?)' + config.closeTag, 'g'), function($, $1){
            var s = $1;

            if(/^=/g.test($1)){
                s = s.substr(1);
                s = config.enabled_escape ? s.replace(/[&<>"']/g, function (s1) {return mapEscape[s1];}) : s;
                s =  '_$jstpl+=' + s + ";";
            }

            return "';" + s + "_$jstpl += '";
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