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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThrottledEventsLogger = void 0;
var json_nd_1 = require("json-nd");
var util_1 = require("./util");
var defaults_1 = require("./defaults");
var ThrottledEventsLogger = /** @class */ (function () {
    function ThrottledEventsLogger(config, transport) {
        this.config = config;
        this.transport = transport;
        this.queue = [];
        this.isProcessing = false;
        this.config = __assign(__assign({}, defaults_1.CONFIG), config);
        this.logger = this.originalLogger();
    }
    ThrottledEventsLogger.prototype.configure = function (opts) {
        for (var k in opts) {
            this.config[k] = opts[k];
        }
    };
    ThrottledEventsLogger.prototype.logEvent = function (data) {
        this.queue.push(data);
        if (!this.isProcessing) {
            this.processQueue();
        }
    };
    ThrottledEventsLogger.prototype.processQueue = function () {
        var _this = this;
        if (this.queue.length === 0 || this.isProcessing) {
            return;
        }
        this.isProcessing = true;
        var eventsData = this.queue.slice();
        this.queue = [];
        var data = json_nd_1.NdJson.stringify(eventsData);
        this.makeHttpRequest(data)
            .then(function () {
            setTimeout(function () {
                _this.isProcessing = false;
                _this.processQueue();
            }, 50);
        })
            .catch(function (error) {
            _this.logger.error('[Honeybadger] Error making HTTP request:', error);
            // Continue processing the queue even if there's an error
            setTimeout(function () {
                _this.isProcessing = false;
                _this.processQueue();
            }, 50);
        });
    };
    ThrottledEventsLogger.prototype.makeHttpRequest = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.transport
                        .send({
                        headers: {
                            'X-API-Key': this.config.apiKey,
                            'Content-Type': 'application/json',
                        },
                        method: 'POST',
                        endpoint: (0, util_1.endpoint)(this.config.endpoint, '/v1/events'),
                        maxObjectDepth: this.config.maxObjectDepth,
                        logger: this.logger,
                    }, data)
                        .then(function () {
                        if (_this.config.debug) {
                            _this.logger.debug('[Honeybadger] Events sent successfully');
                        }
                    })
                        .catch(function (err) {
                        _this.logger.error("[Honeybadger] Error sending events: ".concat(err.message));
                    })];
            });
        });
    };
    /**
     * todo: improve this
     *
     * The EventsLogger overrides the console methods
     * so if we want to log something we need to use the original methods
     */
    ThrottledEventsLogger.prototype.originalLogger = function () {
        var _a, _b, _c, _d, _e;
        return {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            log: (_a = console.log.__hb_original) !== null && _a !== void 0 ? _a : console.log,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            info: (_b = console.info.__hb_original) !== null && _b !== void 0 ? _b : console.info,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            debug: (_c = console.debug.__hb_original) !== null && _c !== void 0 ? _c : console.debug,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            warn: (_d = console.warn.__hb_original) !== null && _d !== void 0 ? _d : console.warn,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            error: (_e = console.error.__hb_original) !== null && _e !== void 0 ? _e : console.error,
        };
    };
    return ThrottledEventsLogger;
}());
exports.ThrottledEventsLogger = ThrottledEventsLogger;
//# sourceMappingURL=throttled_events_logger.js.map