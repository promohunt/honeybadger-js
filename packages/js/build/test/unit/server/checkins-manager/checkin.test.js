"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var check_in_1 = require("../../../../src/server/check-ins-manager/check-in");
describe('CheckIn', function () {
    it('should be able to create a check-in', function () {
        var checkIn = new check_in_1.CheckIn({ slug: 'a-check-in', scheduleType: 'simple' });
        expect(checkIn).toBeInstanceOf(check_in_1.CheckIn);
    });
    it('should be able to mark a checkin as deleted', function () {
        var checkIn = new check_in_1.CheckIn({ slug: 'a-check-in', scheduleType: 'simple' });
        checkIn.markAsDeleted();
        expect(checkIn.isDeleted()).toBeTruthy();
    });
    describe('validate', function () {
        it('should throw an error if the check-in is missing a slug', function () {
            // @ts-expect-error
            var checkIn = new check_in_1.CheckIn({});
            expect(function () { return checkIn.validate(); }).toThrowError('slug is required for each check-in');
        });
        it('should throw an error if the check-in is missing a scheduleType', function () {
            // @ts-expect-error
            var checkIn = new check_in_1.CheckIn({ slug: 'a-check-in' });
            expect(function () { return checkIn.validate(); }).toThrowError('scheduleType is required for each check-in');
        });
        it('should throw an error if the check-in has an invalid scheduleType', function () {
            var checkIn = new check_in_1.CheckIn({
                slug: 'a-check-in',
                scheduleType: 'invalid'
            });
            expect(function () { return checkIn.validate(); }).toThrowError('a-check-in [scheduleType] must be "simple" or "cron"');
        });
        it('should throw an error if the check-in is missing a reportPeriod', function () {
            var checkIn = new check_in_1.CheckIn({
                slug: 'a-check-in',
                scheduleType: 'simple'
            });
            expect(function () { return checkIn.validate(); }).toThrowError('a-check-in [reportPeriod] is required for simple check-ins');
        });
        it('should throw an error if the check-in is missing a cronSchedule', function () {
            var checkIn = new check_in_1.CheckIn({
                slug: 'a-check-in',
                scheduleType: 'cron'
            });
            expect(function () { return checkIn.validate(); }).toThrowError('a-check-in [cronSchedule] is required for cron check-ins');
        });
    });
});
//# sourceMappingURL=checkin.test.js.map