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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readConfigFromFileSystem = exports.getSourceFile = exports.getStats = exports.fatallyLogAndExit = void 0;
var os_1 = __importDefault(require("os"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var util_1 = require("util");
var readFile = (0, util_1.promisify)(fs_1.default.readFile);
function fatallyLogAndExit(err) {
    console.error('[Honeybadger] Exiting process due to uncaught exception');
    console.error(err.stack || err);
    process.exit(1);
}
exports.fatallyLogAndExit = fatallyLogAndExit;
function getStats() {
    return __awaiter(this, void 0, void 0, function () {
        var load, stats, fallback, memData, data, results, error_1;
        return __generator(this, function (_a) {
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
                    error_1 = _a.sent();
                    fallback();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/, stats];
            }
        });
    });
}
exports.getStats = getStats;
/**
 * Get source file if possible, used to build `notice.backtrace.source`
 *
 * @param path to source code
 */
function getSourceFile(path) {
    return __awaiter(this, void 0, void 0, function () {
        var _e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, readFile(path, 'utf-8')];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    _e_1 = _a.sent();
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.getSourceFile = getSourceFile;
function readConfigFromFileSystem() {
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
exports.readConfigFromFileSystem = readConfigFromFileSystem;
//# sourceMappingURL=util.js.map