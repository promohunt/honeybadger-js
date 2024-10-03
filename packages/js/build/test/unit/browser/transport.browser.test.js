"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var transport_1 = require("../../../src/browser/transport");
var jest_fetch_mock_1 = __importDefault(require("jest-fetch-mock"));
describe('BrowserTransport', function () {
    var transport;
    beforeAll(function () {
        transport = new transport_1.BrowserTransport();
    });
    beforeEach(function () {
        jest_fetch_mock_1.default.resetMocks();
    });
    it('sends GET request over the network', function () {
        jest_fetch_mock_1.default.mockResponseOnce(JSON.stringify({}), { status: 201 });
        var promise = transport.send({
            method: 'GET',
            endpoint: 'my-endpoint',
            logger: console
        }).then(function (resp) {
            expect(resp.statusCode).toEqual(201);
            return Promise.resolve();
        });
        expect(jest_fetch_mock_1.default.mock.calls.length).toEqual(1);
        return promise;
    });
    it('sends POST request over the network', function () {
        jest_fetch_mock_1.default.mockResponseOnce(JSON.stringify({}), { status: 201 });
        var promise = transport.send({
            method: 'POST',
            endpoint: 'my-endpoint',
            logger: console
        }, { test: 1 }).then(function (resp) {
            expect(resp.statusCode).toEqual(201);
            return Promise.resolve();
        });
        expect(jest_fetch_mock_1.default.mock.calls.length).toEqual(1);
        return promise;
    });
    it('sends POST request over the network with headers', function () {
        var headers = {
            'X-API-Key': '123',
            'Content-Type': 'application/json;charset=utf-8',
            Accept: 'text/json, application/json'
        };
        jest_fetch_mock_1.default.mockResponseOnce(JSON.stringify({}), { status: 201, headers: headers });
        var promise = transport.send({
            method: 'POST',
            endpoint: 'my-endpoint',
            headers: headers,
            logger: console
        }, { test: 1 }).then(function (resp) {
            expect(resp.statusCode).toEqual(201);
            return Promise.resolve();
        });
        expect(jest_fetch_mock_1.default.mock.lastCall[1].headers).toEqual(headers);
        expect(jest_fetch_mock_1.default.mock.calls.length).toEqual(1);
        return promise;
    });
});
//# sourceMappingURL=transport.browser.test.js.map