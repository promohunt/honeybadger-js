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
var core_1 = require("@honeybadger-io/core");
var os_1 = __importDefault(require("os"));
var nock_1 = __importDefault(require("nock"));
var server_1 = __importDefault(require("../../src/server"));
var helpers_1 = require("./helpers");
describe('server client', function () {
    var client;
    beforeEach(function () {
        client = server_1.default.factory({
            logger: (0, helpers_1.nullLogger)(),
            environment: null,
        });
    });
    afterEach(function () {
        jest.resetAllMocks();
    });
    describe('configuration', function () {
        var CONFIG_FROM_FILE = {
            apiKey: 'testing',
            personalAuthToken: 'p123',
            environment: 'staging',
            developmentEnvironments: ['staging', 'dev', 'local'],
            tags: ['tag-1', 'tag-2'],
            checkins: [
                {
                    projectId: '11111',
                    name: 'a check-in',
                    scheduleType: 'simple',
                    reportPeriod: '1 week',
                    gracePeriod: '5 minutes'
                }
            ]
        };
        it('creates a client with default configuration', function () {
            var client = server_1.default.factory();
            expect(client.config).toMatchObject({
                apiKey: null,
                endpoint: 'https://api.honeybadger.io',
                environment: null,
                projectRoot: process.cwd(),
                hostname: os_1.default.hostname(),
                component: null,
                action: null,
                revision: null,
                reportData: null,
                breadcrumbsEnabled: true,
                maxBreadcrumbs: 40,
                maxObjectDepth: 8,
                logger: console,
                developmentEnvironments: ['dev', 'development', 'test'],
                debug: false,
                tags: null,
                enableUncaught: true,
                enableUnhandledRejection: true,
                reportTimeoutWarning: true,
                timeoutWarningThresholdMs: 50,
                filters: ['creditcard', 'password'],
                __plugins: [],
            });
        });
        it('creates a client with constructor arguments', function () {
            var opts = {
                apiKey: 'testing',
                environment: 'staging',
                developmentEnvironments: ['staging', 'dev', 'local'],
                tags: ['tag-1', 'tag-2']
            };
            var client = server_1.default.factory(opts);
            expect(client.config).toMatchObject(opts);
        });
        it.each(['honeybadger.config.ts', 'honeybadger.config.js'])('creates a client from %p', function (fileName) {
            jest.doMock("../../".concat(fileName), function () { return CONFIG_FROM_FILE; }, { virtual: true });
            var client = server_1.default.factory();
            expect(client.config).toMatchObject(CONFIG_FROM_FILE);
        });
        it('creates a client from both a configuration file and constructor arguments', function () {
            jest.doMock('../../honeybadger.config.js', function () { return CONFIG_FROM_FILE; }, { virtual: true });
            var client = server_1.default.factory({
                apiKey: 'not-testing'
            });
            expect(client.config).toMatchObject(__assign(__assign({}, CONFIG_FROM_FILE), { apiKey: 'not-testing' }));
        });
    });
    it('inherits from base client', function () {
        expect(client).toEqual(expect.any(core_1.Client));
    });
    it('sets the default hostname', function () {
        expect(client.config.hostname).toEqual(expect.any(String));
    });
    it('reports an error over https by default', function () {
        client.configure({
            apiKey: 'testing'
        });
        var request = (0, nock_1.default)('https://api.honeybadger.io')
            .post('/v1/notices/js')
            .reply(201, {
            id: '48b98609-dd3b-48ee-bffc-d51f309a2dfa'
        });
        return new Promise(function (resolve) {
            client.afterNotify(function (_err, _notice) {
                expect(request.isDone()).toBe(true);
                resolve(true);
            });
            client.notify('testing');
        });
    });
    it('reports an error over http when configured', function () {
        client.configure({
            apiKey: 'testing',
            endpoint: 'http://api.honeybadger.io'
        });
        var request = (0, nock_1.default)('http://api.honeybadger.io')
            .post('/v1/notices/js')
            .reply(201, {
            id: '48b98609-dd3b-48ee-bffc-d51f309a2dfa'
        });
        return new Promise(function (resolve) {
            client.afterNotify(function (_err, _notice) {
                expect(request.isDone()).toBe(true);
                resolve(true);
            });
            client.notify('testing');
        });
    });
    it('flags app lines in the backtrace', function () {
        client.configure({
            apiKey: 'testing'
        });
        (0, nock_1.default)('https://api.honeybadger.io')
            .post('/v1/notices/js')
            .reply(201, {
            id: '48b98609-dd3b-48ee-bffc-d51f309a2dfa'
        });
        return new Promise(function (resolve) {
            client.notify('testing', {
                afterNotify: function (err, notice) {
                    expect(err).toBeUndefined();
                    expect(notice.message).toEqual('testing');
                    expect(notice.backtrace[0].file).toMatch('[PROJECT_ROOT]');
                    resolve(true);
                }
            });
        });
    });
    it('combines previous global state when reporting', function () {
        var expectedAssertions = 2; // Safeguard to ensure all handlers are called
        client.addBreadcrumb('global 1');
        client.addBreadcrumb('global 2');
        var req1 = {};
        var req2 = {};
        client.withRequest(req1, function () {
            client.addBreadcrumb('async 1 from request 1');
        });
        client.withRequest(req2, function () {
            client.addBreadcrumb('async 1 from request 2');
            expect(client.__getBreadcrumbs()).toHaveLength(3);
            expect(client.__getBreadcrumbs().map(function (_a) {
                var message = _a.message;
                return message;
            })).toEqual(['global 1', 'global 2', 'async 1 from request 2']);
            expectedAssertions--;
        });
        client.withRequest(req1, function () {
            client.addBreadcrumb('async 2 from request 1');
            expect(client.__getBreadcrumbs()).toHaveLength(4);
            expect(client.__getBreadcrumbs().map(function (_a) {
                var message = _a.message;
                return message;
            })).toEqual(['global 1', 'global 2', 'async 1 from request 1', 'async 2 from request 1']);
            expectedAssertions--;
        });
        client.addBreadcrumb('global 3');
        expect(client.__getBreadcrumbs()).toHaveLength(3);
        expect(client.__getBreadcrumbs().map(function (_a) {
            var message = _a.message;
            return message;
        })).toEqual(['global 1', 'global 2', 'global 3']);
        if (expectedAssertions !== 0) {
            throw new Error("Not all assertions ran. ".concat(expectedAssertions, " assertions did not run."));
        }
    });
    it('uses the correct notifier name', function () {
        expect(client.getNotifier().name).toEqual('@honeybadger-io/js');
    });
    describe('afterNotify', function () {
        beforeEach(function () {
            client.configure({
                apiKey: 'testing'
            });
        });
        it('is called without an error when the request succeeds', function () {
            var id = '48b98609-dd3b-48ee-bffc-d51f309a2dfa';
            (0, nock_1.default)('https://api.honeybadger.io')
                .post('/v1/notices/js')
                .reply(201, {
                id: id
            });
            return new Promise(function (resolve) {
                client.afterNotify(function (err, notice) {
                    expect(err).toBeUndefined();
                    expect(notice.message).toEqual('testing');
                    expect(notice.id).toBe(id);
                    resolve(true);
                });
                client.notify('testing');
            });
        });
        it('is called with an error when the request fails', function () {
            (0, nock_1.default)('https://api.honeybadger.io')
                .post('/v1/notices/js')
                .reply(403);
            return new Promise(function (resolve) {
                client.afterNotify(function (err, notice) {
                    expect(notice.message).toEqual('testing');
                    expect(err.message).toMatch(/403/);
                    resolve(true);
                });
                client.notify('testing');
            });
        });
        it('is called without an error when passed as an option and the request succeeds', function () {
            var id = '48b98609-dd3b-48ee-bffc-d51f309a2dfa';
            (0, nock_1.default)('https://api.honeybadger.io')
                .post('/v1/notices/js')
                .reply(201, {
                id: id
            });
            return new Promise(function (resolve) {
                client.notify('testing', {
                    afterNotify: function (err, notice) {
                        expect(err).toBeUndefined();
                        expect(notice.message).toEqual('testing');
                        expect(notice.id).toBe(id);
                        resolve(true);
                    }
                });
            });
        });
        it('is called with an error when passed as an option and the request fails', function () {
            (0, nock_1.default)('https://api.honeybadger.io')
                .post('/v1/notices/js')
                .reply(403);
            return new Promise(function (resolve) {
                client.notify('testing', {
                    afterNotify: function (err, notice) {
                        expect(notice.message).toEqual('testing');
                        expect(err.message).toMatch(/403/);
                        resolve(true);
                    }
                });
            });
        });
    });
    describe('notifyAsync', function () {
        var _this = this;
        beforeEach(function () {
            client.configure({
                apiKey: 'testing'
            });
        });
        it('resolves after the http request is done', function () { return __awaiter(_this, void 0, void 0, function () {
            var request;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        request = (0, nock_1.default)('https://api.honeybadger.io')
                            .post('/v1/notices/js')
                            .reply(201, {
                            id: '48b98609-dd3b-48ee-bffc-d51f309a2dfa'
                        });
                        return [4 /*yield*/, client.notifyAsync('testing')];
                    case 1:
                        _a.sent();
                        expect(request.isDone()).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
        it('rejects on http error', function () { return __awaiter(_this, void 0, void 0, function () {
            var request;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        request = (0, nock_1.default)('https://api.honeybadger.io')
                            .post('/v1/notices/js')
                            .reply(400);
                        return [4 /*yield*/, expect(client.notifyAsync('testing')).rejects.toThrow(/Bad HTTP response/)];
                    case 1:
                        _a.sent();
                        expect(request.isDone()).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('withRequest', function () {
        beforeEach(function () {
            client.configure({
                apiKey: 'testing'
            });
        });
        // eslint-disable-next-line
        it('captures errors in timers with the right context', function (done) {
            var context, err;
            var errorHandler = function (e) {
                err = e;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                context = client.__getContext();
            };
            client.withRequest({}, function () { return client.setContext({ a: true }); }, errorHandler);
            client.withRequest({}, function () {
                client.setContext({ b: true });
                setTimeout(function () { throw new Error('Oh no'); }, 10);
            }, errorHandler);
            setTimeout(function () {
                expect(err.message).toStrictEqual('Oh no');
                expect(context).toStrictEqual({ b: true });
                done();
            }, 20);
        });
        // eslint-disable-next-line
        it('retrieves context from the same request object', function (done) {
            var request = {};
            client.withRequest(request, function () {
                client.setContext({ request1: true });
            });
            client.withRequest(request, function () {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                expect(client.__getContext()).toStrictEqual({ request1: true });
            });
            client.withRequest(request, function () {
                setTimeout(function () {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    expect(client.__getContext()).toStrictEqual({ request1: true });
                    done();
                }, 200);
            });
        });
    });
    describe('checkIn', function () {
        it('sends a check-in report using a check-in id', function () {
            return __awaiter(this, void 0, void 0, function () {
                var checkInId, request;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            client.configure({
                                apiKey: 'testing',
                                endpoint: 'http://api.honeybadger.io',
                            });
                            checkInId = '123';
                            request = (0, nock_1.default)('http://api.honeybadger.io')
                                .get("/v1/check_in/".concat(checkInId))
                                .reply(201);
                            return [4 /*yield*/, client.checkIn(checkInId)];
                        case 1:
                            _a.sent();
                            expect(request.isDone()).toBe(true);
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('sends a check-in report using a check-in slug', function () {
            return __awaiter(this, void 0, void 0, function () {
                var apiKey, checkInConfig, checkinRequest;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            apiKey = 'testing';
                            checkInConfig = {
                                slug: 'a-simple-check-in',
                                scheduleType: 'simple',
                                reportPeriod: '1 day',
                            };
                            client.configure({
                                apiKey: apiKey,
                                personalAuthToken: 'testingToken',
                                endpoint: 'http://api.honeybadger.io',
                                checkins: [checkInConfig]
                            });
                            checkinRequest = (0, nock_1.default)('http://api.honeybadger.io')
                                .get("/v1/check_in/".concat(apiKey, "/").concat(checkInConfig.slug))
                                .reply(201);
                            return [4 /*yield*/, client.checkIn(checkInConfig.slug)];
                        case 1:
                            _a.sent();
                            expect(checkinRequest.isDone()).toBe(true);
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
    describe('__plugins', function () {
        it('exported singleton includes plugins', function () {
            server_1.default.configure({ apiKey: 'foo' });
            expect(server_1.default.config.__plugins.length).toBe(2);
        });
        it('clients produced via factory don\'t include plugins', function () {
            client.configure({ apiKey: 'foo' });
            expect(client.config.__plugins.length).toBe(0);
        });
        // Integration test with the plugins themselves
        it('uncaughtException and unhandledRejection plugins reload on configure', function () {
            function getListenerCount(type) {
                return process.listeners(type).length;
            }
            server_1.default.configure({ apiKey: 'foo' });
            expect(getListenerCount('uncaughtException')).toBe(1);
            expect(getListenerCount('unhandledRejection')).toBe(1);
            server_1.default.configure({ enableUncaught: false, enableUnhandledRejection: false });
            expect(getListenerCount('uncaughtException')).toBe(0);
            expect(getListenerCount('unhandledRejection')).toBe(0);
        });
    });
});
//# sourceMappingURL=server.test.js.map