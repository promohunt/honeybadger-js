"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../../src/browser/util");
describe('utils/browser', function () {
    describe('stringNameOfElement', function () {
        it('returns the name of the element', function () {
            var element = document.createElement('button');
            expect((0, util_1.stringNameOfElement)(element)).toEqual('button');
        });
        it('returns a blank string when not an element', function () {
            expect((0, util_1.stringNameOfElement)({})).toEqual('');
        });
        it('returns a blank string when element is undefined', function () {
            expect((0, util_1.stringNameOfElement)(undefined)).toEqual('');
        });
        it('includes the element id when available', function () {
            var element = document.createElement('button');
            element.id = 'expected_id';
            expect((0, util_1.stringNameOfElement)(element)).toEqual('button#expected_id');
        });
        it('includes nth-child(i) when it has siblings', function () {
            var container = document.createElement('button');
            var element1 = document.createElement('button');
            var element2 = document.createElement('button');
            container.appendChild(element1);
            container.appendChild(element2);
            expect((0, util_1.stringNameOfElement)(element1)).toEqual('button:nth-child(1)');
            expect((0, util_1.stringNameOfElement)(element2)).toEqual('button:nth-child(2)');
        });
        it('includes whitelisted attributes', function () {
            var element = document.createElement('button');
            element.setAttribute('alt', 'alt value');
            element.setAttribute('name', 'name value');
            element.setAttribute('title', 'title value');
            element.setAttribute('type', 'type value');
            expect((0, util_1.stringNameOfElement)(element)).toEqual('button[alt="alt value"][name="name value"][title="title value"][type="type value"]');
        });
        it('excludes non-whitelisted attributes', function () {
            var element = document.createElement('button');
            element.setAttribute('other', 'other value');
            expect((0, util_1.stringNameOfElement)(element)).not.toMatch('other');
        });
        it('includes CSS class names', function () {
            var element = document.createElement('button');
            element.setAttribute('class', 'foo bar baz');
            expect((0, util_1.stringNameOfElement)(element)).toEqual('button.foo.bar.baz');
        });
    });
    describe('stringSelectorOfElement', function () {
        it('includes parent elements', function () {
            var html = document.createElement('html');
            var body = document.createElement('body');
            var div = document.createElement('div');
            var element = document.createElement('button');
            html.appendChild(body);
            body.appendChild(div);
            div.appendChild(element);
            expect((0, util_1.stringSelectorOfElement)(element)).toEqual('body > div > button');
        });
    });
    describe('stringTextOfElement', function () {
        it('returns the text of the element', function () {
            var element = document.createElement('div');
            var node = document.createTextNode('expected text');
            element.appendChild(node);
            expect((0, util_1.stringTextOfElement)(element)).toEqual('expected text');
        });
        it('truncates long strings', function () {
            function repeat(string, num) {
                var result = string;
                for (var i = 1; i < num; i++) {
                    result += string;
                }
                return result;
            }
            var element = document.createElement('div');
            var node = document.createTextNode(repeat('*', 400));
            element.appendChild(node);
            expect((0, util_1.stringTextOfElement)(element)).toEqual(repeat('*', 300) + '...');
        });
    });
});
//# sourceMappingURL=util.browser.test.js.map