"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sinon_1 = require("sinon");
var util_1 = require("../src/util");
var helpers_1 = require("./helpers");
describe('utils', function () {
    describe('filterUrl', function () {
        it('filters query string', function () {
            expect((0, util_1.filterUrl)('https://www.example.com/?secret=value', ['secret'])).toEqual('https://www.example.com/?secret=[FILTERED]');
        });
        it('filters query string with empty param', function () {
            expect((0, util_1.filterUrl)('https://www.example.com/?secret=&foo=bar', ['secret'])).toEqual('https://www.example.com/?secret=[FILTERED]&foo=bar');
        });
        it('returns untouched url with malformed param', function () {
            expect((0, util_1.filterUrl)('https://www.example.com/?secret&foo=bar', ['secret'])).toEqual('https://www.example.com/?secret&foo=bar');
        });
        it('returns untouched url with filters', function () {
            expect((0, util_1.filterUrl)('https://www.example.com/', ['secret'])).toEqual('https://www.example.com/');
            expect((0, util_1.filterUrl)('https://www.example.com/?foo=bar', ['secret'])).toEqual('https://www.example.com/?foo=bar');
        });
        it('returns untouched url without filters', function () {
            expect((0, util_1.filterUrl)('https://www.example.com/', [])).toEqual('https://www.example.com/');
            expect((0, util_1.filterUrl)('https://www.example.com/?foo=bar', [])).toEqual('https://www.example.com/?foo=bar');
        });
    });
    describe('filter', function () {
        it('filters partial match', function () {
            expect((0, util_1.filter)({ secret_key: 'secret' }, ['secret'])).toEqual({ secret_key: '[FILTERED]' });
        });
        it('ignores case', function () {
            expect((0, util_1.filter)({ foo: 'secret', FOO: 'secret' }, ['Foo'])).toEqual({ foo: '[FILTERED]', FOO: '[FILTERED]' });
        });
    });
    describe('logger', function () {
        it('skips debug logging by default', function () {
            var mockDebug = jest.fn();
            var console = (0, helpers_1.nullLogger)();
            console.debug = mockDebug;
            var client = new helpers_1.TestClient({ logger: console }, new helpers_1.TestTransport());
            (0, util_1.logger)(client).debug('expected');
            expect(mockDebug.mock.calls.length).toBe(0);
        });
        it('logs to console when debug logging is enabled', function () {
            var mockDebug = jest.fn();
            var console = (0, helpers_1.nullLogger)();
            console.log = mockDebug;
            var client = new helpers_1.TestClient({ logger: console, debug: true }, new helpers_1.TestTransport());
            (0, util_1.logger)(client).debug('expected');
            expect(mockDebug.mock.calls.length).toBe(1);
            expect(mockDebug.mock.calls[0][0]).toBe('[Honeybadger]');
            expect(mockDebug.mock.calls[0][1]).toBe('expected');
        });
    });
    describe('merge', function () {
        it('combines two objects', function () {
            expect((0, util_1.merge)({ foo: 'foo' }, { bar: 'bar' })).toEqual({ foo: 'foo', bar: 'bar' });
        });
    });
    describe('mergeNotice', function () {
        it('combines two notice objects', function () {
            expect((0, util_1.mergeNotice)({ name: 'foo' }, { message: 'bar' })).toEqual({ name: 'foo', message: 'bar' });
        });
        it('combines context properties', function () {
            expect((0, util_1.mergeNotice)({ context: { foo: 'foo' } }, { context: { bar: 'bar' } })).toEqual({ context: { foo: 'foo', bar: 'bar' } });
        });
    });
    describe('objectIsEmpty', function () {
        it('returns true when empty', function () {
            expect((0, util_1.objectIsEmpty)({})).toEqual(true);
        });
        it('returns false when not empty', function () {
            expect((0, util_1.objectIsEmpty)({ foo: 'bar' })).toEqual(false);
        });
    });
    describe('runBeforeNotifyHandlers', function () {
        it('returns false when any handler returns false', function () {
            var handlers = [
                function () { return false; },
                function () { return true; }
            ];
            expect((0, util_1.runBeforeNotifyHandlers)({}, handlers).result).toEqual(false);
        });
        it('returns true when all handlers return true', function () {
            var handlers = [
                function () { return true; },
                function () { return true; }
            ];
            expect((0, util_1.runBeforeNotifyHandlers)({}, handlers).result).toEqual(true);
        });
        it('passes the notice to handlers', function () {
            var notice = (0, sinon_1.fake)();
            var handlers = [
                function (notice) { notice.call(); }
            ];
            (0, util_1.runBeforeNotifyHandlers)(notice, handlers);
            expect(notice.called).toEqual(true);
        });
        it('allows handlers to mutate notice', function () {
            var notice = { first: undefined, second: undefined };
            var handlers = [
                function (notice) { notice.first = 'first expected'; },
                function (notice) { notice.second = 'second expected'; }
            ];
            (0, util_1.runBeforeNotifyHandlers)(notice, handlers);
            expect(notice.first).toEqual('first expected');
            expect(notice.second).toEqual('second expected');
        });
    });
    describe('runAfterNotifyHandlers', function () {
        it('passes the notice to handlers', function () {
            var notice = (0, sinon_1.fake)();
            var handlers = [
                function (_error, notice) { notice.call(); }
            ];
            (0, util_1.runAfterNotifyHandlers)(notice, handlers);
            expect(notice.called).toEqual(true);
        });
        it('passes the error to handlers', function () {
            var error = (0, sinon_1.fake)();
            var handlers = [
                function (error, _notice) { error.call(); }
            ];
            (0, util_1.runAfterNotifyHandlers)({}, handlers, error);
            expect(error.called).toEqual(true);
        });
    });
    describe('newObject', function () {
        it('returns a new object', function () {
            var obj = { expected: 'value' };
            expect((0, util_1.shallowClone)(obj)).toEqual(obj);
            expect((0, util_1.shallowClone)(obj)).not.toBe(obj);
        });
    });
    describe('sanitize', function () {
        it('enforces configured max depth', function () {
            expect((0, util_1.sanitize)({ one: { two: { three: { four: 'five' } } } }, 3)).toEqual({ one: { two: { three: '[DEPTH]' } } });
        });
        it('drops undefined values', function () {
            expect((0, util_1.sanitize)({ foo: undefined, bar: 'baz' })).toEqual({ bar: 'baz' });
        });
        it('drops function values', function () {
            expect((0, util_1.sanitize)(
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            { foo: function () { }, bar: 'baz' })).toEqual({ foo: '[object Function]', bar: 'baz' });
        });
        it('drops circular references', function () {
            var obj = { obj: null };
            obj.obj = obj;
            expect((0, util_1.sanitize)(obj)).toEqual({
                obj: '[RECURSION]'
            });
        });
        it('drops null array items', function () {
            expect((0, util_1.sanitize)({ obj: ['first', null] }, 6)).toEqual({ obj: ['first', '[object Null]'] });
        });
        it('enforces max depth in arrays', function () {
            expect((0, util_1.sanitize)({
                one: ['two', ['three', ['four', ['five', ['six', ['seven', ['eight', ['nine']]]]]]]]
            }, 6)).toEqual({
                one: ['two', ['three', ['four', ['five', ['[DEPTH]', '[DEPTH]']]]]]
            });
        });
        it('supports toJSON() of objects', function () {
            expect(JSON.parse(JSON.stringify((0, util_1.sanitize)({
                ignored: false,
                aProperty: {
                    thisShouldBeIgnored: true,
                    toJSON: function () {
                        return {
                            bProperty: true
                        };
                    }
                },
            }, 6)))).toEqual({
                ignored: false,
                aProperty: {
                    bProperty: true
                }
            });
        });
        if (typeof Object.create === 'function') {
            it('handles objects without prototypes as values', function () {
                var obj = Object.create(null);
                expect((0, util_1.sanitize)({
                    key: obj
                })).toEqual({ key: '[object Object]' });
            });
        }
        if (typeof Symbol === 'function') {
            it('serializes symbol values', function () {
                var sym = Symbol('test');
                expect((0, util_1.sanitize)({
                    key: sym
                })).toEqual({ key: '[object Symbol]' });
            });
            it('drops symbol keys', function () {
                var sym = Symbol('test');
                var obj = {};
                obj[sym] = 'value';
                expect((0, util_1.sanitize)(obj)).toEqual({});
            });
        }
        it('handles other errors', function () {
            var obj = [];
            // This will cause the map operation to blow up
            obj.map = function () { throw (new Error('expected error')); };
            expect((0, util_1.sanitize)({ obj: obj })).toEqual({ obj: '[ERROR] Error: expected error' });
        });
    });
});
//# sourceMappingURL=util.test.js.map