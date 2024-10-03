"use strict";
// This file is a modified version of the file from the Playwright BrowserStack Typescript example:
// https://github.com/browserstack/typescript-playwright-browserstack/blob/main/browserstack.config.ts#L41C8-L41C8
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCdpEndpoint = exports.BS_LOCAL_ARGS = exports.bsLocal = void 0;
var cp = __importStar(require("child_process"));
var BrowserStackLocal = __importStar(require("browserstack-local"));
var clientPlaywrightVersion = cp
    .execSync('npx playwright --version')
    .toString()
    .trim()
    .split(' ')[1];
var getGitBranchUsingCommand = function () {
    return cp
        .execSync('git rev-parse --abbrev-ref HEAD')
        .toString();
};
var getBuildLabel = function () {
    var branchName = process.env.GITHUB_REF_NAME;
    if (!branchName) {
        branchName = getGitBranchUsingCommand();
    }
    if (branchName.startsWith('fatal: not a git repository')) {
        branchName = new Date().toDateString();
    }
    return "honeybadger-playwright-browserstack-".concat(branchName);
};
exports.bsLocal = new BrowserStackLocal.Local();
exports.BS_LOCAL_ARGS = {
    key: process.env.BROWSERSTACK_ACCESS_KEY,
};
// BrowserStack Specific Capabilities.
var defaultCapabilities = {
    browser: 'chrome',
    browser_version: 'latest',
    os: 'osx',
    os_version: 'catalina',
    name: 'Honeybadger Integration Tests',
    build: getBuildLabel(),
    'browserstack.username': process.env.BROWSERSTACK_USERNAME,
    'browserstack.accessKey': process.env.BROWSERSTACK_ACCESS_KEY,
    'browserstack.local': true,
    'browserstack.networkLogs': true,
    'browserstack.debug': true,
    'browserstack.console': 'verbose',
    'client.playwrightVersion': clientPlaywrightVersion,
};
function getCdpEndpoint(capabilities) {
    var merged = __assign(__assign({}, defaultCapabilities), capabilities);
    return "wss://cdp.browserstack.com/playwright?caps=".concat(encodeURIComponent(JSON.stringify(merged)));
}
exports.getCdpEndpoint = getCdpEndpoint;
//# sourceMappingURL=browserstack.config.js.map