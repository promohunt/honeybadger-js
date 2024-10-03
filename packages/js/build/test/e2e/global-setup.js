"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var browserstack_config_1 = require("./browserstack.config");
var redColour = '\x1b[31m';
var whiteColour = '\x1b[0m';
module.exports = function () {
    return new Promise(function (resolve) {
        if (!process.env.BROWSERSTACK_ACCESS_KEY) {
            console.log('Will not start BrowserStackLocal because BROWSERSTACK_ACCESS_KEY is not set');
            return resolve();
        }
        console.log('Starting BrowserStackLocal ...');
        // Starts the Local instance with the required arguments
        browserstack_config_1.bsLocal.start(browserstack_config_1.BS_LOCAL_ARGS, function (err) {
            if (err) {
                console.error("".concat(redColour, "Error starting BrowserStackLocal").concat(whiteColour, ": ").concat(err));
            }
            else {
                console.log('BrowserStackLocal Started');
            }
            resolve();
        });
    });
};
//# sourceMappingURL=global-setup.js.map