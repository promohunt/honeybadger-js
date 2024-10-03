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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = require("../../helpers");
var util = __importStar(require("../../../../src/server/util"));
var uncaught_exception_monitor_1 = __importDefault(require("../../../../src/server/integrations/uncaught_exception_monitor"));
var aws = __importStar(require("../../../../src/server/aws_lambda"));
function getListenerCount() {
    return process.listeners('uncaughtException').length;
}
describe('UncaughtExceptionMonitor', function () {
    // Using any rather than the real type so we can test and spy on private methods
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    var uncaughtExceptionMonitor;
    var client;
    var fatallyLogAndExitSpy;
    var notifySpy;
    beforeEach(function () {
        // We just need a really basic client, so ignoring type issues here
        client = new helpers_1.TestClient({ apiKey: 'testKey', afterUncaught: jest.fn(), logger: (0, helpers_1.nullLogger)() }, new helpers_1.TestTransport());
        uncaughtExceptionMonitor = new uncaught_exception_monitor_1.default();
        uncaughtExceptionMonitor.setClient(client);
        // Have to mock fatallyLogAndExit or we will crash the test
        fatallyLogAndExitSpy = jest
            .spyOn(util, 'fatallyLogAndExit')
            .mockImplementation(function () { return true; });
        notifySpy = jest.spyOn(client, 'notify');
    });
    afterEach(function () {
        jest.clearAllMocks();
        process.removeAllListeners('uncaughtException');
        uncaughtExceptionMonitor.__isReporting = false;
        uncaughtExceptionMonitor.__handlerAlreadyCalled = false;
    });
    describe('constructor', function () {
        it('sets variables and removes the AWS lambda uncaught exception listener', function () {
            var restoreEnv = __assign({}, process.env);
            process.env.LAMBDA_TASK_ROOT = 'foobar';
            var removeLambdaSpy = jest
                .spyOn(aws, 'removeAwsDefaultUncaughtExceptionListener');
            // Using any rather than the real type so we can test and spy on private methods
            // eslint-disable-next-line  @typescript-eslint/no-explicit-any
            var newMonitor = new uncaught_exception_monitor_1.default();
            expect(removeLambdaSpy).toHaveBeenCalledTimes(1);
            expect(newMonitor.__isReporting).toBe(false);
            expect(newMonitor.__handlerAlreadyCalled).toBe(false);
            expect(newMonitor.__listener).toStrictEqual(expect.any(Function));
            expect(newMonitor.__listener.name).toBe('honeybadgerUncaughtExceptionListener');
            process.env = restoreEnv;
        });
    });
    describe('maybeAddListener', function () {
        it('adds our listener a maximum of one time', function () {
            expect(getListenerCount()).toBe(0);
            // Adds our listener
            uncaughtExceptionMonitor.maybeAddListener();
            expect(getListenerCount()).toBe(1);
            // Doesn't add a duplicate
            uncaughtExceptionMonitor.maybeAddListener();
            expect(getListenerCount()).toBe(1);
        });
    });
    describe('maybeRemoveListener', function () {
        it('removes our listener if it is present', function () {
            uncaughtExceptionMonitor.maybeAddListener();
            process.on('uncaughtException', function (err) { console.log(err); });
            expect(getListenerCount()).toBe(2);
            uncaughtExceptionMonitor.maybeRemoveListener();
            expect(getListenerCount()).toBe(1);
        });
        it('does nothing if our listener is not present', function () {
            process.on('uncaughtException', function (err) { console.log(err); });
            expect(getListenerCount()).toBe(1);
            uncaughtExceptionMonitor.maybeRemoveListener();
            expect(getListenerCount()).toBe(1);
        });
    });
    describe('__listener', function () {
        var error = new Error('dang, broken again');
        it('calls notify, afterUncaught, and fatallyLogAndExit', function (done) {
            uncaughtExceptionMonitor.__listener(error);
            expect(notifySpy).toHaveBeenCalledTimes(1);
            expect(notifySpy).toHaveBeenCalledWith(error, { afterNotify: expect.any(Function) });
            client.afterNotify(function () {
                expect(client.config.afterUncaught).toHaveBeenCalledWith(error);
                expect(fatallyLogAndExitSpy).toHaveBeenCalledWith(error);
                done();
            });
        });
        it('returns if it is already reporting', function () {
            uncaughtExceptionMonitor.__isReporting = true;
            uncaughtExceptionMonitor.__listener(error);
            expect(notifySpy).not.toHaveBeenCalled();
            expect(fatallyLogAndExitSpy).not.toHaveBeenCalled();
        });
        it('returns if it was already called and there are other listeners', function () {
            process.on('uncaughtException', function () { return true; });
            process.on('uncaughtException', function () { return true; });
            uncaughtExceptionMonitor.__listener(error);
            expect(notifySpy).toHaveBeenCalledTimes(1);
            client.afterNotify(function () {
                expect(fatallyLogAndExitSpy).not.toHaveBeenCalled();
                expect(uncaughtExceptionMonitor.__handlerAlreadyCalled).toBe(true);
                // Doesn't notify a second time
                uncaughtExceptionMonitor.__listener(error);
                expect(notifySpy).toHaveBeenCalledTimes(1);
            });
        });
        it('exits if it was already called and there are no other listeners', function () {
            uncaughtExceptionMonitor.__handlerAlreadyCalled = true;
            uncaughtExceptionMonitor.__listener(error);
            expect(notifySpy).not.toHaveBeenCalled();
            expect(fatallyLogAndExitSpy).toHaveBeenCalledWith(error);
        });
    });
    describe('hasOtherUncaughtExceptionListeners', function () {
        it('returns true if there are user-added listeners', function () {
            uncaughtExceptionMonitor.maybeAddListener();
            process.on('uncaughtException', function domainUncaughtExceptionClear() {
                return;
            });
            process.on('uncaughtException', function userAddedListener() {
                return;
            });
            expect(uncaughtExceptionMonitor.hasOtherUncaughtExceptionListeners()).toBe(true);
        });
        it('returns false if there are only our expected listeners', function () {
            uncaughtExceptionMonitor.maybeAddListener();
            process.on('uncaughtException', function domainUncaughtExceptionClear() {
                return;
            });
            expect(uncaughtExceptionMonitor.hasOtherUncaughtExceptionListeners()).toBe(false);
        });
    });
});
//# sourceMappingURL=uncaught_exception_monitor.server.test.js.map