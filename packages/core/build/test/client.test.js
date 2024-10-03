"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
Object.defineProperty(exports, "__esModule", { value: true });
var stackTraceParser = __importStar(require("stacktrace-parser"));
var helpers_1 = require("./helpers");
var util_1 = require("../src/util");
var throttled_events_logger_1 = require("../src/throttled_events_logger");
var MyError = /** @class */ (function (_super) {
    __extends(MyError, _super);
    function MyError(m) {
        var _this = _super.call(this, m) || this;
        _this.context = null;
        _this.component = null;
        return _this;
    }
    MyError.prototype.sayHello = function () {
        return 'hello ' + this.message;
    };
    return MyError;
}(Error));
describe('client', function () {
    var client;
    beforeEach(function () {
        client = new helpers_1.TestClient({
            logger: (0, helpers_1.nullLogger)(),
            environment: null,
            projectRoot: process.cwd()
        }, new helpers_1.TestTransport());
        client.configure();
    });
    describe('getVersion', function () {
        it('returns the current version', function () {
            expect(client.getVersion()).toEqual('__VERSION__');
        });
    });
    describe('configure', function () {
        it('configures client and doesn\'t overwrite existing options', function () {
            expect(client.configure).toEqual(expect.any(Function));
            client.configure({ apiKey: 'expected' });
            client.configure({ reportData: true });
            expect(client.config.apiKey).toEqual('expected');
            expect(client.config.reportData).toEqual(true);
        });
        it('loads plugins', function () {
            jest.spyOn(client, 'loadPlugins');
            client.configure();
            expect(client.loadPlugins).toHaveBeenCalledTimes(1);
        });
        it('is chainable', function () {
            expect(client.configure({})).toEqual(client);
        });
        it('configures event logger from base config', function () {
            client.configure({
                apiKey: 'testing',
            });
            // @ts-ignore
            expect(client.__eventsLogger).toBeInstanceOf(throttled_events_logger_1.ThrottledEventsLogger);
            // @ts-ignore
            expect(client.__eventsLogger.config.apiKey).toEqual(client.config.apiKey);
        });
    });
    describe('loadPlugins', function () {
        it('does nothing if there are no plugins', function () {
            client.loadPlugins();
            expect(client.getPluginsLoaded()).toEqual(true);
        });
        it('loads all plugins once and reloads as needed', function () {
            var plugin1 = { load: jest.fn() };
            var plugin2 = { load: jest.fn(), shouldReloadOnConfigure: false };
            var plugin3 = { load: jest.fn(), shouldReloadOnConfigure: true };
            var clientWithPlugins = new helpers_1.TestClient({
                logger: (0, helpers_1.nullLogger)(),
                __plugins: [plugin1, plugin2, plugin3],
            }, new helpers_1.TestTransport());
            clientWithPlugins.configure();
            expect(plugin1.load).toHaveBeenCalledTimes(1);
            expect(plugin2.load).toHaveBeenCalledTimes(1);
            expect(plugin3.load).toHaveBeenCalledTimes(1);
            expect(client.getPluginsLoaded()).toEqual(true);
            // Only re-loads if shouldReloadOnConfigure is true
            clientWithPlugins.configure();
            expect(plugin1.load).toHaveBeenCalledTimes(1);
            expect(plugin2.load).toHaveBeenCalledTimes(1);
            expect(plugin3.load).toHaveBeenCalledTimes(2);
        });
    });
    it('has a context object', function () {
        expect(client.__getContext()).toEqual({});
    });
    describe('setContext', function () {
        it('merges existing context', function () {
            client.setContext({
                user_id: '1'
            }).setContext({
                foo: 'bar'
            });
            expect(client.__getContext()).toEqual({ user_id: '1', foo: 'bar' });
        });
        it('is chainable', function () {
            expect(client.setContext({
                user_id: 1
            })).toBe(client);
        });
        it('does not accept non-objects', function () {
            client.setContext('foo');
            expect(client.__getContext()).toEqual({});
        });
        it('keeps previous context when called with non-object', function () {
            client.setContext({
                foo: 'bar'
            }).setContext(false);
            expect(client.__getContext()).toEqual({
                foo: 'bar'
            });
        });
    });
    describe('clear', function () {
        it('clears the context and breadcrumbs', function () {
            client.addBreadcrumb('expected message');
            client.setContext({
                user_id: '1'
            });
            expect(client.__getContext()).not.toEqual({});
            expect(client.__getBreadcrumbs()).not.toEqual([]);
            client.clear();
            expect(client.__getContext()).toEqual({});
            expect(client.__getBreadcrumbs()).toEqual([]);
        });
    });
    describe('resetContext', function () {
        it('empties the context with no arguments', function () {
            client.setContext({
                user_id: '1'
            }).resetContext();
            expect(client.__getContext()).toEqual({});
        });
        it('replaces the context with arguments', function () {
            client.setContext({
                user_id: '1'
            }).resetContext({
                foo: 'bar'
            });
            expect(client.__getContext()).toEqual({
                foo: 'bar'
            });
        });
        it('empties the context with non-object argument', function () {
            client.setContext({
                foo: 'bar'
            }).resetContext('foo');
            expect(client.__getContext()).toEqual({});
        });
        it('is chainable', function () {
            expect(client.resetContext()).toBe(client);
        });
    });
    it('responds to notify', function () {
        expect(client.notify).toEqual(expect.any(Function));
    });
    describe('notify', function () {
        it('sends the notice when configured', function () {
            client.configure({
                apiKey: 'testing'
            });
            expect(client.notify(new Error('test'))).toEqual(true);
        });
        it('doesn\'t send the notice when not configured', function () {
            expect(client.notify(new Error('test'))).toEqual(false);
        });
        it('doesn\'t send the notice when in a development environment', function () {
            client.configure({
                apiKey: 'testing',
                environment: 'development'
            });
            expect(client.notify(new Error('test'))).toEqual(false);
        });
        it('doesn\'t send the notice when reportData is false', function () {
            client.configure({
                apiKey: 'testing',
                reportData: false
            });
            expect(client.notify(new Error('test'))).toEqual(false);
        });
        it('does send the notice from a development environment when reportData is true', function () {
            client.configure({
                apiKey: 'testing',
                environment: 'development',
                reportData: true
            });
            expect(client.notify(new Error('test'))).toEqual(true);
        });
        it('does not send notice without arguments', function () {
            client.configure({
                apiKey: 'testing'
            });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            expect(client.notify()).toEqual(false);
            expect(client.notify(null)).toEqual(false);
            expect(client.notify(null, {})).toEqual(false);
            expect(client.notify({})).toEqual(false);
        });
        it('accepts options as first argument', function () {
            client.configure({
                apiKey: 'testing'
            });
            var payload = client.getPayload({
                message: 'expected message'
            });
            expect(payload.error.message).toEqual('expected message');
        });
        it('accepts name as second argument', function () {
            client.configure({
                apiKey: 'testing'
            });
            var payload = client.getPayload(new Error('expected message'), 'expected name');
            expect(payload.error.message).toEqual('expected message');
            expect(payload.error.class).toEqual('expected name');
        });
        it('accepts options as second argument', function () {
            client.configure({
                apiKey: 'testing'
            });
            var payload = client.getPayload(new Error('original message'), {
                message: 'expected message'
            });
            expect(payload.error.message).toEqual('expected message');
        });
        it('accepts options as third argument', function () {
            client.configure({
                apiKey: 'testing'
            });
            var payload = client.getPayload(new Error('original message'), 'expected name', {
                message: 'expected message'
            });
            expect(payload.error.class).toEqual('expected name');
            expect(payload.error.message).toEqual('expected message');
        });
        // TODO: test pass through of all request data?
        it('sends params', function () {
            client.configure({
                apiKey: 'testing'
            });
            var payload = client.getPayload('testing', {
                params: {
                    foo: 'bar'
                }
            });
            expect(payload.request.params.foo).toEqual('bar');
        });
        it('reads default properties from error objects', function () {
            client.configure({
                apiKey: 'testing'
            });
            var payload;
            try {
                throw new Error('Test message');
            }
            catch (e) {
                payload = client.getPayload(e);
            }
            expect(payload.error.class).toEqual('Error');
            expect(payload.error.message).toEqual('Test message');
            expect(payload.error.backtrace.length).toBeGreaterThan(0);
        });
        it('reads metadata from error objects', function () {
            client.configure({
                apiKey: 'testing'
            });
            var err = new MyError('Testing');
            err.component = 'expected component';
            var payload = client.getPayload(err);
            expect(payload.request.component).toEqual('expected component');
        });
        it('merges context from error objects', function () {
            client.configure({
                apiKey: 'testing'
            });
            var err = new MyError('Testing');
            err.context = {
                foo: 'foo'
            };
            var payload = client.getPayload(err, { context: { bar: 'bar' } });
            expect(payload.request.context).toEqual({ foo: 'foo', bar: 'bar' });
        });
        it('properly handles Error-prototype objects', function () {
            client.configure({
                apiKey: 'testing'
            });
            var error = {};
            Object.setPrototypeOf(error, new TypeError('Some error message'));
            expect(client.notify(error)).toEqual(true);
            var payload = client.getPayload(error);
            expect(payload.error.class).toEqual('TypeError');
            expect(payload.error.message).toEqual('Some error message');
            // @ts-ignore
            expect(payload.error.backtrace.length).toBeGreaterThan(0);
        });
        it('sends details', function () {
            client.configure({
                apiKey: 'testing'
            });
            var details = {
                'Expected Section Name': {
                    'Expected Key': 'Expected Value'
                }
            };
            var payload = client.getPayload('testing', { details: details });
            expect(payload.details).toEqual(details);
        });
    });
    describe('backtrace', function () {
        it('uses the passed-in backtrace if there is one', function () {
            client.configure({
                apiKey: 'testing'
            });
            var payload = client.getPayload({
                name: 'TestError',
                message: 'I have a custom backtrace',
                backtrace: [{
                        file: 'foo.js',
                        method: 'doStuff',
                        number: 3,
                        column: 23,
                    }]
            });
            expect(payload.error.backtrace.length).toBe(1);
            expect(payload.error.backtrace[0].file).toBe('foo.js');
        });
        it('generates a backtrace when existing one is not an array or empty', function () {
            client.configure({
                apiKey: 'testing'
            });
            var stringBacktracePayload = client.getPayload({
                name: 'TestError',
                message: 'I have a custom backtrace',
                // @ts-expect-error
                backtrace: 'oops this should not be a string',
            });
            var emptyBacktracePayload = client.getPayload({
                name: 'TestError',
                message: 'I have a custom backtrace',
                backtrace: [],
            });
            expect(stringBacktracePayload.error.backtrace[0].file).toMatch('client.test.ts');
            expect(emptyBacktracePayload.error.backtrace[0].file).toMatch('client.test.ts');
        });
        it('generates a backtrace when there isn\'t one', function () {
            client.configure({
                apiKey: 'testing'
            });
            var payload = client.getPayload('expected message');
            expect(payload.error.message).toEqual('expected message');
            expect((payload.error.backtrace).length).toBeGreaterThan(0);
            expect(payload.error.backtrace[0].file).toMatch('client.test.ts');
        });
        it('returns an empty array when no stack is undefined', function () {
            var backtrace = (0, util_1.makeBacktrace)(undefined);
            expect(backtrace).toEqual([]);
        });
        it('filters out top frames that come from @honeybadger-io (nodejs)', function () {
            var error = new Error('ENOENT: no such file or directory, open \'\'/tmp/file-123456\'\'');
            error.stack = "Error: ENOENT: no such file or directory, open ''/tmp/file-67efc3cb2da4'' \n            at generateStackTrace (/var/www/somebody/node_modules/@honeybadger-io/js/dist/server/honeybadger.js:563:15)\n            at Honeybadger.Client.makeNotice (/var/www/somebody/node_modules/@honeybadger-io/js/dist/server/honeybadger.js:985:60)\n            at Honeybadger.Client.notify (/var/www/somebody/node_modules/@honeybadger-io/js/dist/server/honeybadger.js:827:27)\n            at /var/www/somebody/node_modules/@honeybadger-io/js/dist/server/honeybadger.js:946:19\n            at new Promise (<anonymous>)\n            at Honeybadger.Client.notifyAsync (/var/www/somebody/node_modules/@honeybadger-io/js/dist/server/honeybadger.js:914:16)\n            at HoneybadgerTransport.log (/var/www/somebody/node_modules/@somebody/logger/HoneybadgerTransport.js:18:19)\n            at HoneybadgerTransport._write (/var/www/somebody/node_modules/winston-transport/index.js:82:19)\n            at doWrite (/var/www/somebody/node_modules/winston-transport/node_modules/readable-stream/lib/_stream_writable.js:409:139)\n            at writeOrBuffer (/var/www/somebody/node_modules/winston-transport/node_modules/readable-stream/lib/_stream_writable.js:398:5)\n            at HoneybadgerTransport.Writable.write (/var/www/somebody/node_modules/winston-transport/node_modules/readable-stream/lib/_stream_writable.js:307:11)\n            at DerivedLogger.ondata (/var/www/somebody/node_modules/winston/node_modules/readable-stream/lib/_stream_readable.js:681:20)\n            at DerivedLogger.emit (node:events:525:35)\n            at DerivedLogger.emit (node:domain:489:12)\n            at addChunk (/var/www/somebody/node_modules/winston/node_modules/readable-stream/lib/_stream_readable.js:298:12)\n            at readableAddChunk (/var/www/somebody/node_modules/winston/node_modules/readable-stream/lib/_stream_readable.js:280:11)\n            at DerivedLogger.Readable.push (/var/www/somebody/node_modules/winston/node_modules/readable-stream/lib/_stream_readable.js:241:10)\n            at DerivedLogger.Transform.push (/var/www/somebody/node_modules/winston/node_modules/readable-stream/lib/_stream_transform.js:139:32)\n            at DerivedLogger._transform (/var/www/somebody/node_modules/winston/lib/winston/logger.js:313:12)\n            at DerivedLogger.Transform._read (/var/www/somebody/node_modules/winston/node_modules/readable-stream/lib/_stream_transform.js:177:10)\n            at DerivedLogger.Transform._write (/var/www/somebody/node_modules/winston/node_modules/readable-stream/lib/_stream_transform.js:164:83)\n            at doWrite (/var/www/somebody/node_modules/winston/node_modules/readable-stream/lib/_stream_writable.js:409:139)\n            at writeOrBuffer (/var/www/somebody/node_modules/winston/node_modules/readable-stream/lib/_stream_writable.js:398:5)\n            at DerivedLogger.Writable.write (/var/www/somebody/node_modules/winston/node_modules/readable-stream/lib/_stream_writable.js:307:11)\n            at DerivedLogger.log (/var/www/somebody/node_modules/winston/lib/winston/logger.js:252:14)\n            at DerivedLogger.<computed> [as error] (/var/www/somebody/node_modules/winston/lib/winston/create-logger.js:95:19)\n            at console.hideMe [as error] (/var/www/somebody/node_modules/@somebody/logger/index.js:83:45)\n            at Function.logerror (/var/www/somebody/node_modules/express/lib/application.js:647:43)";
            var backtrace = (0, util_1.makeBacktrace)(error.stack, true);
            expect(backtrace[0]).toEqual({
                file: '/var/www/somebody/node_modules/@somebody/logger/HoneybadgerTransport.js',
                method: 'HoneybadgerTransport.log',
                number: 18,
                column: 19
            });
        });
        it('filters out top frames that come from @honeybadger-io (browser)', function () {
            var error = new Error('This is a test message reported from an addEventListener callback.');
            error.stack = "Error: This is a test message reported from an addEventListener callback.\n            at __webpack_modules__../node_modules/@honeybadger-io/js/dist/browser/honeybadger.js.Client.notify (http://localhost:63342/honeybadger-js/packages/js/examples/webpack/bundle.js:821:28)\n            at HTMLButtonElement.<anonymous> (http://localhost:63342/honeybadger-js/packages/js/examples/webpack/bundle.js:2139:10)\n            at func.___hb (http://localhost:63342/honeybadger-js/packages/js/examples/webpack/bundle.js:2030:39)";
            var backtrace = (0, util_1.makeBacktrace)(error.stack, true);
            expect(backtrace[0]).toEqual({
                file: 'http://localhost:63342/honeybadger-js/packages/js/examples/webpack/bundle.js',
                method: 'HTMLButtonElement.<anonymous>',
                number: 2139,
                column: 10
            });
        });
        it('filters out default number of frames if no honeybadger source code is found', function () {
            var error = new Error('This is an error from the test file. Tests are not under @honeybadger-io node_modules so the default backtrace shift will be applied.');
            var originalBacktrace = stackTraceParser.parse(error.stack);
            var shiftedBacktrace = (0, util_1.makeBacktrace)(error.stack, true);
            expect(originalBacktrace.length).toEqual(shiftedBacktrace.length + util_1.DEFAULT_BACKTRACE_SHIFT);
            expect(originalBacktrace[util_1.DEFAULT_BACKTRACE_SHIFT]).toMatchObject({
                file: shiftedBacktrace[0].file,
                methodName: shiftedBacktrace[0].method,
                lineNumber: shiftedBacktrace[0].number,
                column: shiftedBacktrace[0].column
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
        it('resolves when configured', function () { return __awaiter(_this, void 0, void 0, function () {
            var called;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        called = false;
                        return [4 /*yield*/, client.notifyAsync(new Error('test')).then(function () {
                                called = true;
                            })];
                    case 1:
                        _a.sent();
                        expect(called).toBeTruthy();
                        return [2 /*return*/];
                }
            });
        }); });
        it('calls afterNotify from client.afterNotify', function () { return __awaiter(_this, void 0, void 0, function () {
            var called;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        called = false;
                        client.afterNotify(function (_err) {
                            called = true;
                        });
                        return [4 /*yield*/, client.notifyAsync('test test')];
                    case 1:
                        _a.sent();
                        expect(called).toBeTruthy();
                        return [2 /*return*/];
                }
            });
        }); });
        it('calls afterNotify in noticeable', function () { return __awaiter(_this, void 0, void 0, function () {
            var called, afterNotify;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        called = false;
                        afterNotify = function () {
                            called = true;
                        };
                        return [4 /*yield*/, client.notifyAsync({
                                message: 'test',
                                afterNotify: afterNotify
                            })];
                    case 1:
                        _a.sent();
                        expect(called).toBeTruthy();
                        return [2 /*return*/];
                }
            });
        }); });
        it('calls afterNotify in name', function () { return __awaiter(_this, void 0, void 0, function () {
            var called, afterNotify;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        called = false;
                        afterNotify = function () {
                            called = true;
                        };
                        return [4 /*yield*/, client.notifyAsync(new Error('test'), { afterNotify: afterNotify })];
                    case 1:
                        _a.sent();
                        expect(called).toBeTruthy();
                        return [2 /*return*/];
                }
            });
        }); });
        it('calls afterNotify in extra', function () { return __awaiter(_this, void 0, void 0, function () {
            var called, afterNotify;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        called = false;
                        afterNotify = function () {
                            called = true;
                        };
                        return [4 /*yield*/, client.notifyAsync(new Error('test'), 'an error', { afterNotify: afterNotify })];
                    case 1:
                        _a.sent();
                        expect(called).toBeTruthy();
                        return [2 /*return*/];
                }
            });
        }); });
        it('calls afterNotify and then resolves promise', function () { return __awaiter(_this, void 0, void 0, function () {
            function register(i) {
                called[i] = false;
                client.afterNotify(function () {
                    called[i] = true;
                });
            }
            var called, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        called = [];
                        for (i = 0; i < 100; i++) {
                            register(i);
                        }
                        return [4 /*yield*/, client.notifyAsync(new Error('test'))];
                    case 1:
                        _a.sent();
                        expect(called.every(function (val) { return val === true; })).toBeTruthy();
                        return [2 /*return*/];
                }
            });
        }); });
        it('rejects with error if not configured correctly', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        client.configure({
                            apiKey: null
                        });
                        return [4 /*yield*/, expect(client.notifyAsync(new Error('test'))).rejects.toThrow(new Error('missing API key'))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('rejects on pre-condition error', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        client.configure({
                            apiKey: 'testing',
                            reportData: false
                        });
                        return [4 /*yield*/, expect(client.notifyAsync(new Error('test'))).rejects.toThrow(new Error('honeybadger.js is disabled'))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('beforeNotify', function () {
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
        it('does not deliver notice when beforeNotify callback returns false', function () {
            client.beforeNotify(function () {
                return false;
            });
            expect(client.notify('testing')).toEqual(false);
        });
        it('does not deliver notice when async beforeNotify callback returns false', function () {
            client.beforeNotify(function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, false];
                    });
                });
            });
            return new Promise(function (resolve) {
                client.afterNotify(function (error) {
                    expect(error.message).toEqual('beforeNotify handlers (async) returned false');
                    resolve();
                });
                // notify returns true because the beforeNotify callback is async
                expect(client.notify('testing')).toEqual(true);
            });
        });
        it('delivers notice when beforeNotify returns true', function () {
            client.beforeNotify(function () {
                return true;
            });
            expect(client.notify('testing')).toEqual(true);
        });
        it('delivers notice when beforeNotify has no return', function () {
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            client.beforeNotify(function () { });
            expect(client.notify('testing')).toEqual(true);
        });
        it('is called with default notice properties', function () {
            var notice;
            client.beforeNotify(function (n) {
                notice = n;
            });
            try {
                throw (new Error('expected message'));
            }
            catch (e) {
                client.notify(e);
            }
            expect(notice.stack).toEqual(expect.any(String));
            expect(notice.name).toEqual('Error');
            expect(notice.message).toEqual('expected message');
            expect(notice.projectRoot).toEqual('config projectRoot');
            expect(notice.environment).toEqual('config environment');
            expect(notice.component).toEqual('config component');
            expect(notice.action).toEqual('config action');
            expect(notice.fingerprint).toEqual(undefined);
            expect(notice.context).toEqual({});
            expect(notice.params).toEqual(undefined);
            expect(notice.url).toEqual(undefined);
            expect(notice.revision).toEqual('config revision');
        });
        it('is called with overridden notice properties', function () {
            var notice;
            client.beforeNotify(function (n) {
                notice = n;
            });
            client.notify({
                stack: 'expected stack',
                name: 'expected name',
                message: 'expected message',
                url: 'expected url',
                projectRoot: 'expected projectRoot',
                environment: 'expected environment',
                component: 'expected component',
                action: 'expected action',
                fingerprint: 'expected fingerprint',
                context: { expected_context_key: 'expected value' },
                params: { expected_params_key: 'expected value' },
                revision: 'expected revision',
                other: 'expected other'
            });
            expect(notice.stack).toEqual('expected stack');
            expect(notice.name).toEqual('expected name');
            expect(notice.message).toEqual('expected message');
            expect(notice.url).toEqual('expected url');
            expect(notice.projectRoot).toEqual('expected projectRoot');
            expect(notice.environment).toEqual('expected environment');
            expect(notice.component).toEqual('expected component');
            expect(notice.action).toEqual('expected action');
            expect(notice.fingerprint).toEqual('expected fingerprint');
            expect(notice.context).toEqual({ expected_context_key: 'expected value' });
            expect(notice.params).toEqual({ expected_params_key: 'expected value' });
            expect(notice.revision).toEqual('expected revision');
            expect(notice.other).toEqual('expected other');
        });
        it('assigns notice properties', function () {
            var notice;
            client.beforeNotify(function (n) {
                notice = n;
                notice.name = 'expected name';
                notice.message = 'expected message';
                notice.url = 'expected url';
                notice.projectRoot = 'expected projectRoot';
                notice.environment = 'expected environment';
                notice.component = 'expected component';
                notice.action = 'expected action';
                notice.fingerprint = 'expected fingerprint';
                notice.context = { expected_context_key: 'expected value' };
                notice.params = { expected_params_key: 'expected value' };
                notice.revision = 'expected revision';
            });
            client.notify('notify message');
            var payload = client.getPayload(notice);
            expect(payload.error.backtrace).toEqual(expect.any(Array));
            expect(payload.error.class).toEqual('expected name');
            expect(payload.error.message).toEqual('expected message');
            expect(payload.request.url).toEqual('expected url');
            expect(payload.server.project_root).toEqual('expected projectRoot');
            expect(payload.server.environment_name).toEqual('expected environment');
            expect(payload.request.component).toEqual('expected component');
            expect(payload.request.action).toEqual('expected action');
            expect(payload.error.fingerprint).toEqual('expected fingerprint');
            expect(payload.request.context).toEqual({ expected_context_key: 'expected value' });
            expect(payload.request.params).toEqual({ expected_params_key: 'expected value' });
            expect(payload.server.revision).toEqual('expected revision');
        });
        it('calls all beforeNotify handlers even if one returns false', function () {
            var _this = this;
            client.configure({
                apiKey: undefined
            });
            return new Promise(function (resolve) {
                var expected = 5;
                var total = 0;
                client.beforeNotify(function () {
                    total++;
                    return false;
                });
                client.beforeNotify(function () {
                    total++;
                    return true;
                });
                client.beforeNotify(function () {
                    total++;
                    return false;
                });
                client.beforeNotify(function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        total++;
                        return [2 /*return*/, true];
                    });
                }); });
                client.beforeNotify(function () {
                    total++;
                });
                client.afterNotify(function () {
                    expect(total).toEqual(expected);
                    resolve();
                });
                client.notify('should not report');
            });
        });
        it('modifies the notice when an async function is provided', function () {
            var _this = this;
            var funkyName = 'My funky name';
            client.beforeNotify(function (notice) { return __awaiter(_this, void 0, void 0, function () {
                var modifyName;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            modifyName = function () { return new Promise(function (resolve) {
                                setTimeout(function () {
                                    notice.name = funkyName;
                                    resolve();
                                });
                            }); };
                            return [4 /*yield*/, modifyName()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            return new Promise(function (resolve) {
                client.afterNotify(function (_err, notice) {
                    expect(notice.name).toEqual(funkyName);
                    resolve();
                });
                expect(client.notify('Should report and modify notice')).toEqual(true);
            });
        });
    });
    describe('afterNotify', function () {
        it('is called with error if apiKey is not set', function () {
            client.configure({
                apiKey: undefined,
            });
            return new Promise(function (resolve) {
                client.afterNotify(function (err) {
                    expect(err.message).toEqual('missing API key');
                    resolve();
                });
                client.notify('should not report');
            });
        });
        it('is called with error if beforeNotify handlers return false', function () {
            client.configure({
                apiKey: 'abc123',
            });
            return new Promise(function (resolve) {
                client.beforeNotify(function () { return false; });
                client.afterNotify(function (err) {
                    expect(err.message).toEqual('beforeNotify handlers returned false');
                    resolve();
                });
                client.notify('should not report');
            });
        });
        it('is called when set in the notice object', function () {
            client.configure({
                apiKey: 'abc123',
            });
            return new Promise(function (resolve) {
                client.beforeNotify(function (notice) {
                    notice.afterNotify = function (err) {
                        expect(err).toBeUndefined();
                        resolve();
                    };
                });
                client.notify('should report');
            });
        });
        it('calls all afterNotify handlers if preconditions fail', function () {
            client.configure({
                apiKey: 'abc123'
            });
            return new Promise(function (resolve) {
                var total = 0;
                var expected = 2;
                var handlerCalled = function (err) {
                    expect(err.message).toEqual('beforeNotify handlers returned false');
                    total++;
                    if (total === expected) {
                        resolve();
                    }
                };
                client.beforeNotify(function (notice) {
                    notice.afterNotify = handlerCalled;
                });
                client.beforeNotify(function () { return false; });
                client.afterNotify(handlerCalled);
                client.notify('should not report');
            });
        });
        it('accepts an async function', function () {
            var _this = this;
            client.configure({
                apiKey: 'abc123',
            });
            return new Promise(function (resolve) {
                client.afterNotify(function (err) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        expect(err).toBeUndefined();
                        resolve();
                        return [2 /*return*/];
                    });
                }); });
                client.notify('should report');
            });
        });
    });
    describe('beforeNotify & afterNotify', function () {
        it('should call before and after notify handlers even if preconditions fail', function () {
            client.configure({
                apiKey: undefined
            });
            return new Promise(function (resolve) {
                var totalBeforeNotify = 0;
                var expectedBeforeNotify = 2;
                var beforeNotifyHandler = function () {
                    totalBeforeNotify++;
                };
                var afterNotifyHandler = function (err) {
                    expect(err.message).toEqual('missing API key');
                    expect(totalBeforeNotify).toEqual(expectedBeforeNotify);
                    resolve();
                };
                client.beforeNotify(beforeNotifyHandler);
                client.beforeNotify(beforeNotifyHandler);
                client.afterNotify(afterNotifyHandler);
                client.notify('should not report');
            });
        });
    });
    describe('addBreadcrumb', function () {
        it('has default breadcrumbs', function () {
            expect(client.__getBreadcrumbs()).toEqual([]);
        });
        it('adds a breadcrumb with defaults', function () {
            client.addBreadcrumb('expected message');
            expect(client.__getBreadcrumbs().length).toEqual(1);
            var crumb = client.__getBreadcrumbs()[0];
            expect(crumb.message).toEqual('expected message');
            expect(crumb.category).toEqual('custom');
            expect(crumb.metadata).toEqual({});
            expect(crumb.timestamp).toEqual(expect.any(String));
        });
        it('overrides the default category', function () {
            client.addBreadcrumb('message', {
                category: 'test'
            });
            expect(client.__getBreadcrumbs().length).toEqual(1);
            expect(client.__getBreadcrumbs()[0].category).toEqual('test');
        });
        it('overrides the default metadata', function () {
            client.addBreadcrumb('message', {
                metadata: {
                    key: 'expected value'
                }
            });
            expect(client.__getBreadcrumbs().length).toEqual(1);
            expect(client.__getBreadcrumbs()[0].metadata).toEqual({
                key: 'expected value'
            });
        });
        it('duplicates metadata objects', function () {
            var metadata = {
                key: 'expected value'
            };
            client.addBreadcrumb('message', {
                metadata: metadata
            });
            client.addBreadcrumb('message', {
                metadata: metadata
            });
            expect(client.__getBreadcrumbs().length).toEqual(2);
            expect(client.__getBreadcrumbs()[0].metadata).toEqual(client.__getBreadcrumbs()[1].metadata);
            expect(client.__getBreadcrumbs()[0].metadata).not.toBe(client.__getBreadcrumbs()[1].metadata);
        });
        it('maintains the size of the breadcrumbs queue', function () {
            for (var i = 0; i <= 45; i++) {
                client.addBreadcrumb('expected message ' + i);
            }
            expect(client.__getBreadcrumbs().length).toEqual(40);
            expect(client.__getBreadcrumbs()[0].message).toEqual('expected message 6');
            expect(client.__getBreadcrumbs()[39].message).toEqual('expected message 45');
        });
        it('sends breadcrumbs by default', function () {
            client.configure({
                apiKey: 'testing'
            });
            client.addBreadcrumb('expected message');
            var payload = client.getPayload('message');
            expect(payload.breadcrumbs.enabled).toEqual(true);
            expect((payload.breadcrumbs.trail).length).toEqual(2);
            expect(payload.breadcrumbs.trail[0].message).toEqual('expected message');
        });
        it('sends empty breadcrumbs when disabled', function () {
            client.configure({
                apiKey: 'testing',
                breadcrumbsEnabled: false
            });
            client.addBreadcrumb('message');
            var payload = client.getPayload('message');
            expect(payload.breadcrumbs.enabled).toEqual(false);
            expect(payload.breadcrumbs.trail).toEqual([]);
        });
    });
    it('has default filters', function () {
        expect(client.config.filters).toEqual(['creditcard', 'password']);
    });
    it('filters keys in payload', function () {
        client.configure({
            apiKey: 'testing',
            filters: ['secret']
        });
        var payload = client.getPayload('message', {
            params: {
                secret: 'secret',
                other: 'expected'
            },
            cgiData: {
                secret: 'secret',
                other: 'expected'
            },
            session: {
                secret: 'secret',
                other: 'expected'
            },
            headers: {
                secret: 'secret',
                other: 'expected'
            }
        });
        var reqParams = payload.request.params;
        expect(reqParams.secret).toEqual('[FILTERED]');
        expect(reqParams.other).toEqual('expected');
        var cgiData = payload.request.cgi_data;
        expect(cgiData.secret).toEqual('[FILTERED]');
        expect(cgiData.other).toEqual('expected');
        var session = payload.request.session;
        expect(session.secret).toEqual('[FILTERED]');
        expect(session.other).toEqual('expected');
        expect(cgiData.HTTP_SECRET).toEqual('[FILTERED]');
        expect(cgiData.HTTP_OTHER).toEqual('expected');
    });
    it('filters URL params', function () {
        client.configure({
            apiKey: 'testing',
            filters: ['secret']
        });
        var payload = client.getPayload('testing', { url: 'https://www.example.com/?secret=value&foo=bar' });
        expect(payload.request.url).toEqual('https://www.example.com/?secret=[FILTERED]&foo=bar');
    });
    it('normalizes comma separated tags', function () {
        client.configure({
            apiKey: 'testing'
        });
        var payload = client.getPayload('testing', { tags: ' one,two   , three ,four' });
        expect(payload.error.tags).toEqual(['one', 'two', 'three', 'four']);
    });
    it('normalizes arrays of tags', function () {
        client.configure({
            apiKey: 'testing'
        });
        var payload = client.getPayload('testing', { tags: ['  tag1,', ',tag2  ', 'tag3 ', 'tag4', 'tag5 '] });
        expect(payload.error.tags).toEqual(['tag1', 'tag2', 'tag3', 'tag4', 'tag5']);
    });
    it('allows non-word characters in tags while stripping whitespace', function () {
        client.configure({
            apiKey: 'testing'
        });
        var payload = client.getPayload('testing', { tags: 'word,  with_underscore ,with space, with-dash,with$special*char' });
        expect(payload.error.tags).toEqual(['word', 'with_underscore', 'with', 'space', 'with-dash', 'with$special*char']);
    });
    it('sends configured tags to errors', function () {
        client.configure({
            apiKey: 'testing',
            tags: ['tag1']
        });
        var payload = client.getPayload('testing');
        expect(payload.error.tags).toEqual(['tag1']);
    });
    it('sends context tags to errors', function () {
        client.configure({
            apiKey: 'testing',
        });
        client.setContext({ tags: 'tag1, tag2' });
        var payload = client.getPayload('testing');
        expect(payload.error.tags).toEqual(['tag1', 'tag2']);
    });
    it('sends config errors, context errors, and notice errors', function () {
        client.configure({
            apiKey: 'testing',
            tags: ['tag4']
        });
        client.setContext({ tags: 'tag3' });
        var payload = client.getPayload('testing', { tags: ['tag1, tag2'] });
        expect(payload.error.tags).toEqual(['tag1', 'tag2', 'tag3', 'tag4']);
    });
    it('should not send duplicate tags', function () {
        client.configure({
            apiKey: 'testing',
            tags: ['tag1']
        });
        var payload = client.getPayload('testing', { tags: ['tag1'] });
        expect(payload.error.tags).toEqual(['tag1']);
    });
    it('supports nested errors', function () {
        var level1Error = new Error('Level 1');
        var level2Error = new Error('Level 2', { cause: level1Error });
        var level3Error = new Error('Level 3', { cause: level2Error });
        var payload = client.getPayload(level3Error);
        expect(payload.error.class).toEqual(level3Error.name);
        expect(payload.error.message).toEqual(level3Error.message);
        if (level3Error.cause) { // `.cause` in constructor is only supported on certain platforms/Node versions
            expect(payload.error.causes).toHaveLength(2);
            expect(payload.error.causes[0].class).toEqual(level2Error.name);
            expect(payload.error.causes[0].message).toEqual(level2Error.message);
            expect(payload.error.causes[0].backtrace).toBeTruthy();
            expect(payload.error.causes[1].class).toEqual(level1Error.name);
            expect(payload.error.causes[1].message).toEqual(level1Error.message);
            expect(payload.error.causes[1].backtrace).toBeTruthy();
        }
        else {
            expect(payload.error.causes).toHaveLength(0);
        }
    });
    it('keeps a maximum of 3 nested errors', function () {
        var level1Error = new Error('Level 1');
        var level2Error = new Error('Level 2', { cause: level1Error });
        var level3Error = new Error('Level 3', { cause: level2Error });
        var level4Error = new Error('Level 4', { cause: level3Error });
        var level5Error = new Error('Level 5', { cause: level4Error });
        var payload = client.getPayload(level5Error);
        expect(payload.error.class).toEqual(level5Error.name);
        expect(payload.error.message).toEqual(level5Error.message);
        if (level5Error.cause) { // `.cause` in constructor is only supported on certain platforms/Node versions
            expect(payload.error.causes).toHaveLength(3);
            expect(payload.error.causes[0].class).toEqual(level3Error.name);
            expect(payload.error.causes[1].class).toEqual(level2Error.name);
            expect(payload.error.causes[2].class).toEqual(level1Error.name);
        }
        else {
            expect(payload.error.causes).toHaveLength(0);
        }
    });
});
//# sourceMappingURL=client.test.js.map