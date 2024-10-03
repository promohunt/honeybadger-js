import { Types } from '@honeybadger-io/core';
export declare function fatallyLogAndExit(err: Error): never;
export declare function getStats(): Promise<Types.ProcessStats>;
/**
 * Get source file if possible, used to build `notice.backtrace.source`
 *
 * @param path to source code
 */
export declare function getSourceFile(path: string): Promise<string>;
export declare function readConfigFromFileSystem(): Types.Config;
//# sourceMappingURL=util.d.ts.map