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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckInsClient = void 0;
var check_in_1 = require("./check-in");
var CheckInsClient = /** @class */ (function () {
    function CheckInsClient(config, transport) {
        this.BASE_URL = 'https://app.honeybadger.io';
        this.transport = transport;
        this.config = config;
        this.logger = config.logger;
    }
    CheckInsClient.prototype.getProjectId = function (projectApiKey) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var response, data;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.config.personalAuthToken || this.config.personalAuthToken === '') {
                            throw new Error('personalAuthToken is required');
                        }
                        return [4 /*yield*/, this.transport.send({
                                method: 'GET',
                                headers: this.getHeaders(),
                                endpoint: "".concat(this.BASE_URL, "/v2/project_keys/").concat(projectApiKey),
                                logger: this.logger,
                            })];
                    case 1:
                        response = _b.sent();
                        if (response.statusCode !== 200) {
                            throw new Error("Failed to fetch project[".concat(projectApiKey, "]: ").concat(this.getErrorMessage(response.body)));
                        }
                        data = JSON.parse(response.body);
                        return [2 /*return*/, (_a = data === null || data === void 0 ? void 0 : data.project) === null || _a === void 0 ? void 0 : _a.id];
                }
            });
        });
    };
    CheckInsClient.prototype.listForProject = function (projectId) {
        return __awaiter(this, void 0, void 0, function () {
            var response, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.config.personalAuthToken || this.config.personalAuthToken === '') {
                            throw new Error('personalAuthToken is required');
                        }
                        return [4 /*yield*/, this.transport.send({
                                method: 'GET',
                                headers: this.getHeaders(),
                                endpoint: "".concat(this.BASE_URL, "/v2/projects/").concat(projectId, "/check_ins"),
                                logger: this.logger,
                            })];
                    case 1:
                        response = _a.sent();
                        if (response.statusCode !== 200) {
                            throw new Error("Failed to fetch checkins for project[".concat(projectId, "]: ").concat(this.getErrorMessage(response.body)));
                        }
                        data = JSON.parse(response.body);
                        return [2 /*return*/, data.results.map(function (checkin) { return check_in_1.CheckIn.fromResponsePayload(checkin); })];
                }
            });
        });
    };
    CheckInsClient.prototype.get = function (projectId, checkInId) {
        return __awaiter(this, void 0, void 0, function () {
            var response, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.config.personalAuthToken || this.config.personalAuthToken === '') {
                            throw new Error('personalAuthToken is required');
                        }
                        return [4 /*yield*/, this.transport.send({
                                method: 'GET',
                                headers: this.getHeaders(),
                                endpoint: "".concat(this.BASE_URL, "/v2/projects/").concat(projectId, "/check_ins/").concat(checkInId),
                                logger: this.logger,
                            })];
                    case 1:
                        response = _a.sent();
                        if (response.statusCode !== 200) {
                            throw new Error("Failed to fetch check-in[".concat(checkInId, "] for project[").concat(projectId, "]: ").concat(this.getErrorMessage(response.body)));
                        }
                        data = JSON.parse(response.body);
                        return [2 /*return*/, check_in_1.CheckIn.fromResponsePayload(data)];
                }
            });
        });
    };
    CheckInsClient.prototype.create = function (projectId, checkIn) {
        return __awaiter(this, void 0, void 0, function () {
            var response, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.config.personalAuthToken || this.config.personalAuthToken === '') {
                            throw new Error('personalAuthToken is required');
                        }
                        return [4 /*yield*/, this.transport.send({
                                method: 'POST',
                                headers: this.getHeaders(),
                                endpoint: "".concat(this.BASE_URL, "/v2/projects/").concat(projectId, "/check_ins"),
                                logger: this.logger,
                            }, { check_in: checkIn.asRequestPayload() })];
                    case 1:
                        response = _a.sent();
                        if (response.statusCode !== 201) {
                            throw new Error("Failed to create check-in[".concat(checkIn.slug, "] for project[").concat(projectId, "]: ").concat(this.getErrorMessage(response.body)));
                        }
                        data = JSON.parse(response.body);
                        return [2 /*return*/, check_in_1.CheckIn.fromResponsePayload(data)];
                }
            });
        });
    };
    CheckInsClient.prototype.update = function (projectId, checkIn) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.config.personalAuthToken || this.config.personalAuthToken === '') {
                            throw new Error('personalAuthToken is required');
                        }
                        return [4 /*yield*/, this.transport.send({
                                method: 'PUT',
                                headers: this.getHeaders(),
                                endpoint: "".concat(this.BASE_URL, "/v2/projects/").concat(projectId, "/check_ins/").concat(checkIn.id),
                                logger: this.logger,
                            }, { check_in: checkIn.asRequestPayload() })];
                    case 1:
                        response = _a.sent();
                        if (response.statusCode !== 204) {
                            throw new Error("Failed to update checkin[".concat(checkIn.slug, "] for project[").concat(projectId, "]: ").concat(this.getErrorMessage(response.body)));
                        }
                        return [2 /*return*/, checkIn];
                }
            });
        });
    };
    CheckInsClient.prototype.remove = function (projectId, checkIn) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.config.personalAuthToken || this.config.personalAuthToken === '') {
                            throw new Error('personalAuthToken is required');
                        }
                        return [4 /*yield*/, this.transport.send({
                                method: 'DELETE',
                                headers: this.getHeaders(),
                                endpoint: "".concat(this.BASE_URL, "/v2/projects/").concat(projectId, "/check_ins/").concat(checkIn.id),
                                logger: this.logger,
                            })];
                    case 1:
                        response = _a.sent();
                        if (response.statusCode !== 204) {
                            throw new Error("Failed to remove checkin[".concat(checkIn.slug, "] for project[").concat(projectId, "]: ").concat(this.getErrorMessage(response.body)));
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CheckInsClient.prototype.getHeaders = function () {
        return {
            'Authorization': "Basic ".concat(Buffer.from("".concat(this.config.personalAuthToken, ":")).toString('base64')),
            'Content-Type': 'application/json'
        };
    };
    CheckInsClient.prototype.getErrorMessage = function (responseBody) {
        var _a;
        if (!responseBody) {
            return '';
        }
        try {
            var jsonBody = JSON.parse(responseBody);
            return (_a = jsonBody.errors) !== null && _a !== void 0 ? _a : '';
        }
        catch (e) {
            return responseBody;
        }
    };
    return CheckInsClient;
}());
exports.CheckInsClient = CheckInsClient;
//# sourceMappingURL=client.js.map