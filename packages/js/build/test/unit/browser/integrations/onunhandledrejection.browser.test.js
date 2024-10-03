"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var onunhandledrejection_1 = __importDefault(require("../../../../src/browser/integrations/onunhandledrejection"));
var helpers_1 = require("../../helpers");
describe('window.onunhandledrejection integration', function () {
    var client, mockNotify;
    beforeEach(function () {
        client = new helpers_1.TestClient({
            logger: (0, helpers_1.nullLogger)()
        }, new helpers_1.TestTransport());
        mockNotify = jest.fn();
        client.notify = mockNotify;
    });
    it('skips install if window.onunhandledrejection isn\'t a property', function () {
        var window = {};
        (0, onunhandledrejection_1.default)(window).load(client);
        expect(window['onunhandledrejection']).toBeUndefined();
    });
    it('reports error reason when specified', function () {
        var window = { onunhandledrejection: undefined };
        (0, onunhandledrejection_1.default)(window).load(client);
        var reason = 'Honeybadgers!';
        window.onunhandledrejection({ reason: reason });
        expect(mockNotify.mock.calls.length).toBe(1);
        expect(mockNotify.mock.calls[0][0]).toEqual(expect.objectContaining({
            name: 'window.onunhandledrejection',
            message: "UnhandledPromiseRejectionWarning: ".concat(reason)
        }));
    });
    it('reports default error reason if left unspecified', function () {
        var window = { onunhandledrejection: undefined };
        (0, onunhandledrejection_1.default)(window).load(client);
        window.onunhandledrejection(jest.fn());
        expect(mockNotify.mock.calls.length).toBe(1);
        expect(mockNotify.mock.calls[0][0]).toEqual(expect.objectContaining({
            name: 'window.onunhandledrejection',
            message: 'UnhandledPromiseRejectionWarning: Unspecified reason'
        }));
    });
});
//# sourceMappingURL=onunhandledrejection.browser.test.js.map