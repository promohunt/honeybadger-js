'use strict';

var originalFetch = require('node-fetch');
var fetchRetry = require('fetch-retry');
var FormData = require('form-data');
var fs = require('fs');
var path = require('path');

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */


function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

/**
 * Attempts to parse error details from a non-ok Response
 */
function parseResErrorDetails(res) {
    return __awaiter(this, void 0, void 0, function* () {
        let details;
        try {
            const body = yield res.json();
            if (body && body.error) {
                details = `${res.status} - ${body.error}`;
            }
            else {
                details = `${res.status} - ${res.statusText}`;
            }
        }
        catch (parseErr) {
            details = `${res.status} - ${res.statusText}`;
        }
        return details;
    });
}
function* generator(promiseFactories) {
    for (let i = 0; i < promiseFactories.length; i++) {
        yield [promiseFactories[i](), i];
    }
}
function worker(generator, results) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const [promise, index] of generator) {
            try {
                const value = yield promise;
                results[index] = { status: 'fulfilled', value };
            }
            catch (err) {
                results[index] = { status: 'rejected', reason: err };
            }
        }
    });
}
/*
 * Settle promises with a configurable worker count
 * Return value is formatted like Promise.allSettled([...])
**/
function settlePromiseWithWorkers(promiseFactories, workerCount) {
    return __awaiter(this, void 0, void 0, function* () {
        // The generator and the results are shared between workers, ensuring each promise is only resolved once
        const sharedGenerator = generator(promiseFactories);
        const results = [];
        // There's no need to create more workers than promises to resolve
        const actualWorkerCount = Math.min(workerCount, promiseFactories.length);
        const workers = Array.from(new Array(actualWorkerCount)).map(() => worker(sharedGenerator, results));
        yield Promise.allSettled(workers);
        return results;
    });
}

// @ts-expect-error
const fetch$1 = fetchRetry(originalFetch);
/**
 * Executes an API call to send a deploy notification
 */
function sendDeployNotification(hbOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = buildBodyForDeployNotification(hbOptions);
        let res;
        try {
            res = yield fetch$1(hbOptions.deployEndpoint, {
                method: 'POST',
                headers: {
                    'X-API-KEY': hbOptions.apiKey,
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body,
                redirect: 'follow',
                retries: hbOptions.retries,
                retryDelay: 1000
            });
        }
        catch (err) {
            // network / operational errors. Does not include 404 / 500 errors
            throw new Error(`Failed to send deploy notification to Honeybadger: ${err.name}${err.message ? ` - ${err.message}` : ''}`);
        }
        if (res.ok) {
            if (!hbOptions.silent) {
                console.info('Successfully sent deploy notification to Honeybadger');
            }
            return res;
        }
        else {
            const details = yield parseResErrorDetails(res);
            throw new Error(`Failed to send deploy notification to Honeybadger: ${details}`);
        }
    });
}
/**
 * Builds the JSON body for the deploy notification
 */
function buildBodyForDeployNotification(hbOptions) {
    const body = {
        deploy: { revision: hbOptions.revision }
    };
    if (typeof hbOptions.deploy === 'object') {
        body.deploy.repository = hbOptions.deploy.repository;
        body.deploy.local_username = hbOptions.deploy.localUsername;
        body.deploy.environment = hbOptions.deploy.environment;
    }
    return JSON.stringify(body);
}

// @ts-expect-error
const fetch = fetchRetry(originalFetch);
/**
 * Uploads sourcemaps to API endpoint
 */
function uploadSourcemaps(sourcemapData, hbOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        if (sourcemapData.length === 0 && !hbOptions.silent) {
            console.warn('Could not find any sourcemaps in the bundle. Nothing will be uploaded.');
            return;
        }
        const sourcemapUploadPromises = sourcemapData.map(data => (() => { return uploadSourcemap(data, hbOptions); }));
        const results = yield settlePromiseWithWorkers(sourcemapUploadPromises, hbOptions.workerCount);
        const fulfilled = results.filter((p) => p.status === 'fulfilled');
        const rejected = results.filter((p) => p.status === 'rejected');
        if (!hbOptions.silent && fulfilled.length > 0) {
            console.info(`${fulfilled.length} sourcemap file(s) successfully uploaded to Honeybadger`);
        }
        if (rejected.length > 0) {
            const errorsStr = rejected.map(p => p.reason).join('\n');
            throw new Error(`Failed to upload ${rejected.length} sourcemap file(s) to Honeybadger\n${errorsStr}`);
        }
        return fulfilled.map(p => p.value);
    });
}
/**
 * Executes an API call to upload a single sourcemap
 */
function uploadSourcemap(sourcemapData, hbOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = yield buildBodyForSourcemapUpload(sourcemapData, hbOptions);
        let res;
        try {
            res = yield fetch(hbOptions.endpoint, {
                method: 'POST',
                // @ts-ignore
                body,
                redirect: 'follow',
                retries: hbOptions.retries,
                retryDelay: 1000
            });
        }
        catch (err) {
            // network / operational errors. Does not include 404 / 500 errors
            throw new Error(`Failed to upload sourcemap ${sourcemapData.sourcemapFilename} to Honeybadger: ${err.name}${err.message ? ` - ${err.message}` : ''}`);
        }
        if (res.ok) {
            if (!hbOptions.silent) {
                console.info(`Successfully uploaded ${sourcemapData.sourcemapFilename} to Honeybadger`);
            }
            return res;
        }
        else {
            const details = yield parseResErrorDetails(res);
            throw new Error(`Failed to upload sourcemap ${sourcemapData.sourcemapFilename} to Honeybadger: ${details}`);
        }
    });
}
/**
 * Builds the form data for the sourcemap API call
 */
function buildBodyForSourcemapUpload(sourcemapData, hbOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        const form = new FormData();
        const url = new URL(hbOptions.assetsUrl);
        url.pathname = path.join(url.pathname, sourcemapData.jsFilename);
        const minifiedUrl = url.href;
        form.append('api_key', hbOptions.apiKey);
        form.append('minified_url', minifiedUrl);
        form.append('revision', hbOptions.revision);
        form.append('minified_file', yield fs.promises.readFile(sourcemapData.jsFilePath), {
            filename: sourcemapData.jsFilename,
            contentType: 'application/javascript'
        });
        form.append('source_map', yield fs.promises.readFile(sourcemapData.sourcemapFilePath), {
            filename: sourcemapData.sourcemapFilePath,
            contentType: 'application/octet-stream'
        });
        return form;
    });
}

const MAX_RETRIES = 10;
const MIN_WORKER_COUNT = 1;
const DEFAULT_WORKER_COUNT = 5;
const DEFAULT_RETRIES = 3;
const DEFAULT_ENDPOINT = 'https://api.honeybadger.io/v1/source_maps';
const DEFAULT_REVISION = 'main';
const DEFAULT_SILENT = false;
const DEFAULT_DEPLOY = false;
const DEFAULT_DEPLOY_ENDPOINT = 'https://api.honeybadger.io/v1/deploys';
const DEFAULT_IGNORE_PATHS = [];
const DEFAULT_IGNORE_ERRORS = false;
const required = [
    'apiKey',
    'assetsUrl'
];
const defaultOptions = {
    endpoint: DEFAULT_ENDPOINT,
    retries: DEFAULT_RETRIES,
    revision: DEFAULT_REVISION,
    silent: DEFAULT_SILENT,
    deploy: DEFAULT_DEPLOY,
    deployEndpoint: DEFAULT_DEPLOY_ENDPOINT,
    ignorePaths: DEFAULT_IGNORE_PATHS,
    ignoreErrors: DEFAULT_IGNORE_ERRORS,
    workerCount: DEFAULT_WORKER_COUNT,
};
function cleanOptions(options) {
    // Validate presence of required fields
    required.forEach(field => {
        if (!options || !options[field]) {
            throw new Error(`${field} is required`);
        }
    });
    // Validate ignorePaths
    if (options.ignorePaths && !Array.isArray(options.ignorePaths)) {
        throw new Error('ignorePaths must be an array');
    }
    // Don't allow excessive retries
    if (options.retries && options.retries > MAX_RETRIES) {
        if (!options.silent) {
            console.warn(`Using max retries: ${MAX_RETRIES}`);
        }
        options.retries = MAX_RETRIES;
    }
    // Don't allow silly worker count
    if (options.workerCount !== undefined && options.workerCount < MIN_WORKER_COUNT) {
        options.workerCount = MIN_WORKER_COUNT;
    }
    // Merge in our defaults
    return Object.assign(Object.assign({}, defaultOptions), options);
}

var types = /*#__PURE__*/Object.freeze({
    __proto__: null
});

exports.Types = types;
exports.cleanOptions = cleanOptions;
exports.sendDeployNotification = sendDeployNotification;
exports.uploadSourcemaps = uploadSourcemaps;
//# sourceMappingURL=index.js.map
