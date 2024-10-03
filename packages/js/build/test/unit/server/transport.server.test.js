"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var transport_1 = require("../../../src/server/transport");
var nock_1 = __importDefault(require("nock"));
describe('ServerTransport', function () {
    var transport;
    beforeAll(function () {
        transport = new transport_1.ServerTransport();
    });
    it('sends GET request over the network', function () {
        var checkInId = '123';
        var request = (0, nock_1.default)('http://api.honeybadger.io')
            .get("/v1/check_in/".concat(checkInId))
            .reply(201);
        return transport
            .send({
            endpoint: "http://api.honeybadger.io/v1/check_in/".concat(checkInId),
            method: 'GET',
            logger: console
        })
            .then(function (resp) {
            expect(request.isDone()).toBe(true);
            expect(resp.statusCode).toEqual(201);
        });
    });
    it('sends POST request over the network', function () {
        var request = (0, nock_1.default)('http://api.honeybadger.io')
            .post('/v1/notices/js')
            .reply(201, {
            id: '48b98609-dd3b-48ee-bffc-d51f309a2dfa'
        });
        return transport
            .send({
            endpoint: 'http://api.honeybadger.io/v1/notices/js',
            method: 'POST',
            logger: console
        })
            .then(function (resp) {
            expect(request.isDone()).toBe(true);
            expect(resp.statusCode).toEqual(201);
        });
    });
    it('sends POST request over the network with headers', function () {
        var headers = {
            'X-API-Key': '123',
            'Content-Type': 'application/json;charset=utf-8',
            'Accept': 'text/json, application/json'
        };
        var request = (0, nock_1.default)('http://api.honeybadger.io')
            .post('/v1/notices/js')
            .matchHeader('X-API-Key', '123')
            .matchHeader('Content-Type', 'application/json;charset=utf-8')
            .matchHeader('Accept', 'text/json, application/json')
            .reply(201, {
            id: '48b98609-dd3b-48ee-bffc-d51f309a2dfa'
        });
        return transport
            .send({
            endpoint: 'http://api.honeybadger.io/v1/notices/js',
            headers: headers,
            method: 'POST',
            logger: console
        })
            .then(function (resp) {
            expect(request.isDone()).toBe(true);
            expect(resp.statusCode).toEqual(201);
        });
    });
});
//# sourceMappingURL=transport.server.test.js.map