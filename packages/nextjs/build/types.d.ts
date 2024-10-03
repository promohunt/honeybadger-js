export type NextJsRuntime = 'server' | 'browser' | 'edge';
export type HoneybadgerNextJsConfig = {
    disableSourceMapUpload?: boolean;
    silent?: boolean;
    webpackPluginOptions?: Omit<HoneybadgerWebpackPluginOptions, 'silent'>;
};
export type HoneybadgerWebpackPluginOptions = {
    apiKey: string;
    assetsUrl: string;
    revision?: string;
    endpoint?: string;
    silent?: boolean;
    ignoreErrors?: boolean;
    retries?: number;
    workerCount?: number;
    deploy?: false | {
        repository?: string;
        environment?: string;
        localUsername?: string;
    };
};
//# sourceMappingURL=types.d.ts.map