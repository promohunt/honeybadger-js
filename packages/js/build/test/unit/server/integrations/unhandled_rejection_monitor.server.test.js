"use strict";
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
var unhandled_rejection_monitor_1 = __importDefault(require("../../../../src/server/integrations/unhandled_rejection_monitor"));
function getListenerCount() {
    return process.listeners('unhandledRejection').length;
}
describe('UnhandledRejectionMonitor', function () {
    // Using any rather than the real type so we can test and spy on private methods
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    var unhandledRejectionMonitor;
    var client;
    var fatallyLogAndExitSpy;
    var notifySpy;
    beforeEach(function () {
        // We just need a really basic client, so ignoring type issues here
        client = new helpers_1.TestClient({ apiKey: 'testKey', afterUncaught: jest.fn(), logger: (0, helpers_1.nullLogger)() }, new helpers_1.TestTransport());
        unhandledRejectionMonitor = new unhandled_rejection_monitor_1.default();
        unhandledRejectionMonitor.setClient(client);
        // Have to mock fatallyLogAndExit or we will crash the test
        fatallyLogAndExitSpy = jest
            .spyOn(util, 'fatallyLogAndExit')
            .mockImplementation(function () { return true; });
        notifySpy = jest.spyOn(client, 'notify');
    });
    afterEach(function () {
        jest.clearAllMocks();
        process.removeAllListeners('unhandledRejection');
        unhandledRejectionMonitor.__isReporting = false;
    });
    describe('constructor', function () {
        it('set up variables and client', function () {
            expect(unhandledRejectionMonitor.__isReporting).toBe(false);
            expect(unhandledRejectionMonitor.__listener).toStrictEqual(expect.any(Function));
            expect(unhandledRejectionMonitor.__listener.name).toBe('honeybadgerUnhandledRejectionListener');
        });
    });
    describe('maybeAddListener', function () {
        it('adds our listener a maximum of one time', function () {
            expect(getListenerCount()).toBe(0);
            // Adds our listener
            unhandledRejectionMonitor.maybeAddListener();
            expect(getListenerCount()).toBe(1);
            // Doesn't add a duplicate
            unhandledRejectionMonitor.maybeAddListener();
            expect(getListenerCount()).toBe(1);
        });
    });
    describe('maybeRemoveListener', function () {
        it('removes our listener if it is present', function () {
            unhandledRejectionMonitor.maybeAddListener();
            process.on('unhandledRejection', function (err) { console.log(err); });
            expect(getListenerCount()).toBe(2);
            unhandledRejectionMonitor.maybeRemoveListener();
            expect(getListenerCount()).toBe(1);
        });
        it('does nothing if our listener is not present', function () {
            process.on('unhandledRejection', function (err) { console.log(err); });
            expect(getListenerCount()).toBe(1);
            unhandledRejectionMonitor.maybeRemoveListener();
            expect(getListenerCount()).toBe(1);
        });
    });
    describe('__listener', function () {
        var promise = new Promise(function () { return true; });
        var reason = 'Promise rejection reason';
        it('calls notify and fatallyLogAndExit', function (done) {
            unhandledRejectionMonitor.__listener(reason, promise);
            expect(notifySpy).toHaveBeenCalledTimes(1);
            expect(notifySpy).toHaveBeenCalledWith(reason, { component: 'unhandledRejection' }, { afterNotify: expect.any(Function) });
            client.afterNotify(function () {
                expect(fatallyLogAndExitSpy).toHaveBeenCalledWith(reason);
                done();
            });
        });
    });
    describe('hasOtherUnhandledRejectionListeners', function () {
        it('returns true if there are user-added listeners', function () {
            unhandledRejectionMonitor.maybeAddListener();
            process.on('unhandledRejection', function userAddedListener() {
                return;
            });
            expect(unhandledRejectionMonitor.hasOtherUnhandledRejectionListeners()).toBe(true);
        });
        it('returns false if there is only our expected listener', function () {
            unhandledRejectionMonitor.maybeAddListener();
            expect(unhandledRejectionMonitor.hasOtherUnhandledRejectionListeners()).toBe(false);
        });
    });
});
//# sourceMappingURL=unhandled_rejection_monitor.server.test.js.map