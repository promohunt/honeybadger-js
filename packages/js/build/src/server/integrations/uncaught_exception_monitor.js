"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var aws_lambda_1 = require("../aws_lambda");
var util_1 = require("../util");
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
                    (0, util_1.fatallyLogAndExit)(uncaughtError);
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
                        (0, util_1.fatallyLogAndExit)(uncaughtError);
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
exports.default = UncaughtExceptionMonitor;
//# sourceMappingURL=uncaught_exception_monitor.js.map