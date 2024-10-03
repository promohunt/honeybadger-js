"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@honeybadger-io/core");
var util_1 = require("../util");
var instrument = core_1.Util.instrument;
function default_1(_window) {
    if (_window === void 0) { _window = (0, util_1.globalThisOrWindow)(); }
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
exports.default = default_1;
//# sourceMappingURL=event_listeners.js.map