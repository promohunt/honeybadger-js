import { Types } from '@honeybadger-io/plugin-core';
import type { OutputBundle, NormalizedOutputOptions } from 'rollup';
/**
 * Extracts the data we need for sourcemap upload from the bundle
 */
export declare function extractSourcemapDataFromBundle(outputOptions: NormalizedOutputOptions, bundle: OutputBundle, ignorePaths?: Array<string>): Types.SourcemapInfo[];
/**
 * Determines if we are in a non-production environment
 * Note that in Vite setups, NODE_ENV should definitely be available
 * In Rollup without Vite, it may or may not be available,
 * so if it's missing we'll assume prod
 */
export declare function isNonProdEnv(): boolean;
//# sourceMappingURL=rollupUtils.d.ts.map