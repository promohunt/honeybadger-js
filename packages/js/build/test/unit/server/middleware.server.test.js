"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var sinon_1 = require("sinon");
var supertest_1 = __importDefault(require("supertest"));
var server_1 = __importDefault(require("../../../src/server"));
var helpers_1 = require("../helpers");
describe('Express Middleware', function () {
    var client;
    var client_mock;
    var error = new Error('Badgers!');
    beforeEach(function () {
        client = server_1.default.factory({
            logger: (0, helpers_1.nullLogger)(),
            environment: null
        });
        client_mock = (0, sinon_1.mock)(client);
    });
    it('is sane', function () {
        var app = (0, express_1.default)();
        app.get('/user', function (req, res) {
            res.status(200).json({ name: 'john' });
        });
        client_mock.expects('notify').never();
        return (0, supertest_1.default)(app)
            .get('/user')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200);
    });
    it('reports the error to Honeybadger and calls next error handler', function () {
        var app = (0, express_1.default)();
        var expected = (0, sinon_1.spy)();
        app.use(client.requestHandler);
        app.get('/', function (_req, _res) {
            throw (error);
        });
        app.use(client.errorHandler);
        app.use(function (err, _req, _res, next) {
            expected();
            next(err);
        });
        client_mock.expects('notify').once().withArgs(error);
        return (0, supertest_1.default)(app)
            .get('/')
            .expect(500)
            .then(function () {
            client_mock.verify();
            expect(expected.calledOnce).toBeTruthy();
        });
    });
    it('reports async errors to Honeybadger and calls next error handler', function () {
        var app = (0, express_1.default)();
        var expected = (0, sinon_1.spy)();
        app.use(client.requestHandler);
        app.get('/', function (_req, _res) {
            setTimeout(function asyncThrow() {
                throw (error);
            }, 0);
        });
        app.use(client.errorHandler);
        app.use(function (err, _req, _res, next) {
            expected();
            next(err);
        });
        client_mock.expects('notify').once().withArgs(error);
        return (0, supertest_1.default)(app)
            .get('/')
            .expect(500)
            .then(function () {
            client_mock.verify();
            expect(expected.calledOnce).toBeTruthy();
        });
    });
    it('does not leak context between requests', function () {
        var app = (0, express_1.default)();
        app.use(client.requestHandler);
        app.get('/:reqId', function (req, res) {
            var initialContext = client.__getContext();
            client.setContext({ reqId: req.params.reqId });
            setTimeout(function () {
                res.status(200).json({
                    initial: initialContext,
                    final: client.__getContext()
                });
            }, 500);
        });
        return Promise.all([1, 2].map(function (i) {
            return (0, supertest_1.default)(app).get("/".concat(i))
                .expect(200)
                .then(function (response) {
                var expectedContexts = { initial: {}, final: { reqId: "".concat(i) } };
                expect(response.body).toStrictEqual(expectedContexts);
            });
        }));
    });
    it('preserves context in the error handlers', function () {
        client.afterNotify(function (err, notice) {
            expect(notice.context.reqId).toEqual(notice.message);
            expect(Object.keys(notice.context.initialContext)).toHaveLength(0);
        });
        var app = (0, express_1.default)();
        app.use(client.requestHandler);
        app.get('/:reqId', function (req, _res) {
            client.setContext({ reqId: req.params.reqId, initialContext: client.__getContext() });
            setTimeout(function asyncThrow() {
                throw new Error(req.params.reqId);
            }, 500);
        });
        app.use(client.errorHandler);
        app.use(function (_err, _req, res, _next) {
            res.status(500).json(client.__getContext());
        });
        return Promise.all([80, 90].map(function (i) {
            return (0, supertest_1.default)(app).get("/".concat(i))
                .expect(500)
                .then(function (response) {
                var expectedContext = { reqId: "".concat(i), initialContext: {} };
                expect(response.body).toStrictEqual(expectedContext);
            });
        }));
    });
});
//# sourceMappingURL=middleware.server.test.js.map