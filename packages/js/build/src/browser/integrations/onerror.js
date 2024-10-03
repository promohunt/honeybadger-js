"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onError = exports.ignoreNextOnError = void 0;
/* eslint-disable prefer-rest-params */
var core_1 = require("@honeybadger-io/core");
var util_1 = require("../util");
var instrument = core_1.Util.instrument, makeNotice = core_1.Util.makeNotice;
var ignoreOnError = 0;
var currentTimeout;
function ignoreNextOnError() {
    ignoreOnError += 1;
    clearTimeout(currentTimeout);
    currentTimeout = setTimeout(function () {
        ignoreOnError = 0;
    });
}
exports.ignoreNextOnError = ignoreNextOnError;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onError(_window) {
    if (_window === void 0) { _window = (0, util_1.globalThisOrWindow)(); }
    return {
        load: function (client) {
            instrument(_window, 'onerror', function (original) {
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
exports.onError = onError;
//# sourceMappingURL=onerror.js.map