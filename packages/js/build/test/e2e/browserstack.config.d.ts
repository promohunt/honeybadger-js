import * as BrowserStackLocal from 'browserstack-local';
export declare const bsLocal: BrowserStackLocal.Local;
export declare const BS_LOCAL_ARGS: {
    key: string;
};
declare const defaultCapabilities: {
    browser: string;
    browser_version: string;
    os: string;
    os_version: string;
    name: string;
    build: string;
    'browserstack.username': string;
    'browserstack.accessKey': string;
    'browserstack.local': boolean;
    'browserstack.networkLogs': boolean;
    'browserstack.debug': boolean;
    'browserstack.console': string;
    'client.playwrightVersion': string;
};
type OverridableCapabilities = Pick<typeof defaultCapabilities, 'browser' | 'browser_version' | 'os' | 'os_version' | 'name'>;
export declare function getCdpEndpoint(capabilities: OverridableCapabilities): string;
export {};
//# sourceMappingURL=browserstack.config.d.ts.map