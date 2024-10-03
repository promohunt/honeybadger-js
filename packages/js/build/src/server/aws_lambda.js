"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeAwsDefaultUncaughtExceptionListener = exports.lambdaHandler = void 0;
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
exports.lambdaHandler = lambdaHandler;
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
exports.removeAwsDefaultUncaughtExceptionListener = removeAwsDefaultUncaughtExceptionListener;
//# sourceMappingURL=aws_lambda.js.map