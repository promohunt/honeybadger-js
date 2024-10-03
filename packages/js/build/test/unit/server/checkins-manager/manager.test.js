"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var check_ins_manager_1 = require("../../../../src/server/check-ins-manager");
var helpers_1 = require("../../helpers");
var check_in_1 = require("../../../../src/server/check-ins-manager/check-in");
var nock_1 = __importDefault(require("nock"));
describe('CheckinsManager', function () {
    it('should create a check-ins manager', function () {
        var config = {
            logger: (0, helpers_1.nullLogger)(),
            apiKey: 'hbp_abc',
            personalAuthToken: 'abc',
            checkins: []
        };
        var manager = new check_ins_manager_1.CheckInsManager(config);
        expect(manager).toBeInstanceOf(check_ins_manager_1.CheckInsManager);
    });
    it('should throw if api key is not set', function () {
        var config = {
            logger: (0, helpers_1.nullLogger)(),
            apiKey: '',
            personalAuthToken: '',
            checkins: []
        };
        var manager = new check_ins_manager_1.CheckInsManager(config);
        expect(manager.sync()).rejects.toThrow('apiKey is required');
    });
    it('should throw if personal auth token is not set', function () {
        var config = {
            logger: (0, helpers_1.nullLogger)(),
            apiKey: 'hbp_123',
            personalAuthToken: '',
            checkins: []
        };
        var manager = new check_ins_manager_1.CheckInsManager(config);
        expect(manager.sync()).rejects.toThrow('personalAuthToken is required');
    });
    it('should throw if a check-in configuration is invalid', function () {
        var config = {
            logger: (0, helpers_1.nullLogger)(),
            apiKey: 'hbp_abc',
            personalAuthToken: 'abc',
            checkins: [
                {
                    slug: 'a-check-in',
                    reportPeriod: '1 week',
                    gracePeriod: '5 minutes'
                },
            ]
        };
        var manager = new check_ins_manager_1.CheckInsManager(config);
        expect(manager.sync()).rejects.toThrow('scheduleType is required for each check-in');
    });
    it('should throw if check-in slugs are not unique', function () {
        var config = {
            logger: (0, helpers_1.nullLogger)(),
            apiKey: 'hbp_abc',
            personalAuthToken: 'abc',
            checkins: [
                {
                    slug: 'a-check-in',
                    scheduleType: 'simple',
                    reportPeriod: '1 week',
                    gracePeriod: '5 minutes'
                },
                {
                    slug: 'a-check-in',
                    scheduleType: 'simple',
                    reportPeriod: '2 weeks',
                    gracePeriod: '5 minutes'
                },
            ]
        };
        var manager = new check_ins_manager_1.CheckInsManager(config);
        expect(manager.sync()).rejects.toThrow('check-in slugs must be unique');
    });
    it('should create check-ins from config', function () { return __awaiter(void 0, void 0, void 0, function () {
        var projectId, simpleCheckInId, cronCheckInId, config, getProjectIdRequest, listProjectCheckInsRequest, simpleCheckInPayload, createSimpleCheckInRequest, cronCheckInPayload, createCronCheckInRequest, manager, synchronizedCheckIns;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    projectId = '11111';
                    simpleCheckInId = '22222';
                    cronCheckInId = '33333';
                    config = {
                        logger: (0, helpers_1.nullLogger)(),
                        apiKey: 'hbp_abc',
                        personalAuthToken: 'abc',
                        checkins: [
                            {
                                slug: 'a-check-in',
                                scheduleType: 'simple',
                                reportPeriod: '1 week',
                                gracePeriod: '5 minutes'
                            },
                            {
                                slug: 'a-cron-check-in',
                                scheduleType: 'cron',
                                cronSchedule: '* * * * 5',
                                gracePeriod: '25 minutes'
                            }
                        ]
                    };
                    getProjectIdRequest = (0, nock_1.default)('https://app.honeybadger.io')
                        .get("/v2/project_keys/".concat(config.apiKey))
                        .once()
                        .reply(200, {
                        id: config.apiKey,
                        project: {
                            id: projectId,
                            name: 'Test',
                        }
                    });
                    listProjectCheckInsRequest = (0, nock_1.default)('https://app.honeybadger.io')
                        .get("/v2/projects/".concat(projectId, "/check_ins"))
                        .once()
                        .reply(200, {
                        results: []
                    });
                    simpleCheckInPayload = new check_in_1.CheckIn(config.checkins[0]).asRequestPayload();
                    createSimpleCheckInRequest = (0, nock_1.default)('https://app.honeybadger.io')
                        .post("/v2/projects/".concat(projectId, "/check_ins"), {
                        check_in: simpleCheckInPayload
                    })
                        .once()
                        .reply(201, __assign({ id: simpleCheckInId }, simpleCheckInPayload));
                    cronCheckInPayload = new check_in_1.CheckIn(config.checkins[1]).asRequestPayload();
                    createCronCheckInRequest = (0, nock_1.default)('https://app.honeybadger.io')
                        .post("/v2/projects/".concat(projectId, "/check_ins"), {
                        check_in: cronCheckInPayload
                    })
                        .once()
                        .reply(201, __assign({ id: cronCheckInId }, cronCheckInPayload));
                    manager = new check_ins_manager_1.CheckInsManager(config);
                    return [4 /*yield*/, manager.sync()];
                case 1:
                    synchronizedCheckIns = _a.sent();
                    expect(getProjectIdRequest.isDone()).toBe(true);
                    expect(listProjectCheckInsRequest.isDone()).toBe(true);
                    expect(createSimpleCheckInRequest.isDone()).toBe(true);
                    expect(createCronCheckInRequest.isDone()).toBe(true);
                    expect(synchronizedCheckIns).toHaveLength(2);
                    expect(synchronizedCheckIns[0]).toMatchObject(config.checkins[0]);
                    expect(synchronizedCheckIns[0].id).toEqual(simpleCheckInId);
                    expect(synchronizedCheckIns[1]).toMatchObject(config.checkins[1]);
                    expect(synchronizedCheckIns[1].id).toEqual(cronCheckInId);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should update check-ins from config', function () { return __awaiter(void 0, void 0, void 0, function () {
        var projectId, simpleCheckInId, cronCheckInId, config, getProjectIdRequest, listProjectCheckInsRequest, simpleCheckInPayload, updateSimpleCheckInRequest, cronCheckInPayload, updateCronCheckInRequest, manager, synchronizedCheckIns;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    projectId = '11111';
                    simpleCheckInId = '22222';
                    cronCheckInId = '33333';
                    config = {
                        logger: (0, helpers_1.nullLogger)(),
                        apiKey: 'hbp_abc',
                        personalAuthToken: 'abc',
                        checkins: [
                            {
                                slug: 'a-check-in',
                                scheduleType: 'simple',
                                reportPeriod: '1 week',
                                gracePeriod: '15 minutes' // the value to update
                            },
                            {
                                slug: 'a-cron-check-in',
                                scheduleType: 'cron',
                                cronSchedule: '* * * 1 5',
                                gracePeriod: '25 minutes'
                            }
                        ]
                    };
                    getProjectIdRequest = (0, nock_1.default)('https://app.honeybadger.io')
                        .get("/v2/project_keys/".concat(config.apiKey))
                        .once()
                        .reply(200, {
                        id: config.apiKey,
                        project: {
                            id: projectId,
                            name: 'Test',
                        }
                    });
                    listProjectCheckInsRequest = (0, nock_1.default)('https://app.honeybadger.io')
                        .get("/v2/projects/".concat(projectId, "/check_ins"))
                        .once()
                        .reply(200, {
                        results: [
                            {
                                id: simpleCheckInId,
                                slug: 'a-check-in',
                                schedule_type: 'simple',
                                report_period: '1 week',
                                grace_period: '5 minutes'
                            },
                            {
                                id: cronCheckInId,
                                slug: 'a-cron-check-in',
                                scheduleType: 'cron',
                                cronSchedule: '* * * * 5',
                                gracePeriod: '25 minutes'
                            }
                        ]
                    });
                    simpleCheckInPayload = new check_in_1.CheckIn(config.checkins[0]).asRequestPayload();
                    updateSimpleCheckInRequest = (0, nock_1.default)('https://app.honeybadger.io')
                        .put("/v2/projects/".concat(projectId, "/check_ins/").concat(simpleCheckInId), {
                        check_in: simpleCheckInPayload
                    })
                        .once()
                        .reply(204);
                    cronCheckInPayload = new check_in_1.CheckIn(config.checkins[1]).asRequestPayload();
                    updateCronCheckInRequest = (0, nock_1.default)('https://app.honeybadger.io')
                        .put("/v2/projects/".concat(projectId, "/check_ins/").concat(cronCheckInId), {
                        check_in: cronCheckInPayload
                    })
                        .once()
                        .reply(204);
                    manager = new check_ins_manager_1.CheckInsManager(config);
                    return [4 /*yield*/, manager.sync()];
                case 1:
                    synchronizedCheckIns = _a.sent();
                    expect(getProjectIdRequest.isDone()).toBe(true);
                    expect(listProjectCheckInsRequest.isDone()).toBe(true);
                    expect(updateSimpleCheckInRequest.isDone()).toBe(true);
                    expect(updateCronCheckInRequest.isDone()).toBe(true);
                    expect(synchronizedCheckIns).toHaveLength(2);
                    expect(synchronizedCheckIns[0]).toMatchObject(__assign(__assign({}, config.checkins[0]), { id: simpleCheckInId, gracePeriod: '15 minutes' }));
                    expect(synchronizedCheckIns[1]).toMatchObject(__assign(__assign({}, config.checkins[1]), { id: cronCheckInId, cronSchedule: '* * * 1 5' }));
                    return [2 /*return*/];
            }
        });
    }); });
    it('should not update check-ins from config if no values changed', function () { return __awaiter(void 0, void 0, void 0, function () {
        var projectId, simpleCheckInId, config, getProjectIdRequest, listProjectCheckInsRequest, manager, synchronizedCheckIns;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    projectId = '11111';
                    simpleCheckInId = '22222';
                    config = {
                        logger: (0, helpers_1.nullLogger)(),
                        apiKey: 'hbp_abc',
                        personalAuthToken: 'abc',
                        checkins: [
                            {
                                slug: 'a-check-in',
                                scheduleType: 'simple',
                                reportPeriod: '1 week',
                            },
                        ]
                    };
                    getProjectIdRequest = (0, nock_1.default)('https://app.honeybadger.io')
                        .get("/v2/project_keys/".concat(config.apiKey))
                        .once()
                        .reply(200, {
                        id: config.apiKey,
                        project: {
                            id: projectId,
                            name: 'Test',
                        }
                    });
                    listProjectCheckInsRequest = (0, nock_1.default)('https://app.honeybadger.io')
                        .get("/v2/projects/".concat(projectId, "/check_ins"))
                        .once()
                        .reply(200, {
                        results: [
                            {
                                id: simpleCheckInId,
                                name: 'a random generated value that should not cause an update',
                                slug: 'a-check-in',
                                schedule_type: 'simple',
                                report_period: '1 week',
                            }
                        ]
                    });
                    manager = new check_ins_manager_1.CheckInsManager(config);
                    return [4 /*yield*/, manager.sync()];
                case 1:
                    synchronizedCheckIns = _a.sent();
                    expect(getProjectIdRequest.isDone()).toBe(true);
                    expect(listProjectCheckInsRequest.isDone()).toBe(true);
                    expect(synchronizedCheckIns).toHaveLength(1);
                    expect(synchronizedCheckIns[0]).toMatchObject(__assign(__assign({}, config.checkins[0]), { id: simpleCheckInId }));
                    return [2 /*return*/];
            }
        });
    }); });
    it('should remove checkins that are not in config', function () { return __awaiter(void 0, void 0, void 0, function () {
        var projectId, simpleCheckInId, checkInIdToRemove, config, getProjectIdRequest, listProjectCheckInsRequest, removeCheckInRequest, manager, synchronizedCheckIns;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    projectId = '11111';
                    simpleCheckInId = '22222';
                    checkInIdToRemove = '33333';
                    config = {
                        logger: (0, helpers_1.nullLogger)(),
                        apiKey: 'hbp_abc',
                        personalAuthToken: 'abc',
                        checkins: [
                            {
                                slug: 'a-check-in',
                                scheduleType: 'simple',
                                reportPeriod: '1 week',
                                gracePeriod: '5 minutes'
                            },
                        ]
                    };
                    getProjectIdRequest = (0, nock_1.default)('https://app.honeybadger.io')
                        .get("/v2/project_keys/".concat(config.apiKey))
                        .once()
                        .reply(200, {
                        id: config.apiKey,
                        project: {
                            id: projectId,
                            name: 'Test',
                        }
                    });
                    listProjectCheckInsRequest = (0, nock_1.default)('https://app.honeybadger.io')
                        .get("/v2/projects/".concat(projectId, "/check_ins"))
                        .once()
                        .reply(200, {
                        results: [
                            {
                                id: simpleCheckInId,
                                slug: 'a-check-in',
                                schedule_type: 'simple',
                                report_period: '1 week',
                                grace_period: '5 minutes'
                            },
                            {
                                id: checkInIdToRemove,
                                slug: 'a-cron-check-in',
                                scheduleType: 'cron',
                                cronSchedule: '* * * * 5',
                                gracePeriod: '25 minutes'
                            }
                        ]
                    });
                    removeCheckInRequest = (0, nock_1.default)('https://app.honeybadger.io')
                        .delete("/v2/projects/".concat(projectId, "/check_ins/").concat(checkInIdToRemove))
                        .once()
                        .reply(204);
                    manager = new check_ins_manager_1.CheckInsManager(config);
                    return [4 /*yield*/, manager.sync()];
                case 1:
                    synchronizedCheckIns = _a.sent();
                    expect(getProjectIdRequest.isDone()).toBe(true);
                    expect(listProjectCheckInsRequest.isDone()).toBe(true);
                    expect(removeCheckInRequest.isDone()).toBe(true);
                    expect(synchronizedCheckIns).toHaveLength(2);
                    expect(synchronizedCheckIns[0]).toMatchObject(__assign(__assign({}, config.checkins[0]), { id: simpleCheckInId }));
                    expect(synchronizedCheckIns[0].id).toEqual(simpleCheckInId);
                    expect(synchronizedCheckIns[1]).toMatchObject(__assign(__assign({}, config.checkins[1]), { id: checkInIdToRemove }));
                    expect(synchronizedCheckIns[1].isDeleted()).toEqual(true);
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=manager.test.js.map