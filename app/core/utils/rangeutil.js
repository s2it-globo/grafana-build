///<reference path="../../headers/common.d.ts" />
define(["require", "exports", 'moment', 'lodash', 'app/core/utils/datemath'], function (require, exports, moment, _, dateMath) {
    var spans = {
        's': { display: 'second' },
        'm': { display: 'minute' },
        'h': { display: 'hour' },
        'd': { display: 'day' },
        'w': { display: 'week' },
        'M': { display: 'month' },
        'y': { display: 'year' },
    };
    var rangeOptions = [
        { from: 'now/d', to: 'now/d', display: 'Today', section: 2 },
        { from: 'now/d', to: 'now', display: 'The day so far', section: 2 },
        { from: 'now/w', to: 'now/w', display: 'This week', section: 2 },
        { from: 'now/w', to: 'now', display: 'Week to date', section: 2 },
        { from: 'now/M', to: 'now/M', display: 'This month', section: 2 },
        { from: 'now/y', to: 'now/y', display: 'This year', section: 2 },
        { from: 'now-1d/d', to: 'now-1d/d', display: 'Yesterday', section: 1 },
        { from: 'now-2d/d', to: 'now-2d/d', display: 'Day before yesterday', section: 1 },
        { from: 'now-7d/d', to: 'now-7d/d', display: 'This day last week', section: 1 },
        { from: 'now-1w/w', to: 'now-1w/w', display: 'Previous week', section: 1 },
        { from: 'now-1M/M', to: 'now-1M/M', display: 'Previous month', section: 1 },
        { from: 'now-1y/y', to: 'now-1y/y', display: 'Previous year', section: 1 },
        { from: 'now-5m', to: 'now', display: 'Last 5 minutes', section: 3 },
        { from: 'now-15m', to: 'now', display: 'Last 15 minutes', section: 3 },
        { from: 'now-30m', to: 'now', display: 'Last 30 minutes', section: 3 },
        { from: 'now-1h', to: 'now', display: 'Last 1 hour', section: 3 },
        { from: 'now-6h', to: 'now', display: 'Last 6 hours', section: 3 },
        { from: 'now-12h', to: 'now', display: 'Last 12 hours', section: 3 },
        { from: 'now-24h', to: 'now', display: 'Last 24 hours', section: 3 },
        { from: 'now-7d', to: 'now', display: 'Last 7 days', section: 3 },
        { from: 'now-30d', to: 'now', display: 'Last 30 days', section: 0 },
        { from: 'now-60d', to: 'now', display: 'Last 60 days', section: 0 },
        { from: 'now-90d', to: 'now', display: 'Last 90 days', section: 0 },
        { from: 'now-6M', to: 'now', display: 'Last 6 months', section: 0 },
        { from: 'now-1y', to: 'now', display: 'Last 1 year', section: 0 },
        { from: 'now-2y', to: 'now', display: 'Last 2 years', section: 0 },
        { from: 'now-5y', to: 'now', display: 'Last 5 years', section: 0 },
    ];
    var absoluteFormat = 'MMM D, YYYY HH:mm:ss';
    var rangeIndex = {};
    _.each(rangeOptions, function (frame) {
        rangeIndex[frame.from + ' to ' + frame.to] = frame;
    });
    function getRelativeTimesList(timepickerSettings, currentDisplay) {
        var groups = _.groupBy(rangeOptions, function (option) {
            option.active = option.display === currentDisplay;
            return option.section;
        });
        // _.each(timepickerSettings.time_options, (duration: string) => {
        //   let info = describeTextRange(duration);
        //   if (info.section) {
        //     groups[info.section].push(info);
        //   }
        // });
        return groups;
    }
    function formatDate(date) {
        return date.format(absoluteFormat);
    }
    // handles expressions like
    // 5m
    // 5m to now/d
    // now/d to now
    // now/d
    // if no to <expr> then to now is assumed
    function describeTextRange(expr) {
        if (expr.indexOf('now') === -1) {
            expr = 'now-' + expr;
        }
        var opt = rangeIndex[expr + ' to now'];
        if (opt) {
            return opt;
        }
        opt = { from: expr, to: 'now' };
        var parts = /^now-(\d+)(\w)/.exec(expr);
        if (parts) {
            var unit = parts[2];
            var amount = parseInt(parts[1]);
            var span = spans[unit];
            if (span) {
                opt.display = 'Last ' + amount + ' ' + span.display;
                opt.section = span.section;
                if (amount > 1) {
                    opt.display += 's';
                }
            }
        }
        else {
            opt.display = opt.from + ' to ' + opt.to;
            opt.invalid = true;
        }
        return opt;
    }
    function describeTimeRange(range) {
        var option = rangeIndex[range.from.toString() + ' to ' + range.to.toString()];
        if (option) {
            return option.display;
        }
        if (moment.isMoment(range.from) && moment.isMoment(range.to)) {
            return formatDate(range.from) + ' to ' + formatDate(range.to);
        }
        if (moment.isMoment(range.from)) {
            var toMoment = dateMath.parse(range.to, true);
            return formatDate(range.from) + ' to ' + toMoment.fromNow();
        }
        if (moment.isMoment(range.to)) {
            var from = dateMath.parse(range.from, false);
            return from.fromNow() + ' to ' + formatDate(range.to);
        }
        var res = describeTextRange(range.from);
        return res.display;
    }
    return {
        getRelativeTimesList: getRelativeTimesList,
        describeTextRange: describeTextRange,
        describeTimeRange: describeTimeRange,
    };
});
//# sourceMappingURL=rangeutil.js.map