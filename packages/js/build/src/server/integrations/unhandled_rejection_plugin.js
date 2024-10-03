"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var unhandled_rejection_monitor_1 = __importDefault(require("./unhandled_rejection_monitor"));
var unhandledRejectionMonitor = new unhandled_rejection_monitor_1.default();
function default_1() {
    return {
        load: function (client) {
            unhandledRejectionMonitor.setClient(client);
            if (client.config.enableUnhandledRejection) {
                unhandledRejectionMonitor.maybeAddListener();
            }
            else {
                unhandledRejectionMonitor.maybeRemoveListener();
            }
        },
        shouldReloadOnConfigure: true,
    };
}
exports.default = default_1;
//# sourceMappingURL=unhandled_rejection_plugin.js.map