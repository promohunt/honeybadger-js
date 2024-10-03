"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable prefer-rest-params */
var core_1 = require("@honeybadger-io/core");
var util_1 = require("../util");
var instrument = core_1.Util.instrument;
function default_1(_window) {
    if (_window === void 0) { _window = (0, util_1.globalThisOrWindow)(); }
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
                instrument(_window, 'setTimeout', instrumentTimer({ component: 'setTimeout' }));
                instrument(_window, 'setInterval', instrumentTimer({ component: 'setInterval' }));
            })();
        }
    };
}
exports.default = default_1;
//# sourceMappingURL=timers.js.map