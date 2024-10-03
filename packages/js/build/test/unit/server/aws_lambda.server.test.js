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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var server_1 = __importDefault(require("../../../src/server"));
var helpers_1 = require("../helpers");
var nock_1 = __importDefault(require("nock"));
var sinon_1 = require("sinon");
var mockAwsEvent = function (obj) {
    if (obj === void 0) { obj = {}; }
    return Object.assign({}, obj);
};
var mockAwsContext = function (obj) {
    if (obj === void 0) { obj = {}; }
    return Object.assign({}, obj);
};
var mockAwsResult = function (obj) {
    if (obj === void 0) { obj = {}; }
    return Object.assign({}, obj);
};
var initNock = function (expectedTimes, requestBodyMatcher) {
    if (expectedTimes === void 0) { expectedTimes = 1; }
    nock_1.default.cleanAll();
    return (0, nock_1.default)('https://api.honeybadger.io')
        .post('/v1/notices/js', requestBodyMatcher)
        .times(expectedTimes)
        .reply(201, '{"id":"1a327bf6-e17a-40c1-ad79-404ea1489c7a"}');
};
describe('Lambda Handler', function () {
    var client;
    beforeEach(function () {
        client = server_1.default.factory({
            logger: (0, helpers_1.nullLogger)(),
            environment: null
        });
    });
    describe('with arguments', function () {
        var awsEvent = mockAwsEvent({ body: '1' });
        var awsContext = mockAwsContext({ awsRequestId: '2' });
        var handlerFunc;
        beforeEach(function () {
            handlerFunc = (0, sinon_1.spy)(function () { return Promise.resolve(); });
            var handler = client.lambdaHandler(handlerFunc);
            return handler(awsEvent, awsContext)
                .then(function () {
                return new Promise((function (resolve) {
                    process.nextTick(function () {
                        resolve(true);
                    });
                }));
            });
        });
        it('calls original handler with arguments', function () {
            expect(handlerFunc.lastCall.args.length).toBe(2);
            expect(handlerFunc.lastCall.args[0]).toBe(awsEvent);
            expect(handlerFunc.lastCall.args[1]).toBe(awsContext);
        });
    });
    describe('async handlers', function () {
        it('calls handler with asynchronous response if no error is thrown', function () {
            return __awaiter(this, void 0, void 0, function () {
                var handler, res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            client.configure({
                                apiKey: 'testing'
                            });
                            handler = client.lambdaHandler(function (_event, _context) {
                                return __awaiter(this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, Promise.resolve(mockAwsResult({ body: 'works!' }))];
                                    });
                                });
                            });
                            return [4 /*yield*/, handler(mockAwsEvent(), mockAwsContext())];
                        case 1:
                            res = _a.sent();
                            expect(res).toBeDefined();
                            expect(res.body).toEqual('works!');
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('calls handler with synchronous response if no error is thrown', function () {
            return __awaiter(this, void 0, void 0, function () {
                var handler, res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            client.configure({
                                apiKey: 'testing'
                            });
                            handler = client.lambdaHandler(function (_event, _context) {
                                return __awaiter(this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, mockAwsResult({ body: 'works!' })];
                                    });
                                });
                            });
                            return [4 /*yield*/, handler(mockAwsEvent(), mockAwsContext())];
                        case 1:
                            res = _a.sent();
                            expect(res).toBeDefined();
                            expect(res.body).toEqual('works!');
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('calls sync handler with synchronous response if no error is thrown', function () {
            return __awaiter(this, void 0, void 0, function () {
                var handler, res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            client.configure({
                                apiKey: 'testing'
                            });
                            handler = client.lambdaHandler(function (_event, _context) {
                                return mockAwsResult({ body: 'works!' });
                            });
                            return [4 /*yield*/, handler(mockAwsEvent(), mockAwsContext())];
                        case 1:
                            res = _a.sent();
                            expect(res).toBeDefined();
                            expect(res.body).toEqual('works!');
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('calls handler if notify exits on preconditions', function () {
            return __awaiter(this, void 0, void 0, function () {
                var handler;
                return __generator(this, function (_a) {
                    client.configure({
                        apiKey: null
                    });
                    handler = client.lambdaHandler(function (_event, _context) {
                        return __awaiter(this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                throw new Error('Badgers!');
                            });
                        });
                    });
                    return [2 /*return*/, expect(handler(mockAwsEvent(), mockAwsContext())).rejects.toEqual(new Error('Badgers!'))];
                });
            });
        });
        it('reports errors to Honeybadger', function () {
            return __awaiter(this, void 0, void 0, function () {
                var api, handler, e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            client.configure({
                                apiKey: 'testing'
                            });
                            api = initNock();
                            handler = client.lambdaHandler(function (_event) {
                                return __awaiter(this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        throw new Error('Badgers!');
                                    });
                                });
                            });
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, handler(mockAwsEvent(), mockAwsContext())];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            e_1 = _a.sent();
                            expect(e_1).toEqual(new Error('Badgers!'));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/, new Promise(function (resolve) {
                                setTimeout(function () {
                                    api.done();
                                    resolve();
                                }, 50);
                            })];
                    }
                });
            });
        });
        it('reports async errors to Honeybadger', function () {
            return __awaiter(this, void 0, void 0, function () {
                var api, handler, e_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            client.configure({
                                apiKey: 'testing'
                            });
                            api = initNock();
                            handler = client.lambdaHandler(function (_event) {
                                return __awaiter(this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                                setTimeout(function () {
                                                    reject(new Error('Badgers!'));
                                                }, 0);
                                            })];
                                    });
                                });
                            });
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, handler(mockAwsEvent(), mockAwsContext())];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            e_2 = _a.sent();
                            expect(e_2).toEqual(new Error('Badgers!'));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/, new Promise(function (resolve) {
                                setTimeout(function () {
                                    api.done();
                                    resolve();
                                }, 50);
                            })];
                    }
                });
            });
        });
        it('reports timeout warning to Honeybadger by default', function () {
            return __awaiter(this, void 0, void 0, function () {
                var REMAINING_TIME_MS, TIMEOUT_THRESHOLD_MS, SHOULD_BE_CALLED_AFTER_MS, noticeSentAt, api, handler, handlerCalledAt, handlerResolvedAt;
                return __generator(this, function (_a) {
                    REMAINING_TIME_MS = 200;
                    TIMEOUT_THRESHOLD_MS = 50 // default
                    ;
                    SHOULD_BE_CALLED_AFTER_MS = REMAINING_TIME_MS - TIMEOUT_THRESHOLD_MS;
                    client.configure({
                        apiKey: 'testing',
                    });
                    api = initNock(1, function (body) {
                        noticeSentAt = Date.now();
                        return body.error.message === 'serverlessFunction[v1.0.0] may have timed out';
                    });
                    handler = client.lambdaHandler(function (_event) {
                        return __awaiter(this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, new Promise(function (resolve, _reject) {
                                        setTimeout(function () {
                                            resolve({ body: 'should not resolve', statusCode: 200 });
                                        }, REMAINING_TIME_MS * 2);
                                    })];
                            });
                        });
                    });
                    handlerCalledAt = Date.now();
                    handler(mockAwsEvent(), mockAwsContext({
                        functionName: 'serverlessFunction',
                        functionVersion: 'v1.0.0',
                        getRemainingTimeInMillis: function () { return REMAINING_TIME_MS; }
                    }))
                        .then(function () {
                        handlerResolvedAt = Date.now();
                    });
                    return [2 /*return*/, new Promise(function (resolve) {
                            setTimeout(function () {
                                if (handlerResolvedAt) {
                                    expect(noticeSentAt).toBeLessThan(handlerResolvedAt);
                                }
                                // let a 100ms window because setTimeout cannot guarantee exact execution at specified interval
                                expect(noticeSentAt - handlerCalledAt).toBeLessThan(SHOULD_BE_CALLED_AFTER_MS + 100);
                                api.done();
                                resolve();
                            }, SHOULD_BE_CALLED_AFTER_MS + 150);
                        })];
                });
            });
        });
        it('reports timeout warning to Honeybadger with custom timeout threshold', function () {
            return __awaiter(this, void 0, void 0, function () {
                var REMAINING_TIME_MS, TIMEOUT_THRESHOLD_MS, SHOULD_BE_CALLED_AFTER_MS, noticeSentAt, api, handler, handlerCalledAt, handlerResolvedAt;
                return __generator(this, function (_a) {
                    REMAINING_TIME_MS = 2000;
                    TIMEOUT_THRESHOLD_MS = 1000;
                    SHOULD_BE_CALLED_AFTER_MS = REMAINING_TIME_MS - TIMEOUT_THRESHOLD_MS;
                    client.configure({
                        apiKey: 'testing',
                        timeoutWarningThresholdMs: TIMEOUT_THRESHOLD_MS
                    });
                    api = initNock(1, function (body) {
                        noticeSentAt = Date.now();
                        return body.error.message === 'serverlessFunction[v1.0.0] may have timed out';
                    });
                    handler = client.lambdaHandler(function (_event) {
                        return __awaiter(this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, new Promise(function (resolve, _reject) {
                                        setTimeout(function () {
                                            resolve({ body: 'should not resolve', statusCode: 200 });
                                        }, REMAINING_TIME_MS * 2);
                                    })];
                            });
                        });
                    });
                    handlerCalledAt = Date.now();
                    handler(mockAwsEvent(), mockAwsContext({
                        functionName: 'serverlessFunction',
                        functionVersion: 'v1.0.0',
                        getRemainingTimeInMillis: function () { return REMAINING_TIME_MS; }
                    }))
                        .then(function () {
                        handlerResolvedAt = Date.now();
                    });
                    return [2 /*return*/, new Promise(function (resolve) {
                            setTimeout(function () {
                                if (handlerResolvedAt) {
                                    expect(noticeSentAt).toBeLessThan(handlerResolvedAt);
                                }
                                // let a 100ms window because setTimeout cannot guarantee exact execution at specified interval
                                expect(noticeSentAt - handlerCalledAt).toBeLessThan(SHOULD_BE_CALLED_AFTER_MS + 100);
                                api.done();
                                resolve();
                            }, SHOULD_BE_CALLED_AFTER_MS + 150);
                        })];
                });
            });
        });
        it('does not report timeout warning to Honeybadger', function () {
            return __awaiter(this, void 0, void 0, function () {
                var REMAINING_TIME_MS, HANDLER_RESOLVE_AFTER_MS, api, handler, handlerCalledAt, result, handlerResolvedAt;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            REMAINING_TIME_MS = 100;
                            HANDLER_RESOLVE_AFTER_MS = 200;
                            client.configure({
                                apiKey: 'testing',
                                reportTimeoutWarning: false
                            });
                            api = initNock();
                            handler = client.lambdaHandler(function (_event) {
                                return __awaiter(this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, new Promise(function (resolve, _reject) {
                                                setTimeout(function () {
                                                    resolve({ body: 'should resolve', statusCode: 200 });
                                                }, HANDLER_RESOLVE_AFTER_MS);
                                            })];
                                    });
                                });
                            });
                            handlerCalledAt = Date.now();
                            return [4 /*yield*/, handler(mockAwsEvent(), mockAwsContext({
                                    functionName: 'serverlessFunction',
                                    functionVersion: 'v1.0.0',
                                    getRemainingTimeInMillis: function () { return REMAINING_TIME_MS; }
                                }))];
                        case 1:
                            result = _a.sent();
                            handlerResolvedAt = Date.now();
                            expect(result.statusCode).toEqual(200);
                            expect(handlerResolvedAt - handlerCalledAt).toBeLessThan(HANDLER_RESOLVE_AFTER_MS + 50);
                            expect(api.isDone()).toBe(false);
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('does not report timeout warning if function resolves', function () {
            return __awaiter(this, void 0, void 0, function () {
                var REMAINING_TIME_MS, TIMEOUT_THRESHOLD_MS, SHOULD_BE_CALLED_AFTER_MS, noticeSentAt, api, handler, handlerCalledAt, handlerResolvedAt;
                return __generator(this, function (_a) {
                    REMAINING_TIME_MS = 200;
                    TIMEOUT_THRESHOLD_MS = 50 // default
                    ;
                    SHOULD_BE_CALLED_AFTER_MS = REMAINING_TIME_MS - TIMEOUT_THRESHOLD_MS;
                    client.configure({
                        apiKey: 'testing',
                    });
                    api = initNock(1, function (body) {
                        noticeSentAt = Date.now();
                        return body.error.message === 'serverlessFunction[v1.0.0] may have timed out';
                    });
                    handler = client.lambdaHandler(function (_event) {
                        return __awaiter(this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, new Promise(function (resolve, _reject) {
                                        setTimeout(function () {
                                            resolve({ body: 'should resolve', statusCode: 200 });
                                        }, REMAINING_TIME_MS / 2);
                                    })];
                            });
                        });
                    });
                    handlerCalledAt = Date.now();
                    handler(mockAwsEvent(), mockAwsContext({
                        functionName: 'serverlessFunction',
                        functionVersion: 'v1.0.0',
                        getRemainingTimeInMillis: function () { return REMAINING_TIME_MS; }
                    }))
                        .then(function () {
                        handlerResolvedAt = Date.now();
                    });
                    return [2 /*return*/, new Promise(function (resolve) {
                            setTimeout(function () {
                                expect(handlerResolvedAt).toBeGreaterThan(handlerCalledAt);
                                expect(noticeSentAt).toBeUndefined();
                                expect(api.isDone()).toEqual(false);
                                resolve();
                            }, SHOULD_BE_CALLED_AFTER_MS + 150);
                        })];
                });
            });
        });
    });
    describe('non-async handlers', function () {
        beforeEach(function () {
            client.configure({
                apiKey: 'testing'
            });
        });
        it('calls handler if no error is thrown', function () {
            return new Promise(function (done) {
                var handler = client.lambdaHandler(function (_event, _context, callback) {
                    callback(null, mockAwsResult({ body: 'works!' }));
                });
                handler(mockAwsEvent(), mockAwsContext(), function (err, res) {
                    expect(res).toBeDefined();
                    expect(res.body).toEqual('works!');
                    done(err);
                });
            });
        });
        it('calls handler if notify exits on preconditions', function () {
            return new Promise(function (done) {
                client.configure({
                    apiKey: null
                });
                var handler = client.lambdaHandler(function (_event, _context, _callback) {
                    throw new Error('Badgers!');
                });
                handler(mockAwsEvent(), mockAwsContext(), function (err, _res) {
                    expect(err).toEqual(new Error('Badgers!'));
                    done(null);
                });
            });
        });
        it('reports errors to Honeybadger', function () {
            var api = initNock();
            var handler = client.lambdaHandler(function (_event, _context, _callback) {
                throw new Error('Badgers!');
            });
            return new Promise(function (done) {
                handler(mockAwsEvent(), mockAwsContext(), function (err, _res) {
                    expect(err).toEqual(new Error('Badgers!'));
                    setTimeout(function () {
                        api.done();
                        done(null);
                    }, 50);
                });
            });
        });
        it('reports async errors to Honeybadger', function () {
            var api = initNock();
            var handler = client.lambdaHandler(function (_event, _context, callback) {
                setTimeout(function () {
                    callback(new Error('Badgers!'));
                }, 0);
            });
            return new Promise(function (done) {
                handler(mockAwsEvent(), mockAwsContext(), function (err, _res) {
                    expect(err).toEqual(new Error('Badgers!'));
                    setTimeout(function () {
                        api.done();
                        done(null);
                    }, 50);
                });
            });
        });
        it('calls beforeNotify and afterNotify handlers', function () {
            var api = initNock();
            var handler = client.lambdaHandler(function (_event, _context, callback) {
                setTimeout(function () {
                    callback(new Error('Badgers!'));
                }, 0);
            });
            client.beforeNotify(function (notice) {
                notice.context = Object.assign(notice.context, { foo: 'bar' });
            });
            var afterNotifyCalled = false;
            client.afterNotify(function (err, notice) {
                expect(notice.context).toEqual({ foo: 'bar' });
                afterNotifyCalled = true;
            });
            return new Promise(function (done) {
                handler(mockAwsEvent(), mockAwsContext(), function (err, _res) {
                    expect(err).toEqual(new Error('Badgers!'));
                    setTimeout(function () {
                        api.done();
                        expect(afterNotifyCalled).toBeTruthy();
                        done(null);
                    }, 50);
                });
            });
        });
        it('reports timeout warning to Honeybadger', function () {
            return __awaiter(this, void 0, void 0, function () {
                var REMAINING_TIME_MS, TIMEOUT_THRESHOLD_MS, SHOULD_BE_CALLED_AFTER_MS, noticeSentAt, api, handler;
                return __generator(this, function (_a) {
                    REMAINING_TIME_MS = 200;
                    TIMEOUT_THRESHOLD_MS = 50 // default
                    ;
                    SHOULD_BE_CALLED_AFTER_MS = REMAINING_TIME_MS - TIMEOUT_THRESHOLD_MS;
                    api = initNock(1, function (body) {
                        noticeSentAt = Date.now();
                        return body.error.message === 'serverlessFunction[v1.0.0] may have timed out';
                    });
                    handler = client.lambdaHandler(function (_event, _context, callback) {
                        setTimeout(function () {
                            callback(null, { body: 'should not resolve', statusCode: 200 });
                        }, REMAINING_TIME_MS * 2);
                    });
                    return [2 /*return*/, new Promise(function (resolve) {
                            var handlerCalledAt = Date.now();
                            var handlerResolvedAt;
                            handler(mockAwsEvent(), mockAwsContext(mockAwsContext({
                                functionName: 'serverlessFunction',
                                functionVersion: 'v1.0.0',
                                getRemainingTimeInMillis: function () { return REMAINING_TIME_MS; }
                            })), function (_err, _res) {
                                handlerResolvedAt = Date.now();
                            });
                            setTimeout(function () {
                                if (handlerResolvedAt) {
                                    expect(noticeSentAt).toBeLessThan(handlerResolvedAt);
                                }
                                // let a 100ms window because setTimeout cannot guarantee exact execution at specified interval
                                expect(noticeSentAt - handlerCalledAt).toBeLessThan(SHOULD_BE_CALLED_AFTER_MS + 100);
                                api.done();
                                resolve();
                            }, SHOULD_BE_CALLED_AFTER_MS + 150);
                        })];
                });
            });
        });
        it('reports timeout warning to Honeybadger with custom timeout threshold', function () {
            return __awaiter(this, void 0, void 0, function () {
                var REMAINING_TIME_MS, TIMEOUT_THRESHOLD_MS, SHOULD_BE_CALLED_AFTER_MS, noticeSentAt, api, handler;
                return __generator(this, function (_a) {
                    REMAINING_TIME_MS = 2000;
                    TIMEOUT_THRESHOLD_MS = 1000 // default
                    ;
                    SHOULD_BE_CALLED_AFTER_MS = REMAINING_TIME_MS - TIMEOUT_THRESHOLD_MS;
                    client.configure({
                        timeoutWarningThresholdMs: TIMEOUT_THRESHOLD_MS
                    });
                    api = initNock(1, function (body) {
                        noticeSentAt = Date.now();
                        return body.error.message === 'serverlessFunction[v1.0.0] may have timed out';
                    });
                    handler = client.lambdaHandler(function (_event, _context, callback) {
                        setTimeout(function () {
                            callback(null, { body: 'should not resolve', statusCode: 200 });
                        }, REMAINING_TIME_MS * 2);
                    });
                    return [2 /*return*/, new Promise(function (resolve) {
                            var handlerCalledAt = Date.now();
                            var handlerResolvedAt;
                            handler(mockAwsEvent(), mockAwsContext(mockAwsContext({
                                functionName: 'serverlessFunction',
                                functionVersion: 'v1.0.0',
                                getRemainingTimeInMillis: function () { return REMAINING_TIME_MS; }
                            })), function (_err, _res) {
                                handlerResolvedAt = Date.now();
                            });
                            setTimeout(function () {
                                if (handlerResolvedAt) {
                                    expect(noticeSentAt).toBeLessThan(handlerResolvedAt);
                                }
                                // let a 100ms window because setTimeout cannot guarantee exact execution at specified interval
                                expect(noticeSentAt - handlerCalledAt).toBeLessThan(SHOULD_BE_CALLED_AFTER_MS + 100);
                                api.done();
                                resolve();
                            }, SHOULD_BE_CALLED_AFTER_MS + 150);
                        })];
                });
            });
        });
        it('does not report timeout warning to Honeybadger', function () {
            return __awaiter(this, void 0, void 0, function () {
                var REMAINING_TIME_MS, HANDLER_RESOLVE_AFTER_MS, api, handler;
                return __generator(this, function (_a) {
                    REMAINING_TIME_MS = 100;
                    HANDLER_RESOLVE_AFTER_MS = 200;
                    client.configure({
                        reportTimeoutWarning: false
                    });
                    api = initNock();
                    handler = client.lambdaHandler(function (_event, _context, callback) {
                        setTimeout(function () {
                            callback(null, { body: 'should resolve', statusCode: 200 });
                        }, HANDLER_RESOLVE_AFTER_MS);
                    });
                    return [2 /*return*/, new Promise(function (resolve) {
                            var handlerCalledAt = Date.now();
                            handler(mockAwsEvent(), mockAwsContext({
                                functionName: 'serverlessFunction',
                                functionVersion: 'v1.0.0',
                                getRemainingTimeInMillis: function () { return REMAINING_TIME_MS; }
                            }), function (err, result) {
                                var handlerResolvedAt = Date.now();
                                expect(err).toBeNull();
                                expect(result.statusCode).toEqual(200);
                                expect(handlerResolvedAt - handlerCalledAt).toBeLessThan(HANDLER_RESOLVE_AFTER_MS + 50);
                                expect(api.isDone()).toBe(false);
                                resolve();
                            });
                        })];
                });
            });
        });
        it('does not report timeout warning if function resolves', function () {
            return __awaiter(this, void 0, void 0, function () {
                var REMAINING_TIME_MS, TIMEOUT_THRESHOLD_MS, SHOULD_BE_CALLED_AFTER_MS, noticeSentAt, api, handler;
                return __generator(this, function (_a) {
                    REMAINING_TIME_MS = 200;
                    TIMEOUT_THRESHOLD_MS = 50 // default
                    ;
                    SHOULD_BE_CALLED_AFTER_MS = REMAINING_TIME_MS - TIMEOUT_THRESHOLD_MS;
                    api = initNock(1, function (body) {
                        noticeSentAt = Date.now();
                        return body.error.message === 'serverlessFunction[v1.0.0] may have timed out';
                    });
                    handler = client.lambdaHandler(function (_event, _context, callback) {
                        setTimeout(function () {
                            callback(null, { body: 'should resolve', statusCode: 200 });
                        }, REMAINING_TIME_MS / 2);
                    });
                    return [2 /*return*/, new Promise(function (resolve) {
                            var handlerCalledAt = Date.now();
                            var handlerResolvedAt;
                            handler(mockAwsEvent(), mockAwsContext(mockAwsContext({
                                functionName: 'serverlessFunction',
                                functionVersion: 'v1.0.0',
                                getRemainingTimeInMillis: function () { return REMAINING_TIME_MS; }
                            })), function (_err, _res) {
                                handlerResolvedAt = Date.now();
                            });
                            setTimeout(function () {
                                expect(handlerResolvedAt).toBeGreaterThan(handlerCalledAt);
                                expect(noticeSentAt).toBeUndefined();
                                expect(api.isDone()).toEqual(false);
                                resolve();
                            }, SHOULD_BE_CALLED_AFTER_MS + 150);
                        })];
                });
            });
        });
    });
});
//# sourceMappingURL=aws_lambda.server.test.js.map