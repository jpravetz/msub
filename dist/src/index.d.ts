export declare type MsubFormatCallback = (val: any, format: string) => string;
export interface MsubInitOptions {
    open?: string;
    close?: string;
    uppercase?: boolean;
    format?: any;
}
export declare function init(options?: MsubInitOptions): void;
