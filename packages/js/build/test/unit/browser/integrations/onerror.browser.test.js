"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var onerror_1 = require("../../../../src/browser/integrations/onerror");
var helpers_1 = require("../../helpers");
describe('window.onerror integration', function () {
    var client, mockNotify, mockAddBreadcrumb;
    beforeEach(function () {
        client = new helpers_1.TestClient({
            logger: (0, helpers_1.nullLogger)()
        }, new helpers_1.TestTransport());
        mockNotify = jest.fn();
        mockAddBreadcrumb = jest.fn();
        client.notify = mockNotify;
        client.addBreadcrumb = mockAddBreadcrumb;
    });
    it('adds config to client', function () {
        var window = {};
        (0, onerror_1.onError)(window).load(client);
        expect(client.config.enableUncaught).toEqual(true);
    });
    it('skips install if window.onerror isn\'t a property', function () {
        var window = {};
        (0, onerror_1.onError)(window).load(client);
        expect(window['onerror']).toBeUndefined();
    });
    it('installs first window.onerror handler', function () {
        var window = { onerror: undefined };
        (0, onerror_1.onError)(window).load(client);
        expect(window.onerror).toEqual(expect.any(Function));
    });
    it('wraps existing window.onerror handler', function () {
        var mockHandler = jest.fn();
        var window = { onerror: mockHandler };
        (0, onerror_1.onError)(window).load(client);
        expect(window.onerror).toEqual(expect.any(Function));
        expect(window.onerror).not.toEqual(mockHandler);
        window.onerror('testing', 'https://www.example.com/', '1', '0');
        expect(mockHandler.mock.calls.length).toBe(1);
    });
    it('reports errors when error object is unavailable', function () {
        var window = { onerror: undefined };
        (0, onerror_1.onError)(window).load(client);
        window.onerror('expected message', 'https://www.example.com/', '1');
        expect(mockNotify.mock.calls.length).toBe(1);
        expect(mockNotify.mock.calls[0][0]).toEqual(expect.objectContaining({
            name: 'window.onerror',
            message: 'expected message',
            stack: 'expected message\n    at ? (https://www.example.com/:1:0)'
        }));
    });
    it('reports error object when it is available', function () {
        var err = new Error('expected message');
        var window = { onerror: undefined };
        (0, onerror_1.onError)(window).load(client);
        window.onerror('testing', 'https://www.example.com/', '1', '0', err);
        expect(mockNotify.mock.calls.length).toBe(1);
        expect(mockNotify.mock.calls[0][0]).toEqual(expect.objectContaining({
            name: 'Error',
            message: 'expected message',
            stack: err.stack
        }));
    });
    it('reports non-error objects', function () {
        var window = { onerror: undefined };
        (0, onerror_1.onError)(window).load(client);
        window.onerror('testing', 'https://www.example.com/', '1', '0', 'expected message');
        expect(mockNotify.mock.calls.length).toBe(1);
        expect(mockNotify.mock.calls[0][0]).toEqual(expect.objectContaining({
            name: 'window.onerror',
            message: 'expected message',
            stack: 'expected message\n    at ? (https://www.example.com/:1:0)'
        }));
    });
    it('supplements minimial information', function () {
        var window = { onerror: undefined };
        (0, onerror_1.onError)(window).load(client);
        window.onerror(null, null, null, null, 'expected message');
        expect(mockNotify.mock.calls.length).toBe(1);
        expect(mockNotify.mock.calls[0][0]).toEqual(expect.objectContaining({
            name: 'window.onerror',
            message: 'expected message',
            stack: 'expected message\n    at ? (unknown:0:0)'
        }));
    });
    it('skips cross-domain script errors', function () {
        var window = { onerror: undefined };
        (0, onerror_1.onError)(window).load(client);
        window.onerror('Script error', 'https://www.example.com/', 0);
        expect(mockNotify.mock.calls.length).toBe(0);
    });
    it('reports breadcrumb', function () {
        var window = { onerror: undefined };
        (0, onerror_1.onError)(window).load(client);
        window.onerror('testing', 'https://www.example.com/', '1', '0', 'expected message');
        expect(mockAddBreadcrumb.mock.calls.length).toBe(1);
        expect(mockAddBreadcrumb.mock.calls[0][0]).toEqual('window.onerror');
        expect(mockAddBreadcrumb.mock.calls[0][1]).toEqual(expect.objectContaining({
            category: 'error',
            metadata: {
                name: 'window.onerror',
                message: 'expected message',
                stack: 'expected message\n    at ? (https://www.example.com/:1:0)'
            }
        }));
    });
});
//# sourceMappingURL=onerror.browser.test.js.map