import { Logger, BacktraceFrame, Notice, Noticeable, BeforeNotifyHandler, AfterNotifyHandler, Config, BrowserConfig } from './types';
export declare function merge<T1 extends Record<string, unknown>, T2 extends Record<string, unknown>>(obj1: T1, obj2: T2): T1 & T2;
export declare function mergeNotice(notice1: Partial<Notice>, notice2: Partial<Notice>): Partial<Notice>;
export declare function objectIsEmpty(obj: any): boolean;
export declare function objectIsExtensible(obj: any): boolean;
export declare function makeBacktrace(stack: string, filterHbSourceCode?: boolean, logger?: Logger): BacktraceFrame[];
export declare const DEFAULT_BACKTRACE_SHIFT = 3;
/**
 * If {@link generateStackTrace} is used, we want to exclude frames that come from
 * Honeybadger's source code.
 *
 * Logic:
 * - For each frame, increment the shift if source code is from Honeybadger
 * - If a frame from an <anonymous> file is encountered increment the shift ONLY if between Honeybadger source code
 *   (i.e. previous and next frames are from Honeybadger)
 * - Exit when frame encountered is not from Honeybadger source code
 *
 * Note: this will not always work, especially in browser versions where code
 *       is minified, uglified and bundled.
 *       For those cases we default to 3:
 *       - generateStackTrace
 *       - makeNotice
 *       - notify
 */
export declare function calculateBacktraceShift(backtrace: BacktraceFrame[]): number;
export declare function getCauses(notice: Partial<Notice>, logger: Logger): any[];
export declare function getSourceForBacktrace(backtrace: BacktraceFrame[], getSourceFileHandler: (path: string) => Promise<string>): Promise<Record<string, string>[]>;
export declare function runBeforeNotifyHandlers(notice: Notice | null, handlers: BeforeNotifyHandler[]): {
    results: ReturnType<BeforeNotifyHandler>[];
    result: boolean;
};
export declare function runAfterNotifyHandlers(notice: Notice | null, handlers: AfterNotifyHandler[], error?: Error): boolean;
export declare function shallowClone<T>(obj: T): T | Record<string, unknown>;
export declare function sanitize(obj: any, maxDepth?: number): any;
export declare function logger(client: {
    config: {
        debug: boolean;
        logger: Logger;
    };
}): Logger;
/**
 * Converts any object into a notice object (which at minimum has the same
 * properties as Error, but supports additional Honeybadger properties.)
 */
export declare function makeNotice(thing: Noticeable): Partial<Notice>;
export declare function isErrorObject(thing: unknown): boolean;
/**
 * Instrument an existing function inside an object (usually global).
 * @param {!Object} object
 * @param {!String} name
 * @param {!Function} replacement
 */
export declare function instrument(object: Record<string, any>, name: string, replacement: (unknown: any) => unknown): void;
export declare function instrumentConsole(_window: any, handler: (method: string, args: unknown[]) => void): void;
export declare function endpoint(base: string, path: string): string;
export declare function generateStackTrace(): string;
export declare function filter(obj: Record<string, unknown>, filters: string[]): Record<string, unknown>;
export declare function filterUrl(url: string, filters: string[]): string;
export declare function formatCGIData(vars: Record<string, unknown>, prefix?: string): Record<string, unknown>;
export declare function clone<T>(obj: T): T;
export declare function isBrowserConfig(config: BrowserConfig | Config): config is BrowserConfig;
//# sourceMappingURL=util.d.ts.map