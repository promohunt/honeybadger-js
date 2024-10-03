"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var test_1 = require("@playwright/test");
var path_1 = require("path");
var setup = function (page) { return __awaiter(void 0, void 0, void 0, function () {
    var hbClient;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, page.goto('/')];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page).toHaveTitle('Integration Sandbox')];
            case 2:
                _a.sent();
                return [4 /*yield*/, page.evaluate('window.Honeybadger')];
            case 3:
                hbClient = _a.sent();
                (0, test_1.expect)(hbClient).toBeDefined();
                (0, test_1.expect)(hbClient.config.apiKey).toEqual('integration_sandbox');
                return [2 /*return*/];
        }
    });
}); };
var triggerException = function (page) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, page.click('button#throw-exception')];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var isRunningOnBrowserStack = function (testInfo) {
    return testInfo.project.name.includes('browserstack');
};
test_1.test.describe('Browser Integration', function () {
    test_1.test.beforeEach(function (_a, testInfo) {
        var page = _a.page;
        return __awaiter(void 0, void 0, void 0, function () {
            var data;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!isRunningOnBrowserStack(testInfo)) return [3 /*break*/, 2];
                        data = {
                            action: 'setSessionName',
                            arguments: { name: testInfo.project.name + ' ' + testInfo.title }
                        };
                        return [4 /*yield*/, page.evaluate(function (_) { }, "browserstack_executor: ".concat(JSON.stringify(data)))];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2: return [4 /*yield*/, setup(page)];
                    case 3:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    test_1.test.afterEach(function (_a, testInfo) {
        var page = _a.page;
        return __awaiter(void 0, void 0, void 0, function () {
            var isPassed, data;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!isRunningOnBrowserStack(testInfo)) return [3 /*break*/, 2];
                        isPassed = testInfo.status === testInfo.expectedStatus;
                        data = {
                            action: 'setSessionStatus',
                            arguments: {
                                status: isPassed ? 'passed' : 'failed',
                                reason: isPassed ? testInfo.title : ("".concat(testInfo.title, "[retry:").concat(testInfo.retry, "] | ") + testInfo.errors.map(function (e) { return e.message; }).join('\n'))
                            }
                        };
                        return [4 /*yield*/, page.evaluate(function (_) { }, "browserstack_executor: ".concat(JSON.stringify(data)))];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    });
    (0, test_1.test)('it logs browser type and version', function (_a) {
        var page = _a.page;
        return __awaiter(void 0, void 0, void 0, function () {
            var context, browser;
            return __generator(this, function (_b) {
                context = page.context();
                browser = context.browser();
                console.log('Running on', browser.browserType().name(), browser.version());
                return [2 /*return*/];
            });
        });
    });
    (0, test_1.test)('it notifies Honeybadger of unhandled exceptions', function (_a) {
        var page = _a.page;
        return __awaiter(void 0, void 0, void 0, function () {
            var notices;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, triggerException(page)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, page.evaluate('results')];
                    case 2:
                        notices = (_b.sent()).notices;
                        (0, test_1.expect)(notices.length).toEqual(1);
                        (0, test_1.expect)(notices[0].error.message).toEqual('unhandled exception with known stack trace');
                        return [2 /*return*/];
                }
            });
        });
    });
    (0, test_1.test)('it notifies Honeybadger manually', function (_a) {
        var page = _a.page;
        return __awaiter(void 0, void 0, void 0, function () {
            var resultHandle, notices;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, page.evaluateHandle(function (_) { return window.Honeybadger.notify('expected message'); })];
                    case 1:
                        resultHandle = _b.sent();
                        return [4 /*yield*/, (0, test_1.expect)(resultHandle.jsonValue()).resolves.toEqual(true)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, resultHandle.dispose()];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, page.evaluate('results')];
                    case 4:
                        notices = (_b.sent()).notices;
                        (0, test_1.expect)(notices.length).toEqual(1);
                        (0, test_1.expect)(notices[0].error.message).toEqual('expected message');
                        return [2 /*return*/];
                }
            });
        });
    });
    (0, test_1.test)('it reports multiple errors in the same process', function (_a) {
        var page = _a.page;
        return __awaiter(void 0, void 0, void 0, function () {
            var resultHandle, resultHandle2, notices;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, page.evaluateHandle(function (_) { return window.Honeybadger.notify('notify 1'); })];
                    case 1:
                        resultHandle = _b.sent();
                        return [4 /*yield*/, (0, test_1.expect)(resultHandle.jsonValue()).resolves.toEqual(true)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, resultHandle.dispose()];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, page.evaluateHandle(function (_) { return window.Honeybadger.notify('notify 2'); })];
                    case 4:
                        resultHandle2 = _b.sent();
                        return [4 /*yield*/, (0, test_1.expect)(resultHandle2.jsonValue()).resolves.toEqual(true)];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, resultHandle2.dispose()];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, triggerException(page)];
                    case 7:
                        _b.sent();
                        return [4 /*yield*/, page.evaluate('results')];
                    case 8:
                        notices = (_b.sent()).notices;
                        (0, test_1.expect)(notices.length).toEqual(3);
                        return [2 /*return*/];
                }
            });
        });
    });
    (0, test_1.test)('it sends console breadcrumbs', function (_a) {
        var page = _a.page;
        return __awaiter(void 0, void 0, void 0, function () {
            var resultHandle, notices;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, page.evaluateHandle(function (_) { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                console.log('expected message');
                                window.Honeybadger.notify('testing');
                                return [2 /*return*/];
                            });
                        }); })];
                    case 1:
                        resultHandle = _b.sent();
                        return [4 /*yield*/, resultHandle.dispose()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, page.evaluate('results')];
                    case 3:
                        notices = (_b.sent()).notices;
                        (0, test_1.expect)(notices.length).toEqual(1);
                        (0, test_1.expect)(notices[0].breadcrumbs.trail.length).toEqual(2);
                        (0, test_1.expect)(notices[0].breadcrumbs.trail[0].message).toEqual('expected message');
                        (0, test_1.expect)(notices[0].breadcrumbs.trail[0].category).toEqual('log');
                        return [2 /*return*/];
                }
            });
        });
    });
    (0, test_1.test)('it sends string value console breadcrumbs when null', function (_a) {
        var page = _a.page;
        return __awaiter(void 0, void 0, void 0, function () {
            var resultHandle, notices;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, page.evaluateHandle(function (_) { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                console.log(null);
                                window.Honeybadger.notify('testing');
                                return [2 /*return*/];
                            });
                        }); })];
                    case 1:
                        resultHandle = _b.sent();
                        return [4 /*yield*/, resultHandle.dispose()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, page.evaluate('results')];
                    case 3:
                        notices = (_b.sent()).notices;
                        (0, test_1.expect)(notices.length).toEqual(1);
                        (0, test_1.expect)(notices[0].breadcrumbs.trail.length).toEqual(2);
                        (0, test_1.expect)(notices[0].breadcrumbs.trail[0].message).toEqual('null');
                        (0, test_1.expect)(notices[0].breadcrumbs.trail[0].category).toEqual('log');
                        return [2 /*return*/];
                }
            });
        });
    });
    (0, test_1.test)('it sends click breadcrumbs', function (_a) {
        var page = _a.page;
        return __awaiter(void 0, void 0, void 0, function () {
            var resultHandle, notices;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, page.evaluateHandle(function (_) { return __awaiter(void 0, void 0, void 0, function () {
                            var button;
                            return __generator(this, function (_a) {
                                button = document.getElementById('normal-button');
                                button.click();
                                window.Honeybadger.notify('testing');
                                return [2 /*return*/];
                            });
                        }); })];
                    case 1:
                        resultHandle = _b.sent();
                        return [4 /*yield*/, resultHandle.dispose()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, page.evaluate('results')];
                    case 3:
                        notices = (_b.sent()).notices;
                        (0, test_1.expect)(notices.length).toEqual(1);
                        (0, test_1.expect)(notices[0].breadcrumbs.trail.length).toEqual(2);
                        (0, test_1.expect)(notices[0].breadcrumbs.trail[0].message).toEqual('button#normal-button');
                        (0, test_1.expect)(notices[0].breadcrumbs.trail[0].category).toEqual('ui.click');
                        (0, test_1.expect)(notices[0].breadcrumbs.trail[0].metadata.selector).toEqual('body > div#buttonDivId > button#normal-button');
                        (0, test_1.expect)(notices[0].breadcrumbs.trail[0].metadata.text).toEqual('normal button');
                        return [2 /*return*/];
                }
            });
        });
    });
    (0, test_1.test)('it sends XHR breadcrumbs for relative paths', function (_a) {
        var page = _a.page;
        return __awaiter(void 0, void 0, void 0, function () {
            var resultHandle, notices;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, page.evaluateHandle(function (_) { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, new Promise(function (resolve, _reject) {
                                        var request = new XMLHttpRequest();
                                        request.open('GET', '/example/path', false);
                                        request.onreadystatechange = function () {
                                            if (request.readyState === 4) {
                                                window.Honeybadger.notify('testing');
                                                resolve();
                                            }
                                        };
                                        request.send(null);
                                    })];
                            });
                        }); })];
                    case 1:
                        resultHandle = _b.sent();
                        return [4 /*yield*/, resultHandle.dispose()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, page.evaluate('results')];
                    case 3:
                        notices = (_b.sent()).notices;
                        (0, test_1.expect)(notices.length).toEqual(1);
                        (0, test_1.expect)(notices[0].breadcrumbs.trail.length).toEqual(2);
                        (0, test_1.expect)(notices[0].breadcrumbs.trail[0].message).toEqual('GET /example/path');
                        (0, test_1.expect)(notices[0].breadcrumbs.trail[0].category).toEqual('request');
                        (0, test_1.expect)(notices[0].breadcrumbs.trail[0].metadata.type).toEqual('xhr');
                        (0, test_1.expect)('message' in notices[0].breadcrumbs.trail[0].metadata).toBe(false);
                        return [2 /*return*/];
                }
            });
        });
    });
    (0, test_1.test)('it sends XHR breadcrumbs for absolute paths', function (_a) {
        var page = _a.page;
        return __awaiter(void 0, void 0, void 0, function () {
            var resultHandle, notices;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, page.evaluateHandle(function (_) { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, new Promise(function (resolve, _reject) {
                                        var request = new XMLHttpRequest();
                                        request.open('GET', 'https://example.com/example/path', true);
                                        request.onreadystatechange = function () {
                                            if (request.readyState === 4) {
                                                window.Honeybadger.notify('testing');
                                                resolve();
                                            }
                                        };
                                        request.send(null);
                                    })];
                            });
                        }); })];
                    case 1:
                        resultHandle = _b.sent();
                        return [4 /*yield*/, resultHandle.dispose()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, page.evaluate('results')];
                    case 3:
                        notices = (_b.sent()).notices;
                        (0, test_1.expect)(notices.length).toEqual(1);
                        (0, test_1.expect)(notices[0].breadcrumbs.trail.length).toEqual(2);
                        (0, test_1.expect)(notices[0].breadcrumbs.trail[0].message).toEqual('GET https://example.com/example/path');
                        (0, test_1.expect)(notices[0].breadcrumbs.trail[0].category).toEqual('request');
                        (0, test_1.expect)(notices[0].breadcrumbs.trail[0].metadata.type).toEqual('xhr');
                        (0, test_1.expect)('message' in notices[0].breadcrumbs.trail[0].metadata).toBe(false);
                        return [2 /*return*/];
                }
            });
        });
    });
    (0, test_1.test)('it sends fetch breadcrumbs', function (_a) {
        var page = _a.page;
        return __awaiter(void 0, void 0, void 0, function () {
            var resultHandle, notices;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, page.evaluateHandle(function (_) { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, fetch('/example/path')
                                        .then(function () {
                                        window.Honeybadger.notify('testing');
                                    })];
                            });
                        }); })];
                    case 1:
                        resultHandle = _b.sent();
                        return [4 /*yield*/, resultHandle.dispose()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, page.evaluate('results')];
                    case 3:
                        notices = (_b.sent()).notices;
                        (0, test_1.expect)(notices.length).toEqual(1);
                        (0, test_1.expect)(notices[0].breadcrumbs.trail.length).toEqual(2);
                        (0, test_1.expect)(notices[0].breadcrumbs.trail[0].message).toEqual('GET /example/path');
                        (0, test_1.expect)(notices[0].breadcrumbs.trail[0].category).toEqual('request');
                        (0, test_1.expect)(notices[0].breadcrumbs.trail[0].metadata.type).toEqual('fetch');
                        (0, test_1.expect)('message' in notices[0].breadcrumbs.trail[0].metadata).toBe(false);
                        return [2 /*return*/];
                }
            });
        });
    });
    (0, test_1.test)('it sends navigation breadcrumbs', function (_a) {
        var page = _a.page;
        return __awaiter(void 0, void 0, void 0, function () {
            var resultHandle, notices;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, page.evaluateHandle(function (_) {
                            window.history.pushState({}, '', 'foo.html');
                            window.Honeybadger.notify('testing');
                        })];
                    case 1:
                        resultHandle = _b.sent();
                        return [4 /*yield*/, resultHandle.dispose()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, page.evaluate('results')];
                    case 3:
                        notices = (_b.sent()).notices;
                        (0, test_1.expect)(notices.length).toEqual(1);
                        (0, test_1.expect)(notices[0].breadcrumbs.trail.length).toEqual(2);
                        (0, test_1.expect)(notices[0].breadcrumbs.trail[0].message).toEqual('Page changed');
                        (0, test_1.expect)(notices[0].breadcrumbs.trail[0].category).toEqual('navigation');
                        (0, test_1.expect)(notices[0].breadcrumbs.trail[0].metadata).toEqual({
                            from: 'http://localhost:3000/',
                            to: 'foo.html'
                        });
                        return [2 /*return*/];
                }
            });
        });
    });
    (0, test_1.test)('it sends notify breadcrumbs', function (_a) {
        var page = _a.page;
        return __awaiter(void 0, void 0, void 0, function () {
            var resultHandle, notices;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, page.evaluateHandle(function (_) { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                window.Honeybadger.notify('expected message', { name: 'expected name', stack: 'expected stack' });
                                return [2 /*return*/];
                            });
                        }); })];
                    case 1:
                        resultHandle = _b.sent();
                        return [4 /*yield*/, resultHandle.dispose()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, page.evaluate('results')];
                    case 3:
                        notices = (_b.sent()).notices;
                        (0, test_1.expect)(notices.length).toEqual(1);
                        (0, test_1.expect)(notices[0].breadcrumbs.trail.length).toEqual(1);
                        (0, test_1.expect)(notices[0].breadcrumbs.trail[0].message).toEqual('Honeybadger Notice');
                        (0, test_1.expect)(notices[0].breadcrumbs.trail[0].category).toEqual('notice');
                        (0, test_1.expect)(notices[0].breadcrumbs.trail[0].metadata).toMatchObject({
                            name: 'expected name',
                            message: 'expected message',
                            stack: 'expected stack'
                        });
                        (0, test_1.expect)(notices[0].breadcrumbs.trail[0].metadata).not.toHaveProperty('context');
                        return [2 /*return*/];
                }
            });
        });
    });
    (0, test_1.test)('it sends window.onerror breadcrumbs', function (_a) {
        var page = _a.page;
        return __awaiter(void 0, void 0, void 0, function () {
            var notices, errorBreadcrumbs, errorStack;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, triggerException(page)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, page.evaluate('results')];
                    case 2:
                        notices = (_b.sent()).notices;
                        (0, test_1.expect)(notices.length).toEqual(1);
                        (0, test_1.expect)(notices[0].error.message).toEqual('unhandled exception with known stack trace');
                        (0, test_1.expect)(Array.isArray(notices[0].breadcrumbs.trail)).toEqual(true);
                        errorBreadcrumbs = notices[0].breadcrumbs.trail.filter(function (c) { return c.category === 'error'; });
                        (0, test_1.expect)(errorBreadcrumbs.length).toEqual(1);
                        (0, test_1.expect)(errorBreadcrumbs[0].message).toMatch('Error');
                        (0, test_1.expect)(errorBreadcrumbs[0].category).toEqual('error');
                        (0, test_1.expect)(errorBreadcrumbs[0].metadata).toMatchObject({
                            message: 'unhandled exception with known stack trace',
                            name: 'Error',
                        });
                        return [4 /*yield*/, page.evaluate('results.error.stack')];
                    case 3:
                        errorStack = _b.sent();
                        (0, test_1.expect)(errorBreadcrumbs[0].metadata.stack).toMatch(errorStack);
                        return [2 /*return*/];
                }
            });
        });
    });
    (0, test_1.test)('it skips onunhandledrejection when already sent', function (_a) {
        var page = _a.page;
        return __awaiter(void 0, void 0, void 0, function () {
            var resultHandle, doesNotSupportUnhandledRejectionListener, resultHandle2, notices;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, page.evaluateHandle(function (_) { return !('onunhandledrejection' in window); })];
                    case 1:
                        resultHandle = _b.sent();
                        return [4 /*yield*/, resultHandle.jsonValue()];
                    case 2:
                        doesNotSupportUnhandledRejectionListener = _b.sent();
                        test_1.test.skip(doesNotSupportUnhandledRejectionListener, 'onunhandledrejection not supported');
                        return [4 /*yield*/, page.evaluateHandle(function (_) { return __awaiter(void 0, void 0, void 0, function () {
                                var promise;
                                return __generator(this, function (_a) {
                                    promise = new Promise(function (_res, _rej) {
                                        throw new Error('unhandled exception');
                                    });
                                    return [2 /*return*/, promise.catch(function (err) { window.Honeybadger.notify(err); })];
                                });
                            }); })];
                    case 3:
                        resultHandle2 = _b.sent();
                        return [4 /*yield*/, resultHandle2.dispose()];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, page.evaluate('results')];
                    case 5:
                        notices = (_b.sent()).notices;
                        (0, test_1.expect)(notices.length).toEqual(1);
                        return [2 /*return*/];
                }
            });
        });
    });
    (0, test_1.test)('it sends window.onunhandledrejection breadcrumbs when rejection is an Error', function (_a, testInfo) {
        var page = _a.page;
        return __awaiter(void 0, void 0, void 0, function () {
            var resultHandle, doesNotSupportUnhandledRejectionListener, handle, notices, errorBreadcrumbs;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, page.evaluateHandle(function (_) { return !('onunhandledrejection' in window); })];
                    case 1:
                        resultHandle = _b.sent();
                        return [4 /*yield*/, resultHandle.jsonValue()];
                    case 2:
                        doesNotSupportUnhandledRejectionListener = _b.sent();
                        test_1.test.skip(doesNotSupportUnhandledRejectionListener || ['browserstack_chrome_83_windows', 'browserstack_edge_83_windows'].includes(testInfo.project.name), 'onunhandledrejection not supported');
                        return [4 /*yield*/, page.evaluateHandle(function (_) {
                                var myPromise = new Promise(function () {
                                    throw new Error('unhandled rejection');
                                });
                                myPromise.then(function () { });
                                return Promise.resolve();
                            })];
                    case 3:
                        handle = _b.sent();
                        return [4 /*yield*/, handle.dispose()];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, page.evaluate('results')];
                    case 5:
                        notices = (_b.sent()).notices;
                        (0, test_1.expect)(notices.length).toEqual(1);
                        (0, test_1.expect)(Array.isArray(notices[0].breadcrumbs.trail)).toEqual(true);
                        errorBreadcrumbs = notices[0].breadcrumbs.trail.filter(function (c) { return c.category === 'error'; });
                        (0, test_1.expect)(errorBreadcrumbs.length).toEqual(1);
                        (0, test_1.expect)(errorBreadcrumbs[0].message).toEqual('window.onunhandledrejection: Error');
                        (0, test_1.expect)(errorBreadcrumbs[0].category).toEqual('error');
                        (0, test_1.expect)(errorBreadcrumbs[0].metadata).toMatchObject({
                            message: 'UnhandledPromiseRejectionWarning: Error: unhandled rejection',
                            name: 'Error',
                        });
                        return [2 /*return*/];
                }
            });
        });
    });
    (0, test_1.test)('it skips window.onunhandledrejection breadcrumbs when rejection is not Error', function (_a) {
        var page = _a.page;
        return __awaiter(void 0, void 0, void 0, function () {
            var resultHandle, doesNotSupportUnhandledRejectionListener, handle, notices, errorBreadcrumbs;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, page.evaluateHandle(function (_) { return !('onunhandledrejection' in window); })];
                    case 1:
                        resultHandle = _b.sent();
                        return [4 /*yield*/, resultHandle.jsonValue()];
                    case 2:
                        doesNotSupportUnhandledRejectionListener = _b.sent();
                        test_1.test.skip(doesNotSupportUnhandledRejectionListener, 'onunhandledrejection not supported');
                        return [4 /*yield*/, page.evaluateHandle(function (_) {
                                var myPromise = new Promise(function (_, reject) {
                                    reject('whatever');
                                });
                                myPromise.then(function () { });
                                return Promise.resolve();
                            })];
                    case 3:
                        handle = _b.sent();
                        return [4 /*yield*/, handle.dispose()];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, page.evaluate('results')];
                    case 5:
                        notices = (_b.sent()).notices;
                        (0, test_1.expect)(notices.length).toEqual(1);
                        (0, test_1.expect)(Array.isArray(notices[0].breadcrumbs.trail)).toEqual(true);
                        errorBreadcrumbs = notices[0].breadcrumbs.trail.filter(function (c) { return c.category === 'error'; });
                        (0, test_1.expect)(errorBreadcrumbs.length).toEqual(0);
                        return [2 /*return*/];
                }
            });
        });
    });
    (0, test_1.test)('it shows user feedback form', function (_a) {
        var page = _a.page;
        return __awaiter(void 0, void 0, void 0, function () {
            var handle, relativePath, notices, noticeId, formHeading;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, page.evaluateHandle(function (_) {
                            // @ts-ignore private access
                            window.Honeybadger.isUserFeedbackScriptUrlAlreadyVisible = function () { return false; };
                            // @ts-ignore private access
                            window.Honeybadger.appendUserFeedbackScriptTag = function () { };
                            window.Honeybadger.afterNotify(function () {
                                window.Honeybadger.showUserFeedbackForm();
                            });
                            window.Honeybadger.notify('an error message');
                        })];
                    case 1:
                        handle = _b.sent();
                        return [4 /*yield*/, handle.dispose()];
                    case 2:
                        _b.sent();
                        relativePath = '../../dist/browser/honeybadger-feedback-form.js';
                        return [4 /*yield*/, page.addScriptTag({
                                path: (0, path_1.resolve)(__dirname, relativePath)
                            })];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, page.waitForSelector('div#honeybadger-feedback')];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, page.evaluate('results')];
                    case 5:
                        notices = (_b.sent()).notices;
                        (0, test_1.expect)(notices.length).toEqual(1);
                        return [4 /*yield*/, page.evaluate('window.honeybadgerUserFeedbackOptions.noticeId')];
                    case 6:
                        noticeId = _b.sent();
                        (0, test_1.expect)(noticeId).toEqual('test');
                        formHeading = page.locator('h2#honeybadger-feedback-heading');
                        return [4 /*yield*/, (0, test_1.expect)(formHeading.textContent()).resolves.toMatch('Care to help us fix this?')];
                    case 7:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    (0, test_1.test)('it shows user feedback form with custom labels', function (_a) {
        var page = _a.page;
        return __awaiter(void 0, void 0, void 0, function () {
            var handle, relativePath, notices, noticeId, formHeading;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, page.evaluateHandle(function (_) {
                            // @ts-ignore private access
                            window.Honeybadger.isUserFeedbackScriptUrlAlreadyVisible = function () { return false; };
                            // @ts-ignore private access
                            window.Honeybadger.appendUserFeedbackScriptTag = function () { };
                            window.Honeybadger.afterNotify(function () {
                                window.Honeybadger.showUserFeedbackForm({
                                    messages: {
                                        heading: 'Help us fix this',
                                    }
                                });
                            });
                            window.Honeybadger.notify('an error message');
                        })];
                    case 1:
                        handle = _b.sent();
                        return [4 /*yield*/, handle.dispose()];
                    case 2:
                        _b.sent();
                        relativePath = '../../dist/browser/honeybadger-feedback-form.js';
                        return [4 /*yield*/, page.addScriptTag({
                                path: (0, path_1.resolve)(__dirname, relativePath)
                            })];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, page.waitForSelector('div#honeybadger-feedback')];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, page.evaluate('results')];
                    case 5:
                        notices = (_b.sent()).notices;
                        (0, test_1.expect)(notices.length).toEqual(1);
                        return [4 /*yield*/, page.evaluate('window.honeybadgerUserFeedbackOptions.noticeId')];
                    case 6:
                        noticeId = _b.sent();
                        (0, test_1.expect)(noticeId).toEqual('test');
                        formHeading = page.locator('h2#honeybadger-feedback-heading');
                        return [4 /*yield*/, (0, test_1.expect)(formHeading.textContent()).resolves.toMatch('Help us fix this')];
                    case 7:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    (0, test_1.test)('it sends user feedback for notice on submit', function (_a) {
        var page = _a.page;
        return __awaiter(void 0, void 0, void 0, function () {
            var handle, relativePath, notices, noticeId, name, email, comment, feedbackSubmitUrl, form, htmlString;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, page.evaluateHandle(function (_) {
                            // @ts-ignore private access
                            window.Honeybadger.isUserFeedbackScriptUrlAlreadyVisible = function () { return false; };
                            // @ts-ignore private access
                            window.Honeybadger.appendUserFeedbackScriptTag = function () { };
                            window.Honeybadger.afterNotify(function () {
                                window.Honeybadger.showUserFeedbackForm();
                            });
                            window.Honeybadger.notify('an error message');
                        })];
                    case 1:
                        handle = _b.sent();
                        return [4 /*yield*/, handle.dispose()];
                    case 2:
                        _b.sent();
                        relativePath = '../../dist/browser/honeybadger-feedback-form.js';
                        return [4 /*yield*/, page.addScriptTag({
                                path: (0, path_1.resolve)(__dirname, relativePath)
                            })];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, page.waitForSelector('div#honeybadger-feedback')];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, page.evaluate('results')];
                    case 5:
                        notices = (_b.sent()).notices;
                        (0, test_1.expect)(notices.length).toEqual(1);
                        return [4 /*yield*/, page.evaluate('window.honeybadgerUserFeedbackOptions.noticeId')];
                    case 6:
                        noticeId = _b.sent();
                        (0, test_1.expect)(noticeId).toEqual('test');
                        name = 'integration test';
                        email = 'integration-test@honeybadger.io';
                        comment = 'ci integration comment';
                        return [4 /*yield*/, page.type('#honeybadger-feedback-name', name)];
                    case 7:
                        _b.sent();
                        return [4 /*yield*/, page.type('#honeybadger-feedback-email', email)];
                    case 8:
                        _b.sent();
                        return [4 /*yield*/, page.type('#honeybadger-feedback-comment', comment)];
                    case 9:
                        _b.sent();
                        return [4 /*yield*/, page.click('#honeybadger-feedback-submit')];
                    case 10:
                        _b.sent();
                        feedbackSubmitUrl = 'https://api.honeybadger.io/v2/feedback' +
                            '?format=js' +
                            '&amp;api_key=integration_sandbox' +
                            '&amp;token=test' +
                            "&amp;name=".concat(encodeURIComponent(name)) +
                            "&amp;email=".concat(encodeURIComponent(email)) +
                            "&amp;comment=".concat(encodeURIComponent(comment));
                        form = page.locator('form#honeybadger-feedback-form');
                        return [4 /*yield*/, form.innerHTML()];
                    case 11:
                        htmlString = _b.sent();
                        (0, test_1.expect)(htmlString).toContain("<script src=\"".concat(feedbackSubmitUrl, "\"></script>"));
                        return [2 /*return*/];
                }
            });
        });
    });
    (0, test_1.test)('it closes user feedback form on cancel', function (_a) {
        var page = _a.page;
        return __awaiter(void 0, void 0, void 0, function () {
            var handle, relativePath, notices, noticeId, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, page.evaluateHandle(function (_) {
                            // @ts-ignore private access
                            window.Honeybadger.isUserFeedbackScriptUrlAlreadyVisible = function () { return false; };
                            // @ts-ignore private access
                            window.Honeybadger.appendUserFeedbackScriptTag = function () { };
                            window.Honeybadger.afterNotify(function () {
                                window.Honeybadger.showUserFeedbackForm();
                            });
                            window.Honeybadger.notify('an error message');
                        })];
                    case 1:
                        handle = _d.sent();
                        return [4 /*yield*/, handle.dispose()];
                    case 2:
                        _d.sent();
                        relativePath = '../../dist/browser/honeybadger-feedback-form.js';
                        return [4 /*yield*/, page.addScriptTag({
                                path: (0, path_1.resolve)(__dirname, relativePath)
                            })];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, page.waitForSelector('div#honeybadger-feedback')];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, page.evaluate('results')];
                    case 5:
                        notices = (_d.sent()).notices;
                        (0, test_1.expect)(notices.length).toEqual(1);
                        return [4 /*yield*/, page.evaluate('window.honeybadgerUserFeedbackOptions.noticeId')];
                    case 6:
                        noticeId = _d.sent();
                        (0, test_1.expect)(noticeId).toEqual('test');
                        _b = test_1.expect;
                        return [4 /*yield*/, page.locator('#honeybadger-feedback-wrapper').count()];
                    case 7:
                        _b.apply(void 0, [_d.sent()]).toEqual(1);
                        return [4 /*yield*/, page.click('#honeybadger-feedback-cancel')];
                    case 8:
                        _d.sent();
                        _c = test_1.expect;
                        return [4 /*yield*/, page.locator('#honeybadger-feedback-wrapper').count()];
                    case 9:
                        _c.apply(void 0, [_d.sent()]).toEqual(0);
                        return [2 /*return*/];
                }
            });
        });
    });
});
test_1.test.describe('Web Worker Integration', function () {
    (0, test_1.test)('it creates worker', function (_a, _testInfo) {
        var page = _a.page;
        return __awaiter(void 0, void 0, void 0, function () {
            var resultHandle, doesNotSupportWorkers, notices;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, page.evaluateHandle(function (_) { return !('Worker' in window); })];
                    case 1:
                        resultHandle = _b.sent();
                        return [4 /*yield*/, resultHandle.jsonValue()];
                    case 2:
                        doesNotSupportWorkers = _b.sent();
                        test_1.test.skip(doesNotSupportWorkers, 'Workers are not supported');
                        return [4 /*yield*/, page.goto('/')];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, (0, test_1.expect)(page).toHaveTitle('Integration Sandbox')];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, page.evaluate(function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, new Promise(function (resolve) {
                                            // create worker with a uri that will be loaded from the local http server (server.js)
                                            // send a message which will trigger the worker to send the notices back to the test
                                            var worker = new Worker('test/e2e/worker.js');
                                            worker.onmessage = function (e) { return resolve(e.data); };
                                            worker.postMessage('');
                                        })];
                                });
                            }); })];
                    case 5:
                        notices = (_b.sent()).notices;
                        (0, test_1.expect)(notices.length).toEqual(1);
                        (0, test_1.expect)(notices[0].breadcrumbs.trail.length).toEqual(1);
                        (0, test_1.expect)(notices[0].breadcrumbs.trail[0].message).toEqual('Honeybadger Notice');
                        (0, test_1.expect)(notices[0].breadcrumbs.trail[0].category).toEqual('notice');
                        (0, test_1.expect)(notices[0].breadcrumbs.trail[0].metadata).toMatchObject({
                            name: 'expected name',
                            message: 'expected message',
                        });
                        (0, test_1.expect)(notices[0].breadcrumbs.trail[0].metadata).not.toHaveProperty('context');
                        return [2 /*return*/];
                }
            });
        });
    });
});
//# sourceMappingURL=integration.spec.js.map