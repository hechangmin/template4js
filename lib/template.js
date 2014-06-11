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
    var _isNode = typeof exports !== 'undefined',
        _cache = {},
        _config = {
            openTag        : '<%',
            closeTag       : '%>',
            enabled_escape : true
        },
        _mapEscape = {
             "<" : "&#60;",
             ">" : "&#62;",
             '"' : "&#34;",
             "'" : "&#39;",
             "&" : "&#38;"
        };

    function include(strPathOrId){

        var content = '',
            element,
            fs;

        try{
            if(_isNode){
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
            _config[key] = config[key];
        }
    }

    function template(strPathOrId, data, config){
        var strContent,
            strParseRet,
            fnContent,
            strRet;

        config && configure(config);

        try{
            if(_cache[strPathOrId]){
                fnContent = _cache[strPathOrId];
            }else{
                strContent = include(strPathOrId);
                strParseRet = preParse(strContent);
                fnContent = compile(strParseRet);
                _cache[strPathOrId] = fnContent;
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

    function restore(strParam, isReplease){
        return isReplease ? strParam.replace(/\'/g, '``') : strParam.replace(/``/g,'\'');
    }

    function getSubTpl(source){
        return source.replace(new RegExp(_config.openTag + '\\s*include\\(\\s*[\'"]([^\'"]+)[\'"]\\s*\\)\\s*' + _config.closeTag, "g"), function($, $1){
            return preParse(include($1));
        });
    }

    function compile(source){
        var strFn = "var _$jstpl='',__fn__=(function(__d__){var __v__='';for(var __k__ in __d__){__v__+=('var '+__k__+'=__d__[\"'+__k__+'\"];');};eval(__v__);_$jstpl+='" + source + "';__v__=null;})(param);__fn__ = null;return _$jstpl;";
        return new Function("param", strFn);
    }

    function preParse(source){
        source = source.replace(new RegExp("<!--.*?-->", "g"),"")
            .replace(new RegExp("[\\r\\t\\n]","g"), "");

        source = restore(source, true);
        source = getSubTpl(source);
        return parse(source);
    }

    function parse(source){
        return source.replace(new RegExp( _config.openTag + '(.*?)' + _config.closeTag, 'g'), function($, $1){
            var s = $1;

            if(/^=/g.test($1)){
                s = s.substr(1);
                s = _config.enabled_escape ? s.replace(/[&<>"']/g, function (s1) {return _mapEscape[s1];}) : s;
                s =  '_$jstpl+=' + s + ";";
            }

            return "';" + s + "_$jstpl += '";
        });
    }

    if('function' === typeof define){
        define(function() {
            return template;
        });
    }else if(_isNode){
        module.exports = template;
    }else{
        window.template = template;
    }
})();