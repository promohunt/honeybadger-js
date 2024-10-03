"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../util");
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
                        (0, util_1.fatallyLogAndExit)(reason);
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
exports.default = UnhandledRejectionMonitor;
//# sourceMappingURL=unhandled_rejection_monitor.js.map