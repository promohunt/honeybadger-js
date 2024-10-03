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
var throttled_events_logger_1 = require("../src/throttled_events_logger");
var json_nd_1 = require("json-nd");
var helpers_1 = require("./helpers");
function wait(ms) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) { return setTimeout(resolve, ms); })];
        });
    });
}
describe('ThrottledEventsLogger', function () {
    beforeEach(function () {
        jest.clearAllMocks();
    });
    it('should create an instance', function () {
        var eventsLogger = new throttled_events_logger_1.ThrottledEventsLogger({}, new helpers_1.TestTransport());
        expect(eventsLogger).toBeInstanceOf(throttled_events_logger_1.ThrottledEventsLogger);
    });
    it('should log event and send to the backend', function () { return __awaiter(void 0, void 0, void 0, function () {
        var consoleLogSpy, transport, eventsLogger;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    consoleLogSpy = jest.spyOn(console, 'debug');
                    transport = new helpers_1.TestTransport();
                    eventsLogger = new throttled_events_logger_1.ThrottledEventsLogger({ debug: true }, transport);
                    eventsLogger.logEvent({ name: 'foo' });
                    return [4 /*yield*/, wait(100)
                        // @ts-ignore
                    ];
                case 1:
                    _a.sent();
                    // @ts-ignore
                    expect(eventsLogger.queue.length).toBe(0);
                    // @ts-ignore
                    expect(eventsLogger.isProcessing).toBe(false);
                    expect(consoleLogSpy).toHaveBeenCalledWith('[Honeybadger] Events sent successfully');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should log multiple events and send the all together to the backend', function () { return __awaiter(void 0, void 0, void 0, function () {
        var consoleLogSpy, transport, transportSpy, eventsLogger, event1, event2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    consoleLogSpy = jest.spyOn(console, 'debug');
                    transport = new helpers_1.TestTransport();
                    transportSpy = jest.spyOn(transport, 'send');
                    eventsLogger = new throttled_events_logger_1.ThrottledEventsLogger({ debug: true }, transport);
                    event1 = { name: 'foo' };
                    event2 = { name: 'foo', nested: { value: { play: 1 } } };
                    eventsLogger.logEvent(event1);
                    eventsLogger.logEvent(event2);
                    eventsLogger.logEvent(event1);
                    return [4 /*yield*/, wait(200)
                        // @ts-ignore
                    ];
                case 1:
                    _a.sent();
                    // @ts-ignore
                    expect(eventsLogger.queue.length).toBe(0);
                    // @ts-ignore
                    expect(eventsLogger.isProcessing).toBe(false);
                    expect(consoleLogSpy).toHaveBeenCalledTimes(2);
                    expect(consoleLogSpy).toHaveBeenCalledWith('[Honeybadger] Events sent successfully');
                    expect(transportSpy).toHaveBeenCalledTimes(2);
                    expect(transportSpy).toHaveBeenNthCalledWith(1, expect.anything(), json_nd_1.NdJson.stringify([event1]));
                    expect(transportSpy).toHaveBeenNthCalledWith(2, expect.anything(), json_nd_1.NdJson.stringify([event2, event1]));
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=throttled_events_logger.test.js.map