/**
 * javascript Template
 * https://github.com/hechangmin/jstpl
 * @author  hechangmin@gmail.com
 * @version 2.3.2
 * @date    2014.8
 *
 * Released under the MIT license
 */

(function() {
    var hasDefine = typeof define === 'function',
        hasExports = typeof module !== 'undefined' && module.exports,
        cache = {},
        retCache = [],
        maxCacheCount = 100,
        variables,
        escapeRules = {
            '<': '&#60;',
            '>': '&#62;',
            '"': '&#34;',
            "'": '&#39;',
            '&': '&#38;'
        },
        config = {
            openTag: '<%',
            closeTag: '%>'
        };

    var helper = {
        escape: function(str) {
            if (str && str.replace) {
                str = str.replace(/[&<>"']/g, function(s1) {
                    return escapeRules[s1];
                });
            }
            return str;
        }
    };

     var isType = function(type) {
        return function(obj) {
            var strFullType = Object.prototype.toString.call(obj);
            var curType = strFullType.split(' ')[1].split(']')[0];

            //The results of window is global, but should be object.
            if('Object' === type && curType === 'global'){
                return true;
            }else{
                return type === curType;
            }
        };
    };
    
    var isObject = isType('Object');
    var isFunction = isType('Function');
   
    if (typeof Function.prototype.bind === 'undefined') {
        Function.prototype.bind = function(objThis) {
            var f = this,
                slice = Array.prototype.slice,
                args = slice.call(arguments, 1);

            return function() {
                return f.apply(objThis, args.concat(slice.call(arguments)));
            };
        };
    }

    function include(resId) {
        var fs, element, content = '';

        try {
            if (hasExports) {
                fs = require('fs');
                content = fs.readFileSync(resId, 'utf-8');
            } else {
                element = document.getElementById(resId);
                content = element ? (element.value || element.innerHTML) : resId;
            }
            return content;
        } catch (err) {
            throw err;
        }
    }

    function configure(opts) {
        for (var key in opts) {
            config[key] = opts[key];
        }
    }

    function getRender(resId, data) {
        var strContent,
            strParseRet,
            fnRender;

        if (!cache[resId]) {
            strContent = include(resId);
            strParseRet = preParse(strContent);
            setPreVars(data);
            fnRender = compile(strParseRet).bind(null, helper);
            if(isFunction(fnRender)){
                cache[resId] = fnRender;
            }else{
                throw('generate render function fail.');
            }
        }
        return cache[resId];
    }

    function hasCache(obj){
        var k = 0;
        var len = retCache.length;

        while (k < len) {
            if(retCache[k] == obj) {
                return true;
            }
            k++;
        }
        return false;
    }

    function setCacheRet(resId, data, options, strRet){
        if(!hasCache(arguments)){
            while(retCache.length > maxCacheCount){
                retCache.shift();
            }
            retCache.push(arguments);
        }
    }
    
    function getCacheRet(resId, data, options, strRet){
        for(var i = 0, l = retCache.length; i < l; i++){
            if(retCache[i][0] == resId &&
                retCache[i][1] == data &&
                retCache[i][2] == options){
                return retCache[i][3];
            }
        }
        return false;
    }

    function template(resId, data, options) {
        var render;
        var strRet = getCacheRet(resId, data, options);

        if(strRet){
            return strRet;
        }

        options && configure(options);
        
        if(!(isObject(data) && 'object' === typeof data)){
            data = {};
        }

        try {
            render = getRender(resId, data);
            strRet = render(data);
            setCacheRet(resId, data, options, strRet);
        } catch (err) {
            if(cache[resId]){
                delete cache[resId];    
            }
            throw err;
        }

        return strRet;
    }

    function getSubTpl(source) {
        var reSubTpl = new RegExp(config.openTag + '\\s*include\\(\\s*[\'"]([^\'"]+)[\'"]\\s*\\)\\s*' + config.closeTag, 'g');

        return source.replace(reSubTpl, function($, $1) {
            if ($1) {
                return preParse(include($1));
            }
        });
    }

    function setPreVars(data) {

        var vars = 'var ';

        for (var name in data) {
            vars += name;
            vars += '=data["';
            vars += name;
            vars += '"],';
        }

        variables = vars;
    }

    function compile(source) {
        var strFn = variables;
        strFn += " f='';f+='";
        strFn += source;
        strFn += "'; return f;";
        return new Function('helper', 'data', strFn);
    }

    function preParse(source) {

        var regHTML = new RegExp(config.openTag + '(?:(?!' + config.closeTag + ')[\\s\\S])*' + config.closeTag + '|((?:(?!' + config.openTag + ')[\\s\\S])+)', 'g');

        source = source.replace(/<!--.*?-->/g, ' ')
            .replace(/[\r\t\n]/g, ' ')
            .replace(regHTML, function($, $1) {
                var str = $;

                if ($1) {
                    str = $1.replace(/'/g, '\\\'');
                }

                return str;
            });
        source = getSubTpl(source);
        return parse(source);
    }

    function parse(source) {

        source = source.replace(new RegExp(config.openTag + '(.*?)' + config.closeTag, 'g'), function($, $1) {
            var s = $1;

            if (/^-/g.test($1)) {
                s = s.substr(1);
                s = 'helper.escape(' + s + ')';
                s = 'f+=' + s + ';';
            } else if (/^=/g.test($1)) {
                s = 'f+=' + s.substr(1) + ';';
            }

            return "';" + s + "f += '";
        });

        return source;
    }

    if (hasDefine) {
        define(template);
    } else if (hasExports) {
        module.exports = template;
    } else {
        window.template = template;
    }
}());