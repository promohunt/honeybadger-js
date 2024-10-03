"use strict";
const { copyConfigFiles } = require('./copy-config-files');
copyConfigFiles().catch((err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=copy-config-files-exec.js.map