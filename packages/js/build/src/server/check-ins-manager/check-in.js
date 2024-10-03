"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckIn = void 0;
var CheckIn = /** @class */ (function () {
    function CheckIn(props) {
        this.id = props.id;
        this.name = props.name;
        this.slug = props.slug;
        this.scheduleType = props.scheduleType;
        this.reportPeriod = props.reportPeriod;
        this.gracePeriod = props.gracePeriod;
        this.cronSchedule = props.cronSchedule;
        this.cronTimezone = props.cronTimezone;
        this.deleted = false;
    }
    CheckIn.prototype.isDeleted = function () {
        return this.deleted;
    };
    CheckIn.prototype.markAsDeleted = function () {
        this.deleted = true;
    };
    CheckIn.prototype.validate = function () {
        if (!this.slug) {
            throw new Error('slug is required for each check-in');
        }
        if (!this.scheduleType) {
            throw new Error('scheduleType is required for each check-in');
        }
        if (!['simple', 'cron'].includes(this.scheduleType)) {
            throw new Error("".concat(this.slug, " [scheduleType] must be \"simple\" or \"cron\""));
        }
        if (this.scheduleType === 'simple' && !this.reportPeriod) {
            throw new Error("".concat(this.slug, " [reportPeriod] is required for simple check-ins"));
        }
        if (this.scheduleType === 'cron' && !this.cronSchedule) {
            throw new Error("".concat(this.slug, " [cronSchedule] is required for cron check-ins"));
        }
    };
    CheckIn.prototype.asRequestPayload = function () {
        var _a, _b;
        var payload = {
            name: this.name,
            schedule_type: this.scheduleType,
            slug: this.slug,
            grace_period: (_a = this.gracePeriod) !== null && _a !== void 0 ? _a : '' // default is empty string
        };
        if (this.scheduleType === 'simple') {
            payload.report_period = this.reportPeriod;
        }
        else {
            payload.cron_schedule = this.cronSchedule;
            payload.cron_timezone = (_b = this.cronTimezone) !== null && _b !== void 0 ? _b : ''; // default is empty string
        }
        return payload;
    };
    /**
     * Compares two check-ins, usually the one from the API and the one from the config file.
     * If the one in the config file does not match the check-in from the API,
     * then we issue an update request.
     *
     * `name`, `gracePeriod` and `cronTimezone` are optional fields that are automatically
     * set to a value from the server if one is not provided,
     * so we ignore their values if they are not set locally.
     */
    CheckIn.prototype.isInSync = function (other) {
        var ignoreNameCheck = this.name === undefined;
        var ignoreGracePeriodCheck = this.gracePeriod === undefined;
        var ignoreCronTimezoneCheck = this.cronTimezone === undefined;
        return this.slug === other.slug
            && this.scheduleType === other.scheduleType
            && this.reportPeriod === other.reportPeriod
            && this.cronSchedule === other.cronSchedule
            && (ignoreNameCheck || this.name === other.name)
            && (ignoreGracePeriodCheck || this.gracePeriod === other.gracePeriod)
            && (ignoreCronTimezoneCheck || this.cronTimezone === other.cronTimezone);
    };
    CheckIn.fromResponsePayload = function (payload) {
        return new CheckIn({
            id: payload.id,
            name: payload.name,
            slug: payload.slug,
            scheduleType: payload.schedule_type,
            reportPeriod: payload.report_period,
            gracePeriod: payload.grace_period,
            cronSchedule: payload.cron_schedule,
            cronTimezone: payload.cron_timezone,
        });
    };
    return CheckIn;
}());
exports.CheckIn = CheckIn;
//# sourceMappingURL=check-in.js.map