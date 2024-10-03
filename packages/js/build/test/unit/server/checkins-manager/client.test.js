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
var client_1 = require("../../../../src/server/check-ins-manager/client");
var check_in_1 = require("../../../../src/server/check-ins-manager/check-in");
var helpers_1 = require("../../helpers");
var nock_1 = __importDefault(require("nock"));
var transport_1 = require("../../../../src/server/transport");
describe('CheckinsClient', function () {
    it('should create a client', function () {
        var client = new client_1.CheckInsClient({
            logger: (0, helpers_1.nullLogger)(),
            apiKey: 'hbp_123',
            personalAuthToken: '123',
        }, new transport_1.ServerTransport());
        expect(client).toBeInstanceOf(client_1.CheckInsClient);
    });
    it('should get project id from an api key', function () { return __awaiter(void 0, void 0, void 0, function () {
        var request, client, projectId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    request = (0, nock_1.default)('https://app.honeybadger.io')
                        .get('/v2/project_keys/hbp_123')
                        .reply(200, {
                        project: {
                            id: '11111',
                            name: 'a project',
                        }
                    });
                    client = new client_1.CheckInsClient({
                        logger: (0, helpers_1.nullLogger)(),
                        apiKey: 'hbp_123',
                        personalAuthToken: '123',
                    }, new transport_1.ServerTransport());
                    return [4 /*yield*/, client.getProjectId('hbp_123')];
                case 1:
                    projectId = _a.sent();
                    expect(request.isDone()).toBe(true);
                    expect(projectId).toEqual('11111');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should list check-ins for a project', function () { return __awaiter(void 0, void 0, void 0, function () {
        var projectId, request, client, checkIns;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    projectId = '11111';
                    request = (0, nock_1.default)('https://app.honeybadger.io')
                        .get("/v2/projects/".concat(projectId, "/check_ins"))
                        .reply(200, {
                        results: [
                            {
                                id: 'uuid',
                                slug: 'a-check-in',
                                schedule_type: 'simple',
                                report_period: '1 week',
                            }
                        ]
                    });
                    client = new client_1.CheckInsClient({
                        logger: (0, helpers_1.nullLogger)(),
                        apiKey: 'hbp_123',
                        personalAuthToken: '123',
                    }, new transport_1.ServerTransport());
                    return [4 /*yield*/, client.listForProject(projectId)];
                case 1:
                    checkIns = _a.sent();
                    expect(request.isDone()).toBe(true);
                    expect(checkIns).toHaveLength(1);
                    expect(checkIns[0].id).toEqual('uuid');
                    expect(checkIns[0].slug).toEqual('a-check-in');
                    expect(checkIns[0].scheduleType).toEqual('simple');
                    expect(checkIns[0].reportPeriod).toEqual('1 week');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should get a check-in', function () { return __awaiter(void 0, void 0, void 0, function () {
        var projectId, checkInId, request, client, checkIn;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    projectId = '11111';
                    checkInId = '22222';
                    request = (0, nock_1.default)('https://app.honeybadger.io')
                        .get("/v2/projects/".concat(projectId, "/check_ins/").concat(checkInId))
                        .once()
                        .reply(200, {
                        id: 'uuid',
                        slug: 'a-check-in',
                        schedule_type: 'simple',
                        report_period: '1 week',
                    });
                    client = new client_1.CheckInsClient({
                        logger: (0, helpers_1.nullLogger)(),
                        apiKey: 'hbp_123',
                        personalAuthToken: '123',
                    }, new transport_1.ServerTransport());
                    return [4 /*yield*/, client.get(projectId, checkInId)];
                case 1:
                    checkIn = _a.sent();
                    expect(request.isDone()).toBe(true);
                    expect(checkIn.id).toEqual('uuid');
                    expect(checkIn.slug).toEqual('a-check-in');
                    expect(checkIn.scheduleType).toEqual('simple');
                    expect(checkIn.reportPeriod).toEqual('1 week');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should create a check-in', function () { return __awaiter(void 0, void 0, void 0, function () {
        var projectId, checkInId, checkInToBeSaved, payload, request, client, checkIn;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    projectId = '11111';
                    checkInId = '22222';
                    checkInToBeSaved = new check_in_1.CheckIn({
                        slug: 'a-check-in',
                        scheduleType: 'simple',
                        reportPeriod: '1 week',
                    });
                    payload = checkInToBeSaved.asRequestPayload();
                    request = (0, nock_1.default)('https://app.honeybadger.io')
                        .post("/v2/projects/".concat(projectId, "/check_ins"), { check_in: payload })
                        .once()
                        .reply(201, __assign({ id: checkInId }, payload));
                    client = new client_1.CheckInsClient({
                        logger: (0, helpers_1.nullLogger)(),
                        apiKey: 'hbp_123',
                        personalAuthToken: '123',
                    }, new transport_1.ServerTransport());
                    return [4 /*yield*/, client.create(projectId, checkInToBeSaved)];
                case 1:
                    checkIn = _a.sent();
                    expect(request.isDone()).toBe(true);
                    expect(checkIn.id).toEqual(checkInId);
                    expect(checkIn.slug).toEqual('a-check-in');
                    expect(checkIn.scheduleType).toEqual('simple');
                    expect(checkIn.reportPeriod).toEqual('1 week');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should update a check-in', function () { return __awaiter(void 0, void 0, void 0, function () {
        var projectId, checkInId, checkInToBeUpdated, payload, request, client, checkIn;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    projectId = '11111';
                    checkInId = '22222';
                    checkInToBeUpdated = new check_in_1.CheckIn({
                        id: checkInId,
                        slug: 'a-check-in',
                        scheduleType: 'simple',
                        reportPeriod: '1 week',
                    });
                    payload = checkInToBeUpdated.asRequestPayload();
                    request = (0, nock_1.default)('https://app.honeybadger.io')
                        .put("/v2/projects/".concat(projectId, "/check_ins/").concat(checkInId), { check_in: payload })
                        .once()
                        .reply(204, __assign({ id: checkInId }, payload));
                    client = new client_1.CheckInsClient({
                        logger: (0, helpers_1.nullLogger)(),
                        apiKey: 'hbp_123',
                        personalAuthToken: '123',
                    }, new transport_1.ServerTransport());
                    return [4 /*yield*/, client.update(projectId, checkInToBeUpdated)];
                case 1:
                    checkIn = _a.sent();
                    expect(request.isDone()).toBe(true);
                    expect(checkIn.id).toEqual(checkInId);
                    expect(checkIn.slug).toEqual('a-check-in');
                    expect(checkIn.scheduleType).toEqual('simple');
                    expect(checkIn.reportPeriod).toEqual('1 week');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should remove a checkin', function () { return __awaiter(void 0, void 0, void 0, function () {
        var projectId, checkInId, checkInToBeRemoved, request, client;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    projectId = '11111';
                    checkInId = '22222';
                    checkInToBeRemoved = new check_in_1.CheckIn({
                        id: checkInId,
                        slug: 'a-check-in',
                        scheduleType: 'simple',
                        reportPeriod: '1 week',
                    });
                    request = (0, nock_1.default)('https://app.honeybadger.io')
                        .delete("/v2/projects/".concat(projectId, "/check_ins/").concat(checkInId))
                        .once()
                        .reply(204);
                    client = new client_1.CheckInsClient({
                        logger: (0, helpers_1.nullLogger)(),
                        apiKey: 'hbp_123',
                        personalAuthToken: '123',
                    }, new transport_1.ServerTransport());
                    return [4 /*yield*/, client.remove(projectId, checkInToBeRemoved)];
                case 1:
                    _a.sent();
                    expect(request.isDone()).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=client.test.js.map