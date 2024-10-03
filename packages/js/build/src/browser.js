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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Types = exports.getUserFeedbackScriptUrl = void 0;
var core_1 = require("@honeybadger-io/core");
var util_1 = require("./browser/util");
var onerror_1 = require("./browser/integrations/onerror");
var onunhandledrejection_1 = __importDefault(require("./browser/integrations/onunhandledrejection"));
var breadcrumbs_1 = __importDefault(require("./browser/integrations/breadcrumbs"));
var events_1 = __importDefault(require("./browser/integrations/events"));
var timers_1 = __importDefault(require("./browser/integrations/timers"));
var event_listeners_1 = __importDefault(require("./browser/integrations/event_listeners"));
var transport_1 = require("./browser/transport");
var merge = core_1.Util.merge, filter = core_1.Util.filter, objectIsExtensible = core_1.Util.objectIsExtensible;
var getProjectRoot = function () {
    var global = (0, util_1.globalThisOrWindow)();
    var projectRoot = '';
    // Cloudflare workers do not have access to location API.
    if (global.location != null) {
        projectRoot = global.location.protocol + '//' + global.location.host;
    }
    return projectRoot;
};
var getUserFeedbackScriptUrl = function (version) {
    var majorMinorVersion = version.split('.').slice(0, 2).join('.');
    return "https://js.honeybadger.io/v".concat(majorMinorVersion, "/honeybadger-feedback-form.js");
};
exports.getUserFeedbackScriptUrl = getUserFeedbackScriptUrl;
var Honeybadger = /** @class */ (function (_super) {
    __extends(Honeybadger, _super);
    function Honeybadger(opts) {
        if (opts === void 0) { opts = {}; }
        var _this = _super.call(this, __assign({ userFeedbackEndpoint: 'https://api.honeybadger.io/v2/feedback', async: true, maxErrors: null, projectRoot: getProjectRoot() }, opts), new transport_1.BrowserTransport({
            'User-Agent': userAgent(),
        })) || this;
        /** @internal */
        _this.__errorsSent = 0;
        /** @internal */
        _this.__lastWrapErr = undefined;
        /** @internal */
        _this.__lastNoticeId = undefined;
        /** @internal */
        _this.__beforeNotifyHandlers = [
            function (notice) {
                if (_this.__exceedsMaxErrors()) {
                    _this.logger.debug('Dropping notice: max errors exceeded', notice);
                    return false;
                }
                if (notice && !notice.url && typeof document !== 'undefined') {
                    notice.url = document.URL;
                }
                _this.__incrementErrorsCount();
                return true;
            }
        ];
        _this.__afterNotifyHandlers = [
            function (_error, notice) {
                if (notice) {
                    _this.__lastNoticeId = notice.id;
                }
            }
        ];
        return _this;
    }
    Honeybadger.prototype.configure = function (opts) {
        if (opts === void 0) { opts = {}; }
        return _super.prototype.configure.call(this, opts);
    };
    Honeybadger.prototype.resetMaxErrors = function () {
        return (this.__errorsSent = 0);
    };
    Honeybadger.prototype.factory = function (opts) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        var clone = new Honeybadger(opts);
        clone.setNotifier(this.getNotifier());
        return clone;
    };
    Honeybadger.prototype.checkIn = function (_id) {
        throw new Error('Honeybadger.checkIn() is not supported on the browser');
    };
    Honeybadger.prototype.showUserFeedbackForm = function (options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var global;
            return __generator(this, function (_a) {
                if (!this.config || !this.config.apiKey) {
                    this.logger.debug('Client not initialized');
                    return [2 /*return*/];
                }
                if (!this.__lastNoticeId) {
                    this.logger.debug("Can't show user feedback form without a notice already reported");
                    return [2 /*return*/];
                }
                global = (0, util_1.globalThisOrWindow)();
                if (typeof global.document === 'undefined') {
                    this.logger.debug('global.document is undefined. Cannot attach script');
                    return [2 /*return*/];
                }
                if (this.isUserFeedbackScriptUrlAlreadyVisible()) {
                    this.logger.debug('User feedback form is already visible');
                    return [2 /*return*/];
                }
                global['honeybadgerUserFeedbackOptions'] = __assign(__assign({}, options), { apiKey: this.config.apiKey, endpoint: this.config.userFeedbackEndpoint, noticeId: this.__lastNoticeId });
                this.appendUserFeedbackScriptTag(global, options);
                return [2 /*return*/];
            });
        });
    };
    Honeybadger.prototype.appendUserFeedbackScriptTag = function (window, options) {
        if (options === void 0) { options = {}; }
        throw new Error('Yappa');
    };
    Honeybadger.prototype.isUserFeedbackScriptUrlAlreadyVisible = function () {
        var global = (0, util_1.globalThisOrWindow)();
        var feedbackScriptUrl = this.getUserFeedbackSubmitUrl();
        for (var i = 0; i < global.document.scripts.length; i++) {
            var script = global.document.scripts[i];
            if (script.src === feedbackScriptUrl) {
                return true;
            }
        }
        return false;
    };
    Honeybadger.prototype.getUserFeedbackSubmitUrl = function () {
        return (0, exports.getUserFeedbackScriptUrl)(this.getVersion());
    };
    /** @internal */
    Honeybadger.prototype.__buildPayload = function (notice) {
        var cgiData = {
            HTTP_USER_AGENT: undefined,
            HTTP_REFERER: undefined,
            HTTP_COOKIE: undefined
        };
        if (typeof navigator !== 'undefined' && navigator.userAgent) {
            cgiData.HTTP_USER_AGENT = navigator.userAgent;
        }
        if (typeof document !== 'undefined' && document.referrer.match(/\S/)) {
            cgiData.HTTP_REFERER = document.referrer;
        }
        var cookiesObject;
        if (typeof notice.cookies === 'string') {
            cookiesObject = (0, util_1.decodeCookie)(notice.cookies);
        }
        else {
            cookiesObject = notice.cookies;
        }
        if (cookiesObject) {
            cgiData.HTTP_COOKIE = (0, util_1.encodeCookie)(filter(cookiesObject, this.config.filters));
        }
        var payload = _super.prototype.__buildPayload.call(this, notice);
        payload.request.cgi_data = merge(cgiData, payload.request.cgi_data);
        return payload;
    };
    /**
     * wrap always returns the same function so that callbacks can be removed via
     * removeEventListener.
     * @internal
     */
    Honeybadger.prototype.__wrap = function (f, opts) {
        if (opts === void 0) { opts = {}; }
        var func = f;
        if (!opts) {
            opts = {};
        }
        try {
            if (typeof func !== 'function') {
                return func;
            }
            if (!objectIsExtensible(func)) {
                return func;
            }
            if (!func.___hb) {
                // eslint-disable-next-line @typescript-eslint/no-this-alias
                var client_1 = this;
                func.___hb = function () {
                    if (util_1.preferCatch) {
                        try {
                            // eslint-disable-next-line prefer-rest-params
                            return func.apply(this, arguments);
                        }
                        catch (err) {
                            if (client_1.__lastWrapErr === err) {
                                throw (err);
                            }
                            client_1.__lastWrapErr = err;
                            (0, onerror_1.ignoreNextOnError)();
                            client_1.addBreadcrumb(opts.component ? "".concat(opts.component, ": ").concat(err.name) : err.name, {
                                category: 'error',
                                metadata: {
                                    message: err.message,
                                    name: err.name,
                                    stack: err.stack
                                }
                            });
                            if (client_1.config.enableUncaught) {
                                client_1.notify(err);
                            }
                            throw (err);
                        }
                    }
                    else {
                        // eslint-disable-next-line prefer-rest-params
                        return func.apply(this, arguments);
                    }
                };
            }
            func.___hb.___hb = func.___hb;
            return func.___hb;
        }
        catch (_e) {
            return func;
        }
    };
    /** @internal */
    Honeybadger.prototype.__incrementErrorsCount = function () {
        return this.__errorsSent++;
    };
    /** @internal */
    Honeybadger.prototype.__exceedsMaxErrors = function () {
        return this.config.maxErrors && this.__errorsSent >= this.config.maxErrors;
    };
    return Honeybadger;
}(core_1.Client));
var NOTIFIER = {
    name: '@honeybadger-io/js',
    url: 'https://github.com/honeybadger-io/honeybadger-js/tree/master/packages/js',
    version: '__VERSION__'
};
var userAgent = function () {
    if (typeof navigator !== 'undefined') {
        return "Honeybadger JS Browser Client ".concat(NOTIFIER.version, "; ").concat(navigator.userAgent);
    }
    return "Honeybadger JS Browser Client ".concat(NOTIFIER.version, "; n/a; n/a");
};
var singleton = new Honeybadger({
    __plugins: [
        (0, onerror_1.onError)(),
        (0, onunhandledrejection_1.default)(),
        (0, timers_1.default)(),
        (0, event_listeners_1.default)(),
        (0, breadcrumbs_1.default)(),
        (0, events_1.default)(),
    ]
});
singleton.setNotifier(NOTIFIER);
var core_2 = require("@honeybadger-io/core");
Object.defineProperty(exports, "Types", { enumerable: true, get: function () { return core_2.Types; } });
exports.default = singleton;
//# sourceMappingURL=browser.js.map