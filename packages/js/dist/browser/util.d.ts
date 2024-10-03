/**
 * Converts an HTMLElement into a human-readable string.
 * @param {!HTMLElement} element
 * @return {string}
 */
export declare function stringNameOfElement(element: HTMLElement): string;
export declare function stringSelectorOfElement(element: any): any;
export declare function stringTextOfElement(element: any): any;
export declare function nativeFetch(): boolean;
export declare function parseURL(url: string): {
    protocol: any;
    host: any;
    pathname: any;
};
export declare function localURLPathname(url: string): any;
export declare function decodeCookie(string: string): Record<string, unknown>;
export declare function encodeCookie(object: any): string;
export declare const preferCatch: boolean;
/** globalThis has fairly good support. But just in case, lets check its defined.
 * @see {https://caniuse.com/?search=globalThis}
 */
export declare function globalThisOrWindow(): typeof globalThis;
//# sourceMappingURL=util.d.ts.map