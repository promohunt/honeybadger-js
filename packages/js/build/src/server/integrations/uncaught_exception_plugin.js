"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var uncaught_exception_monitor_1 = __importDefault(require("./uncaught_exception_monitor"));
var uncaughtExceptionMonitor = new uncaught_exception_monitor_1.default();
function default_1() {
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
exports.default = default_1;
//# sourceMappingURL=uncaught_exception_plugin.js.map