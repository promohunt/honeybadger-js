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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Types = void 0;
var os_1 = __importDefault(require("os"));
var domain_1 = __importDefault(require("domain"));
var core_1 = require("@honeybadger-io/core");
var util_1 = require("./server/util");
var uncaught_exception_plugin_1 = __importDefault(require("./server/integrations/uncaught_exception_plugin"));
var unhandled_rejection_plugin_1 = __importDefault(require("./server/integrations/unhandled_rejection_plugin"));
var middleware_1 = require("./server/middleware");
var aws_lambda_1 = require("./server/aws_lambda");
var transport_1 = require("./server/transport");
var stacked_store_1 = require("./server/stacked_store");
var client_1 = require("./server/check-ins-manager/client");
var endpoint = core_1.Util.endpoint;
var DEFAULT_PLUGINS = [
    (0, uncaught_exception_plugin_1.default)(),
    (0, unhandled_rejection_plugin_1.default)()
];
var Honeybadger = /** @class */ (function (_super) {
    __extends(Honeybadger, _super);
    function Honeybadger(opts) {
        if (opts === void 0) { opts = {}; }
        var _this = this;
        var _a;
        var transport = new transport_1.ServerTransport({
            'User-Agent': userAgent(),
        });
        _this = _super.call(this, __assign({ projectRoot: process.cwd(), hostname: os_1.default.hostname() }, opts), transport) || this;
        /** @internal */
        _this.__beforeNotifyHandlers = [
            function (notice) {
                if (notice && notice.backtrace) {
                    notice.backtrace.forEach(function (line) {
                        if (line.file) {
                            line.file = line.file.replace(/.*\/node_modules\/(.+)/, '[NODE_MODULES]/$1');
                            line.file = line.file.replace(notice.projectRoot, '[PROJECT_ROOT]');
                        }
                        return line;
                    });
                }
            }
        ];
        // serverless defaults
        var config = _this.config;
        config.reportTimeoutWarning = (_a = config.reportTimeoutWarning) !== null && _a !== void 0 ? _a : true;
        config.timeoutWarningThresholdMs = config.timeoutWarningThresholdMs || 50;
        _this.__checkInsClient = new client_1.CheckInsClient(_this.config, transport);
        _this.__getSourceFileHandler = util_1.getSourceFile.bind(_this);
        _this.errorHandler = middleware_1.errorHandler.bind(_this);
        _this.requestHandler = middleware_1.requestHandler.bind(_this);
        _this.lambdaHandler = aws_lambda_1.lambdaHandler.bind(_this);
        return _this;
    }
    Honeybadger.prototype.factory = function (opts) {
        var _a;
        var clone = new Honeybadger(__assign(__assign({}, ((_a = (0, util_1.readConfigFromFileSystem)()) !== null && _a !== void 0 ? _a : {})), opts));
        clone.setNotifier(this.getNotifier());
        return clone;
    };
    Honeybadger.prototype.configure = function (opts) {
        if (opts === void 0) { opts = {}; }
        return _super.prototype.configure.call(this, opts);
    };
    Honeybadger.prototype.__initStore = function () {
        // @ts-ignore
        this.__store = new stacked_store_1.StackedStore(this.config.maxBreadcrumbs);
    };
    Honeybadger.prototype.showUserFeedbackForm = function () {
        throw new Error('Honeybadger.showUserFeedbackForm() is not supported on the server-side');
    };
    Honeybadger.prototype.checkIn = function (idOrSlug) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.isCheckInSlug(idOrSlug)) {
                    return [2 /*return*/, this.checkInWithSlug(idOrSlug)];
                }
                return [2 /*return*/, this.checkInWithId(idOrSlug)];
            });
        });
    };
    Honeybadger.prototype.checkInWithSlug = function (slug) {
        return __awaiter(this, void 0, void 0, function () {
            var err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.__transport
                                .send({
                                method: 'GET',
                                endpoint: endpoint(this.config.endpoint, "v1/check_in/".concat(this.config.apiKey, "/").concat(slug)),
                                logger: this.logger,
                            })];
                    case 1:
                        _a.sent();
                        this.logger.info("Check-In with slug[".concat(slug, "] sent"));
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        this.logger.error("CheckIn with slug[".concat(slug, "] failed: an unknown error occurred."), "message=".concat(err_1.message));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Honeybadger.prototype.checkInWithId = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.__transport
                                .send({
                                method: 'GET',
                                endpoint: endpoint(this.config.endpoint, "v1/check_in/".concat(id)),
                                logger: this.logger,
                            })];
                    case 1:
                        _a.sent();
                        this.logger.info("Check-In with id[".concat(id, "] sent"));
                        return [3 /*break*/, 3];
                    case 2:
                        err_2 = _a.sent();
                        this.logger.error("Check-In with id[".concat(id, "] failed: an unknown error occurred."), "message=".concat(err_2.message));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Honeybadger.prototype.isCheckInSlug = function (idOrSlug) {
        var _a, _b;
        return (_b = (_a = this.config.checkins) === null || _a === void 0 ? void 0 : _a.some(function (c) { return c.slug === idOrSlug; })) !== null && _b !== void 0 ? _b : false;
    };
    // This method is intended for web frameworks.
    // It allows us to track context for individual requests without leaking to other requests
    // by doing two things:
    // 1. Using AsyncLocalStorage so the context is tracked across async operations.
    // 2. Attaching the store contents to the request object,
    //   so, even if the store is destroyed, we can still recover the context for a given request
    //   (for example, in an error-handling middleware)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Honeybadger.prototype.withRequest = function (request, handler, onError) {
        var _this = this;
        if (onError) {
            // ALS is fine for context-tracking, but `domain` allows us to catch errors
            // thrown asynchronously (timers, event emitters)
            // We can't use unhandledRejection/uncaughtException listeners; they're global and shared across all requests
            // But the `onError` handler might be request-specific.
            // Note that this doesn't still handle all cases. `domain` has its own problems:
            // See https://github.com/honeybadger-io/honeybadger-js/pull/711
            var dom = domain_1.default.create();
            var onErrorWithContext = function (err) { return _this.__store.run(function () { return onError(err); }, request); };
            dom.on('error', onErrorWithContext);
            handler = dom.bind(handler);
        }
        return this.__store.run(handler, request);
    };
    Honeybadger.prototype.run = function (callback) {
        return this.__store.run(callback);
    };
    return Honeybadger;
}(core_1.Client));
var NOTIFIER = {
    name: '@honeybadger-io/js',
    url: 'https://github.com/honeybadger-io/honeybadger-js/tree/master/packages/js',
    version: '__VERSION__'
};
var userAgent = function () {
    return "Honeybadger JS Server Client ".concat(NOTIFIER.version, ", ").concat(os_1.default.version(), "; ").concat(os_1.default.platform());
};
var singleton = new Honeybadger(__assign({ __plugins: DEFAULT_PLUGINS }, ((_a = (0, util_1.readConfigFromFileSystem)()) !== null && _a !== void 0 ? _a : {})));
singleton.setNotifier(NOTIFIER);
var core_2 = require("@honeybadger-io/core");
Object.defineProperty(exports, "Types", { enumerable: true, get: function () { return core_2.Types; } });
exports.default = singleton;
//# sourceMappingURL=server.js.map