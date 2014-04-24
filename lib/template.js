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

function template4js(){

    var isNode = "undefined" == typeof window,
        cache = {},
        tpl_config = {
            openTag        : '<%',
            closeTag       : '%>',
            enabled_escape : true
        };

    function include(strPathOrId){
        var content = '',
            element,
            fs;
        try{
            if(isNode){
                fs = require('fs');
                content = fs.readFileSync(strPathOrId, 'utf-8');
            }else{
                element = document.getElementById(strPathOrId);
                content = element.value || element.innerHTML;
            }
            return content;
        }catch(err){
            throw err;
        }
    }

    function configure(config){
        for(var key in config){
            tpl_config[key] = config[key];
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

            strRet = fnContent(data).replace(new RegExp(tpl_config.openTag+"(?:(?!"+tpl_config.closeTag+")[\\s\\S])*"+tpl_config.closeTag+"|((?:(?!"+tpl_config.openTag+")[\\s\\S])+)","g"),function (item, $1) {
                var str = '';
                if($1){
                    str = $1.replace(/&#39;/g,'\'');
                }else{
                    str = item;
                }
                return str ;
            });
        }catch(err){
            throw err;
        }
        return strRet;
    }

    function getSubTpl(source){
        return source.replace(new RegExp(tpl_config.openTag + '\\s*include\\(\\s*[\'"]([^\'"]+)[\'"]\\s*\\)\\s*' + tpl_config.closeTag, "g"), function($, $1){
            return preParse(include($1));
        });
    }

    function compile(source){
        var strFn = "var _$jstpl='',__fn__=(function(__d__){var __v__='';for(var __k__ in __d__){__v__+=('var '+__k__+'=__d__[\"'+__k__+'\"];');};eval(__v__);_$jstpl+='" + source + "';__v__=null;})(param);__fn__ = null;return _$jstpl;";
        return new Function("param", strFn);
    }

    function preParse(source){
        source = source.replace(new RegExp("(" + tpl_config.openTag + "[^" + tpl_config.closeTag + "]*)//.*\n","g"), "$1")
            .replace(new RegExp("<!--.*?-->", "g"),"")
            .replace(new RegExp("[\\r\\t\\n]","g"), "")
            .replace(new RegExp(tpl_config.openTag+"(?:(?!"+tpl_config.closeTag+")[\\s\\S])*"+tpl_config.closeTag+"|((?:(?!"+tpl_config.openTag+")[\\s\\S])+)","g"),function (item, $1) {
                var str = '';

                if($1){
                    str = $1.replace(/'/g,'&#39;');
                }else{
                    str = item;
                }

                return str ;
            });

        source = getSubTpl(source);

        return parse(source);
    }

    function parse(source){
        return source.replace(new RegExp( tpl_config.openTag + '(.*?)' + tpl_config.closeTag, 'g'), function($, $1){
            var s = $1;

            if(0 === $1.indexOf('=')){
                s = s.substr(1);
                s = tpl_config.enabled_escape ? s.replace(/[&<>"']/g, function (s1) {return {"<": "&#60;",">": "&#62;",'"': "&#34;","'": "&#39;","&": "&#38;"}[s1];}) : s;
                s =  '_$jstpl+=' + s + ";";
            }

            return "';" + s + "_$jstpl += '";
        });
    }

    return template;
};

if('function' === typeof define){
    define(function() {
        return template4js();
    });
}else if('undefined' !== typeof exports){
    module.exports = template4js();
}else{
    template = template4js();
}