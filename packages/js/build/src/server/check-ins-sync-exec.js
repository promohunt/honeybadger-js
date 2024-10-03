var syncCheckIns = require('./check-ins-sync').syncCheckIns;
syncCheckIns().catch(function (err) {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=check-ins-sync-exec.js.map