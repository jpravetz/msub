import { whileStatement } from '@babel/types';
import { isDeclareTypeAlias } from 'babel-types';

export interface MSubInitOptions {
  open?: string;
  close?: string;
  uppercase?: boolean;
  format?: any;
}

export type MSubFormatCallback = (val: any, format: string) => string;

interface IMSub {
  init(options?: MSubInitOptions): this;
  exec(
    s: string,
    ...args: (MSubParam | MSubParam[] | { [key: string]: MSubParam })[]
  ): string;
}

class MSubImpl implements IMSub {
  open: string = '${';
  close: string = '}';
  uppercase: boolean = false;
  format?: any;
  private static regNumber = new RegExp(/\d+/);
  private static regPrim = new RegExp(/^(number|string|boolean)$/);
  private static BRACES: { [key: string]: string } = {
    '${': '}',
    '#{': '}',
    '{{': '}}',
    '{': '}',
    '(': ')',
    '[': ']',
    '<': '>',
    '<<': '>>'
  };

  constructor() {}

  init(options: MSubInitOptions = {}): this {
    this.open = options.open ? options.open : '${';
    this.close = options.close
      ? options.close
      : MSub.BRACES[options.open]
      ? MSub.BRACES[options.open]
      : '}';
    if (options.uppercase === true) {
      this.uppercase = true;
    }
    if (options.format) {
      this.format = options.format;
    }
    return this;
  }

  exec(
    s: string,
    ...args: (MSubParam | MSubParam[] | { [key: string]: MSubParam })[]
  ): string {
    if (args !== undefined && args !== null) {
      let isArray;

      // Resolve input args
      let obj = {};
      let arr = [];
      for (let idx = 0; idx < args.length; ++idx) {
        const item = args[idx];
        if (MSubImpl.isObject(item)) {
          obj = Object.assign(obj, item);
        } else if (Array.isArray(item)) {
          arr = [...arr, ...item];
        } else if (MSubImpl.isAllowedPrim(item)) {
          arr.push(item);
        }
      }

      let sub = (str: string): string => {
        let p = str.split(':');
        let key = p.shift();
        let format = p.shift();
        let val;
        let index = arr.length && MSub.regNumber.test(key) ? parseInt(key, 10) : -1;
        if (index >= 0 && arr[index] !== undefined) {
          val = arr[index];
        } else {
          val = obj[this.convertKey(key)];
        }
        if (val instanceof Date) {
          if (format && typeof val[format] === 'function') {
            val = val[format](...p);
          } else if (format && this.format) {
            val = this.format(val, format);
          } else {
            val = val.toString();
          }
        } else if (typeof val === 'number') {
          if (format && typeof val[format] === 'function') {
            val = val[format](...p);
          } else if (format && this.format) {
            val = this.format(val, format);
          } else {
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
            } else {
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
  private convertKey(s: string): string {
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

  static isObject(val: any) {
    return val !== undefined && val !== null && val.constructor === Object;
  }
  static isDate(val: any) {
    return val !== undefined && val !== null && val.constructor === Date;
  }

  static isAllowedPrim(val: any) {
    if (MSubImpl.isDate(val) || val === null) {
      return true;
    }
    return MSubImpl.regPrim.test(typeof val);
  }
}

let __msub = new MSubImpl();
export const msub = __msub;
export const MSub = MSubImpl;

export type MSubParam = string | number | boolean | Date;

declare global {
  interface String {
    /**
     * String replacement, similar to ES2015 back tick quotes.
     * @param args
     */
    msub(...args: (MSubParam | MSubParam[] | { [key: string]: MSubParam })[]): string;
  }
}

String.prototype.msub = function(...args) {
  let s = this;
  return __msub.exec(s, ...args);
};
