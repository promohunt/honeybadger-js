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
exports.isBrowserConfig = exports.clone = exports.formatCGIData = exports.filterUrl = exports.filter = exports.generateStackTrace = exports.endpoint = exports.instrumentConsole = exports.instrument = exports.isErrorObject = exports.makeNotice = exports.logger = exports.sanitize = exports.shallowClone = exports.runAfterNotifyHandlers = exports.runBeforeNotifyHandlers = exports.getSourceForBacktrace = exports.getCauses = exports.calculateBacktraceShift = exports.DEFAULT_BACKTRACE_SHIFT = exports.makeBacktrace = exports.objectIsExtensible = exports.objectIsEmpty = exports.mergeNotice = exports.merge = void 0;
/* eslint-disable prefer-rest-params */
var stackTraceParser = __importStar(require("stacktrace-parser"));
function merge(obj1, obj2) {
    var result = {};
    for (var k in obj1) {
        result[k] = obj1[k];
    }
    for (var k in obj2) {
        result[k] = obj2[k];
    }
    return result;
}
exports.merge = merge;
function mergeNotice(notice1, notice2) {
    var result = merge(notice1, notice2);
    if (notice1.context && notice2.context) {
        result.context = merge(notice1.context, notice2.context);
    }
    return result;
}
exports.mergeNotice = mergeNotice;
function objectIsEmpty(obj) {
    for (var k in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, k)) {
            return false;
        }
    }
    return true;
}
exports.objectIsEmpty = objectIsEmpty;
function objectIsExtensible(obj) {
    if (typeof Object.isExtensible !== 'function') {
        return true;
    }
    return Object.isExtensible(obj);
}
exports.objectIsExtensible = objectIsExtensible;
function makeBacktrace(stack, filterHbSourceCode, logger) {
    if (filterHbSourceCode === void 0) { filterHbSourceCode = false; }
    if (logger === void 0) { logger = console; }
    if (!stack) {
        return [];
    }
    try {
        var backtrace = stackTraceParser
            .parse(stack)
            .map(function (line) {
            return {
                file: line.file,
                method: line.methodName,
                number: line.lineNumber,
                column: line.column
            };
        });
        if (filterHbSourceCode) {
            backtrace.splice(0, calculateBacktraceShift(backtrace));
        }
        return backtrace;
    }
    catch (err) {
        logger.debug(err);
        return [];
    }
}
exports.makeBacktrace = makeBacktrace;
function isFrameFromHbSourceCode(frame) {
    var hasHbFile = false;
    var hasHbMethod = false;
    if (frame.file) {
        hasHbFile = frame.file.toLowerCase().indexOf('@honeybadger-io') > -1;
    }
    if (frame.method) {
        hasHbMethod = frame.method.toLowerCase().indexOf('@honeybadger-io') > -1;
    }
    return hasHbFile || hasHbMethod;
}
exports.DEFAULT_BACKTRACE_SHIFT = 3;
/**
 * If {@link generateStackTrace} is used, we want to exclude frames that come from
 * Honeybadger's source code.
 *
 * Logic:
 * - For each frame, increment the shift if source code is from Honeybadger
 * - If a frame from an <anonymous> file is encountered increment the shift ONLY if between Honeybadger source code
 *   (i.e. previous and next frames are from Honeybadger)
 * - Exit when frame encountered is not from Honeybadger source code
 *
 * Note: this will not always work, especially in browser versions where code
 *       is minified, uglified and bundled.
 *       For those cases we default to 3:
 *       - generateStackTrace
 *       - makeNotice
 *       - notify
 */
function calculateBacktraceShift(backtrace) {
    var shift = 0;
    for (var i = 0; i < backtrace.length; i++) {
        var frame = backtrace[i];
        if (isFrameFromHbSourceCode(frame)) {
            shift++;
            continue;
        }
        if (!frame.file || frame.file === '<anonymous>') {
            var nextFrame = backtrace[i + 1];
            if (nextFrame && isFrameFromHbSourceCode(nextFrame)) {
                shift++;
                continue;
            }
        }
        break;
    }
    return shift || exports.DEFAULT_BACKTRACE_SHIFT;
}
exports.calculateBacktraceShift = calculateBacktraceShift;
function getCauses(notice, logger) {
    if (notice.cause) {
        var causes = [];
        var cause = notice;
        // @ts-ignore this throws an error if tsconfig.json has strict: true
        while (causes.length < 3 && (cause = cause.cause)) {
            causes.push({
                class: cause.name,
                message: cause.message,
                backtrace: typeof cause.stack == 'string' ? makeBacktrace(cause.stack, false, logger) : null
            });
        }
        return causes;
    }
    return [];
}
exports.getCauses = getCauses;
function getSourceForBacktrace(backtrace, getSourceFileHandler) {
    return __awaiter(this, void 0, void 0, function () {
        var result, index, trace, fileContent;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    result = [];
                    if (!getSourceFileHandler || !backtrace || !backtrace.length) {
                        return [2 /*return*/, result];
                    }
                    index = 0;
                    _a.label = 1;
                case 1:
                    if (!backtrace.length) return [3 /*break*/, 3];
                    trace = backtrace.splice(0)[index];
                    return [4 /*yield*/, getSourceFileHandler(trace.file)];
                case 2:
                    fileContent = _a.sent();
                    result[index] = getSourceCodeSnippet(fileContent, trace.number);
                    index++;
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/, result];
            }
        });
    });
}
exports.getSourceForBacktrace = getSourceForBacktrace;
function runBeforeNotifyHandlers(notice, handlers) {
    var results = [];
    var result = true;
    for (var i = 0, len = handlers.length; i < len; i++) {
        var handler = handlers[i];
        var handlerResult = handler(notice);
        if (handlerResult === false) {
            result = false;
        }
        results.push(handlerResult);
    }
    return {
        results: results,
        result: result
    };
}
exports.runBeforeNotifyHandlers = runBeforeNotifyHandlers;
function runAfterNotifyHandlers(notice, handlers, error) {
    if (notice && notice.afterNotify) {
        notice.afterNotify(error, notice);
    }
    for (var i = 0, len = handlers.length; i < len; i++) {
        handlers[i](error, notice);
    }
    return true;
}
exports.runAfterNotifyHandlers = runAfterNotifyHandlers;
// Returns a new object with properties from other object.
function shallowClone(obj) {
    if (typeof (obj) !== 'object' || obj === null) {
        return {};
    }
    var result = {};
    for (var k in obj) {
        result[k] = obj[k];
    }
    return result;
}
exports.shallowClone = shallowClone;
function sanitize(obj, maxDepth) {
    if (maxDepth === void 0) { maxDepth = 8; }
    var seenObjects = [];
    function seen(obj) {
        if (!obj || typeof (obj) !== 'object') {
            return false;
        }
        for (var i = 0; i < seenObjects.length; i++) {
            var value = seenObjects[i];
            if (value === obj) {
                return true;
            }
        }
        seenObjects.push(obj);
        return false;
    }
    function canSerialize(obj) {
        var typeOfObj = typeof obj;
        // Functions are TMI
        if (/function/.test(typeOfObj)) {
            // Let special toJSON method pass as it's used by JSON.stringify (#722)
            return obj.name === 'toJSON';
        }
        // Symbols can't convert to strings.
        if (/symbol/.test(typeOfObj)) {
            return false;
        }
        if (obj === null) {
            return false;
        }
        // No prototype, likely created with `Object.create(null)`.
        if (typeof obj === 'object' && typeof obj.hasOwnProperty === 'undefined') {
            return false;
        }
        return true;
    }
    function serialize(obj, depth) {
        if (depth === void 0) { depth = 0; }
        if (depth >= maxDepth) {
            return '[DEPTH]';
        }
        // Inspect invalid types
        if (!canSerialize(obj)) {
            return Object.prototype.toString.call(obj);
        }
        // Halt circular references
        if (seen(obj)) {
            return '[RECURSION]';
        }
        // Serialize inside arrays
        if (Array.isArray(obj)) {
            return obj.map(function (o) { return safeSerialize(o, depth + 1); });
        }
        // Serialize inside objects
        if (typeof (obj) === 'object') {
            var ret = {};
            for (var k in obj) {
                var v = obj[k];
                if (Object.prototype.hasOwnProperty.call(obj, k) && (k != null) && (v != null)) {
                    ret[k] = safeSerialize(v, depth + 1);
                }
            }
            return ret;
        }
        // Return everything else untouched
        return obj;
    }
    function safeSerialize(obj, depth) {
        if (depth === void 0) { depth = 0; }
        try {
            return serialize(obj, depth);
        }
        catch (e) {
            return "[ERROR] ".concat(e);
        }
    }
    return safeSerialize(obj);
}
exports.sanitize = sanitize;
function logger(client) {
    var log = function (method) {
        return function () {
            var _a;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (method === 'debug') {
                if (!client.config.debug) {
                    return;
                }
                // Log at default level so that you don't need to also enable verbose
                // logging in Chrome.
                method = 'log';
            }
            args.unshift('[Honeybadger]');
            (_a = client.config.logger)[method].apply(_a, args);
        };
    };
    return {
        log: log('log'),
        info: log('info'),
        debug: log('debug'),
        warn: log('warn'),
        error: log('error')
    };
}
exports.logger = logger;
/**
 * Converts any object into a notice object (which at minimum has the same
 * properties as Error, but supports additional Honeybadger properties.)
 */
function makeNotice(thing) {
    var notice;
    if (!thing) {
        notice = {};
    }
    else if (isErrorObject(thing)) {
        var e = thing;
        notice = merge(thing, { name: e.name, message: e.message, stack: e.stack, cause: e.cause });
    }
    else if (typeof thing === 'object') {
        notice = shallowClone(thing);
    }
    else {
        var m = String(thing);
        notice = { message: m };
    }
    return notice;
}
exports.makeNotice = makeNotice;
function isErrorObject(thing) {
    return thing instanceof Error
        || Object.prototype.toString.call(thing) === '[object Error]'; // Important for cross-realm objects
}
exports.isErrorObject = isErrorObject;
/**
 * Instrument an existing function inside an object (usually global).
 * @param {!Object} object
 * @param {!String} name
 * @param {!Function} replacement
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function instrument(object, name, replacement) {
    if (!object || !name || !replacement || !(name in object)) {
        return;
    }
    try {
        var original = object[name];
        while (original && original.__hb_original) {
            original = original.__hb_original;
        }
        object[name] = replacement(original);
        object[name].__hb_original = original;
    }
    catch (_e) {
        // Ignores errors where "original" is a restricted object (see #1001)
        // Uncaught Error: Permission denied to access property "__hb_original"
        // Also ignores:
        //   Error: TypeError: Cannot set property onunhandledrejection of [object Object] which has only a getter
        //   User-Agent: Mozilla/5.0 (Linux; Android 10; SAMSUNG SM-G960F) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/12.1 Chrome/79.0.3945.136 Mobile Safari/537.36
    }
}
exports.instrument = instrument;
var _consoleAlreadyInstrumented = false;
var listeners = [];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function instrumentConsole(_window, handler) {
    if (!_window || !_window.console || !handler) {
        return;
    }
    listeners.push(handler);
    if (_consoleAlreadyInstrumented) {
        return;
    }
    _consoleAlreadyInstrumented = true;
    ['debug', 'info', 'warn', 'error', 'log'].forEach(function (level) {
        instrument(_window.console, level, function hbLogger(original) {
            return function () {
                var args = Array.prototype.slice.call(arguments);
                listeners.forEach(function (listener) {
                    try {
                        listener(level, args);
                    }
                    catch (_e) {
                        // ignore
                        // should never reach here because instrument method already wraps with try/catch block
                    }
                });
                if (typeof original === 'function') {
                    Function.prototype.apply.call(original, _window.console, arguments);
                }
            };
        });
    });
}
exports.instrumentConsole = instrumentConsole;
function endpoint(base, path) {
    var endpoint = base.trim().replace(/\/$/, '');
    path = path.trim().replace(/(^\/|\/$)/g, '');
    return "".concat(endpoint, "/").concat(path);
}
exports.endpoint = endpoint;
function generateStackTrace() {
    try {
        throw new Error('');
    }
    catch (e) {
        if (e.stack) {
            return e.stack;
        }
    }
    var maxStackSize = 10;
    var stack = [];
    var curr = arguments.callee;
    while (curr && stack.length < maxStackSize) {
        if (/function(?:\s+([\w$]+))+\s*\(/.test(curr.toString())) {
            stack.push(RegExp.$1 || '<anonymous>');
        }
        else {
            stack.push('<anonymous>');
        }
        try {
            curr = curr.caller;
        }
        catch (e) {
            break;
        }
    }
    return stack.join('\n');
}
exports.generateStackTrace = generateStackTrace;
function filter(obj, filters) {
    if (!is('Object', obj)) {
        return;
    }
    if (!is('Array', filters)) {
        filters = [];
    }
    var seen = [];
    function filter(obj) {
        var k, newObj;
        if (is('Object', obj) || is('Array', obj)) {
            if (seen.indexOf(obj) !== -1) {
                return '[CIRCULAR DATA STRUCTURE]';
            }
            seen.push(obj);
        }
        if (is('Object', obj)) {
            newObj = {};
            for (k in obj) {
                if (filterMatch(k, filters)) {
                    newObj[k] = '[FILTERED]';
                }
                else {
                    newObj[k] = filter(obj[k]);
                }
            }
            return newObj;
        }
        if (is('Array', obj)) {
            return obj.map(function (v) {
                return filter(v);
            });
        }
        if (is('Function', obj)) {
            return '[FUNC]';
        }
        return obj;
    }
    return filter(obj);
}
exports.filter = filter;
function filterMatch(key, filters) {
    for (var i = 0; i < filters.length; i++) {
        if (key.toLowerCase().indexOf(filters[i].toLowerCase()) !== -1) {
            return true;
        }
    }
    return false;
}
function is(type, obj) {
    var klass = Object.prototype.toString.call(obj).slice(8, -1);
    return obj !== undefined && obj !== null && klass === type;
}
function filterUrl(url, filters) {
    if (!filters) {
        return url;
    }
    if (typeof url !== 'string') {
        return url;
    }
    var query = url.split(/\?/, 2)[1];
    if (!query) {
        return url;
    }
    var result = url;
    query.split(/[&]\s?/).forEach(function (pair) {
        var _a = pair.split('=', 2), key = _a[0], value = _a[1];
        if (filterMatch(key, filters)) {
            result = result.replace("".concat(key, "=").concat(value), "".concat(key, "=[FILTERED]"));
        }
    });
    return result;
}
exports.filterUrl = filterUrl;
function formatCGIData(vars, prefix) {
    if (prefix === void 0) { prefix = ''; }
    var formattedVars = {};
    Object.keys(vars).forEach(function (key) {
        var formattedKey = prefix + key.replace(/\W/g, '_').toUpperCase();
        formattedVars[formattedKey] = vars[key];
    });
    return formattedVars;
}
exports.formatCGIData = formatCGIData;
function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}
exports.clone = clone;
function getSourceCodeSnippet(fileData, lineNumber, sourceRadius) {
    if (sourceRadius === void 0) { sourceRadius = 2; }
    if (!fileData) {
        return null;
    }
    var lines = fileData.split('\n');
    // add one empty line because array index starts from 0, but error line number is counted from 1
    lines.unshift('');
    var start = lineNumber - sourceRadius;
    var end = lineNumber + sourceRadius;
    var result = {};
    for (var i = start; i <= end; i++) {
        var line = lines[i];
        if (typeof line === 'string') {
            result[i] = line;
        }
    }
    return result;
}
function isBrowserConfig(config) {
    return config.async !== undefined;
}
exports.isBrowserConfig = isBrowserConfig;
//# sourceMappingURL=util.js.map