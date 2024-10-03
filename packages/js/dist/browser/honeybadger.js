(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Honeybadger = factory());
})(this, (function () { 'use strict';

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

	var browser$1 = {};

	var src = {};

	var client = {};

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
	var util_1$9 = util$1;
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
	        this.contents.context = (0, util_1$9.merge)(this.contents.context, context || {});
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

	var module = /*#__PURE__*/Object.freeze({
		__proto__: null,
		NdJson: NdJson
	});

	var require$$0 = /*@__PURE__*/getAugmentedNamespace(module);

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
	Object.defineProperty(throttled_events_logger, "__esModule", { value: true });
	throttled_events_logger.ThrottledEventsLogger = void 0;
	var json_nd_1 = require$$0;
	var util_1$8 = util$1;
	var defaults_1$1 = defaults;
	var ThrottledEventsLogger = /** @class */ (function () {
	    function ThrottledEventsLogger(config, transport) {
	        this.config = config;
	        this.transport = transport;
	        this.queue = [];
	        this.isProcessing = false;
	        this.config = __assign$1(__assign$1({}, defaults_1$1.CONFIG), config);
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
	        return __awaiter$2(this, void 0, void 0, function () {
	            var _this = this;
	            return __generator$2(this, function (_a) {
	                return [2 /*return*/, this.transport
	                        .send({
	                        headers: {
	                            'X-API-Key': this.config.apiKey,
	                            'Content-Type': 'application/json',
	                        },
	                        method: 'POST',
	                        endpoint: (0, util_1$8.endpoint)(this.config.endpoint, '/v1/events'),
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
	Object.defineProperty(client, "__esModule", { value: true });
	client.Client = void 0;
	var util_1$7 = util$1;
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
	        this.config = __assign(__assign({}, defaults_1.CONFIG), opts);
	        this.__initStore();
	        this.__transport = transport;
	        this.__eventsLogger = new throttled_events_logger_1.ThrottledEventsLogger(this.config, this.__transport);
	        this.logger = (0, util_1$7.logger)(this);
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
	        var sourceCodeData = notice && notice.backtrace ? notice.backtrace.map(function (trace) { return (0, util_1$7.shallowClone)(trace); }) : null;
	        var preConditionsResult = this.__runPreconditions(notice);
	        if (preConditionsResult instanceof Error) {
	            (0, util_1$7.runAfterNotifyHandlers)(notice, this.__afterNotifyHandlers, preConditionsResult);
	            return false;
	        }
	        if (preConditionsResult instanceof Promise) {
	            preConditionsResult.then(function (result) {
	                if (result instanceof Error) {
	                    (0, util_1$7.runAfterNotifyHandlers)(notice, _this.__afterNotifyHandlers, result);
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
	        var notice = (0, util_1$7.makeNotice)(noticeable);
	        if (name && !(typeof name === 'object')) {
	            var n = String(name);
	            name = { name: n };
	        }
	        if (name) {
	            notice = (0, util_1$7.mergeNotice)(notice, name);
	        }
	        if (typeof extra === 'object' && extra !== null) {
	            notice = (0, util_1$7.mergeNotice)(notice, extra);
	        }
	        if ((0, util_1$7.objectIsEmpty)(notice)) {
	            return null;
	        }
	        var context = this.__store.getContents('context');
	        var noticeTags = this.__constructTags(notice.tags);
	        var contextTags = this.__constructTags(context['tags']);
	        var configTags = this.__constructTags(this.config.tags);
	        // Turning into a Set will remove duplicates
	        var tags = noticeTags.concat(contextTags).concat(configTags);
	        var uniqueTags = tags.filter(function (item, index) { return tags.indexOf(item) === index; });
	        notice = (0, util_1$7.merge)(notice, {
	            name: notice.name || 'Error',
	            context: (0, util_1$7.merge)(context, notice.context),
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
	                notice.stack = (0, util_1$7.generateStackTrace)();
	                notice.backtrace = (0, util_1$7.makeBacktrace)(notice.stack, true, this.logger);
	            }
	            else {
	                notice.backtrace = (0, util_1$7.makeBacktrace)(notice.stack, false, this.logger);
	            }
	        }
	        return notice;
	    };
	    Client.prototype.addBreadcrumb = function (message, opts) {
	        if (!this.config.breadcrumbsEnabled) {
	            return;
	        }
	        opts = opts || {};
	        var metadata = (0, util_1$7.shallowClone)(opts.metadata);
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
	        var headers = (0, util_1$7.filter)(notice.headers, this.config.filters) || {};
	        var cgiData = (0, util_1$7.filter)(__assign(__assign({}, notice.cgiData), (0, util_1$7.formatCGIData)(headers, 'HTTP_')), this.config.filters);
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
	                causes: (0, util_1$7.getCauses)(notice, this.logger),
	            },
	            request: {
	                url: (0, util_1$7.filterUrl)(notice.url, this.config.filters),
	                component: notice.component,
	                action: notice.action,
	                context: notice.context,
	                cgi_data: cgiData,
	                params: (0, util_1$7.filter)(notice.params, this.config.filters) || {},
	                session: (0, util_1$7.filter)(notice.session, this.config.filters) || {}
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
	        var beforeNotifyResult = (0, util_1$7.runBeforeNotifyHandlers)(notice, this.__beforeNotifyHandlers);
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
	        return (0, util_1$7.getSourceForBacktrace)(originalBacktrace, this.__getSourceFileHandler)
	            .then(function (sourcePerTrace) { return __awaiter$1(_this, void 0, void 0, function () {
	            var payload;
	            return __generator$1(this, function (_a) {
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
	                        endpoint: (0, util_1$7.endpoint)(this.config.endpoint, '/v1/notices/js'),
	                        maxObjectDepth: this.config.maxObjectDepth,
	                        logger: this.logger,
	                    }, payload)];
	            });
	        }); })
	            .then(function (res) {
	            if (res.statusCode !== 201) {
	                (0, util_1$7.runAfterNotifyHandlers)(notice, _this.__afterNotifyHandlers, new Error("Bad HTTP response: ".concat(res.statusCode)));
	                _this.logger.warn("Error report failed: unknown response from server. code=".concat(res.statusCode));
	                return false;
	            }
	            var uuid = JSON.parse(res.body).id;
	            (0, util_1$7.runAfterNotifyHandlers)((0, util_1$7.merge)(notice, {
	                id: uuid
	            }), _this.__afterNotifyHandlers);
	            _this.logger.info("Error report sent \u26A1 https://app.honeybadger.io/notice/".concat(uuid));
	            return true;
	        })
	            .catch(function (err) {
	            _this.logger.error('Error report failed: an unknown error occurred.', "message=".concat(err.message));
	            (0, util_1$7.runAfterNotifyHandlers)(notice, _this.__afterNotifyHandlers, err);
	            return false;
	        });
	    };
	    return Client;
	}());
	client.Client = Client;

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
		var client_1 = client;
		Object.defineProperty(exports, "Client", { enumerable: true, get: function () { return client_1.Client; } });
		__exportStar(store, exports);
		exports.Types = __importStar(types);
		exports.Util = __importStar(util$1);
		
	} (src));

	var util = {};

	Object.defineProperty(util, "__esModule", { value: true });
	util.globalThisOrWindow = util.preferCatch = util.encodeCookie = util.decodeCookie = util.localURLPathname = util.parseURL = util.nativeFetch = util.stringTextOfElement = util.stringSelectorOfElement = util.stringNameOfElement = void 0;
	/**
	 * Converts an HTMLElement into a human-readable string.
	 * @param {!HTMLElement} element
	 * @return {string}
	 */
	function stringNameOfElement(element) {
	    if (!element || !element.tagName) {
	        return '';
	    }
	    var name = element.tagName.toLowerCase();
	    // Ignore the root <html> element in selectors and events.
	    if (name === 'html') {
	        return '';
	    }
	    if (element.id) {
	        name += "#".concat(element.id);
	    }
	    var stringClassNames = element.getAttribute('class');
	    if (stringClassNames) {
	        stringClassNames.split(/\s+/).forEach(function (className) {
	            name += ".".concat(className);
	        });
	    }
	    ['alt', 'name', 'title', 'type'].forEach(function (attrName) {
	        var attr = element.getAttribute(attrName);
	        if (attr) {
	            name += "[".concat(attrName, "=\"").concat(attr, "\"]");
	        }
	    });
	    var siblings = getSiblings(element);
	    if (siblings.length > 1) {
	        name += ":nth-child(".concat(Array.prototype.indexOf.call(siblings, element) + 1, ")");
	    }
	    return name;
	}
	util.stringNameOfElement = stringNameOfElement;
	function stringSelectorOfElement(element) {
	    var name = stringNameOfElement(element);
	    if (element.parentNode && element.parentNode.tagName) {
	        var parentName = stringSelectorOfElement(element.parentNode);
	        if (parentName.length > 0) {
	            return "".concat(parentName, " > ").concat(name);
	        }
	    }
	    return name;
	}
	util.stringSelectorOfElement = stringSelectorOfElement;
	function stringTextOfElement(element) {
	    var text = element.textContent || element.innerText || '';
	    if (!text && (element.type === 'submit' || element.type === 'button')) {
	        text = element.value;
	    }
	    return truncate(text.trim(), 300);
	}
	util.stringTextOfElement = stringTextOfElement;
	function nativeFetch() {
	    var global = globalThisOrWindow();
	    if (!global.fetch) {
	        return false;
	    }
	    if (isNative(global.fetch)) {
	        return true;
	    }
	    if (typeof document === 'undefined') {
	        return false;
	    }
	    // If fetch isn't native, it may be wrapped by someone else. Try to get
	    // a pristine function from an iframe.
	    try {
	        var sandbox = document.createElement('iframe');
	        sandbox.style.display = 'none';
	        document.head.appendChild(sandbox);
	        var result = sandbox.contentWindow.fetch && isNative(sandbox.contentWindow.fetch);
	        document.head.removeChild(sandbox);
	        return result;
	    }
	    catch (err) {
	        if (console && console.warn) {
	            console.warn('failed to detect native fetch via iframe: ' + err);
	        }
	    }
	    return false;
	}
	util.nativeFetch = nativeFetch;
	function isNative(func) {
	    return func.toString().indexOf('native') !== -1;
	}
	function parseURL(url) {
	    // Regexp: https://tools.ietf.org/html/rfc3986#appendix-B
	    var match = url.match(/^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/) || {};
	    return {
	        protocol: match[2],
	        host: match[4],
	        pathname: match[5]
	    };
	}
	util.parseURL = parseURL;
	function localURLPathname(url) {
	    var parsed = parseURL(url);
	    var parsedDocURL = parseURL(document.URL);
	    // URL must be relative
	    if (!parsed.host || !parsed.protocol) {
	        return parsed.pathname;
	    }
	    // Same domain
	    if (parsed.protocol === parsedDocURL.protocol && parsed.host === parsedDocURL.host) {
	        return parsed.pathname;
	    }
	    // x-domain
	    return "".concat(parsed.protocol, "://").concat(parsed.host).concat(parsed.pathname);
	}
	util.localURLPathname = localURLPathname;
	function decodeCookie(string) {
	    var result = {};
	    string.split(/[;,]\s?/).forEach(function (pair) {
	        var _a = pair.split('=', 2), key = _a[0], value = _a[1];
	        result[key] = value;
	    });
	    return result;
	}
	util.decodeCookie = decodeCookie;
	function encodeCookie(object) {
	    if (typeof object !== 'object') {
	        return undefined;
	    }
	    var cookies = [];
	    for (var k in object) {
	        cookies.push(k + '=' + object[k]);
	    }
	    return cookies.join(';');
	}
	util.encodeCookie = encodeCookie;
	// Helpers
	function getSiblings(element) {
	    try {
	        var nodes = element.parentNode.childNodes;
	        var siblings_1 = [];
	        Array.prototype.forEach.call(nodes, function (node) {
	            if (node.tagName && node.tagName === element.tagName) {
	                siblings_1.push(node);
	            }
	        });
	        return siblings_1;
	    }
	    catch (e) {
	        return [];
	    }
	}
	function truncate(string, length) {
	    if (string.length > length) {
	        string = string.substr(0, length) + '...';
	    }
	    return string;
	}
	// Used to decide which error handling method to use when wrapping async
	// handlers: try/catch, or `window.onerror`. When available, `window.onerror`
	// will provide more information in modern browsers.
	util.preferCatch = (function () {
	    var preferCatch = true;
	    // In case we're in an environment without access to "window", lets make sure theres a window.
	    if (typeof window === 'undefined')
	        return preferCatch;
	    // IE < 10
	    if (!window.atob) {
	        preferCatch = false;
	    }
	    // Modern browsers support the full ErrorEvent API
	    // See https://developer.mozilla.org/en-US/docs/Web/API/ErrorEvent
	    if (window.ErrorEvent) {
	        try {
	            if ((new window.ErrorEvent('')).colno === 0) {
	                preferCatch = false;
	            }
	            // eslint-disable-next-line no-empty
	        }
	        catch (_e) { }
	    }
	    return preferCatch;
	})();
	/** globalThis has fairly good support. But just in case, lets check its defined.
	 * @see {https://caniuse.com/?search=globalThis}
	 */
	function globalThisOrWindow() {
	    if (typeof globalThis !== 'undefined') {
	        return globalThis;
	    }
	    if (typeof self !== 'undefined') {
	        return self;
	    }
	    return window;
	}
	util.globalThisOrWindow = globalThisOrWindow;

	var onerror = {};

	Object.defineProperty(onerror, "__esModule", { value: true });
	onerror.onError = onerror.ignoreNextOnError = void 0;
	/* eslint-disable prefer-rest-params */
	var core_1$6 = src;
	var util_1$6 = util;
	var instrument$4 = core_1$6.Util.instrument, makeNotice = core_1$6.Util.makeNotice;
	var ignoreOnError = 0;
	var currentTimeout;
	function ignoreNextOnError() {
	    ignoreOnError += 1;
	    clearTimeout(currentTimeout);
	    currentTimeout = setTimeout(function () {
	        ignoreOnError = 0;
	    });
	}
	onerror.ignoreNextOnError = ignoreNextOnError;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function onError(_window) {
	    if (_window === void 0) { _window = (0, util_1$6.globalThisOrWindow)(); }
	    return {
	        load: function (client) {
	            instrument$4(_window, 'onerror', function (original) {
	                var onerror = function (msg, url, line, col, err) {
	                    client.logger.debug('window.onerror callback invoked', arguments);
	                    if (ignoreOnError > 0) {
	                        client.logger.debug('Ignoring window.onerror (error likely reported earlier)', arguments);
	                        ignoreOnError -= 1;
	                        return;
	                    }
	                    // See https://developer.mozilla.org/en/docs/Web/API/GlobalEventHandlers/onerror#Notes
	                    if (line === 0 && /Script error\.?/.test(msg)) {
	                        if (client.config.enableUncaught) {
	                            // Log only if the user wants to report uncaught errors
	                            client.logger.warn('Ignoring cross-domain script error: enable CORS to track these types of errors', arguments);
	                        }
	                        return;
	                    }
	                    var notice = makeNotice(err);
	                    if (!notice.name) {
	                        notice.name = 'window.onerror';
	                    }
	                    if (!notice.message) {
	                        notice.message = msg;
	                    }
	                    if (!notice.stack) {
	                        // Simulate v8 stack
	                        notice.stack = [notice.message, '\n    at ? (', url || 'unknown', ':', line || 0, ':', col || 0, ')'].join('');
	                    }
	                    client.addBreadcrumb((notice.name === 'window.onerror' || !notice.name) ? 'window.onerror' : "window.onerror: ".concat(notice.name), {
	                        category: 'error',
	                        metadata: {
	                            name: notice.name,
	                            message: notice.message,
	                            stack: notice.stack
	                        }
	                    });
	                    if (client.config.enableUncaught) {
	                        client.notify(notice);
	                    }
	                };
	                return function (msg, url, line, col, err) {
	                    onerror(msg, url, line, col, err);
	                    if (typeof original === 'function') {
	                        return original.apply(_window, arguments);
	                    }
	                    return false;
	                };
	            });
	        }
	    };
	}
	onerror.onError = onError;

	var onunhandledrejection = {};

	Object.defineProperty(onunhandledrejection, "__esModule", { value: true });
	/* eslint-disable prefer-rest-params */
	var core_1$5 = src;
	var util_1$5 = util;
	var instrument$3 = core_1$5.Util.instrument;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function default_1$4(_window) {
	    if (_window === void 0) { _window = (0, util_1$5.globalThisOrWindow)(); }
	    return {
	        load: function (client) {
	            if (!client.config.enableUnhandledRejection) {
	                return;
	            }
	            instrument$3(_window, 'onunhandledrejection', function (original) {
	                // See https://developer.mozilla.org/en-US/docs/Web/API/Window/unhandledrejection_event
	                function onunhandledrejection(promiseRejectionEvent) {
	                    var _a;
	                    client.logger.debug('window.onunhandledrejection callback invoked', arguments);
	                    if (!client.config.enableUnhandledRejection) {
	                        return;
	                    }
	                    var reason = promiseRejectionEvent.reason;
	                    if (reason instanceof Error) {
	                        // simulate v8 stack
	                        // const fileName = reason.fileName || 'unknown'
	                        // const lineNumber = reason.lineNumber || 0
	                        var fileName = 'unknown';
	                        var lineNumber = 0;
	                        var stackFallback = "".concat(reason.message, "\n    at ? (").concat(fileName, ":").concat(lineNumber, ")");
	                        var stack = reason.stack || stackFallback;
	                        var err = {
	                            name: reason.name,
	                            message: "UnhandledPromiseRejectionWarning: ".concat(reason),
	                            stack: stack
	                        };
	                        client.addBreadcrumb("window.onunhandledrejection: ".concat(err.name), {
	                            category: 'error',
	                            metadata: err
	                        });
	                        client.notify(err);
	                        return;
	                    }
	                    var message = typeof reason === 'string' ? reason : ((_a = JSON.stringify(reason)) !== null && _a !== void 0 ? _a : 'Unspecified reason');
	                    client.notify({
	                        name: 'window.onunhandledrejection',
	                        message: "UnhandledPromiseRejectionWarning: ".concat(message)
	                    });
	                }
	                return function (promiseRejectionEvent) {
	                    onunhandledrejection(promiseRejectionEvent);
	                    if (typeof original === 'function') {
	                        original.apply(this, arguments);
	                    }
	                };
	            });
	        }
	    };
	}
	onunhandledrejection.default = default_1$4;

	var breadcrumbs = {};

	Object.defineProperty(breadcrumbs, "__esModule", { value: true });
	/* eslint-disable prefer-rest-params */
	var core_1$4 = src;
	var util_1$4 = util;
	var sanitize$1 = core_1$4.Util.sanitize, instrument$2 = core_1$4.Util.instrument, instrumentConsole$1 = core_1$4.Util.instrumentConsole;
	function default_1$3(_window) {
	    if (_window === void 0) { _window = (0, util_1$4.globalThisOrWindow)(); }
	    return {
	        load: function (client) {
	            function breadcrumbsEnabled(type) {
	                if (client.config.breadcrumbsEnabled === true) {
	                    return true;
	                }
	                if (type) {
	                    return client.config.breadcrumbsEnabled[type] === true;
	                }
	                return client.config.breadcrumbsEnabled !== false;
	            }
	            // Breadcrumbs: instrument console
	            (function () {
	                if (!breadcrumbsEnabled('console')) {
	                    return;
	                }
	                function inspectArray(obj) {
	                    if (!Array.isArray(obj)) {
	                        return '';
	                    }
	                    return obj.map(function (value) {
	                        try {
	                            return String(value);
	                        }
	                        catch (e) {
	                            return '[unknown]';
	                        }
	                    }).join(' ');
	                }
	                instrumentConsole$1(_window, function (level, args) {
	                    var message = inspectArray(args);
	                    var opts = {
	                        category: 'log',
	                        metadata: {
	                            level: level,
	                            arguments: sanitize$1(args, 3)
	                        }
	                    };
	                    client.addBreadcrumb(message, opts);
	                });
	            })();
	            // Breadcrumbs: instrument click events
	            (function () {
	                if (!breadcrumbsEnabled('dom')) {
	                    return;
	                }
	                if (typeof _window.addEventListener !== 'function') {
	                    return;
	                }
	                _window.addEventListener('click', function (event) {
	                    var message, selector, text;
	                    try {
	                        message = (0, util_1$4.stringNameOfElement)(event.target);
	                        selector = (0, util_1$4.stringSelectorOfElement)(event.target);
	                        text = (0, util_1$4.stringTextOfElement)(event.target);
	                    }
	                    catch (e) {
	                        message = 'UI Click';
	                        selector = '[unknown]';
	                        text = '[unknown]';
	                    }
	                    // There's nothing to display
	                    if (message.length === 0) {
	                        return;
	                    }
	                    client.addBreadcrumb(message, {
	                        category: 'ui.click',
	                        metadata: {
	                            selector: selector,
	                            text: text,
	                            event: event
	                        }
	                    });
	                }, _window.location ? true : false); // In CloudFlare workers useCapture must be false. window.location is a hacky way to detect it.
	            })();
	            // Breadcrumbs: instrument XMLHttpRequest
	            (function () {
	                if (!breadcrumbsEnabled('network')) {
	                    return;
	                }
	                // Some environments may not support XMLHttpRequest.
	                if (typeof XMLHttpRequest === 'undefined') {
	                    return;
	                }
	                // -- On xhr.open: capture initial metadata
	                instrument$2(XMLHttpRequest.prototype, 'open', function (original) {
	                    return function () {
	                        // eslint-disable-next-line @typescript-eslint/no-this-alias
	                        var xhr = this;
	                        var rawUrl = arguments[1];
	                        // in case of url being URL object (which is valid input) we need to stringify it
	                        var url = typeof rawUrl === 'string' ? rawUrl : String(rawUrl);
	                        var method = typeof arguments[0] === 'string' ? arguments[0].toUpperCase() : arguments[0];
	                        var message = "".concat(method, " ").concat((0, util_1$4.localURLPathname)(url));
	                        this.__hb_xhr = {
	                            type: 'xhr',
	                            method: method,
	                            url: url,
	                            message: message
	                        };
	                        if (typeof original === 'function') {
	                            original.apply(xhr, arguments);
	                        }
	                    };
	                });
	                // -- On xhr.send: set up xhr.onreadystatechange to report breadcrumb
	                instrument$2(XMLHttpRequest.prototype, 'send', function (original) {
	                    return function () {
	                        // eslint-disable-next-line @typescript-eslint/no-this-alias
	                        var xhr = this;
	                        function onreadystatechangeHandler() {
	                            if (xhr.readyState === 4) {
	                                var message = void 0;
	                                if (xhr.__hb_xhr) {
	                                    xhr.__hb_xhr.status_code = xhr.status;
	                                    message = xhr.__hb_xhr.message;
	                                    delete xhr.__hb_xhr.message;
	                                }
	                                client.addBreadcrumb(message || 'XMLHttpRequest', {
	                                    category: 'request',
	                                    metadata: xhr.__hb_xhr
	                                });
	                            }
	                        }
	                        if ('onreadystatechange' in xhr && typeof xhr.onreadystatechange === 'function') {
	                            instrument$2(xhr, 'onreadystatechange', function (original) {
	                                return function () {
	                                    onreadystatechangeHandler();
	                                    if (typeof original === 'function') {
	                                        // eslint-disable-next-line prefer-rest-params
	                                        original.apply(this, arguments);
	                                    }
	                                };
	                            });
	                        }
	                        else {
	                            xhr.onreadystatechange = onreadystatechangeHandler;
	                        }
	                        if (typeof original === 'function') {
	                            // eslint-disable-next-line prefer-rest-params
	                            original.apply(xhr, arguments);
	                        }
	                    };
	                });
	            })();
	            // Breadcrumbs: instrument fetch
	            (function () {
	                if (!breadcrumbsEnabled('network')) {
	                    return;
	                }
	                if (!(0, util_1$4.nativeFetch)()) {
	                    // Polyfills use XHR.
	                    return;
	                }
	                instrument$2(_window, 'fetch', function (original) {
	                    return function () {
	                        // eslint-disable-next-line prefer-rest-params
	                        var input = arguments[0];
	                        var method = 'GET';
	                        var url;
	                        if (typeof input === 'string') {
	                            url = input;
	                        }
	                        else if ('Request' in _window && input instanceof Request) {
	                            url = input.url;
	                            if (input.method) {
	                                method = input.method;
	                            }
	                        }
	                        else {
	                            url = String(input);
	                        }
	                        if (arguments[1] && arguments[1].method) {
	                            method = arguments[1].method;
	                        }
	                        if (typeof method === 'string') {
	                            method = method.toUpperCase();
	                        }
	                        // localURLPathname cant be constructed for CF workers due to reliance on "document".
	                        var message = "".concat(method, " ").concat(typeof document === 'undefined' ? url : (0, util_1$4.localURLPathname)(url));
	                        var metadata = {
	                            type: 'fetch',
	                            method: method,
	                            url: url
	                        };
	                        return original
	                            .apply(this, arguments)
	                            .then(function (response) {
	                            metadata['status_code'] = response.status;
	                            client.addBreadcrumb(message, {
	                                category: 'request',
	                                metadata: metadata
	                            });
	                            return response;
	                        })
	                            .catch(function (error) {
	                            client.addBreadcrumb('fetch error', {
	                                category: 'error',
	                                metadata: metadata
	                            });
	                            throw error;
	                        });
	                    };
	                });
	            })();
	            // Breadcrumbs: instrument navigation
	            (function () {
	                if (!breadcrumbsEnabled('navigation')) {
	                    return;
	                }
	                if (_window.location == null) {
	                    // Most likely in a CF worker, we should be listening to fetch requests instead.
	                    return;
	                }
	                // The last known href of the current page
	                var lastHref = _window.location.href;
	                function recordUrlChange(from, to) {
	                    lastHref = to;
	                    client.addBreadcrumb('Page changed', {
	                        category: 'navigation',
	                        metadata: {
	                            from: from,
	                            to: to
	                        }
	                    });
	                }
	                if (typeof addEventListener === 'function') {
	                    addEventListener('popstate', function (_event) {
	                        recordUrlChange(lastHref, _window.location.href);
	                    });
	                }
	                if (typeof _window.history === 'undefined') {
	                    return;
	                }
	                // https://developer.mozilla.org/en-US/docs/Web/API/History/pushState
	                // https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState
	                function historyWrapper(original) {
	                    return function () {
	                        var url = arguments.length > 2 ? arguments[2] : undefined;
	                        if (url) {
	                            recordUrlChange(lastHref, String(url));
	                        }
	                        return original.apply(this, arguments);
	                    };
	                }
	                instrument$2(_window.history, 'pushState', historyWrapper);
	                instrument$2(_window.history, 'replaceState', historyWrapper);
	            })();
	        }
	    };
	}
	breadcrumbs.default = default_1$3;

	var events = {};

	Object.defineProperty(events, "__esModule", { value: true });
	/* eslint-disable prefer-rest-params */
	var core_1$3 = src;
	var util_1$3 = util;
	var instrumentConsole = core_1$3.Util.instrumentConsole;
	function default_1$2(_window) {
	    if (_window === void 0) { _window = (0, util_1$3.globalThisOrWindow)(); }
	    return {
	        shouldReloadOnConfigure: false,
	        load: function (client) {
	            function sendEventsToInsights() {
	                return client.config.eventsEnabled;
	            }
	            if (!sendEventsToInsights()) {
	                return;
	            }
	            instrumentConsole(_window, function (level, args) {
	                if (!sendEventsToInsights()) {
	                    return;
	                }
	                // todo: send browser info
	                client.logEvent({
	                    level: level,
	                    args: args
	                });
	            });
	        }
	    };
	}
	events.default = default_1$2;

	var timers = {};

	Object.defineProperty(timers, "__esModule", { value: true });
	/* eslint-disable prefer-rest-params */
	var core_1$2 = src;
	var util_1$2 = util;
	var instrument$1 = core_1$2.Util.instrument;
	function default_1$1(_window) {
	    if (_window === void 0) { _window = (0, util_1$2.globalThisOrWindow)(); }
	    return {
	        load: function (client) {
	            // Wrap timers
	            (function () {
	                function instrumentTimer(wrapOpts) {
	                    return function (original) {
	                        // See https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setTimeout
	                        return function (func, delay) {
	                            if (typeof func === 'function') {
	                                var args_1 = Array.prototype.slice.call(arguments, 2);
	                                func = client.__wrap(func, wrapOpts);
	                                return original(function () {
	                                    func.apply(void 0, args_1);
	                                }, delay);
	                            }
	                            else {
	                                return original(func, delay);
	                            }
	                        };
	                    };
	                }
	                instrument$1(_window, 'setTimeout', instrumentTimer({ component: 'setTimeout' }));
	                instrument$1(_window, 'setInterval', instrumentTimer({ component: 'setInterval' }));
	            })();
	        }
	    };
	}
	timers.default = default_1$1;

	var event_listeners = {};

	Object.defineProperty(event_listeners, "__esModule", { value: true });
	var core_1$1 = src;
	var util_1$1 = util;
	var instrument = core_1$1.Util.instrument;
	function default_1(_window) {
	    if (_window === void 0) { _window = (0, util_1$1.globalThisOrWindow)(); }
	    return {
	        load: function (client) {
	            // Wrap event listeners
	            // Event targets borrowed from bugsnag-js:
	            // See https://github.com/bugsnag/bugsnag-js/blob/d55af916a4d3c7757f979d887f9533fe1a04cc93/src/bugsnag.js#L542
	            var targets = ['EventTarget', 'Window', 'Node', 'ApplicationCache', 'AudioTrackList', 'ChannelMergerNode', 'CryptoOperation', 'EventSource', 'FileReader', 'HTMLUnknownElement', 'IDBDatabase', 'IDBRequest', 'IDBTransaction', 'KeyOperation', 'MediaController', 'MessagePort', 'ModalWindow', 'Notification', 'SVGElementInstance', 'Screen', 'TextTrack', 'TextTrackCue', 'TextTrackList', 'WebSocket', 'WebSocketWorker', 'Worker', 'XMLHttpRequest', 'XMLHttpRequestEventTarget', 'XMLHttpRequestUpload'];
	            targets.forEach(function (prop) {
	                var prototype = _window[prop] && _window[prop].prototype;
	                if (prototype && Object.prototype.hasOwnProperty.call(prototype, 'addEventListener')) {
	                    instrument(prototype, 'addEventListener', function (original) {
	                        var wrapOpts = { component: "".concat(prop, ".prototype.addEventListener") };
	                        // See https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
	                        return function (type, listener, useCapture, wantsUntrusted) {
	                            try {
	                                if (listener && listener.handleEvent != null) {
	                                    listener.handleEvent = client.__wrap(listener.handleEvent, wrapOpts);
	                                }
	                            }
	                            catch (e) {
	                                // Ignore 'Permission denied to access property "handleEvent"' errors.
	                                client.logger.error(e);
	                            }
	                            return original.call(this, type, client.__wrap(listener, wrapOpts), useCapture, wantsUntrusted);
	                        };
	                    });
	                    instrument(prototype, 'removeEventListener', function (original) {
	                        return function (type, listener, useCapture, wantsUntrusted) {
	                            original.call(this, type, listener, useCapture, wantsUntrusted);
	                            return original.call(this, type, client.__wrap(listener), useCapture, wantsUntrusted);
	                        };
	                    });
	                }
	            });
	        }
	    };
	}
	event_listeners.default = default_1;

	var transport = {};

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
	Object.defineProperty(transport, "__esModule", { value: true });
	transport.BrowserTransport = void 0;
	var core_1 = src;
	var util_1 = util;
	var sanitize = core_1.Util.sanitize;
	/**
	 * Helper function to get typesafe Object.entries()
	 * https://twitter.com/mattpocockuk/status/1502264005251018754?lang=en
	 */
	function objectEntries(obj) {
	    return Object.entries(obj);
	}
	var BrowserTransport = /** @class */ (function () {
	    function BrowserTransport(headers) {
	        if (headers === void 0) { headers = {}; }
	        this.headers = {};
	        this.headers = headers;
	    }
	    BrowserTransport.prototype.defaultHeaders = function () {
	        return this.headers;
	    };
	    BrowserTransport.prototype.send = function (options, payload) {
	        return __awaiter(this, void 0, void 0, function () {
	            var headerArray, headers, requestInit, response, body;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0:
	                        headerArray = options.headers ? objectEntries(options.headers) : [];
	                        headers = this.defaultHeaders();
	                        headerArray.forEach(function (_a) {
	                            var key = _a[0], value = _a[1];
	                            if (key != null && value != null) {
	                                headers[String(key)] = String(value);
	                            }
	                        });
	                        requestInit = {
	                            method: options.method,
	                            headers: headers
	                        };
	                        // GET methods cannot have a body.
	                        if (options.method === 'POST' && payload) {
	                            requestInit.body = typeof payload === 'string' ? payload : JSON.stringify(sanitize(payload, options.maxObjectDepth));
	                        }
	                        return [4 /*yield*/, (0, util_1.globalThisOrWindow)().fetch(options.endpoint, requestInit)];
	                    case 1:
	                        response = _a.sent();
	                        return [4 /*yield*/, response.text()];
	                    case 2:
	                        body = _a.sent();
	                        return [2 /*return*/, Promise.resolve({ statusCode: response.status, body: body })];
	                }
	            });
	        });
	    };
	    return BrowserTransport;
	}());
	transport.BrowserTransport = BrowserTransport;

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
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.Types = exports.getUserFeedbackScriptUrl = void 0;
		var core_1 = src;
		var util_1 = util;
		var onerror_1 = onerror;
		var onunhandledrejection_1 = __importDefault(onunhandledrejection);
		var breadcrumbs_1 = __importDefault(breadcrumbs);
		var events_1 = __importDefault(events);
		var timers_1 = __importDefault(timers);
		var event_listeners_1 = __importDefault(event_listeners);
		var transport_1 = transport;
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
		    version: '6.8.3'
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
		var core_2 = src;
		Object.defineProperty(exports, "Types", { enumerable: true, get: function () { return core_2.Types; } });
		exports.default = singleton;
		
	} (browser$1));

	var browser = /*@__PURE__*/getDefaultExportFromCjs(browser$1);

	return browser;

}));
//# sourceMappingURL=honeybadger.js.map
