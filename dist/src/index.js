"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let __msubOpts = {
    open: '${',
    close: '}',
    uppercase: false,
    regNumber: new RegExp(/\d+/),
    subRegEx: '',
    extRegEx: '',
    dateFormat: undefined
};
// Convert uppercase with underscores to camelcase, eg. USE_STRING to useString
function convertKey(s) {
    if (__msubOpts.uppercase) {
        let r = s
            .split('_')
            .map(word => {
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
            .join('');
        return r.charAt(0).toLowerCase() + r.slice(1);
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
// @ts-ignore
String.prototype.msub = function (args) {
    let s = this;
    if (args !== undefined && args !== null) {
        let isArray;
        if (args.constructor !== Object) {
            isArray = true;
            if (args.constructor !== Array) {
                args = Array.prototype.slice.call(arguments);
            }
        }
        let sub = (str) => {
            let p = str.split(':');
            let key = p.shift();
            let format = p.shift();
            let val;
            if (isArray && __msubOpts.regNumber.test(key)) {
                val = args[parseInt(key, 10)];
            }
            else {
                val = args[convertKey(key)];
            }
            if (val instanceof Date) {
                if (format && typeof val[format] === 'function') {
                    val = val[format](...p);
                }
                else if (format && __msubOpts.format) {
                    val = __msubOpts.format(val, format);
                }
                else {
                    val = val.toString();
                }
            }
            else if (typeof val === 'number') {
                if (format && typeof Number[format] === 'function') {
                    val = Number(val)[format](...p);
                }
                else if (format && __msubOpts.format) {
                    val = __msubOpts.format(val, format);
                }
                else {
                    val = String(val);
                }
            }
            return val;
        };
        let remainder = s;
        let i = 0;
        let out = '';
        let j = remainder.indexOf(__msubOpts.open);
        if (j >= 0) {
            out += remainder.slice(i, j);
            remainder = remainder.slice(j + __msubOpts.open.length);
            let k = remainder.indexOf(__msubOpts.close);
            if (k >= 0) {
                let key = remainder.slice(0, k);
                let val = sub(key);
                if (val !== undefined) {
                    out += val;
                }
                else {
                    out += __msubOpts.open + key + __msubOpts.close;
                }
                remainder = remainder.slice(k + __msubOpts.close.length);
            }
        }
    }
    return s.toString();
};
const BRACES = {
    '${': '}',
    '#{': '}',
    '{{': '}}',
    '{': '}',
    '(': ')',
    '[': ']',
    '<': '>',
    '<<': '>>'
};
function regExpEscape(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}
function init(options = {}) {
    // let open = '\\$\\{'; // for ${0} pattern
    // let close = '\\}';
    __msubOpts.open = options.open ? options.open : '${';
    __msubOpts.close = options.close
        ? options.close
        : BRACES[options.open]
            ? BRACES[options.open]
            : '}';
    // let notClose = '[^'+ regExpEscape(close) +']+';
    // let notDivOrClose = '[^\\}:]+';
    // let notDivOrClose = '[^\\}:]+';
    // if (c) {
    //   notClose = '[^\\' + c + ']+';
    //   notDivOrClose = '[^\\' + c + ':]+';
    //   close = '\\' + c;
    // }
    if (options.uppercase === true) {
        __msubOpts.uppercase = true;
    }
    if (options.format) {
        __msubOpts.format = options.format;
    }
    // __msubOpts.subRegEx = new RegExp(regExpEscape(open) + notClose + close, 'g');
    // __msubOpts.extRegEx = new RegExp(
    //   open + '(' + notDivOrClose + ')' + '(:(' + notClose + '))?' + close
    // );
}
exports.init = init;
init();
//# sourceMappingURL=index.js.map