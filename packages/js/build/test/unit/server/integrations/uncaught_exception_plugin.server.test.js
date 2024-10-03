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
var uncaught_exception_plugin_1 = __importDefault(require("../../../../src/server/integrations/uncaught_exception_plugin"));
var helpers_1 = require("../../helpers");
var util = __importStar(require("../../../../src/server/util"));
function getListeners() {
    return process.listeners('uncaughtException');
}
function getListenerCount() {
    return getListeners().length;
}
describe('Uncaught Exception Plugin', function () {
    var client;
    var notifySpy;
    beforeEach(function () {
        // We just need a really basic client, so ignoring type issues here
        client = new helpers_1.TestClient({ apiKey: 'testKey', afterUncaught: jest.fn(), logger: (0, helpers_1.nullLogger)() }, new helpers_1.TestTransport());
        // Have to mock fatallyLogAndExit or we will crash the test
        jest
            .spyOn(util, 'fatallyLogAndExit')
            .mockImplementation(function () { return true; });
        notifySpy = jest.spyOn(client, 'notify');
    });
    afterEach(function () {
        jest.clearAllMocks();
        process.removeAllListeners('uncaughtException');
    });
    it('is a function which returns an object with a load function', function () {
        expect((0, uncaught_exception_plugin_1.default)()).toStrictEqual({
            load: expect.any(Function),
            shouldReloadOnConfigure: true,
        });
    });
    describe('load', function () {
        var load = (0, uncaught_exception_plugin_1.default)().load;
        it('adds a listener for uncaughtException if enableUncaught is true', function () {
            load(client);
            var listeners = getListeners();
            expect(listeners.length).toBe(1);
            expect(listeners[0].name).toBe('honeybadgerUncaughtExceptionListener');
            var error = new Error('uncaught');
            process.emit('uncaughtException', error);
            expect(notifySpy).toHaveBeenCalledTimes(1);
        });
        it('does not add a listener if enableUncaught is false', function () {
            client.configure({ enableUncaught: false });
            load(client);
            expect(getListenerCount()).toBe(0);
        });
        it('adds or removes listener if needed when reloaded', function () {
            load(client);
            expect(getListenerCount()).toBe(1);
            client.configure({ enableUncaught: false });
            load(client);
            expect(getListenerCount()).toBe(0);
            client.configure({ enableUncaught: true });
            load(client);
            expect(getListenerCount()).toBe(1);
        });
    });
});
//# sourceMappingURL=uncaught_exception_plugin.server.test.js.map