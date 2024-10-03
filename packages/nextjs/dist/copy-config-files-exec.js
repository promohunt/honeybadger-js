#!/usr/bin/env node
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function getAugmentedNamespace(n) {
  var f = n.default;
	if (typeof f == "function") {
		var a = function () {
			return f.apply(this, arguments);
		};
		a.prototype = f.prototype;
  } else a = {};
  Object.defineProperty(a, '__esModule', {value: true});
	Object.keys(n).forEach(function (k) {
		var d = Object.getOwnPropertyDescriptor(n, k);
		Object.defineProperty(a, k, d.get ? d : {
			enumerable: true,
			get: function () {
				return n[k];
			}
		});
	});
	return a;
}

var copyConfigFilesExec = {};

const path = require('path');
const fs = require('fs');
const debug = process.env.HONEYBADGER_DEBUG === 'true';
function usesTypescript() {
    return fs.existsSync('tsconfig.json');
}
function usesSrcFolder() {
    return fs.existsSync('src');
}
function usesPagesRouter(isUnderSrc) {
    const srcFolder = isUnderSrc ? 'src' : '';
    return fs.existsSync(path.join(srcFolder, 'pages'));
}
function usesAppRouter(isUnderSrc) {
    const srcFolder = isUnderSrc ? 'src' : '';
    return fs.existsSync(path.join(srcFolder, 'app'));
}
function getTargetPath(isUnderSrc, isAppRouter = false, isGlobalErrorComponent = false) {
    if (!isAppRouter && isGlobalErrorComponent) {
        throw new Error('invalid arguments: isGlobalErrorComponent can only be true when isAppRouter is true');
    }
    const extension = usesTypescript() ? 'tsx' : 'js';
    let srcFolder = isUnderSrc ? 'src' : '';
    srcFolder = path.join(srcFolder, isAppRouter ? 'app' : 'pages');
    let fileName = '';
    if (isAppRouter) {
        fileName = isGlobalErrorComponent ? 'global-error' : 'error';
    }
    else {
        fileName = '_error';
    }
    return path.join(srcFolder, fileName + '.' + extension);
}
function getTemplate(isAppRouter = false, isGlobalErrorComponent = false) {
    if (!isAppRouter && isGlobalErrorComponent) {
        throw new Error('invalid arguments: isGlobalErrorComponent can only be true when isAppRouter is true');
    }
    const extension = isGlobalErrorComponent ? 'tsx' : 'js';
    const templateName = isAppRouter ? '_error_app_router' : '_error';
    return path.resolve(__dirname, '../templates', templateName + '.' + extension);
}
async function copyErrorJs(isUnderSrc, isAppRouter = false) {
    const sourcePath = getTemplate(isAppRouter);
    const targetPath = getTargetPath(isUnderSrc, isAppRouter);
    return copyFileWithBackup(sourcePath, targetPath);
}
function copyGlobalErrorJs(isUnderSrc) {
    const sourcePath = getTemplate(true, true);
    const targetPath = getTargetPath(isUnderSrc, true, true);
    return copyFileWithBackup(sourcePath, targetPath);
}
async function copyFileWithBackup(sourcePath, targetPath) {
    const fileAlreadyExists = fs.existsSync(targetPath);
    if (fileAlreadyExists) {
        // Don't overwrite an existing file without creating a backup first
        const backupPath = targetPath + '.bak';
        if (debug) {
            console.debug('backing up', targetPath, 'to', backupPath);
        }
        await fs.promises.copyFile(targetPath, backupPath);
    }
    if (debug) {
        console.debug('copying', sourcePath, 'to', targetPath);
    }
    return fs.promises.copyFile(sourcePath, targetPath);
}
async function copyConfigFiles$1() {
    if (debug) {
        console.debug('cwd', process.cwd());
    }
    const templateDir = path.resolve(__dirname, '../templates');
    const configFiles = [
        'honeybadger.browser.config.js',
        'honeybadger.edge.config.js',
        'honeybadger.server.config.js',
    ];
    const copyPromises = configFiles.map((file) => {
        if (debug) {
            console.debug('copying', file);
        }
        return fs.promises.copyFile(path.join(templateDir, file), file);
    });
    const isUnderSrcFolder = usesSrcFolder();
    if (usesPagesRouter(isUnderSrcFolder)) {
        copyPromises.push(copyErrorJs(isUnderSrcFolder, false));
    }
    if (usesAppRouter(isUnderSrcFolder)) {
        copyPromises.push(copyErrorJs(isUnderSrcFolder, true));
        copyPromises.push(copyGlobalErrorJs(isUnderSrcFolder));
    }
    await Promise.all(copyPromises);
    console.log('Done copying config files.');
}

var copyConfigFiles$2 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	copyConfigFiles: copyConfigFiles$1
});

var require$$0 = /*@__PURE__*/getAugmentedNamespace(copyConfigFiles$2);

const { copyConfigFiles } = require$$0;
copyConfigFiles().catch((err) => {
    console.error(err);
    process.exit(1);
});

exports["default"] = copyConfigFilesExec;
//# sourceMappingURL=copy-config-files-exec.js.map
