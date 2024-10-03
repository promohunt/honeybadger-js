"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable prefer-rest-params */
var core_1 = require("@honeybadger-io/core");
var util_1 = require("../util");
var instrument = core_1.Util.instrument;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function default_1(_window) {
    if (_window === void 0) { _window = (0, util_1.globalThisOrWindow)(); }
    return {
        load: function (client) {
            if (!client.config.enableUnhandledRejection) {
                return;
            }
            instrument(_window, 'onunhandledrejection', function (original) {
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
exports.default = default_1;
//# sourceMappingURL=onunhandledrejection.js.map