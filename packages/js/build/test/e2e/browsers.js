"use strict";
// When updating the minimum versions we test against in this file,
// please also update the docs:
//   https://github.com/honeybadger-io/docs/blob/master/source/lib/javascript/reference/supported-versions.html.md
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.browsers = void 0;
var test_1 = require("@playwright/test");
var browserstack_config_1 = require("./browserstack.config");
var browserStackBrowsers = [
    {
        // Chrome minimum version
        // Earliest available chrome version is 83
        // https://www.browserstack.com/docs/automate/playwright/browsers-and-os
        name: 'browserstack_chrome_83_windows',
        use: {
            connectOptions: {
                wsEndpoint: (0, browserstack_config_1.getCdpEndpoint)({
                    browser: 'chrome',
                    browser_version: '83',
                    os: 'Windows',
                    os_version: '10',
                    name: 'browserstack_chrome_83_windows'
                })
            },
        },
    },
    {
        // Chrome latest version
        name: 'browserstack_chrome_latest_windows',
        use: {
            connectOptions: {
                wsEndpoint: (0, browserstack_config_1.getCdpEndpoint)({
                    browser: 'chrome',
                    browser_version: 'latest',
                    os: 'Windows',
                    os_version: '11',
                    name: 'browserstack_chrome_latest_windows'
                })
            },
        },
    },
    {
        // Edge minimum version
        // Earliest available chrome version is 83
        // https://www.browserstack.com/docs/automate/playwright/browsers-and-os
        name: 'browserstack_edge_83_windows',
        use: {
            connectOptions: {
                wsEndpoint: (0, browserstack_config_1.getCdpEndpoint)({
                    browser: 'edge',
                    browser_version: '83',
                    os: 'Windows',
                    os_version: '10',
                    name: 'browserstack_edge_83_windows'
                })
            },
        },
    },
    {
        // Edge latest version
        name: 'browserstack_edge_latest_windows',
        use: {
            connectOptions: {
                wsEndpoint: (0, browserstack_config_1.getCdpEndpoint)({
                    browser: 'edge',
                    browser_version: 'latest',
                    os: 'Windows',
                    os_version: '11',
                    name: 'browserstack_edge_latest_windows'
                })
            },
        },
    },
];
var playwrightBrowsers = [
    {
        name: 'chromium',
        use: __assign({}, test_1.devices['Desktop Chrome']),
    },
    {
        name: 'firefox',
        use: __assign({}, test_1.devices['Desktop Firefox']),
    },
    {
        name: 'webkit',
        use: __assign({}, test_1.devices['Desktop Safari']),
    },
    /* Test against mobile viewports. */
    {
        name: 'Mobile Chrome',
        use: __assign({}, test_1.devices['Pixel 5']),
    },
    {
        name: 'Mobile Safari',
        use: __assign({}, test_1.devices['iPhone 12']),
    },
    /* Test against branded browsers. */
    {
        name: 'Microsoft Edge',
        use: __assign(__assign({}, test_1.devices['Desktop Edge']), { channel: 'msedge' }),
    },
    {
        name: 'Google Chrome',
        use: __assign(__assign({}, test_1.devices['Desktop Chrome']), { channel: 'chrome' }),
    },
];
exports.browsers = (!!process.env.CI || !!process.env.BROWSERSTACK_ACCESS_KEY)
    ? __spreadArray(__spreadArray([], browserStackBrowsers, true), playwrightBrowsers, true) : playwrightBrowsers;
//# sourceMappingURL=browsers.js.map