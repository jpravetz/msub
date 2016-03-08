/*****************************************************************************
 * msub.js
 * Copyright 2016 Jim Pravetz. MIT License (MIT)
 *****************************************************************************/

// var open = "\\\$\\\{";       // for ${0} pattern
var open = "\\\{";              // for {0} pattern
var close = "\\\}";
var mRegEx = new RegExp(open + "D:([^" + close + "]+)" + close, 'g');
var moment = require('moment');


/**
 * Replace all instances of a {PROP} in this string with a value.
 * Note that any instances of {PROP} in your string will be replaced, if it is found in the args
 * list. This limits your use of "{some-text}" to 'some-text' that does not match the args list.
 * @param args {object|array|arguments}
 *              If an object: Key, value pair where all instances of {KEY} are replaced with value.
 *              The keys are converted to uppercase and camelcase is separated with underscore, so
 *              the key isExtNow becomes {IS_EXT_NOW} in s.
 *              If a list of arguments: converted to array
 *              If an array: replaces {1}, {2}, {3}, etc. with first, second, third, etc arguments.
 * @returns {string} Returns s with all instances of args replaced
 */
String.prototype.msub = function (args) {

    var s = this;

    if (args !== undefined && args !== null) {
        var replaceRegEx = {};
        var fnEx = {};
        if (args.constructor === Object) {
            for (var prop in args) {
                if (typeof args[prop] === 'string' || typeof args[prop] === 'number' || typeof args[prop] === 'boolean') {
                    var p = prop.replace(/([A-Z])/g, "_$1").toUpperCase();
                    replaceRegEx[prop] = new RegExp(open + p + close, 'g');
                } else if (args[prop] instanceof Date) {
                    var p = prop.replace(/([A-Z])/g, "_$1").toUpperCase();
                    var v = open + p + ":([^" + close + "]+)" + close;
                    replaceRegEx[prop] = new RegExp(v, 'g');
                    fnEx[prop] = true;
                }
            }
        } else {
            if (args.constructor !== Array) {
                args = Array.prototype.slice.call(arguments);
            }
            for (var idx = 0; idx < args.length; ++idx) {
                if (typeof args[idx] === 'string' || typeof args[idx] === 'number' || typeof args[idx] === 'boolean') {
                    replaceRegEx[idx] = new RegExp(open + String(idx) + close, 'g');
                } else if (args[idx] instanceof Date) {
                    var v = open + String(idx) + ":([^" + close + "]+)" + close;
                    replaceRegEx[idx] = new RegExp(v, 'g');
                    var d = args[idx];
                    fnEx[idx] = true;
                }
            }
        }
        for (var prop in replaceRegEx) {
            if (fnEx[prop]) {
                //s = s.replace(replaceRegEx[prop], fnEx[prop]);
                s = s.replace(replaceRegEx[prop], function (m0, m1) {
                    return moment(args[prop]).format(m1);
                });
            } else {
                s = s.replace(replaceRegEx[prop], args[prop]);
            }
        }
    }
    //s = s.replace(mRegEx,function(m0,m1) {
    //    return m.format(m1);
    //});
    return s.toString();
};
