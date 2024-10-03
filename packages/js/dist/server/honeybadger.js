'use strict';

var require$$0$2 = require('os');
var require$$1$1 = require('domain');
var require$$1 = require('fs');
var require$$2 = require('path');
var require$$3 = require('util');
var require$$0$3 = require('url');
var require$$3$1 = require('http');
var require$$4 = require('https');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var require$$0__default = /*#__PURE__*/_interopDefaultLegacy(require$$0$2);
var require$$1__default$1 = /*#__PURE__*/_interopDefaultLegacy(require$$1$1);
var require$$1__default = /*#__PURE__*/_interopDefaultLegacy(require$$1);
var require$$2__default = /*#__PURE__*/_interopDefaultLegacy(require$$2);
var require$$3__default = /*#__PURE__*/_interopDefaultLegacy(require$$3);
var require$$0__default$1 = /*#__PURE__*/_interopDefaultLegacy(require$$0$3);
var require$$3__default$1 = /*#__PURE__*/_interopDefaultLegacy(require$$3$1);
var require$$4__default = /*#__PURE__*/_interopDefaultLegacy(require$$4);

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function getAugmentedNamespace(n) {
  var f = n.default;
	if (typeof f == "function") {
		var a = function () {
			return f.apply(this, arguments);
		};
		a.prototype = f.prototype;
  } else a = {};
  Object.defineProperty(a, '__esModule', {value: true});
	Object.keys(n).forEach(function (k) {
		var d = Object.getOwnPropertyDescriptor(n, k);
		Object.defineProperty(a, k, d.get ? d : {
			enumerable: true,
			get: function () {
				return n[k];
			}
		});
	});
	return a;
}

var server$1 = {};

var src = {};

var client$1 = {};

var util$1 = {};

var UNKNOWN_FUNCTION = '<unknown>';
/**
 * This parses the different stack traces and puts them into one format
 * This borrows heavily from TraceKit (https://github.com/csnover/TraceKit)
 */

function parse(stackString) {
  var lines = stackString.split('\n');
  return lines.reduce(function (stack, line) {
    var parseResult = parseChrome(line) || parseWinjs(line) || parseGecko(line) || parseNode(line) || parseJSC(line);

    if (parseResult) {
      stack.push(parseResult);
    }

    return stack;
  }, []);
}
var chromeRe = /^\s*at (.*?) ?\(((?:file|https?|blob|chrome-extension|native|eval|webpack|<anonymous>|\/|[a-z]:\\|\\\\).*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i;
var chromeEvalRe = /\((\S*)(?::(\d+))(?::(\d+))\)/;

function parseChrome(line) {
  var parts = chromeRe.exec(line);

  if (!parts) {
    return null;
  }

  var isNative = parts[2] && parts[2].indexOf('native') === 0; // start of line

  var isEval = parts[2] && parts[2].indexOf('eval') === 0; // start of line

  var submatch = chromeEvalRe.exec(parts[2]);

  if (isEval && submatch != null) {
    // throw out eval line/column and use top-most line/column number
    parts[2] = submatch[1]; // url

    parts[3] = submatch[2]; // line

    parts[4] = submatch[3]; // column
  }

  return {
    file: !isNative ? parts[2] : null,
    methodName: parts[1] || UNKNOWN_FUNCTION,
    arguments: isNative ? [parts[2]] : [],
    lineNumber: parts[3] ? +parts[3] : null,
    column: parts[4] ? +parts[4] : null
  };
}

var winjsRe = /^\s*at (?:((?:\[object object\])?.+) )?\(?((?:file|ms-appx|https?|webpack|blob):.*?):(\d+)(?::(\d+))?\)?\s*$/i;

function parseWinjs(line) {
  var parts = winjsRe.exec(line);

  if (!parts) {
    return null;
  }

  return {
    file: parts[2],
    methodName: parts[1] || UNKNOWN_FUNCTION,
    arguments: [],
    lineNumber: +parts[3],
    column: parts[4] ? +parts[4] : null
  };
}

var geckoRe = /^\s*(.*?)(?:\((.*?)\))?(?:^|@)((?:file|https?|blob|chrome|webpack|resource|\[native).*?|[^@]*bundle)(?::(\d+))?(?::(\d+))?\s*$/i;
var geckoEvalRe = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i;

function parseGecko(line) {
  var parts = geckoRe.exec(line);

  if (!parts) {
    return null;
  }

  var isEval = parts[3] && parts[3].indexOf(' > eval') > -1;
  var submatch = geckoEvalRe.exec(parts[3]);

  if (isEval && submatch != null) {
    // throw out eval line/column and use top-most line number
    parts[3] = submatch[1];
    parts[4] = submatch[2];
    parts[5] = null; // no column when eval
  }

  return {
    file: parts[3],
    methodName: parts[1] || UNKNOWN_FUNCTION,
    arguments: parts[2] ? parts[2].split(',') : [],
    lineNumber: parts[4] ? +parts[4] : null,
    column: parts[5] ? +parts[5] : null
  };
}

var javaScriptCoreRe = /^\s*(?:([^@]*)(?:\((.*?)\))?@)?(\S.*?):(\d+)(?::(\d+))?\s*$/i;

function parseJSC(line) {
  var parts = javaScriptCoreRe.exec(line);

  if (!parts) {
    return null;
  }

  return {
    file: parts[3],
    methodName: parts[1] || UNKNOWN_FUNCTION,
    arguments: [],
    lineNumber: +parts[4],
    column: parts[5] ? +parts[5] : null
  };
}

var nodeRe = /^\s*at (?:((?:\[object object\])?[^\\/]+(?: \[as \S+\])?) )?\(?(.*?):(\d+)(?::(\d+))?\)?\s*$/i;

function parseNode(line) {
  var parts = nodeRe.exec(line);

  if (!parts) {
    return null;
  }

  return {
    file: parts[2],
    methodName: parts[1] || UNKNOWN_FUNCTION,
    arguments: [],
    lineNumber: +parts[3],
    column: parts[4] ? +parts[4] : null
  };
}

var stackTraceParser_esm = /*#__PURE__*/Object.freeze({
	__proto__: null,
	parse: parse
});

var require$$0$1 = /*@__PURE__*/getAugmentedNamespace(stackTraceParser_esm);

(function (exports) {
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
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.isBrowserConfig = exports.clone = exports.formatCGIData = exports.filterUrl = exports.filter = exports.generateStackTrace = exports.endpoint = exports.instrumentConsole = exports.instrument = exports.isErrorObject = exports.makeNotice = exports.logger = exports.sanitize = exports.shallowClone = exports.runAfterNotifyHandlers = exports.runBeforeNotifyHandlers = exports.getSourceForBacktrace = exports.getCauses = exports.calculateBacktraceShift = exports.DEFAULT_BACKTRACE_SHIFT = exports.makeBacktrace = exports.objectIsExtensible = exports.objectIsEmpty = exports.mergeNotice = exports.merge = void 0;
	/* eslint-disable prefer-rest-params */
	var stackTraceParser = __importStar(require$$0$1);
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
	
} (util$1));

var store = {};

Object.defineProperty(store, "__esModule", { value: true });
store.GlobalStore = void 0;
var util_1$6 = util$1;
var GlobalStore = /** @class */ (function () {
    function GlobalStore(contents, breadcrumbsLimit) {
        this.contents = contents;
        this.breadcrumbsLimit = breadcrumbsLimit;
    }
    GlobalStore.create = function (contents, breadcrumbsLimit) {
        return new GlobalStore(contents, breadcrumbsLimit);
    };
    GlobalStore.prototype.available = function () {
        return true;
    };
    GlobalStore.prototype.getContents = function (key) {
        var value = key ? this.contents[key] : this.contents;
        return JSON.parse(JSON.stringify(value));
    };
    GlobalStore.prototype.setContext = function (context) {
        this.contents.context = (0, util_1$6.merge)(this.contents.context, context || {});
    };
    GlobalStore.prototype.addBreadcrumb = function (breadcrumb) {
        if (this.contents.breadcrumbs.length == this.breadcrumbsLimit) {
            this.contents.breadcrumbs.shift();
        }
        this.contents.breadcrumbs.push(breadcrumb);
    };
    GlobalStore.prototype.clear = function () {
        this.contents.context = {};
        this.contents.breadcrumbs = [];
    };
    GlobalStore.prototype.run = function (callback) {
        return callback();
    };
    return GlobalStore;
}());
store.GlobalStore = GlobalStore;

var throttled_events_logger = {};

class NdJson {
    static parse(data) {
        const lines = data.trim().split('\n');
        return lines.map(line => JSON.parse(line));
    }
    static stringify(data) {
        return data.map(item => JSON.stringify(item)).join('\n');
    }
}

var module$1 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	NdJson: NdJson
});

var require$$0 = /*@__PURE__*/getAugmentedNamespace(module$1);

var defaults = {};

Object.defineProperty(defaults, "__esModule", { value: true });
defaults.CONFIG = void 0;
defaults.CONFIG = {
    apiKey: null,
    endpoint: 'https://api.honeybadger.io',
    environment: null,
    hostname: null,
    projectRoot: null,
    component: null,
    action: null,
    revision: null,
    reportData: null,
    breadcrumbsEnabled: true,
    eventsEnabled: false,
    maxBreadcrumbs: 40,
    maxObjectDepth: 8,
    logger: console,
    developmentEnvironments: ['dev', 'development', 'test'],
    debug: false,
    tags: null,
    enableUncaught: true,
    enableUnhandledRejection: true,
    afterUncaught: function () { return true; },
    filters: ['creditcard', 'password'],
    __plugins: [],
};

var __assign$2 = (commonjsGlobal && commonjsGlobal.__assign) || function () {
    __assign$2 = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$2.apply(this, arguments);
};
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
Object.defineProperty(throttled_events_logger, "__esModule", { value: true });
throttled_events_logger.ThrottledEventsLogger = void 0;
var json_nd_1 = require$$0;
var util_1$5 = util$1;
var defaults_1$1 = defaults;
var ThrottledEventsLogger = /** @class */ (function () {
    function ThrottledEventsLogger(config, transport) {
        this.config = config;
        this.transport = transport;
        this.queue = [];
        this.isProcessing = false;
        this.config = __assign$2(__assign$2({}, defaults_1$1.CONFIG), config);
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
        return __awaiter$3(this, void 0, void 0, function () {
            var _this = this;
            return __generator$3(this, function (_a) {
                return [2 /*return*/, this.transport
                        .send({
                        headers: {
                            'X-API-Key': this.config.apiKey,
                            'Content-Type': 'application/json',
                        },
                        method: 'POST',
                        endpoint: (0, util_1$5.endpoint)(this.config.endpoint, '/v1/events'),
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
throttled_events_logger.ThrottledEventsLogger = ThrottledEventsLogger;

var __assign$1 = (commonjsGlobal && commonjsGlobal.__assign) || function () {
    __assign$1 = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$1.apply(this, arguments);
};
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
Object.defineProperty(client$1, "__esModule", { value: true });
client$1.Client = void 0;
var util_1$4 = util$1;
var store_1 = store;
var throttled_events_logger_1 = throttled_events_logger;
var defaults_1 = defaults;
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
            version: '6.8.3'
        };
        this.config = __assign$1(__assign$1({}, defaults_1.CONFIG), opts);
        this.__initStore();
        this.__transport = transport;
        this.__eventsLogger = new throttled_events_logger_1.ThrottledEventsLogger(this.config, this.__transport);
        this.logger = (0, util_1$4.logger)(this);
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
        var sourceCodeData = notice && notice.backtrace ? notice.backtrace.map(function (trace) { return (0, util_1$4.shallowClone)(trace); }) : null;
        var preConditionsResult = this.__runPreconditions(notice);
        if (preConditionsResult instanceof Error) {
            (0, util_1$4.runAfterNotifyHandlers)(notice, this.__afterNotifyHandlers, preConditionsResult);
            return false;
        }
        if (preConditionsResult instanceof Promise) {
            preConditionsResult.then(function (result) {
                if (result instanceof Error) {
                    (0, util_1$4.runAfterNotifyHandlers)(notice, _this.__afterNotifyHandlers, result);
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
        var notice = (0, util_1$4.makeNotice)(noticeable);
        if (name && !(typeof name === 'object')) {
            var n = String(name);
            name = { name: n };
        }
        if (name) {
            notice = (0, util_1$4.mergeNotice)(notice, name);
        }
        if (typeof extra === 'object' && extra !== null) {
            notice = (0, util_1$4.mergeNotice)(notice, extra);
        }
        if ((0, util_1$4.objectIsEmpty)(notice)) {
            return null;
        }
        var context = this.__store.getContents('context');
        var noticeTags = this.__constructTags(notice.tags);
        var contextTags = this.__constructTags(context['tags']);
        var configTags = this.__constructTags(this.config.tags);
        // Turning into a Set will remove duplicates
        var tags = noticeTags.concat(contextTags).concat(configTags);
        var uniqueTags = tags.filter(function (item, index) { return tags.indexOf(item) === index; });
        notice = (0, util_1$4.merge)(notice, {
            name: notice.name || 'Error',
            context: (0, util_1$4.merge)(context, notice.context),
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
                notice.stack = (0, util_1$4.generateStackTrace)();
                notice.backtrace = (0, util_1$4.makeBacktrace)(notice.stack, true, this.logger);
            }
            else {
                notice.backtrace = (0, util_1$4.makeBacktrace)(notice.stack, false, this.logger);
            }
        }
        return notice;
    };
    Client.prototype.addBreadcrumb = function (message, opts) {
        if (!this.config.breadcrumbsEnabled) {
            return;
        }
        opts = opts || {};
        var metadata = (0, util_1$4.shallowClone)(opts.metadata);
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
        var headers = (0, util_1$4.filter)(notice.headers, this.config.filters) || {};
        var cgiData = (0, util_1$4.filter)(__assign$1(__assign$1({}, notice.cgiData), (0, util_1$4.formatCGIData)(headers, 'HTTP_')), this.config.filters);
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
                causes: (0, util_1$4.getCauses)(notice, this.logger),
            },
            request: {
                url: (0, util_1$4.filterUrl)(notice.url, this.config.filters),
                component: notice.component,
                action: notice.action,
                context: notice.context,
                cgi_data: cgiData,
                params: (0, util_1$4.filter)(notice.params, this.config.filters) || {},
                session: (0, util_1$4.filter)(notice.session, this.config.filters) || {}
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
        var beforeNotifyResult = (0, util_1$4.runBeforeNotifyHandlers)(notice, this.__beforeNotifyHandlers);
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
        return (0, util_1$4.getSourceForBacktrace)(originalBacktrace, this.__getSourceFileHandler)
            .then(function (sourcePerTrace) { return __awaiter$2(_this, void 0, void 0, function () {
            var payload;
            return __generator$2(this, function (_a) {
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
                        endpoint: (0, util_1$4.endpoint)(this.config.endpoint, '/v1/notices/js'),
                        maxObjectDepth: this.config.maxObjectDepth,
                        logger: this.logger,
                    }, payload)];
            });
        }); })
            .then(function (res) {
            if (res.statusCode !== 201) {
                (0, util_1$4.runAfterNotifyHandlers)(notice, _this.__afterNotifyHandlers, new Error("Bad HTTP response: ".concat(res.statusCode)));
                _this.logger.warn("Error report failed: unknown response from server. code=".concat(res.statusCode));
                return false;
            }
            var uuid = JSON.parse(res.body).id;
            (0, util_1$4.runAfterNotifyHandlers)((0, util_1$4.merge)(notice, {
                id: uuid
            }), _this.__afterNotifyHandlers);
            _this.logger.info("Error report sent \u26A1 https://app.honeybadger.io/notice/".concat(uuid));
            return true;
        })
            .catch(function (err) {
            _this.logger.error('Error report failed: an unknown error occurred.', "message=".concat(err.message));
            (0, util_1$4.runAfterNotifyHandlers)(notice, _this.__afterNotifyHandlers, err);
            return false;
        });
    };
    return Client;
}());
client$1.Client = Client;

var types = {};

Object.defineProperty(types, "__esModule", { value: true });

(function (exports) {
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
	var __exportStar = (commonjsGlobal && commonjsGlobal.__exportStar) || function(m, exports) {
	    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
	};
	var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
	    if (mod && mod.__esModule) return mod;
	    var result = {};
	    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
	    __setModuleDefault(result, mod);
	    return result;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Util = exports.Types = exports.Client = void 0;
	var client_1 = client$1;
	Object.defineProperty(exports, "Client", { enumerable: true, get: function () { return client_1.Client; } });
	__exportStar(store, exports);
	exports.Types = __importStar(types);
	exports.Util = __importStar(util$1);
	
} (src));

var util = {};

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
var __importDefault$3 = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(util, "__esModule", { value: true });
util.readConfigFromFileSystem = util.getSourceFile = util.getStats = util.fatallyLogAndExit = void 0;
var os_1 = __importDefault$3(require$$0__default["default"]);
var fs_1 = __importDefault$3(require$$1__default["default"]);
var path_1 = __importDefault$3(require$$2__default["default"]);
var util_1$3 = require$$3__default["default"];
var readFile = (0, util_1$3.promisify)(fs_1.default.readFile);
function fatallyLogAndExit(err) {
    console.error('[Honeybadger] Exiting process due to uncaught exception');
    console.error(err.stack || err);
    process.exit(1);
}
util.fatallyLogAndExit = fatallyLogAndExit;
function getStats() {
    return __awaiter$1(this, void 0, void 0, function () {
        var load, stats, fallback, memData, data, results;
        return __generator$1(this, function (_a) {
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
    return __awaiter$1(this, void 0, void 0, function () {
        return __generator$1(this, function (_a) {
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
util.readConfigFromFileSystem = readConfigFromFileSystem;

var uncaught_exception_plugin = {};

var uncaught_exception_monitor = {};

var aws_lambda = {};

Object.defineProperty(aws_lambda, "__esModule", { value: true });
aws_lambda.removeAwsDefaultUncaughtExceptionListener = aws_lambda.lambdaHandler = void 0;
function isHandlerSync(handler) {
    return handler.length > 2;
}
function reportToHoneybadger(hb, err, callback) {
    hb.notify(err, {
        afterNotify: function () {
            hb.clear();
            callback(err);
        }
    });
}
function asyncHandler(handler, hb) {
    return function wrappedLambdaHandler(event, context) {
        return new Promise(function (resolve, reject) {
            hb.run(function () {
                var timeoutHandler = setupTimeoutWarning(hb, context);
                try {
                    var result = handler(event, context);
                    // check if handler returns a promise
                    if (result && result.then) {
                        result
                            .then(resolve)
                            .catch(function (err) { return reportToHoneybadger(hb, err, reject); })
                            .finally(function () { return clearTimeout(timeoutHandler); });
                    }
                    else {
                        clearTimeout(timeoutHandler);
                        resolve(result);
                    }
                }
                catch (err) {
                    clearTimeout(timeoutHandler);
                    reportToHoneybadger(hb, err, reject);
                }
            });
        });
    };
}
function syncHandler(handler, hb) {
    return function wrappedLambdaHandler(event, context, cb) {
        hb.run(function () {
            var timeoutHandler = setupTimeoutWarning(hb, context);
            try {
                handler(event, context, function (error, result) {
                    clearTimeout(timeoutHandler);
                    if (error) {
                        return reportToHoneybadger(hb, error, cb);
                    }
                    cb(null, result);
                });
            }
            catch (err) {
                clearTimeout(timeoutHandler);
                reportToHoneybadger(hb, err, cb);
            }
        });
    };
}
function shouldReportTimeoutWarning(hb, context) {
    return typeof context.getRemainingTimeInMillis === 'function' && !!(hb.config.reportTimeoutWarning);
}
function setupTimeoutWarning(hb, context) {
    if (!shouldReportTimeoutWarning(hb, context)) {
        return;
    }
    var delay = context.getRemainingTimeInMillis() - (hb.config.timeoutWarningThresholdMs);
    return setTimeout(function () {
        hb.notify("".concat(context.functionName, "[").concat(context.functionVersion, "] may have timed out"));
    }, delay > 0 ? delay : 0);
}
function lambdaHandler(handler) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    var hb = this;
    if (isHandlerSync(handler)) {
        return syncHandler(handler, hb);
    }
    return asyncHandler(handler, hb);
}
aws_lambda.lambdaHandler = lambdaHandler;
var listenerRemoved = false;
/**
 * Removes AWS Lambda default listener that
 * exits the process before letting us report to honeybadger.
 */
function removeAwsDefaultUncaughtExceptionListener() {
    if (listenerRemoved) {
        return;
    }
    listenerRemoved = true;
    var listeners = process.listeners('uncaughtException');
    if (listeners.length === 0) {
        return;
    }
    // We assume it's the first listener
    process.removeListener('uncaughtException', listeners[0]);
}
aws_lambda.removeAwsDefaultUncaughtExceptionListener = removeAwsDefaultUncaughtExceptionListener;

Object.defineProperty(uncaught_exception_monitor, "__esModule", { value: true });
var aws_lambda_1 = aws_lambda;
var util_1$2 = util;
var UncaughtExceptionMonitor = /** @class */ (function () {
    function UncaughtExceptionMonitor() {
        this.__isReporting = false;
        this.__handlerAlreadyCalled = false;
        this.__listener = this.makeListener();
        this.removeAwsLambdaListener();
    }
    UncaughtExceptionMonitor.prototype.setClient = function (client) {
        this.__client = client;
    };
    UncaughtExceptionMonitor.prototype.makeListener = function () {
        var _this = this;
        var honeybadgerUncaughtExceptionListener = function (uncaughtError) {
            if (_this.__isReporting || !_this.__client) {
                return;
            }
            // report only the first error - prevent reporting recursive errors
            if (_this.__handlerAlreadyCalled) {
                if (!_this.hasOtherUncaughtExceptionListeners()) {
                    (0, util_1$2.fatallyLogAndExit)(uncaughtError);
                }
                return;
            }
            _this.__isReporting = true;
            _this.__client.notify(uncaughtError, {
                afterNotify: function (_err, _notice) {
                    _this.__isReporting = false;
                    _this.__handlerAlreadyCalled = true;
                    _this.__client.config.afterUncaught(uncaughtError);
                    if (!_this.hasOtherUncaughtExceptionListeners()) {
                        (0, util_1$2.fatallyLogAndExit)(uncaughtError);
                    }
                }
            });
        };
        return honeybadgerUncaughtExceptionListener;
    };
    UncaughtExceptionMonitor.prototype.maybeAddListener = function () {
        var listeners = process.listeners('uncaughtException');
        if (!listeners.includes(this.__listener)) {
            process.on('uncaughtException', this.__listener);
        }
    };
    UncaughtExceptionMonitor.prototype.maybeRemoveListener = function () {
        var listeners = process.listeners('uncaughtException');
        if (listeners.includes(this.__listener)) {
            process.removeListener('uncaughtException', this.__listener);
        }
    };
    UncaughtExceptionMonitor.prototype.removeAwsLambdaListener = function () {
        var isLambda = !!process.env.LAMBDA_TASK_ROOT;
        if (!isLambda) {
            return;
        }
        (0, aws_lambda_1.removeAwsDefaultUncaughtExceptionListener)();
    };
    /**
     * If there are no other uncaughtException listeners,
     * we want to report the exception to Honeybadger and
     * mimic the default behavior of NodeJs,
     * which is to exit the process with code 1
     *
     * Node sets up domainUncaughtExceptionClear when we use domains.
     * Since they're not set up by a user, they shouldn't affect whether we exit or not
     */
    UncaughtExceptionMonitor.prototype.hasOtherUncaughtExceptionListeners = function () {
        var _this = this;
        var allListeners = process.listeners('uncaughtException');
        var otherListeners = allListeners.filter(function (listener) { return (listener.name !== 'domainUncaughtExceptionClear'
            && listener !== _this.__listener); });
        return otherListeners.length > 0;
    };
    return UncaughtExceptionMonitor;
}());
uncaught_exception_monitor.default = UncaughtExceptionMonitor;

var __importDefault$2 = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(uncaught_exception_plugin, "__esModule", { value: true });
var uncaught_exception_monitor_1 = __importDefault$2(uncaught_exception_monitor);
var uncaughtExceptionMonitor = new uncaught_exception_monitor_1.default();
function default_1$1() {
    return {
        load: function (client) {
            uncaughtExceptionMonitor.setClient(client);
            if (client.config.enableUncaught) {
                uncaughtExceptionMonitor.maybeAddListener();
            }
            else {
                uncaughtExceptionMonitor.maybeRemoveListener();
            }
        },
        shouldReloadOnConfigure: true,
    };
}
uncaught_exception_plugin.default = default_1$1;

var unhandled_rejection_plugin = {};

var unhandled_rejection_monitor = {};

Object.defineProperty(unhandled_rejection_monitor, "__esModule", { value: true });
var util_1$1 = util;
var UnhandledRejectionMonitor = /** @class */ (function () {
    function UnhandledRejectionMonitor() {
        this.__isReporting = false;
        this.__listener = this.makeListener();
    }
    UnhandledRejectionMonitor.prototype.setClient = function (client) {
        this.__client = client;
    };
    UnhandledRejectionMonitor.prototype.makeListener = function () {
        var _this = this;
        var honeybadgerUnhandledRejectionListener = function (reason, _promise) {
            _this.__isReporting = true;
            _this.__client.notify(reason, { component: 'unhandledRejection' }, {
                afterNotify: function () {
                    _this.__isReporting = false;
                    if (!_this.hasOtherUnhandledRejectionListeners()) {
                        (0, util_1$1.fatallyLogAndExit)(reason);
                    }
                }
            });
        };
        return honeybadgerUnhandledRejectionListener;
    };
    UnhandledRejectionMonitor.prototype.maybeAddListener = function () {
        var listeners = process.listeners('unhandledRejection');
        if (!listeners.includes(this.__listener)) {
            process.on('unhandledRejection', this.__listener);
        }
    };
    UnhandledRejectionMonitor.prototype.maybeRemoveListener = function () {
        var listeners = process.listeners('unhandledRejection');
        if (listeners.includes(this.__listener)) {
            process.removeListener('unhandledRejection', this.__listener);
        }
    };
    /**
     * If there are no other unhandledRejection listeners,
     * we want to report the exception to Honeybadger and
     * mimic the default behavior of NodeJs,
     * which is to exit the process with code 1
     */
    UnhandledRejectionMonitor.prototype.hasOtherUnhandledRejectionListeners = function () {
        var _this = this;
        var otherListeners = process.listeners('unhandledRejection')
            .filter(function (listener) { return listener !== _this.__listener; });
        return otherListeners.length > 0;
    };
    return UnhandledRejectionMonitor;
}());
unhandled_rejection_monitor.default = UnhandledRejectionMonitor;

var __importDefault$1 = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(unhandled_rejection_plugin, "__esModule", { value: true });
var unhandled_rejection_monitor_1 = __importDefault$1(unhandled_rejection_monitor);
var unhandledRejectionMonitor = new unhandled_rejection_monitor_1.default();
function default_1() {
    return {
        load: function (client) {
            unhandledRejectionMonitor.setClient(client);
            if (client.config.enableUnhandledRejection) {
                unhandledRejectionMonitor.maybeAddListener();
            }
            else {
                unhandledRejectionMonitor.maybeRemoveListener();
            }
        },
        shouldReloadOnConfigure: true,
    };
}
unhandled_rejection_plugin.default = default_1;

var middleware = {};

var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(middleware, "__esModule", { value: true });
middleware.errorHandler = middleware.requestHandler = void 0;
var url_1$1 = __importDefault(require$$0__default$1["default"]);
function fullUrl(req) {
    var connection = req.connection;
    var address = connection && connection.address();
    // @ts-ignore The old @types/node incorrectly defines `address` as string|Address
    var port = address ? address.port : undefined;
    // @ts-ignore
    return url_1$1.default.format({
        protocol: req.protocol,
        hostname: req.hostname,
        port: port,
        pathname: req.path,
        query: req.query
    });
}
function requestHandler(req, res, next) {
    this.withRequest(req, next, next);
}
middleware.requestHandler = requestHandler;
function errorHandler(err, req, _res, next) {
    this.notify(err, {
        url: fullUrl(req),
        params: req.body,
        // @ts-ignore
        session: req.session,
        headers: req.headers,
        cgiData: {
            REQUEST_METHOD: req.method
        }
    });
    if (next) {
        return next(err);
    }
}
middleware.errorHandler = errorHandler;

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
var core_1$1 = src;
var url_1 = require$$0__default$1["default"];
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

var stacked_store = {};

var async_store = {};

Object.defineProperty(async_store, "__esModule", { value: true });
async_store.AsyncStore = void 0;
var kHoneybadgerStore = Symbol.for('kHoneybadgerStore');
var AsyncStore = /** @class */ (function () {
    function AsyncStore(asyncLocalStorage, contents, breadcrumbsLimit) {
        this.als = asyncLocalStorage;
        this.contents = contents;
        this.breadcrumbsLimit = breadcrumbsLimit;
    }
    /**
     * Attempt to create a new AsyncStore instance
     */
    AsyncStore.create = function (contents, breadcrumbsLimit) {
        try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            var AsyncLocalStorage_1 = require('async_hooks').AsyncLocalStorage;
            return new AsyncStore(new AsyncLocalStorage_1, contents, breadcrumbsLimit);
        }
        catch (e) {
            return null;
        }
    };
    /**
     * This returns the live store object, so we can mutate it.
     * If we're in an async context (a `run()` callback), the stored contents at this point will be returned.
     * Otherwise, the initial stored contents will be returned.
     */
    AsyncStore.prototype.__currentContents = function () {
        return this.als.getStore() || this.contents;
    };
    AsyncStore.prototype.getContents = function (key) {
        var value = key ? this.__currentContents()[key] : this.__currentContents();
        return JSON.parse(JSON.stringify(value));
    };
    AsyncStore.prototype.available = function () {
        return !!this.als.getStore();
    };
    AsyncStore.prototype.setContext = function (context) {
        Object.assign(this.__currentContents().context, context || {});
    };
    AsyncStore.prototype.addBreadcrumb = function (breadcrumb) {
        if (this.__currentContents().breadcrumbs.length == this.breadcrumbsLimit) {
            this.__currentContents().breadcrumbs.shift();
        }
        this.__currentContents().breadcrumbs.push(breadcrumb);
    };
    AsyncStore.prototype.clear = function () {
        this.__currentContents().context = {};
        this.__currentContents().breadcrumbs = [];
    };
    AsyncStore.prototype.run = function (callback, request) {
        // When entering an async context, we pass in *a copy* of the initial contents.
        // This allows every request to start from the same state
        // and add data specific to them, without overlapping.
        if (!request) {
            return this.als.run(this.getContents(), callback);
        }
        var contents;
        if (request[kHoneybadgerStore]) {
            contents = request[kHoneybadgerStore];
        }
        else {
            contents = this.getContents();
            request[kHoneybadgerStore] = contents;
        }
        return this.als.run(contents, callback);
    };
    return AsyncStore;
}());
async_store.AsyncStore = AsyncStore;

Object.defineProperty(stacked_store, "__esModule", { value: true });
stacked_store.StackedStore = void 0;
var core_1 = src;
var async_store_1 = async_store;
/**
 * A store that's really a "stack" of stores (async and global)
 * Will proxy calls to the async store if it's active (ie when we enter an async context via `ALS.run()`),
 * otherwise it will fall back to the global store.
 * Both stores in the stack start out with the same contents object.
 * Note that the asyncStore may be null if ALS is not supported.
 */
var StackedStore = /** @class */ (function () {
    function StackedStore(breadcrumbsLimit) {
        this.contents = { context: {}, breadcrumbs: [] };
        this.asyncStore = async_store_1.AsyncStore.create(this.contents, breadcrumbsLimit);
        this.globalStore = core_1.GlobalStore.create(this.contents, breadcrumbsLimit);
    }
    StackedStore.prototype.__activeStore = function () {
        var _a;
        return ((_a = this.asyncStore) === null || _a === void 0 ? void 0 : _a.available()) ? this.asyncStore : this.globalStore;
    };
    StackedStore.prototype.available = function () {
        return true;
    };
    // @ts-ignore
    StackedStore.prototype.getContents = function (key) {
        return this.__activeStore().getContents(key);
    };
    StackedStore.prototype.setContext = function (context) {
        this.__activeStore().setContext(context);
    };
    StackedStore.prototype.addBreadcrumb = function (breadcrumb) {
        this.__activeStore().addBreadcrumb(breadcrumb);
    };
    StackedStore.prototype.clear = function () {
        this.__activeStore().clear();
    };
    StackedStore.prototype.run = function (callback, request) {
        // We explicitly favour the async store here, if ALS is supported. It's the whole point of the `run()` method
        return this.asyncStore ? this.asyncStore.run(callback, request) : this.globalStore.run(callback);
    };
    return StackedStore;
}());
stacked_store.StackedStore = StackedStore;

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
Object.defineProperty(client, "__esModule", { value: true });
client.CheckInsClient = void 0;
var check_in_1 = checkIn;
var CheckInsClient = /** @class */ (function () {
    function CheckInsClient(config, transport) {
        this.BASE_URL = 'https://app.honeybadger.io';
        this.transport = transport;
        this.config = config;
        this.logger = config.logger;
    }
    CheckInsClient.prototype.getProjectId = function (projectApiKey) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var response, data;
            return __generator(this, function (_b) {
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
        return __awaiter(this, void 0, void 0, function () {
            var response, data;
            return __generator(this, function (_a) {
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
                        return [2 /*return*/, data.results.map(function (checkin) { return check_in_1.CheckIn.fromResponsePayload(checkin); })];
                }
            });
        });
    };
    CheckInsClient.prototype.get = function (projectId, checkInId) {
        return __awaiter(this, void 0, void 0, function () {
            var response, data;
            return __generator(this, function (_a) {
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
                        return [2 /*return*/, check_in_1.CheckIn.fromResponsePayload(data)];
                }
            });
        });
    };
    CheckInsClient.prototype.create = function (projectId, checkIn) {
        return __awaiter(this, void 0, void 0, function () {
            var response, data;
            return __generator(this, function (_a) {
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
                        return [2 /*return*/, check_in_1.CheckIn.fromResponsePayload(data)];
                }
            });
        });
    };
    CheckInsClient.prototype.update = function (projectId, checkIn) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
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
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
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

(function (exports) {
	var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
	var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
	    return (mod && mod.__esModule) ? mod : { "default": mod };
	};
	var _a;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Types = void 0;
	var os_1 = __importDefault(require$$0__default["default"]);
	var domain_1 = __importDefault(require$$1__default$1["default"]);
	var core_1 = src;
	var util_1 = util;
	var uncaught_exception_plugin_1 = __importDefault(uncaught_exception_plugin);
	var unhandled_rejection_plugin_1 = __importDefault(unhandled_rejection_plugin);
	var middleware_1 = middleware;
	var aws_lambda_1 = aws_lambda;
	var transport_1 = transport;
	var stacked_store_1 = stacked_store;
	var client_1 = client;
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
	    version: '6.8.3'
	};
	var userAgent = function () {
	    return "Honeybadger JS Server Client ".concat(NOTIFIER.version, ", ").concat(os_1.default.version(), "; ").concat(os_1.default.platform());
	};
	var singleton = new Honeybadger(__assign({ __plugins: DEFAULT_PLUGINS }, ((_a = (0, util_1.readConfigFromFileSystem)()) !== null && _a !== void 0 ? _a : {})));
	singleton.setNotifier(NOTIFIER);
	var core_2 = src;
	Object.defineProperty(exports, "Types", { enumerable: true, get: function () { return core_2.Types; } });
	exports.default = singleton;
	
} (server$1));

var server = /*@__PURE__*/getDefaultExportFromCjs(server$1);

module.exports = server;
//# sourceMappingURL=honeybadger.js.map
