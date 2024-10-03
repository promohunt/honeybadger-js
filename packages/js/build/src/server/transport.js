"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerTransport = void 0;
var core_1 = require("@honeybadger-io/core");
var url_1 = require("url");
var util_1 = require("./util");
var http = __importStar(require("http"));
var https = __importStar(require("https"));
var sanitize = core_1.Util.sanitize;
var ServerTransport = /** @class */ (function () {
    function ServerTransport(headers) {
        if (headers === void 0) { headers = {}; }
        this.headers = {};
        this.headers = headers;
    }
    ServerTransport.prototype.defaultHeaders = function () {
        return this.headers;
    };
    ServerTransport.prototype.send = function (options, payload) {
        var _this = this;
        var _a = new url_1.URL(options.endpoint), protocol = _a.protocol, hostname = _a.hostname, pathname = _a.pathname;
        var transport = (protocol === 'http:' ? http : https);
        return new Promise(function (resolve, reject) {
            var promise;
            // this should not be here. it should be done before reaching the transport layer
            // it could be inside a beforeNotifyHandler, but is not possible at the moment because those handlers are synchronous
            if (_this.isNoticePayload(payload)) {
                promise = _this.appendMetadata(payload);
            }
            else {
                promise = Promise.resolve();
            }
            promise.then(function () {
                //
                // We use a httpOptions object to limit issues with libraries that may patch Node.js
                // See https://github.com/honeybadger-io/honeybadger-js/issues/825#issuecomment-1193113433
                var httpOptions = {
                    method: options.method,
                    headers: __assign(__assign({}, _this.defaultHeaders()), options.headers),
                    path: pathname,
                    protocol: protocol,
                    hostname: hostname,
                };
                var data = undefined;
                if (payload) {
                    var dataStr = typeof payload === 'string' ? payload : JSON.stringify(sanitize(payload, options.maxObjectDepth));
                    data = Buffer.from(dataStr, 'utf8');
                    httpOptions.headers['Content-Length'] = data.length;
                }
                var req = transport.request(httpOptions, function (res) {
                    options.logger.debug("statusCode: ".concat(res.statusCode));
                    var body = '';
                    res.on('data', function (chunk) {
                        body += chunk;
                    });
                    res.on('end', function () { return resolve({ statusCode: res.statusCode, body: body }); });
                });
                req.on('error', function (err) { return reject(err); });
                if (data) {
                    req.write(data);
                }
                req.end();
            });
        });
    };
    ServerTransport.prototype.isNoticePayload = function (payload) {
        return payload && payload.error !== undefined;
    };
    ServerTransport.prototype.appendMetadata = function (payload) {
        payload.server.pid = process.pid;
        return (0, util_1.getStats)()
            .then(function (stats) {
            payload.server.stats = stats;
        });
    };
    return ServerTransport;
}());
exports.ServerTransport = ServerTransport;
//# sourceMappingURL=transport.js.map