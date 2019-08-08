"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MSubImpl {
    constructor() {
        this.open = '${';
        this.close = '}';
        this.uppercase = false;
    }
    init(options = {}) {
        this.open = options.open ? options.open : '${';
        this.close = options.close
            ? options.close
            : exports.MSub.BRACES[options.open]
                ? exports.MSub.BRACES[options.open]
                : '}';
        if (options.uppercase === true) {
            this.uppercase = true;
        }
        if (options.format) {
            this.format = options.format;
        }
        return this;
    }
    exec(s, ...args) {
        if (args !== undefined && args !== null) {
            let isArray;
            // Resolve input args
            let obj = {};
            let arr = [];
            for (let idx = 0; idx < args.length; ++idx) {
                const item = args[idx];
                if (MSubImpl.isObject(item)) {
                    obj = Object.assign(obj, item);
                }
                else if (Array.isArray(item)) {
                    arr = [...arr, ...item];
                }
                else if (MSubImpl.isAllowedPrim(item)) {
                    arr.push(item);
                }
            }
            let sub = (str) => {
                let p = str.split(':');
                let key = p.shift();
                let format = p.shift();
                let val;
                let index = arr.length && exports.MSub.regNumber.test(key) ? parseInt(key, 10) : -1;
                if (index >= 0 && arr[index] !== undefined) {
                    val = arr[index];
                }
                else {
                    val = obj[this.convertKey(key)];
                }
                if (val instanceof Date) {
                    if (format && typeof val[format] === 'function') {
                        val = val[format](...p);
                    }
                    else if (format && this.format) {
                        val = this.format(val, format);
                    }
                    else {
                        val = val.toString();
                    }
                }
                else if (typeof val === 'number') {
                    if (format && typeof val[format] === 'function') {
                        val = val[format](...p);
                    }
                    else if (format && this.format) {
                        val = this.format(val, format);
                    }
                    else {
                        val = String(val);
                    }
                }
                return val;
            };
            let j = s.indexOf(this.open);
            if (j >= 0) {
                let remainder = s;
                let out = '';
                let k = 1;
                let loop = 100; // extra endless-loop protection
                while (j >= 0 && k >= 0 && loop > 0) {
                    out += remainder.slice(0, j);
                    remainder = remainder.slice(j + this.open.length);
                    k = remainder.indexOf(this.close);
                    if (k >= 0) {
                        let key = remainder.slice(0, k);
                        let val = sub(key);
                        if (val !== undefined) {
                            out += val;
                        }
                        else {
                            out += this.open + key + this.close;
                        }
                        remainder = remainder.slice(k + this.close.length);
                        j = remainder.indexOf(this.open);
                    }
                    --loop;
                }
                out += remainder;
                return out.toString();
            }
        }
        return s.toString();
    }
    // Convert uppercase with underscores to camelcase, eg. USE_STRING to useString
    convertKey(s) {
        if (this.uppercase) {
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
    static isObject(val) {
        return val !== undefined && val !== null && val.constructor === Object;
    }
    static isDate(val) {
        return val !== undefined && val !== null && val.constructor === Date;
    }
    static isAllowedPrim(val) {
        if (MSubImpl.isDate(val) || val === null) {
            return true;
        }
        return MSubImpl.regPrim.test(typeof val);
    }
}
MSubImpl.regNumber = new RegExp(/\d+/);
MSubImpl.regPrim = new RegExp(/^(number|string|boolean)$/);
MSubImpl.BRACES = {
    '${': '}',
    '#{': '}',
    '{{': '}}',
    '{': '}',
    '(': ')',
    '[': ']',
    '<': '>',
    '<<': '>>'
};
let __msub = new MSubImpl();
exports.msub = __msub;
exports.MSub = MSubImpl;
String.prototype.msub = function (...args) {
    let s = this;
    return __msub.exec(s, ...args);
};
//# sourceMappingURL=index.js.map