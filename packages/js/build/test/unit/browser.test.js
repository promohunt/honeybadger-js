"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var browser_1 = __importStar(require("../../src/browser"));
var helpers_1 = require("./helpers");
var jest_fetch_mock_1 = __importDefault(require("jest-fetch-mock"));
describe('browser client', function () {
    var client;
    beforeEach(function () {
        client = browser_1.default.factory({
            logger: (0, helpers_1.nullLogger)()
        });
        // @ts-expect-error - no need to test this in here
        client.__getSourceFileHandler = null;
        jest_fetch_mock_1.default.resetMocks();
    });
    describe('Singleton', function () {
        it('implements the window.onerror plugin', function () {
            browser_1.default.configure();
            expect(browser_1.default.config.enableUncaught).toEqual(true);
        });
        it('implements the breadcrumbs plugin', function () {
            browser_1.default.configure();
            expect(browser_1.default.config.breadcrumbsEnabled).toEqual(true);
        });
    });
    describe('afterNotify', function () {
        beforeEach(function () {
            client.configure({
                apiKey: 'testing',
                environment: 'config environment',
                component: 'config component',
                action: 'config action',
                revision: 'config revision',
                projectRoot: 'config projectRoot'
            });
        });
        it('is called without an error when the request succeeds', function () {
            var id = '48b98609-dd3b-48ee-bffc-d51f309a2dfa';
            var body = JSON.stringify({ id: id });
            jest_fetch_mock_1.default.mockResponseOnce(body, { status: 201 });
            return new Promise(function (resolve) {
                client.afterNotify(function (err, notice) {
                    expect(err).toBeUndefined();
                    expect(notice.message).toEqual('testing');
                    expect(notice.id).toBe(id);
                    resolve();
                });
                client.notify('testing');
            });
        });
        it('is called with an error when the request fails', function () {
            return new Promise(function (resolve) {
                jest_fetch_mock_1.default.mockResponse(JSON.stringify({}), { status: 403 });
                client.afterNotify(function (err, notice) {
                    expect(notice.message).toEqual('testing');
                    expect(err.message).toMatch(/403/);
                    resolve();
                });
                client.notify('testing');
            });
        });
        it('is called without an error when passed as an option and the request succeeds', function () {
            return new Promise(function (resolve) {
                var id = '48b98609-dd3b-48ee-bffc-d51f309a2dfa';
                var body = JSON.stringify({ id: id });
                jest_fetch_mock_1.default.mockResponseOnce(body, { status: 201 });
                var afterNotify = function (err, notice) {
                    expect(err).toBeUndefined();
                    expect(notice.message).toEqual('testing');
                    expect(notice.id).toBe(id);
                    resolve();
                };
                client.notify('testing', { afterNotify: afterNotify });
            });
        });
        it('is called with an error when passed as an option and the request fails', function () {
            return new Promise(function (resolve) {
                var afterNotify = function (err, notice) {
                    expect(notice.message).toEqual('testing');
                    expect(err.message).toMatch(/403/);
                    resolve();
                };
                jest_fetch_mock_1.default.mockResponseOnce(JSON.stringify({}), { status: 403 });
                client.notify('testing', { afterNotify: afterNotify });
            });
        });
    });
    describe('notify', function () {
        it('does not report if notice is empty', function () {
            client.configure({
                apiKey: 'testing'
            });
            var result = client.notify({});
            expect(result).toEqual(false);
        });
        it('excludes cookies by default', function () {
            return __awaiter(this, void 0, void 0, function () {
                var payload;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            client.configure({
                                apiKey: 'testing'
                            });
                            jest_fetch_mock_1.default.mockResponseOnce(JSON.stringify({ id: '1' }), { status: 201 });
                            return [4 /*yield*/, client.notifyAsync('testing')
                                // @ts-expect-error
                            ];
                        case 1:
                            _a.sent();
                            payload = JSON.parse(jest_fetch_mock_1.default.mock.lastCall[1].body);
                            expect(payload.request.cgi_data.HTTP_COOKIE).toBeUndefined();
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('filters cookies string', function () {
            return __awaiter(this, void 0, void 0, function () {
                var payload;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            client.configure({
                                apiKey: 'testing'
                            });
                            jest_fetch_mock_1.default.mockResponseOnce(JSON.stringify({ id: '1' }), { status: 201 });
                            return [4 /*yield*/, client.notifyAsync('testing', {
                                    cookies: 'expected=value; password=secret'
                                })
                                // @ts-expect-error
                            ];
                        case 1:
                            _a.sent();
                            payload = JSON.parse(jest_fetch_mock_1.default.mock.lastCall[1].body);
                            expect(payload.request.cgi_data.HTTP_COOKIE).toEqual('expected=value;password=[FILTERED]');
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('filters cookies object', function () {
            return __awaiter(this, void 0, void 0, function () {
                var payload;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            client.configure({
                                apiKey: 'testing'
                            });
                            jest_fetch_mock_1.default.mockResponseOnce(JSON.stringify({ id: '1' }), { status: 201 });
                            return [4 /*yield*/, client.notifyAsync('testing', { cookies: { expected: 'value', password: 'secret' } })
                                // @ts-expect-error
                            ];
                        case 1:
                            _a.sent();
                            payload = JSON.parse(jest_fetch_mock_1.default.mock.lastCall[1].body);
                            expect(payload.request.cgi_data.HTTP_COOKIE).toEqual('expected=value;password=[FILTERED]');
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('uses the correct notifier name', function () {
            return __awaiter(this, void 0, void 0, function () {
                var payload;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            client.configure({
                                apiKey: 'testing'
                            });
                            jest_fetch_mock_1.default.mockResponseOnce(JSON.stringify({ id: '1' }), { status: 201 });
                            return [4 /*yield*/, client.notifyAsync('testing')
                                // @ts-expect-error
                            ];
                        case 1:
                            _a.sent();
                            payload = JSON.parse(jest_fetch_mock_1.default.mock.lastCall[1].body);
                            expect(payload.notifier.name).toEqual('@honeybadger-io/js');
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
    describe('showUserFeedbackForm', function () {
        beforeEach(function () {
            window['honeybadgerUserFeedbackOptions'] = undefined;
            for (var i = window.document.scripts.length - 1; i >= 0; i--) {
                if (window.document.scripts[i].src.indexOf('https://js.honeybadger.io') > -1) {
                    window.document.scripts[i].parentNode.removeChild(window.document.scripts[i]);
                }
            }
        });
        it('should do nothing if client is not properly initialized', function () {
            client.configure({
                apiKey: undefined
            });
            client.showUserFeedbackForm();
            expect(window['honeybadgerUserFeedbackOptions']).toBeUndefined();
        });
        it('should remember id of last reported notice', function () {
            client.configure({
                apiKey: 'testing'
            });
            var id1 = '48b98609-dd3b-48ee-bffc-d51f309a2dfa';
            var id2 = '48b98609-dd3b-48ee-bffc-d51f309a2dfb';
            jest_fetch_mock_1.default.mockResponses([JSON.stringify({ id: id1 }), { status: 201 }], [JSON.stringify({ id: id2 }), { status: 201 }]);
            return new Promise(function (resolve) {
                client.afterNotify(function (err, notice) {
                    expect(err).toBeUndefined();
                    if (notice.message === 'testing') {
                        expect(notice.id).toBe(id1);
                        // @ts-expect-error __lastNoticeId is private
                        expect(client.__lastNoticeId).toBe(id1);
                    }
                    if (notice.message === 'testing 2') {
                        expect(notice.id).toBe(id2);
                        // @ts-expect-error __lastNoticeId is private
                        expect(client.__lastNoticeId).not.toBe(id1);
                        // @ts-expect-error __lastNoticeId is private
                        expect(client.__lastNoticeId).toBe(id2);
                        resolve();
                    }
                });
                client.notify('testing');
                client.notify('testing 2');
            });
        });
        it('should do nothing if no notice has been reported yet', function () {
            client.configure({
                apiKey: 'testing'
            });
            client.showUserFeedbackForm();
            expect(window['honeybadgerUserFeedbackOptions']).toBeUndefined();
        });
        it('should build a feedback script url only with major.minor version', function () {
            var version = '4.8.1';
            var url = (0, browser_1.getUserFeedbackScriptUrl)(version);
            expect(url).toMatch('/v4.8/');
        });
        it('should add user feedback script tag on document.head', function () {
            var id = '48b98609-dd3b-48ee-bffc-d51f309a2dfa';
            client.configure({
                apiKey: 'testing'
            });
            // @ts-expect-error
            client.__lastNoticeId = id;
            client.showUserFeedbackForm();
            expect(window['honeybadgerUserFeedbackOptions']).toMatchObject({
                noticeId: id
            });
            expect(window.document.head.innerHTML).toMatch("<script src=\"".concat((0, browser_1.getUserFeedbackScriptUrl)(client.getVersion()), "\" async=\"true\"></script>"));
        });
        it('should add user feedback options in window object', function () {
            var id = '48b98609-dd3b-48ee-bffc-d51f309a2dfa';
            client.configure({
                apiKey: 'testing'
            });
            // @ts-expect-error
            client.__lastNoticeId = id;
            var options = {
                labels: { name: 'Your Name ???' },
                buttons: { cancel: 'Stop!' },
                messages: { thanks: 'Your feedback is greatly appreciated!' }
            };
            client.showUserFeedbackForm(options);
            expect(window['honeybadgerUserFeedbackOptions']).toEqual(__assign({ apiKey: client.config.apiKey, endpoint: client.config.userFeedbackEndpoint, noticeId: id }, options));
        });
        it('should not load feedback script more than once', function () {
            var id = '48b98609-dd3b-48ee-bffc-d51f309a2dfa';
            client.configure({
                apiKey: 'testing'
            });
            // @ts-expect-error
            client.__lastNoticeId = id;
            var scriptsCount = window.document.scripts.length;
            client.showUserFeedbackForm();
            expect(window.document.scripts.length).toEqual(scriptsCount + 1);
            client.showUserFeedbackForm();
            expect(window.document.scripts.length).toEqual(scriptsCount + 1);
        });
    });
});
//# sourceMappingURL=browser.test.js.map