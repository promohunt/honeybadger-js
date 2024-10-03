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
exports.Client = void 0;
var util_1 = require("./util");
var store_1 = require("./store");
var throttled_events_logger_1 = require("./throttled_events_logger");
var defaults_1 = require("./defaults");
// Split at commas and spaces
var TAG_SEPARATOR = /,|\s+/;
// Checks for non-blank characters
var NOT_BLANK = /\S/;
var Client = /** @class */ (function () {
    function Client(opts, transport) {
        if (opts === void 0) { opts = {}; }
        this.__pluginsLoaded = false;
        this.__store = null;
        this.__beforeNotifyHandlers = [];
        this.__afterNotifyHandlers = [];
        this.__notifier = {
            name: '@honeybadger-io/core',
            url: 'https://github.com/honeybadger-io/honeybadger-js/tree/master/packages/core',
            version: '__VERSION__'
        };
        this.config = __assign(__assign({}, defaults_1.CONFIG), opts);
        this.__initStore();
        this.__transport = transport;
        this.__eventsLogger = new throttled_events_logger_1.ThrottledEventsLogger(this.config, this.__transport);
        this.logger = (0, util_1.logger)(this);
    }
    Client.prototype.getVersion = function () {
        return this.__notifier.version;
    };
    Client.prototype.getNotifier = function () {
        return this.__notifier;
    };
    /**
     * CAREFUL: When adding a new notifier or updating the name of an existing notifier,
     * the Honeybadger rails project may need its mappings updated.
     * See https://github.com/honeybadger-io/honeybadger/blob/master/app/presenters/breadcrumbs_presenter.rb
     *     https://github.com/honeybadger-io/honeybadger/blob/master/app/models/parser/java_script.rb
     *     https://github.com/honeybadger-io/honeybadger/blob/master/app/models/language.rb
     **/
    Client.prototype.setNotifier = function (notifier) {
        this.__notifier = notifier;
    };
    Client.prototype.configure = function (opts) {
        if (opts === void 0) { opts = {}; }
        for (var k in opts) {
            this.config[k] = opts[k];
        }
        this.__eventsLogger.configure(this.config);
        this.loadPlugins();
        return this;
    };
    Client.prototype.loadPlugins = function () {
        var _this = this;
        var pluginsToLoad = this.__pluginsLoaded
            ? this.config.__plugins.filter(function (plugin) { return plugin.shouldReloadOnConfigure; })
            : this.config.__plugins;
        pluginsToLoad.forEach(function (plugin) { return plugin.load(_this); });
        this.__pluginsLoaded = true;
    };
    Client.prototype.__initStore = function () {
        this.__store = new store_1.GlobalStore({ context: {}, breadcrumbs: [] }, this.config.maxBreadcrumbs);
    };
    Client.prototype.beforeNotify = function (handler) {
        this.__beforeNotifyHandlers.push(handler);
        return this;
    };
    Client.prototype.afterNotify = function (handler) {
        this.__afterNotifyHandlers.push(handler);
        return this;
    };
    Client.prototype.setContext = function (context) {
        if (typeof context === 'object' && context != null) {
            this.__store.setContext(context);
        }
        return this;
    };
    Client.prototype.resetContext = function (context) {
        this.logger.warn('Deprecation warning: `Honeybadger.resetContext()` has been deprecated; please use `Honeybadger.clear()` instead.');
        this.__store.clear();
        if (typeof context === 'object' && context !== null) {
            this.__store.setContext(context);
        }
        return this;
    };
    Client.prototype.clear = function () {
        this.__store.clear();
        return this;
    };
    Client.prototype.notify = function (noticeable, name, extra) {
        var _this = this;
        if (name === void 0) { name = undefined; }
        if (extra === void 0) { extra = undefined; }
        var notice = this.makeNotice(noticeable, name, extra);
        // we need to have the source file data before the beforeNotifyHandlers,
        // in case they modify them
        var sourceCodeData = notice && notice.backtrace ? notice.backtrace.map(function (trace) { return (0, util_1.shallowClone)(trace); }) : null;
        var preConditionsResult = this.__runPreconditions(notice);
        if (preConditionsResult instanceof Error) {
            (0, util_1.runAfterNotifyHandlers)(notice, this.__afterNotifyHandlers, preConditionsResult);
            return false;
        }
        if (preConditionsResult instanceof Promise) {
            preConditionsResult.then(function (result) {
                if (result instanceof Error) {
                    (0, util_1.runAfterNotifyHandlers)(notice, _this.__afterNotifyHandlers, result);
                    return false;
                }
                return _this.__send(notice, sourceCodeData);
            });
            return true;
        }
        this.__send(notice, sourceCodeData).catch(function (_err) { });
        return true;
    };
    /**
     * An async version of {@link notify} that resolves only after the notice has been reported to Honeybadger.
     * Implemented using the {@link afterNotify} hook.
     * Rejects if for any reason the report failed to be reported.
     * Useful in serverless environments (AWS Lambda).
     */
    Client.prototype.notifyAsync = function (noticeable, name, extra) {
        var _this = this;
        if (name === void 0) { name = undefined; }
        if (extra === void 0) { extra = undefined; }
        return new Promise(function (resolve, reject) {
            var applyAfterNotify = function (partialNotice) {
                var originalAfterNotify = partialNotice.afterNotify;
                partialNotice.afterNotify = function (err) {
                    originalAfterNotify === null || originalAfterNotify === void 0 ? void 0 : originalAfterNotify.call(_this, err);
                    if (err) {
                        return reject(err);
                    }
                    resolve();
                };
            };
            // We have to respect any afterNotify hooks that come from the arguments
            var objectToOverride;
            if (noticeable.afterNotify) {
                objectToOverride = noticeable;
            }
            else if (name && name.afterNotify) {
                objectToOverride = name;
            }
            else if (extra && extra.afterNotify) {
                objectToOverride = extra;
            }
            else if (name && typeof name === 'object') {
                objectToOverride = name;
            }
            else if (extra) {
                objectToOverride = extra;
            }
            else {
                objectToOverride = name = {};
            }
            applyAfterNotify(objectToOverride);
            _this.notify(noticeable, name, extra);
        });
    };
    Client.prototype.makeNotice = function (noticeable, name, extra) {
        if (name === void 0) { name = undefined; }
        if (extra === void 0) { extra = undefined; }
        var notice = (0, util_1.makeNotice)(noticeable);
        if (name && !(typeof name === 'object')) {
            var n = String(name);
            name = { name: n };
        }
        if (name) {
            notice = (0, util_1.mergeNotice)(notice, name);
        }
        if (typeof extra === 'object' && extra !== null) {
            notice = (0, util_1.mergeNotice)(notice, extra);
        }
        if ((0, util_1.objectIsEmpty)(notice)) {
            return null;
        }
        var context = this.__store.getContents('context');
        var noticeTags = this.__constructTags(notice.tags);
        var contextTags = this.__constructTags(context['tags']);
        var configTags = this.__constructTags(this.config.tags);
        // Turning into a Set will remove duplicates
        var tags = noticeTags.concat(contextTags).concat(configTags);
        var uniqueTags = tags.filter(function (item, index) { return tags.indexOf(item) === index; });
        notice = (0, util_1.merge)(notice, {
            name: notice.name || 'Error',
            context: (0, util_1.merge)(context, notice.context),
            projectRoot: notice.projectRoot || this.config.projectRoot,
            environment: notice.environment || this.config.environment,
            component: notice.component || this.config.component,
            action: notice.action || this.config.action,
            revision: notice.revision || this.config.revision,
            tags: uniqueTags,
        });
        // If we're passed a custom backtrace array, use it
        // Otherwise we make one.
        if (!Array.isArray(notice.backtrace) || !notice.backtrace.length) {
            if (typeof notice.stack !== 'string' || !notice.stack.trim()) {
                notice.stack = (0, util_1.generateStackTrace)();
                notice.backtrace = (0, util_1.makeBacktrace)(notice.stack, true, this.logger);
            }
            else {
                notice.backtrace = (0, util_1.makeBacktrace)(notice.stack, false, this.logger);
            }
        }
        return notice;
    };
    Client.prototype.addBreadcrumb = function (message, opts) {
        if (!this.config.breadcrumbsEnabled) {
            return;
        }
        opts = opts || {};
        var metadata = (0, util_1.shallowClone)(opts.metadata);
        var category = opts.category || 'custom';
        var timestamp = new Date().toISOString();
        this.__store.addBreadcrumb({
            category: category,
            message: message,
            metadata: metadata,
            timestamp: timestamp
        });
        return this;
    };
    Client.prototype.logEvent = function (data) {
        this.__eventsLogger.logEvent(data);
    };
    Client.prototype.__getBreadcrumbs = function () {
        return this.__store.getContents('breadcrumbs').slice();
    };
    Client.prototype.__getContext = function () {
        return this.__store.getContents('context');
    };
    Client.prototype.__developmentMode = function () {
        if (this.config.reportData === true) {
            return false;
        }
        return (this.config.environment && this.config.developmentEnvironments.includes(this.config.environment));
    };
    Client.prototype.__buildPayload = function (notice) {
        var headers = (0, util_1.filter)(notice.headers, this.config.filters) || {};
        var cgiData = (0, util_1.filter)(__assign(__assign({}, notice.cgiData), (0, util_1.formatCGIData)(headers, 'HTTP_')), this.config.filters);
        return {
            notifier: this.__notifier,
            breadcrumbs: {
                enabled: !!this.config.breadcrumbsEnabled,
                trail: notice.__breadcrumbs || []
            },
            error: {
                class: notice.name,
                message: notice.message,
                backtrace: notice.backtrace,
                fingerprint: notice.fingerprint,
                tags: notice.tags,
                causes: (0, util_1.getCauses)(notice, this.logger),
            },
            request: {
                url: (0, util_1.filterUrl)(notice.url, this.config.filters),
                component: notice.component,
                action: notice.action,
                context: notice.context,
                cgi_data: cgiData,
                params: (0, util_1.filter)(notice.params, this.config.filters) || {},
                session: (0, util_1.filter)(notice.session, this.config.filters) || {}
            },
            server: {
                project_root: notice.projectRoot,
                environment_name: notice.environment,
                revision: notice.revision,
                hostname: this.config.hostname,
                time: new Date().toUTCString()
            },
            details: notice.details || {}
        };
    };
    Client.prototype.__constructTags = function (tags) {
        if (!tags) {
            return [];
        }
        return tags.toString().split(TAG_SEPARATOR).filter(function (tag) { return NOT_BLANK.test(tag); });
    };
    Client.prototype.__runPreconditions = function (notice) {
        var _this = this;
        var preConditionError = null;
        if (!notice) {
            this.logger.debug('failed to build error report');
            preConditionError = new Error('failed to build error report');
        }
        if (this.config.reportData === false) {
            this.logger.debug('skipping error report: honeybadger.js is disabled', notice);
            preConditionError = new Error('honeybadger.js is disabled');
        }
        if (this.__developmentMode()) {
            this.logger.log('honeybadger.js is in development mode; the following error report will be sent in production.', notice);
            preConditionError = new Error('honeybadger.js is in development mode');
        }
        if (!this.config.apiKey) {
            this.logger.warn('could not send error report: no API key has been configured', notice);
            preConditionError = new Error('missing API key');
        }
        var beforeNotifyResult = (0, util_1.runBeforeNotifyHandlers)(notice, this.__beforeNotifyHandlers);
        if (!preConditionError && !beforeNotifyResult.result) {
            this.logger.debug('skipping error report: one or more beforeNotify handlers returned false', notice);
            preConditionError = new Error('beforeNotify handlers returned false');
        }
        if (beforeNotifyResult.results.length && beforeNotifyResult.results.some(function (result) { return result instanceof Promise; })) {
            return Promise.allSettled(beforeNotifyResult.results)
                .then(function (results) {
                if (!preConditionError && (results.some(function (result) { return result.status === 'rejected' || result.value === false; }))) {
                    _this.logger.debug('skipping error report: one or more beforeNotify handlers returned false', notice);
                    preConditionError = new Error('beforeNotify handlers (async) returned false');
                }
                if (preConditionError) {
                    return preConditionError;
                }
            });
        }
        return preConditionError;
    };
    Client.prototype.__send = function (notice, originalBacktrace) {
        var _this = this;
        if (this.config.breadcrumbsEnabled) {
            this.addBreadcrumb('Honeybadger Notice', {
                category: 'notice',
                metadata: {
                    message: notice.message,
                    name: notice.name,
                    stack: notice.stack
                }
            });
            notice.__breadcrumbs = this.__store.getContents('breadcrumbs');
        }
        else {
            notice.__breadcrumbs = [];
        }
        return (0, util_1.getSourceForBacktrace)(originalBacktrace, this.__getSourceFileHandler)
            .then(function (sourcePerTrace) { return __awaiter(_this, void 0, void 0, function () {
            var payload;
            return __generator(this, function (_a) {
                sourcePerTrace.forEach(function (source, index) {
                    notice.backtrace[index].source = source;
                });
                payload = this.__buildPayload(notice);
                return [2 /*return*/, this.__transport
                        .send({
                        headers: {
                            'X-API-Key': this.config.apiKey,
                            'Content-Type': 'application/json',
                            'Accept': 'text/json, application/json'
                        },
                        method: 'POST',
                        endpoint: (0, util_1.endpoint)(this.config.endpoint, '/v1/notices/js'),
                        maxObjectDepth: this.config.maxObjectDepth,
                        logger: this.logger,
                    }, payload)];
            });
        }); })
            .then(function (res) {
            if (res.statusCode !== 201) {
                (0, util_1.runAfterNotifyHandlers)(notice, _this.__afterNotifyHandlers, new Error("Bad HTTP response: ".concat(res.statusCode)));
                _this.logger.warn("Error report failed: unknown response from server. code=".concat(res.statusCode));
                return false;
            }
            var uuid = JSON.parse(res.body).id;
            (0, util_1.runAfterNotifyHandlers)((0, util_1.merge)(notice, {
                id: uuid
            }), _this.__afterNotifyHandlers);
            _this.logger.info("Error report sent \u26A1 https://app.honeybadger.io/notice/".concat(uuid));
            return true;
        })
            .catch(function (err) {
            _this.logger.error('Error report failed: an unknown error occurred.', "message=".concat(err.message));
            (0, util_1.runAfterNotifyHandlers)(notice, _this.__afterNotifyHandlers, err);
            return false;
        });
    };
    return Client;
}());
exports.Client = Client;
//# sourceMappingURL=client.js.map