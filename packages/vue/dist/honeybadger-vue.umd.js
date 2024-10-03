(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@honeybadger-io/js')) :
  typeof define === 'function' && define.amd ? define(['exports', '@honeybadger-io/js'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.HoneybadgerVue = {}, global.Honeybadger));
})(this, (function (exports, Honeybadger) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var Honeybadger__default = /*#__PURE__*/_interopDefaultLegacy(Honeybadger);

  /**
   * This was originally taken from https://github.com/vuejs/vue/blob/master/src/core/util/debug.js.
   * The method generateStackTrace is used to log errors the same way as Vue logs them when errorHandler is not set.
   */

  var classifyRE = /(?:^|[-_])(\w)/g;
  var classify = function (str) { return str
    .replace(classifyRE, function (c) { return c.toUpperCase(); })
    .replace(/[-_]/g, ''); };

  var ANONYMOUS_COMPONENT = '<Anonymous>';
  var ROOT_COMPONENT = '<Root>';

  var formatComponentName = function (vm, includeFile, isVue3Vm) {
    if (!vm) {
      return ANONYMOUS_COMPONENT
    }

    // no need to check for root in vue3, better to show name of component, even if $root
    if (!isVue3Vm && vm.$root === vm) {
      return ROOT_COMPONENT
    }

    var options = vm.$options;
    if (!options) {
      return ANONYMOUS_COMPONENT
    }

    // __name found in vue3
    var name = options.name || options._componentTag || options.__name;
    var file = options.__file;
    if (!name && file) {
      var match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }

    return (
      (name ? ("<" + (classify(name)) + ">") : ANONYMOUS_COMPONENT) +
      (file && includeFile !== false ? (" at " + file) : '')
    )
  };

  var repeat = function (str, n) {
    var res = '';
    while (n) {
      if (n % 2 === 1) { res += str; }
      if (n > 1) { str += str; }
      n >>= 1;
    }
    return res
  };

  var isVue3Vm = function (vm) { return !!(vm && vm.__isVue); };
  var isVue2Vm = function (vm) { return !!(vm && vm._isVue); };

  var generateComponentTrace = function (vm) {
    var vue3Vm = isVue3Vm(vm);
    if ((vue3Vm || isVue2Vm(vm)) && vm.$parent) {
      var tree = [];
      var currentRecursiveSequence = 0;
      while (vm) {
        if (!vue3Vm && tree.length > 0) {
          var last = tree[tree.length - 1];
          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++;
            vm = vm.$parent;
            continue
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [last, currentRecursiveSequence];
            currentRecursiveSequence = 0;
          }
        }
        tree.push(vm);
        vm = vm.$parent;
      }
      return '\n\nfound in\n\n' + tree
        .map(function (vm, i) { return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
            ? ((formatComponentName(vm[0], true, vue3Vm)) + "... (" + (vm[1]) + " recursive calls)")
            : formatComponentName(vm, true, vue3Vm))); })
        .join('\n')
    } else {
      return ("\n\n(found in " + (formatComponentName(vm, true, vue3Vm)) + ")")
    }
  };

  function logError (app, error, vm, info) {
    var message = "Error in " + info + ": \"" + (error && error.toString()) + "\"";

    var trace = vm ? generateComponentTrace(vm) : '';
    if (app.config.warnHandler) {
      app.config.warnHandler.call(null, message, vm, trace);
    } else {
      console.error(("[Vue warn]: " + message + trace));
    }
  }

  var NOTIFIER = {
    name: '@honeybadger-io/vue',
    url: 'https://github.com/honeybadger-io/honeybadger-js',
    version: '6.1.19'
  };

  function shouldLogError (app, options) {
    if (app.config.warnHandler) {
      return true
    }

    var hasConsole = typeof console !== 'undefined';
    var hasProcess = typeof process !== 'undefined';
    var isDebug = options.debug || (hasProcess && process.env.NODE_ENV !== 'production');
    return hasConsole && isDebug
  }

  function extractContext (vm) {
    var options = vm.$options || {};
    var name = options.name || options._componentTag;
    var file = options.__file;
    var parentName = vm.$parent && vm.$parent.$options ? vm.$parent.$options.name : undefined;

    // Vue2 - $options.propsData
    // Vue3 - $props
    var props = options.propsData || vm.$props;

    return {
      isRoot: vm.$root === vm,
      name: name,
      props: props,
      parentName: parentName,
      file: file
    }
  }

  function install(vue, options) {
    if (options.debug) {
      console.log(("Honeybadger configured with " + (options.apiKey)));
    }
    var honeybadger = Honeybadger__default["default"].configure(options);
    honeybadger.setNotifier(NOTIFIER);

    vue.$honeybadger = honeybadger;

    // vue 2 support -> make available for all components
    if (vue.prototype) {
      vue.prototype.$honeybadger = honeybadger;
    }

    if (vue.config && vue.config.globalProperties) {
      // vue 3 support -> make available for all components
      vue.config.globalProperties.$honeybadger = honeybadger;
    }
    var chainedErrorHandler = vue.config.errorHandler;
    vue.config.errorHandler = function (error, vm, info) {
      var metadata = { context: { vm: extractContext(vm), info: info } };
      honeybadger.notify(error, metadata);
      if (typeof chainedErrorHandler === 'function') {
        chainedErrorHandler.call(vue, error, vm, info);
      }

      if (shouldLogError(vue, options)) {
        logError(vue, error, vm, info);
      }
    };
  }

  var index = {
    install: install
  };

  exports["default"] = index;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=honeybadger-vue.umd.js.map
