"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalThisOrWindow = exports.preferCatch = exports.encodeCookie = exports.decodeCookie = exports.localURLPathname = exports.parseURL = exports.nativeFetch = exports.stringTextOfElement = exports.stringSelectorOfElement = exports.stringNameOfElement = void 0;
/**
 * Converts an HTMLElement into a human-readable string.
 * @param {!HTMLElement} element
 * @return {string}
 */
function stringNameOfElement(element) {
    if (!element || !element.tagName) {
        return '';
    }
    var name = element.tagName.toLowerCase();
    // Ignore the root <html> element in selectors and events.
    if (name === 'html') {
        return '';
    }
    if (element.id) {
        name += "#".concat(element.id);
    }
    var stringClassNames = element.getAttribute('class');
    if (stringClassNames) {
        stringClassNames.split(/\s+/).forEach(function (className) {
            name += ".".concat(className);
        });
    }
    ['alt', 'name', 'title', 'type'].forEach(function (attrName) {
        var attr = element.getAttribute(attrName);
        if (attr) {
            name += "[".concat(attrName, "=\"").concat(attr, "\"]");
        }
    });
    var siblings = getSiblings(element);
    if (siblings.length > 1) {
        name += ":nth-child(".concat(Array.prototype.indexOf.call(siblings, element) + 1, ")");
    }
    return name;
}
exports.stringNameOfElement = stringNameOfElement;
function stringSelectorOfElement(element) {
    var name = stringNameOfElement(element);
    if (element.parentNode && element.parentNode.tagName) {
        var parentName = stringSelectorOfElement(element.parentNode);
        if (parentName.length > 0) {
            return "".concat(parentName, " > ").concat(name);
        }
    }
    return name;
}
exports.stringSelectorOfElement = stringSelectorOfElement;
function stringTextOfElement(element) {
    var text = element.textContent || element.innerText || '';
    if (!text && (element.type === 'submit' || element.type === 'button')) {
        text = element.value;
    }
    return truncate(text.trim(), 300);
}
exports.stringTextOfElement = stringTextOfElement;
function nativeFetch() {
    var global = globalThisOrWindow();
    if (!global.fetch) {
        return false;
    }
    if (isNative(global.fetch)) {
        return true;
    }
    if (typeof document === 'undefined') {
        return false;
    }
    // If fetch isn't native, it may be wrapped by someone else. Try to get
    // a pristine function from an iframe.
    try {
        var sandbox = document.createElement('iframe');
        sandbox.style.display = 'none';
        document.head.appendChild(sandbox);
        var result = sandbox.contentWindow.fetch && isNative(sandbox.contentWindow.fetch);
        document.head.removeChild(sandbox);
        return result;
    }
    catch (err) {
        if (console && console.warn) {
            console.warn('failed to detect native fetch via iframe: ' + err);
        }
    }
    return false;
}
exports.nativeFetch = nativeFetch;
function isNative(func) {
    return func.toString().indexOf('native') !== -1;
}
function parseURL(url) {
    // Regexp: https://tools.ietf.org/html/rfc3986#appendix-B
    var match = url.match(/^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/) || {};
    return {
        protocol: match[2],
        host: match[4],
        pathname: match[5]
    };
}
exports.parseURL = parseURL;
function localURLPathname(url) {
    var parsed = parseURL(url);
    var parsedDocURL = parseURL(document.URL);
    // URL must be relative
    if (!parsed.host || !parsed.protocol) {
        return parsed.pathname;
    }
    // Same domain
    if (parsed.protocol === parsedDocURL.protocol && parsed.host === parsedDocURL.host) {
        return parsed.pathname;
    }
    // x-domain
    return "".concat(parsed.protocol, "://").concat(parsed.host).concat(parsed.pathname);
}
exports.localURLPathname = localURLPathname;
function decodeCookie(string) {
    var result = {};
    string.split(/[;,]\s?/).forEach(function (pair) {
        var _a = pair.split('=', 2), key = _a[0], value = _a[1];
        result[key] = value;
    });
    return result;
}
exports.decodeCookie = decodeCookie;
function encodeCookie(object) {
    if (typeof object !== 'object') {
        return undefined;
    }
    var cookies = [];
    for (var k in object) {
        cookies.push(k + '=' + object[k]);
    }
    return cookies.join(';');
}
exports.encodeCookie = encodeCookie;
// Helpers
function getSiblings(element) {
    try {
        var nodes = element.parentNode.childNodes;
        var siblings_1 = [];
        Array.prototype.forEach.call(nodes, function (node) {
            if (node.tagName && node.tagName === element.tagName) {
                siblings_1.push(node);
            }
        });
        return siblings_1;
    }
    catch (e) {
        return [];
    }
}
function truncate(string, length) {
    if (string.length > length) {
        string = string.substr(0, length) + '...';
    }
    return string;
}
// Used to decide which error handling method to use when wrapping async
// handlers: try/catch, or `window.onerror`. When available, `window.onerror`
// will provide more information in modern browsers.
exports.preferCatch = (function () {
    var preferCatch = true;
    // In case we're in an environment without access to "window", lets make sure theres a window.
    if (typeof window === 'undefined')
        return preferCatch;
    // IE < 10
    if (!window.atob) {
        preferCatch = false;
    }
    // Modern browsers support the full ErrorEvent API
    // See https://developer.mozilla.org/en-US/docs/Web/API/ErrorEvent
    if (window.ErrorEvent) {
        try {
            if ((new window.ErrorEvent('')).colno === 0) {
                preferCatch = false;
            }
            // eslint-disable-next-line no-empty
        }
        catch (_e) { }
    }
    return preferCatch;
})();
/** globalThis has fairly good support. But just in case, lets check its defined.
 * @see {https://caniuse.com/?search=globalThis}
 */
function globalThisOrWindow() {
    if (typeof globalThis !== 'undefined') {
        return globalThis;
    }
    if (typeof self !== 'undefined') {
        return self;
    }
    return window;
}
exports.globalThisOrWindow = globalThisOrWindow;
//# sourceMappingURL=util.js.map