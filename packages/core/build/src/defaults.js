"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONFIG = void 0;
exports.CONFIG = {
    apiKey: null,
    endpoint: 'https://api.honeybadger.io',
    environment: null,
    hostname: null,
    projectRoot: null,
    component: null,
    action: null,
    revision: null,
    reportData: null,
    breadcrumbsEnabled: true,
    eventsEnabled: false,
    maxBreadcrumbs: 40,
    maxObjectDepth: 8,
    logger: console,
    developmentEnvironments: ['dev', 'development', 'test'],
    debug: false,
    tags: null,
    enableUncaught: true,
    enableUnhandledRejection: true,
    afterUncaught: function () { return true; },
    filters: ['creditcard', 'password'],
    __plugins: [],
};
//# sourceMappingURL=defaults.js.map