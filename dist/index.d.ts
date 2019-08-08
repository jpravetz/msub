export interface MSubInitOptions {
    open?: string;
    close?: string;
    uppercase?: boolean;
    format?: any;
}
export declare type MSubFormatCallback = (val: any, format: string) => string;
interface IMSub {
    init(options?: MSubInitOptions): this;
    exec(s: string, ...args: (MSubParam | MSubParam[] | {
        [key: string]: MSubParam;
    })[]): string;
}
declare class MSubImpl implements IMSub {
    open: string;
    close: string;
    uppercase: boolean;
    format?: any;
    private static regNumber;
    private static regPrim;
    private static BRACES;
    constructor();
    init(options?: MSubInitOptions): this;
    exec(s: string, ...args: (MSubParam | MSubParam[] | {
        [key: string]: MSubParam;
    })[]): string;
    private convertKey;
    static isObject(val: any): boolean;
    static isDate(val: any): boolean;
    static isAllowedPrim(val: any): boolean;
}
export declare const msub: MSubImpl;
export declare const MSub: typeof MSubImpl;
export declare type MSubParam = string | number | boolean | Date;
declare global {
    interface String {
        /**
         * String replacement, similar to ES2015 back tick quotes.
         * @param args
         */
        msub(...args: (MSubParam | MSubParam[] | {
            [key: string]: MSubParam;
        })[]): string;
    }
}
export {};
