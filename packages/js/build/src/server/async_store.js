"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsyncStore = void 0;
var kHoneybadgerStore = Symbol.for('kHoneybadgerStore');
var AsyncStore = /** @class */ (function () {
    function AsyncStore(asyncLocalStorage, contents, breadcrumbsLimit) {
        this.als = asyncLocalStorage;
        this.contents = contents;
        this.breadcrumbsLimit = breadcrumbsLimit;
    }
    /**
     * Attempt to create a new AsyncStore instance
     */
    AsyncStore.create = function (contents, breadcrumbsLimit) {
        try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            var AsyncLocalStorage_1 = require('async_hooks').AsyncLocalStorage;
            return new AsyncStore(new AsyncLocalStorage_1, contents, breadcrumbsLimit);
        }
        catch (e) {
            return null;
        }
    };
    /**
     * This returns the live store object, so we can mutate it.
     * If we're in an async context (a `run()` callback), the stored contents at this point will be returned.
     * Otherwise, the initial stored contents will be returned.
     */
    AsyncStore.prototype.__currentContents = function () {
        return this.als.getStore() || this.contents;
    };
    AsyncStore.prototype.getContents = function (key) {
        var value = key ? this.__currentContents()[key] : this.__currentContents();
        return JSON.parse(JSON.stringify(value));
    };
    AsyncStore.prototype.available = function () {
        return !!this.als.getStore();
    };
    AsyncStore.prototype.setContext = function (context) {
        Object.assign(this.__currentContents().context, context || {});
    };
    AsyncStore.prototype.addBreadcrumb = function (breadcrumb) {
        if (this.__currentContents().breadcrumbs.length == this.breadcrumbsLimit) {
            this.__currentContents().breadcrumbs.shift();
        }
        this.__currentContents().breadcrumbs.push(breadcrumb);
    };
    AsyncStore.prototype.clear = function () {
        this.__currentContents().context = {};
        this.__currentContents().breadcrumbs = [];
    };
    AsyncStore.prototype.run = function (callback, request) {
        // When entering an async context, we pass in *a copy* of the initial contents.
        // This allows every request to start from the same state
        // and add data specific to them, without overlapping.
        if (!request) {
            return this.als.run(this.getContents(), callback);
        }
        var contents;
        if (request[kHoneybadgerStore]) {
            contents = request[kHoneybadgerStore];
        }
        else {
            contents = this.getContents();
            request[kHoneybadgerStore] = contents;
        }
        return this.als.run(contents, callback);
    };
    return AsyncStore;
}());
exports.AsyncStore = AsyncStore;
//# sourceMappingURL=async_store.js.map