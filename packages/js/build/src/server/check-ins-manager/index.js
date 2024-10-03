"use strict";
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckInsManager = void 0;
var core_1 = require("@honeybadger-io/core");
var client_1 = require("./client");
var transport_1 = require("../transport");
var check_in_1 = require("./check-in");
var CheckInsManager = /** @class */ (function () {
    function CheckInsManager(config, client) {
        var _a, _b, _c, _d, _e;
        this.config = {
            debug: (_a = config.debug) !== null && _a !== void 0 ? _a : false,
            apiKey: (_b = config.apiKey) !== null && _b !== void 0 ? _b : undefined,
            personalAuthToken: (_c = config.personalAuthToken) !== null && _c !== void 0 ? _c : undefined,
            checkins: (_d = config.checkins) !== null && _d !== void 0 ? _d : [],
            logger: (_e = config.logger) !== null && _e !== void 0 ? _e : console,
        };
        var transport = new transport_1.ServerTransport();
        this.logger = core_1.Util.logger(this);
        this.client = client !== null && client !== void 0 ? client : new client_1.CheckInsClient({
            apiKey: config.apiKey,
            personalAuthToken: config.personalAuthToken,
            logger: this.logger
        }, transport);
    }
    CheckInsManager.prototype.sync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var localCheckIns, projectId, remoteCheckIns, createdOrUpdated, removed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // check if api key is set
                        if (!this.config.apiKey || this.config.apiKey === '') {
                            throw new Error('apiKey is required');
                        }
                        // check if personal auth token is set
                        if (!this.config.personalAuthToken || this.config.personalAuthToken === '') {
                            throw new Error('personalAuthToken is required');
                        }
                        localCheckIns = this.getLocalCheckIns();
                        return [4 /*yield*/, this.client.getProjectId(this.config.apiKey)];
                    case 1:
                        projectId = _a.sent();
                        return [4 /*yield*/, this.client.listForProject(projectId)];
                    case 2:
                        remoteCheckIns = _a.sent();
                        return [4 /*yield*/, this.createOrUpdate(projectId, localCheckIns, remoteCheckIns)];
                    case 3:
                        createdOrUpdated = _a.sent();
                        return [4 /*yield*/, this.remove(projectId, localCheckIns, remoteCheckIns)];
                    case 4:
                        removed = _a.sent();
                        return [2 /*return*/, __spreadArray(__spreadArray([], createdOrUpdated, true), removed, true)];
                }
            });
        });
    };
    CheckInsManager.prototype.getLocalCheckIns = function () {
        // create check-ins from configuration and validate them
        var localCheckIns = this.config.checkins.map(function (dto) {
            var checkIn = new check_in_1.CheckIn(dto);
            checkIn.validate();
            return checkIn;
        });
        // validate that we have unique check-in slugs
        var checkInSlugs = localCheckIns.map(function (checkIn) { return checkIn.slug; });
        var uniqueCheckInSlugs = new Set(checkInSlugs);
        if (checkInSlugs.length !== uniqueCheckInSlugs.size) {
            throw new Error('check-in slugs must be unique');
        }
        return localCheckIns;
    };
    CheckInsManager.prototype.createOrUpdate = function (projectId, localCheckIns, remoteCheckIns) {
        return __awaiter(this, void 0, void 0, function () {
            var results, _loop_1, this_1, _i, localCheckIns_1, localCheckIn;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        results = [];
                        _loop_1 = function (localCheckIn) {
                            var remoteCheckIn, _b, _c, _d, _e;
                            return __generator(this, function (_f) {
                                switch (_f.label) {
                                    case 0:
                                        remoteCheckIn = remoteCheckIns.find(function (checkIn) {
                                            return checkIn.slug === localCheckIn.slug;
                                        });
                                        if (!!remoteCheckIn) return [3 /*break*/, 2];
                                        _c = (_b = results).push;
                                        return [4 /*yield*/, this_1.client.create(projectId, localCheckIn)];
                                    case 1:
                                        _c.apply(_b, [_f.sent()]);
                                        return [3 /*break*/, 5];
                                    case 2:
                                        if (!!localCheckIn.isInSync(remoteCheckIn)) return [3 /*break*/, 4];
                                        localCheckIn.id = remoteCheckIn.id;
                                        _e = (_d = results).push;
                                        return [4 /*yield*/, this_1.client.update(projectId, localCheckIn)];
                                    case 3:
                                        _e.apply(_d, [_f.sent()]);
                                        return [3 /*break*/, 5];
                                    case 4:
                                        // no change - still need to add to results
                                        results.push(remoteCheckIn);
                                        _f.label = 5;
                                    case 5: return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _i = 0, localCheckIns_1 = localCheckIns;
                        _a.label = 1;
                    case 1:
                        if (!(_i < localCheckIns_1.length)) return [3 /*break*/, 4];
                        localCheckIn = localCheckIns_1[_i];
                        return [5 /*yield**/, _loop_1(localCheckIn)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, results];
                }
            });
        });
    };
    CheckInsManager.prototype.remove = function (projectId, localCheckIns, remoteCheckIns) {
        return __awaiter(this, void 0, void 0, function () {
            var checkInsToRemove;
            var _this = this;
            return __generator(this, function (_a) {
                checkInsToRemove = remoteCheckIns.filter(function (remoteCheckIn) {
                    return !localCheckIns.find(function (localCheckIn) {
                        return localCheckIn.slug === remoteCheckIn.slug;
                    });
                });
                return [2 /*return*/, Promise.all(checkInsToRemove.map(function (checkIn) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.client.remove(projectId, checkIn)];
                                case 1:
                                    _a.sent();
                                    checkIn.markAsDeleted();
                                    return [2 /*return*/, checkIn];
                            }
                        });
                    }); }))];
            });
        });
    };
    return CheckInsManager;
}());
exports.CheckInsManager = CheckInsManager;
//# sourceMappingURL=index.js.map