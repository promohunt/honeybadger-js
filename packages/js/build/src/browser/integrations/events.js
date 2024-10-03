"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable prefer-rest-params */
var core_1 = require("@honeybadger-io/core");
var util_1 = require("../util");
var instrumentConsole = core_1.Util.instrumentConsole;
function default_1(_window) {
    if (_window === void 0) { _window = (0, util_1.globalThisOrWindow)(); }
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
exports.default = default_1;
//# sourceMappingURL=events.js.map