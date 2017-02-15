/*****************************************************************************
 * msub.js
 * Copyright 2016-2017 Jim Pravetz. MIT License (MIT)
 *****************************************************************************/

var regNumber = new RegExp(/\d+/);
var useUppercase = false;
var useMoment = false;
var moment;
var subRegEx;
var extRegEx;

// Convert uppercase with underscores to camelcase, eg. USE_STRING to useString
function convertKey (s) {
    if (useUppercase) {
        s = s.split('_').map(function (word) {
            return word.charAt(0).toUpperCase() + word.slice(1);
        }).join('');
        return s.charAt(0).toLowerCase() + s.slice(1);
    }
    return s;
}

/**
 * Replace all instances of a ${prop} in this string with a value.
 * Note that any instances of ${prop in your string will be replaced, if it is found in the args
 * list. This limits your use of "${some-text}" to 'some-text' that does not match the args list.
 * @param args {object|array|arguments}
 *              If an object: Key, value pair where all instances of ${key} are replaced with value.
 *              If a list of arguments: converted to array
 *              If an array: replaces {1}, {2}, {3}, etc. with first, second, third, etc arguments.
 * @returns {string} Returns s with all instances of args replaced
 */
String.prototype.msub = function (args) {

    if (!moment && useMoment) {
        moment = require('moment');
    }

    var s = this;

    if (args !== undefined && args !== null) {

        var isArray;

        if (args.constructor !== Object) {
            isArray = true;
            if (args.constructor !== Array) {
                args = Array.prototype.slice.call(arguments);
            }
        }

        var parts = s.match(subRegEx);
        if (parts && parts.length) {
            for (var pdx = 0; pdx < parts.length; pdx++) {
                var p = parts[pdx].match(extRegEx);
                if (p.length >= 2) {
                    var key = p[1];
                    var fn = p[3];
                    var val;
                    if (isArray && regNumber.test(key)) {
                        val = args[parseInt(key, 10)];
                    } else {
                        val = args[convertKey(key)];
                    }
                    if (val instanceof Date) {
                        if (fn && typeof val[fn] === 'function') {
                            val = val[fn]();
                        } else if (fn && useMoment && moment) {
                            val = moment(val).format(fn);
                        } else {
                            val = val.toString();
                        }
                    }
                    if (val !== undefined) {
                        s = s.replace(p[0], val);
                    }
                }
            }
        }
    }
    return s.toString();
};

module.exports = init = function (options) {
    options || ( options = {} );
    var open = "\\\$\\\{";          // for ${0} pattern
    var close = "\\\}";
    var notClose = "[^\\\}]+";
    var notDivOrClose = "[^\\\}:]+";
    if (options.open === '{') {
        open = "\\\{";
    }
    if (options.uppercase === true) {
        useUppercase = true;
    }
    if (options.moment === true) {
        useMoment = true;
    }
    subRegEx = new RegExp(open + notClose + close, 'g');
    extRegEx = new RegExp(open + '(' + notDivOrClose + ')' + '(:(' + notClose + '))?' + close);
};

init();
