export declare const browsers: ({
    name: string;
    use: {
        connectOptions: {
            wsEndpoint: string;
        };
    };
} | {
    name: string;
    use: {
        viewport: import("playwright-core").ViewportSize;
        userAgent: string;
        deviceScaleFactor: number;
        isMobile: boolean;
        hasTouch: boolean;
        defaultBrowserType: "chromium" | "firefox" | "webkit";
    };
})[];
//# sourceMappingURL=browsers.d.ts.map