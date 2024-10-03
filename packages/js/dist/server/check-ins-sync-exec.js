#!/usr/bin/env node
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var require$$0 = require('os');
var require$$1 = require('fs');
var require$$2 = require('path');
var require$$3 = require('util');
var require$$0$1 = require('@honeybadger-io/core');
var require$$1$1 = require('url');
var require$$3$1 = require('http');
var require$$4 = require('https');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var require$$0__default = /*#__PURE__*/_interopDefaultLegacy(require$$0);
var require$$1__default = /*#__PURE__*/_interopDefaultLegacy(require$$1);
var require$$2__default = /*#__PURE__*/_interopDefaultLegacy(require$$2);
var require$$3__default = /*#__PURE__*/_interopDefaultLegacy(require$$3);
var require$$0__default$1 = /*#__PURE__*/_interopDefaultLegacy(require$$0$1);
var require$$1__default$1 = /*#__PURE__*/_interopDefaultLegacy(require$$1$1);
var require$$3__default$1 = /*#__PURE__*/_interopDefaultLegacy(require$$3$1);
var require$$4__default = /*#__PURE__*/_interopDefaultLegacy(require$$4);

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var checkInsSyncExec = {};

var checkInsSync = {};

var util = {};

var __awaiter$3 = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator$3 = (commonjsGlobal && commonjsGlobal.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(util, "__esModule", { value: true });
util.readConfigFromFileSystem = util.getSourceFile = util.getStats = util.fatallyLogAndExit = void 0;
var os_1 = __importDefault(require$$0__default["default"]);
var fs_1 = __importDefault(require$$1__default["default"]);
var path_1 = __importDefault(require$$2__default["default"]);
var util_1$1 = require$$3__default["default"];
var readFile = (0, util_1$1.promisify)(fs_1.default.readFile);
function fatallyLogAndExit(err) {
    console.error('[Honeybadger] Exiting process due to uncaught exception');
    console.error(err.stack || err);
    process.exit(1);
}
util.fatallyLogAndExit = fatallyLogAndExit;
function getStats() {
    return __awaiter$3(this, void 0, void 0, function () {
        var load, stats, fallback, memData, data, results;
        return __generator$3(this, function (_a) {
            switch (_a.label) {
                case 0:
                    load = os_1.default.loadavg();
                    stats = {
                        load: {
                            one: load[0],
                            five: load[1],
                            fifteen: load[2]
                        },
                        mem: {}
                    };
                    fallback = function () {
                        stats.mem = {
                            free: os_1.default.freemem(),
                            total: os_1.default.totalmem()
                        };
                    };
                    if (!fs_1.default.existsSync('/proc/meminfo')) {
                        fallback();
                        return [2 /*return*/, stats];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, readFile('/proc/meminfo', 'utf8')
                        // The first four lines, in order, are Total, Free, Buffers, Cached.
                        // @TODO: Figure out if there's a way to only read these lines
                    ];
                case 2:
                    memData = _a.sent();
                    data = memData.split('\n').slice(0, 4);
                    results = data.map(function (i) {
                        return parseInt(/\s+(\d+)\skB/i.exec(i)[1], 10) / 1024.0;
                    });
                    stats.mem = {
                        total: results[0],
                        free: results[1],
                        buffers: results[2],
                        cached: results[3],
                        free_total: results[1] + results[2] + results[3]
                    };
                    return [3 /*break*/, 4];
                case 3:
                    _a.sent();
                    fallback();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/, stats];
            }
        });
    });
}
util.getStats = getStats;
/**
 * Get source file if possible, used to build `notice.backtrace.source`
 *
 * @param path to source code
 */
function getSourceFile(path) {
    return __awaiter$3(this, void 0, void 0, function () {
        return __generator$3(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, readFile(path, 'utf-8')];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    _a.sent();
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
util.getSourceFile = getSourceFile;
function readConfigFromFileSystem$1() {
    var options = ['honeybadger.config.js', 'honeybadger.config.ts'];
    var config = null;
    while (config === null && options.length > 0) {
        var configPath = options.shift();
        try {
            config = require(path_1.default.join(process.cwd(), configPath));
        }
        catch (_e) { /* empty */ }
    }
    return config;
}
util.readConfigFromFileSystem = readConfigFromFileSystem$1;

var checkInsManager = {};

var client = {};

var checkIn = {};

Object.defineProperty(checkIn, "__esModule", { value: true });
checkIn.CheckIn = void 0;
var CheckIn = /** @class */ (function () {
    function CheckIn(props) {
        this.id = props.id;
        this.name = props.name;
        this.slug = props.slug;
        this.scheduleType = props.scheduleType;
        this.reportPeriod = props.reportPeriod;
        this.gracePeriod = props.gracePeriod;
        this.cronSchedule = props.cronSchedule;
        this.cronTimezone = props.cronTimezone;
        this.deleted = false;
    }
    CheckIn.prototype.isDeleted = function () {
        return this.deleted;
    };
    CheckIn.prototype.markAsDeleted = function () {
        this.deleted = true;
    };
    CheckIn.prototype.validate = function () {
        if (!this.slug) {
            throw new Error('slug is required for each check-in');
        }
        if (!this.scheduleType) {
            throw new Error('scheduleType is required for each check-in');
        }
        if (!['simple', 'cron'].includes(this.scheduleType)) {
            throw new Error("".concat(this.slug, " [scheduleType] must be \"simple\" or \"cron\""));
        }
        if (this.scheduleType === 'simple' && !this.reportPeriod) {
            throw new Error("".concat(this.slug, " [reportPeriod] is required for simple check-ins"));
        }
        if (this.scheduleType === 'cron' && !this.cronSchedule) {
            throw new Error("".concat(this.slug, " [cronSchedule] is required for cron check-ins"));
        }
    };
    CheckIn.prototype.asRequestPayload = function () {
        var _a, _b;
        var payload = {
            name: this.name,
            schedule_type: this.scheduleType,
            slug: this.slug,
            grace_period: (_a = this.gracePeriod) !== null && _a !== void 0 ? _a : '' // default is empty string
        };
        if (this.scheduleType === 'simple') {
            payload.report_period = this.reportPeriod;
        }
        else {
            payload.cron_schedule = this.cronSchedule;
            payload.cron_timezone = (_b = this.cronTimezone) !== null && _b !== void 0 ? _b : ''; // default is empty string
        }
        return payload;
    };
    /**
     * Compares two check-ins, usually the one from the API and the one from the config file.
     * If the one in the config file does not match the check-in from the API,
     * then we issue an update request.
     *
     * `name`, `gracePeriod` and `cronTimezone` are optional fields that are automatically
     * set to a value from the server if one is not provided,
     * so we ignore their values if they are not set locally.
     */
    CheckIn.prototype.isInSync = function (other) {
        var ignoreNameCheck = this.name === undefined;
        var ignoreGracePeriodCheck = this.gracePeriod === undefined;
        var ignoreCronTimezoneCheck = this.cronTimezone === undefined;
        return this.slug === other.slug
            && this.scheduleType === other.scheduleType
            && this.reportPeriod === other.reportPeriod
            && this.cronSchedule === other.cronSchedule
            && (ignoreNameCheck || this.name === other.name)
            && (ignoreGracePeriodCheck || this.gracePeriod === other.gracePeriod)
            && (ignoreCronTimezoneCheck || this.cronTimezone === other.cronTimezone);
    };
    CheckIn.fromResponsePayload = function (payload) {
        return new CheckIn({
            id: payload.id,
            name: payload.name,
            slug: payload.slug,
            scheduleType: payload.schedule_type,
            reportPeriod: payload.report_period,
            gracePeriod: payload.grace_period,
            cronSchedule: payload.cron_schedule,
            cronTimezone: payload.cron_timezone,
        });
    };
    return CheckIn;
}());
checkIn.CheckIn = CheckIn;

var __awaiter$2 = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator$2 = (commonjsGlobal && commonjsGlobal.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
Object.defineProperty(client, "__esModule", { value: true });
client.CheckInsClient = void 0;
var check_in_1$1 = checkIn;
var CheckInsClient = /** @class */ (function () {
    function CheckInsClient(config, transport) {
        this.BASE_URL = 'https://app.honeybadger.io';
        this.transport = transport;
        this.config = config;
        this.logger = config.logger;
    }
    CheckInsClient.prototype.getProjectId = function (projectApiKey) {
        var _a;
        return __awaiter$2(this, void 0, void 0, function () {
            var response, data;
            return __generator$2(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.config.personalAuthToken || this.config.personalAuthToken === '') {
                            throw new Error('personalAuthToken is required');
                        }
                        return [4 /*yield*/, this.transport.send({
                                method: 'GET',
                                headers: this.getHeaders(),
                                endpoint: "".concat(this.BASE_URL, "/v2/project_keys/").concat(projectApiKey),
                                logger: this.logger,
                            })];
                    case 1:
                        response = _b.sent();
                        if (response.statusCode !== 200) {
                            throw new Error("Failed to fetch project[".concat(projectApiKey, "]: ").concat(this.getErrorMessage(response.body)));
                        }
                        data = JSON.parse(response.body);
                        return [2 /*return*/, (_a = data === null || data === void 0 ? void 0 : data.project) === null || _a === void 0 ? void 0 : _a.id];
                }
            });
        });
    };
    CheckInsClient.prototype.listForProject = function (projectId) {
        return __awaiter$2(this, void 0, void 0, function () {
            var response, data;
            return __generator$2(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.config.personalAuthToken || this.config.personalAuthToken === '') {
                            throw new Error('personalAuthToken is required');
                        }
                        return [4 /*yield*/, this.transport.send({
                                method: 'GET',
                                headers: this.getHeaders(),
                                endpoint: "".concat(this.BASE_URL, "/v2/projects/").concat(projectId, "/check_ins"),
                                logger: this.logger,
                            })];
                    case 1:
                        response = _a.sent();
                        if (response.statusCode !== 200) {
                            throw new Error("Failed to fetch checkins for project[".concat(projectId, "]: ").concat(this.getErrorMessage(response.body)));
                        }
                        data = JSON.parse(response.body);
                        return [2 /*return*/, data.results.map(function (checkin) { return check_in_1$1.CheckIn.fromResponsePayload(checkin); })];
                }
            });
        });
    };
    CheckInsClient.prototype.get = function (projectId, checkInId) {
        return __awaiter$2(this, void 0, void 0, function () {
            var response, data;
            return __generator$2(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.config.personalAuthToken || this.config.personalAuthToken === '') {
                            throw new Error('personalAuthToken is required');
                        }
                        return [4 /*yield*/, this.transport.send({
                                method: 'GET',
                                headers: this.getHeaders(),
                                endpoint: "".concat(this.BASE_URL, "/v2/projects/").concat(projectId, "/check_ins/").concat(checkInId),
                                logger: this.logger,
                            })];
                    case 1:
                        response = _a.sent();
                        if (response.statusCode !== 200) {
                            throw new Error("Failed to fetch check-in[".concat(checkInId, "] for project[").concat(projectId, "]: ").concat(this.getErrorMessage(response.body)));
                        }
                        data = JSON.parse(response.body);
                        return [2 /*return*/, check_in_1$1.CheckIn.fromResponsePayload(data)];
                }
            });
        });
    };
    CheckInsClient.prototype.create = function (projectId, checkIn) {
        return __awaiter$2(this, void 0, void 0, function () {
            var response, data;
            return __generator$2(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.config.personalAuthToken || this.config.personalAuthToken === '') {
                            throw new Error('personalAuthToken is required');
                        }
                        return [4 /*yield*/, this.transport.send({
                                method: 'POST',
                                headers: this.getHeaders(),
                                endpoint: "".concat(this.BASE_URL, "/v2/projects/").concat(projectId, "/check_ins"),
                                logger: this.logger,
                            }, { check_in: checkIn.asRequestPayload() })];
                    case 1:
                        response = _a.sent();
                        if (response.statusCode !== 201) {
                            throw new Error("Failed to create check-in[".concat(checkIn.slug, "] for project[").concat(projectId, "]: ").concat(this.getErrorMessage(response.body)));
                        }
                        data = JSON.parse(response.body);
                        return [2 /*return*/, check_in_1$1.CheckIn.fromResponsePayload(data)];
                }
            });
        });
    };
    CheckInsClient.prototype.update = function (projectId, checkIn) {
        return __awaiter$2(this, void 0, void 0, function () {
            var response;
            return __generator$2(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.config.personalAuthToken || this.config.personalAuthToken === '') {
                            throw new Error('personalAuthToken is required');
                        }
                        return [4 /*yield*/, this.transport.send({
                                method: 'PUT',
                                headers: this.getHeaders(),
                                endpoint: "".concat(this.BASE_URL, "/v2/projects/").concat(projectId, "/check_ins/").concat(checkIn.id),
                                logger: this.logger,
                            }, { check_in: checkIn.asRequestPayload() })];
                    case 1:
                        response = _a.sent();
                        if (response.statusCode !== 204) {
                            throw new Error("Failed to update checkin[".concat(checkIn.slug, "] for project[").concat(projectId, "]: ").concat(this.getErrorMessage(response.body)));
                        }
                        return [2 /*return*/, checkIn];
                }
            });
        });
    };
    CheckInsClient.prototype.remove = function (projectId, checkIn) {
        return __awaiter$2(this, void 0, void 0, function () {
            var response;
            return __generator$2(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.config.personalAuthToken || this.config.personalAuthToken === '') {
                            throw new Error('personalAuthToken is required');
                        }
                        return [4 /*yield*/, this.transport.send({
                                method: 'DELETE',
                                headers: this.getHeaders(),
                                endpoint: "".concat(this.BASE_URL, "/v2/projects/").concat(projectId, "/check_ins/").concat(checkIn.id),
                                logger: this.logger,
                            })];
                    case 1:
                        response = _a.sent();
                        if (response.statusCode !== 204) {
                            throw new Error("Failed to remove checkin[".concat(checkIn.slug, "] for project[").concat(projectId, "]: ").concat(this.getErrorMessage(response.body)));
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CheckInsClient.prototype.getHeaders = function () {
        return {
            'Authorization': "Basic ".concat(Buffer.from("".concat(this.config.personalAuthToken, ":")).toString('base64')),
            'Content-Type': 'application/json'
        };
    };
    CheckInsClient.prototype.getErrorMessage = function (responseBody) {
        var _a;
        if (!responseBody) {
            return '';
        }
        try {
            var jsonBody = JSON.parse(responseBody);
            return (_a = jsonBody.errors) !== null && _a !== void 0 ? _a : '';
        }
        catch (e) {
            return responseBody;
        }
    };
    return CheckInsClient;
}());
client.CheckInsClient = CheckInsClient;

var transport = {};

var __assign = (commonjsGlobal && commonjsGlobal.__assign) || function () {
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
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
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
var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(transport, "__esModule", { value: true });
transport.ServerTransport = void 0;
var core_1$1 = require$$0__default$1["default"];
var url_1 = require$$1__default$1["default"];
var util_1 = util;
var http = __importStar(require$$3__default$1["default"]);
var https = __importStar(require$$4__default["default"]);
var sanitize = core_1$1.Util.sanitize;
var ServerTransport = /** @class */ (function () {
    function ServerTransport(headers) {
        if (headers === void 0) { headers = {}; }
        this.headers = {};
        this.headers = headers;
    }
    ServerTransport.prototype.defaultHeaders = function () {
        return this.headers;
    };
    ServerTransport.prototype.send = function (options, payload) {
        var _this = this;
        var _a = new url_1.URL(options.endpoint), protocol = _a.protocol, hostname = _a.hostname, pathname = _a.pathname;
        var transport = (protocol === 'http:' ? http : https);
        return new Promise(function (resolve, reject) {
            var promise;
            // this should not be here. it should be done before reaching the transport layer
            // it could be inside a beforeNotifyHandler, but is not possible at the moment because those handlers are synchronous
            if (_this.isNoticePayload(payload)) {
                promise = _this.appendMetadata(payload);
            }
            else {
                promise = Promise.resolve();
            }
            promise.then(function () {
                //
                // We use a httpOptions object to limit issues with libraries that may patch Node.js
                // See https://github.com/honeybadger-io/honeybadger-js/issues/825#issuecomment-1193113433
                var httpOptions = {
                    method: options.method,
                    headers: __assign(__assign({}, _this.defaultHeaders()), options.headers),
                    path: pathname,
                    protocol: protocol,
                    hostname: hostname,
                };
                var data = undefined;
                if (payload) {
                    var dataStr = typeof payload === 'string' ? payload : JSON.stringify(sanitize(payload, options.maxObjectDepth));
                    data = Buffer.from(dataStr, 'utf8');
                    httpOptions.headers['Content-Length'] = data.length;
                }
                var req = transport.request(httpOptions, function (res) {
                    options.logger.debug("statusCode: ".concat(res.statusCode));
                    var body = '';
                    res.on('data', function (chunk) {
                        body += chunk;
                    });
                    res.on('end', function () { return resolve({ statusCode: res.statusCode, body: body }); });
                });
                req.on('error', function (err) { return reject(err); });
                if (data) {
                    req.write(data);
                }
                req.end();
            });
        });
    };
    ServerTransport.prototype.isNoticePayload = function (payload) {
        return payload && payload.error !== undefined;
    };
    ServerTransport.prototype.appendMetadata = function (payload) {
        payload.server.pid = process.pid;
        return (0, util_1.getStats)()
            .then(function (stats) {
            payload.server.stats = stats;
        });
    };
    return ServerTransport;
}());
transport.ServerTransport = ServerTransport;

var __awaiter$1 = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator$1 = (commonjsGlobal && commonjsGlobal.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
var __spreadArray = (commonjsGlobal && commonjsGlobal.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(checkInsManager, "__esModule", { value: true });
checkInsManager.CheckInsManager = void 0;
var core_1 = require$$0__default$1["default"];
var client_1 = client;
var transport_1 = transport;
var check_in_1 = checkIn;
var CheckInsManager$1 = /** @class */ (function () {
    function CheckInsManager(config, client) {
        var _a, _b, _c, _d, _e;
        this.config = {
            debug: (_a = config.debug) !== null && _a !== void 0 ? _a : false,
            apiKey: (_b = config.apiKey) !== null && _b !== void 0 ? _b : undefined,
            personalAuthToken: (_c = config.personalAuthToken) !== null && _c !== void 0 ? _c : undefined,
            checkins: (_d = config.checkins) !== null && _d !== void 0 ? _d : [],
            logger: (_e = config.logger) !== null && _e !== void 0 ? _e : console,
        };
        var transport = new transport_1.ServerTransport();
        this.logger = core_1.Util.logger(this);
        this.client = client !== null && client !== void 0 ? client : new client_1.CheckInsClient({
            apiKey: config.apiKey,
            personalAuthToken: config.personalAuthToken,
            logger: this.logger
        }, transport);
    }
    CheckInsManager.prototype.sync = function () {
        return __awaiter$1(this, void 0, void 0, function () {
            var localCheckIns, projectId, remoteCheckIns, createdOrUpdated, removed;
            return __generator$1(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // check if api key is set
                        if (!this.config.apiKey || this.config.apiKey === '') {
                            throw new Error('apiKey is required');
                        }
                        // check if personal auth token is set
                        if (!this.config.personalAuthToken || this.config.personalAuthToken === '') {
                            throw new Error('personalAuthToken is required');
                        }
                        localCheckIns = this.getLocalCheckIns();
                        return [4 /*yield*/, this.client.getProjectId(this.config.apiKey)];
                    case 1:
                        projectId = _a.sent();
                        return [4 /*yield*/, this.client.listForProject(projectId)];
                    case 2:
                        remoteCheckIns = _a.sent();
                        return [4 /*yield*/, this.createOrUpdate(projectId, localCheckIns, remoteCheckIns)];
                    case 3:
                        createdOrUpdated = _a.sent();
                        return [4 /*yield*/, this.remove(projectId, localCheckIns, remoteCheckIns)];
                    case 4:
                        removed = _a.sent();
                        return [2 /*return*/, __spreadArray(__spreadArray([], createdOrUpdated, true), removed, true)];
                }
            });
        });
    };
    CheckInsManager.prototype.getLocalCheckIns = function () {
        // create check-ins from configuration and validate them
        var localCheckIns = this.config.checkins.map(function (dto) {
            var checkIn = new check_in_1.CheckIn(dto);
            checkIn.validate();
            return checkIn;
        });
        // validate that we have unique check-in slugs
        var checkInSlugs = localCheckIns.map(function (checkIn) { return checkIn.slug; });
        var uniqueCheckInSlugs = new Set(checkInSlugs);
        if (checkInSlugs.length !== uniqueCheckInSlugs.size) {
            throw new Error('check-in slugs must be unique');
        }
        return localCheckIns;
    };
    CheckInsManager.prototype.createOrUpdate = function (projectId, localCheckIns, remoteCheckIns) {
        return __awaiter$1(this, void 0, void 0, function () {
            var results, _loop_1, this_1, _i, localCheckIns_1, localCheckIn;
            return __generator$1(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        results = [];
                        _loop_1 = function (localCheckIn) {
                            var remoteCheckIn, _b, _c, _d, _e;
                            return __generator$1(this, function (_f) {
                                switch (_f.label) {
                                    case 0:
                                        remoteCheckIn = remoteCheckIns.find(function (checkIn) {
                                            return checkIn.slug === localCheckIn.slug;
                                        });
                                        if (!!remoteCheckIn) return [3 /*break*/, 2];
                                        _c = (_b = results).push;
                                        return [4 /*yield*/, this_1.client.create(projectId, localCheckIn)];
                                    case 1:
                                        _c.apply(_b, [_f.sent()]);
                                        return [3 /*break*/, 5];
                                    case 2:
                                        if (!!localCheckIn.isInSync(remoteCheckIn)) return [3 /*break*/, 4];
                                        localCheckIn.id = remoteCheckIn.id;
                                        _e = (_d = results).push;
                                        return [4 /*yield*/, this_1.client.update(projectId, localCheckIn)];
                                    case 3:
                                        _e.apply(_d, [_f.sent()]);
                                        return [3 /*break*/, 5];
                                    case 4:
                                        // no change - still need to add to results
                                        results.push(remoteCheckIn);
                                        _f.label = 5;
                                    case 5: return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _i = 0, localCheckIns_1 = localCheckIns;
                        _a.label = 1;
                    case 1:
                        if (!(_i < localCheckIns_1.length)) return [3 /*break*/, 4];
                        localCheckIn = localCheckIns_1[_i];
                        return [5 /*yield**/, _loop_1(localCheckIn)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, results];
                }
            });
        });
    };
    CheckInsManager.prototype.remove = function (projectId, localCheckIns, remoteCheckIns) {
        return __awaiter$1(this, void 0, void 0, function () {
            var checkInsToRemove;
            var _this = this;
            return __generator$1(this, function (_a) {
                checkInsToRemove = remoteCheckIns.filter(function (remoteCheckIn) {
                    return !localCheckIns.find(function (localCheckIn) {
                        return localCheckIn.slug === remoteCheckIn.slug;
                    });
                });
                return [2 /*return*/, Promise.all(checkInsToRemove.map(function (checkIn) { return __awaiter$1(_this, void 0, void 0, function () {
                        return __generator$1(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.client.remove(projectId, checkIn)];
                                case 1:
                                    _a.sent();
                                    checkIn.markAsDeleted();
                                    return [2 /*return*/, checkIn];
                            }
                        });
                    }); }))];
            });
        });
    };
    return CheckInsManager;
}());
checkInsManager.CheckInsManager = CheckInsManager$1;

var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (commonjsGlobal && commonjsGlobal.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
Object.defineProperty(checkInsSync, "__esModule", { value: true });
checkInsSync.syncCheckIns = void 0;
var readConfigFromFileSystem = util.readConfigFromFileSystem;
var CheckInsManager = checkInsManager.CheckInsManager;
function syncCheckIns$1() {
    return __awaiter(this, void 0, void 0, function () {
        var config, checkInsManager, checkIns, table;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    config = readConfigFromFileSystem();
                    if (!config) {
                        throw new Error('Could not find a Honeybadger configuration file.');
                    }
                    checkInsManager = new CheckInsManager(config);
                    return [4 /*yield*/, checkInsManager.sync()];
                case 1:
                    checkIns = _a.sent();
                    if (!checkIns.length) {
                        console.log('No check-ins found to synchronize with Honeybadger.');
                        return [2 /*return*/];
                    }
                    table = checkIns.map(function (c) {
                        return {
                            'Id': c.id,
                            'Name': c.name,
                            'Slug': c.slug,
                            'Schedule Type': c.scheduleType,
                            'Report Period': c.reportPeriod,
                            'Cron Schedule': c.cronSchedule,
                            'Cron Timezone': c.cronTimezone,
                            'Grace Period': c.gracePeriod,
                            'Status': c.isDeleted() ? '❌ Removed' : '✅ Synchronized'
                        };
                    });
                    console.log('Check-ins were synchronized with Honeybadger.');
                    console.table(table);
                    return [2 /*return*/];
            }
        });
    });
}
checkInsSync.syncCheckIns = syncCheckIns$1;

var syncCheckIns = checkInsSync.syncCheckIns;
syncCheckIns().catch(function (err) {
    console.error(err);
    process.exit(1);
});

exports["default"] = checkInsSyncExec;
//# sourceMappingURL=check-ins-sync-exec.js.map
