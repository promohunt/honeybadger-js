"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StackedStore = void 0;
var core_1 = require("@honeybadger-io/core");
var async_store_1 = require("./async_store");
/**
 * A store that's really a "stack" of stores (async and global)
 * Will proxy calls to the async store if it's active (ie when we enter an async context via `ALS.run()`),
 * otherwise it will fall back to the global store.
 * Both stores in the stack start out with the same contents object.
 * Note that the asyncStore may be null if ALS is not supported.
 */
var StackedStore = /** @class */ (function () {
    function StackedStore(breadcrumbsLimit) {
        this.contents = { context: {}, breadcrumbs: [] };
        this.asyncStore = async_store_1.AsyncStore.create(this.contents, breadcrumbsLimit);
        this.globalStore = core_1.GlobalStore.create(this.contents, breadcrumbsLimit);
    }
    StackedStore.prototype.__activeStore = function () {
        var _a;
        return ((_a = this.asyncStore) === null || _a === void 0 ? void 0 : _a.available()) ? this.asyncStore : this.globalStore;
    };
    StackedStore.prototype.available = function () {
        return true;
    };
    // @ts-ignore
    StackedStore.prototype.getContents = function (key) {
        return this.__activeStore().getContents(key);
    };
    StackedStore.prototype.setContext = function (context) {
        this.__activeStore().setContext(context);
    };
    StackedStore.prototype.addBreadcrumb = function (breadcrumb) {
        this.__activeStore().addBreadcrumb(breadcrumb);
    };
    StackedStore.prototype.clear = function () {
        this.__activeStore().clear();
    };
    StackedStore.prototype.run = function (callback, request) {
        // We explicitly favour the async store here, if ALS is supported. It's the whole point of the `run()` method
        return this.asyncStore ? this.asyncStore.run(callback, request) : this.globalStore.run(callback);
    };
    return StackedStore;
}());
exports.StackedStore = StackedStore;
//# sourceMappingURL=stacked_store.js.map