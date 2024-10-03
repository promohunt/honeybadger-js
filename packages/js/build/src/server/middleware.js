"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.requestHandler = void 0;
var url_1 = __importDefault(require("url"));
function fullUrl(req) {
    var connection = req.connection;
    var address = connection && connection.address();
    // @ts-ignore The old @types/node incorrectly defines `address` as string|Address
    var port = address ? address.port : undefined;
    // @ts-ignore
    return url_1.default.format({
        protocol: req.protocol,
        hostname: req.hostname,
        port: port,
        pathname: req.path,
        query: req.query
    });
}
function requestHandler(req, res, next) {
    this.withRequest(req, next, next);
}
exports.requestHandler = requestHandler;
function errorHandler(err, req, _res, next) {
    this.notify(err, {
        url: fullUrl(req),
        params: req.body,
        // @ts-ignore
        session: req.session,
        headers: req.headers,
        cgiData: {
            REQUEST_METHOD: req.method
        }
    });
    if (next) {
        return next(err);
    }
}
exports.errorHandler = errorHandler;
//# sourceMappingURL=middleware.js.map