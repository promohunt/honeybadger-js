"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestClient = exports.TestTransport = exports.nullLogger = void 0;
var client_1 = require("../src/client");
function nullLogger() {
    return {
        log: function () { return true; },
        info: function () { return true; },
        debug: function () { return true; },
        warn: function () { return true; },
        error: function () { return true; }
    };
}
exports.nullLogger = nullLogger;
var TestTransport = /** @class */ (function () {
    function TestTransport() {
    }
    TestTransport.prototype.defaultHeaders = function () {
        return {};
    };
    TestTransport.prototype.send = function (_options, _payload) {
        return Promise.resolve({ body: JSON.stringify({ id: 'uuid' }), statusCode: 201 });
    };
    return TestTransport;
}());
exports.TestTransport = TestTransport;
var TestClient = /** @class */ (function (_super) {
    __extends(TestClient, _super);
    function TestClient(opts, transport) {
        return _super.call(this, opts, transport) || this;
    }
    TestClient.prototype.factory = function (_opts) {
        throw new Error('Method not implemented.');
    };
    TestClient.prototype.checkIn = function (_id) {
        throw new Error('Method not implemented.');
    };
    TestClient.prototype.showUserFeedbackForm = function (_options) {
        throw new Error('Method not implemented.');
    };
    TestClient.prototype.getPayload = function (noticeable, name, extra) {
        if (name === void 0) { name = undefined; }
        if (extra === void 0) { extra = undefined; }
        // called in client.notify()
        var notice = this.makeNotice(noticeable, name, extra);
        this.addBreadcrumb('Honeybadger Notice', {
            category: 'notice',
            metadata: {
                message: notice.message,
                name: notice.name,
                stack: notice.stack
            }
        });
        notice.__breadcrumbs = this.config.breadcrumbsEnabled ? this.__getBreadcrumbs() : [];
        // called in (server|browser).__send()
        return this.__buildPayload(notice);
    };
    TestClient.prototype.getPluginsLoaded = function () {
        return this.__pluginsLoaded;
    };
    return TestClient;
}(client_1.Client));
exports.TestClient = TestClient;
//# sourceMappingURL=helpers.js.map