function MainController($location, $scope) {
    var vm = this;

    vm.alarm = true;
    vm.dates = [];
    vm.datesCursor = 0;
    vm.selectedDate = '';
    vm.activeHighlight = false;
    vm.hoursPerDay = {};

    /**
     * Toggles alarm icon state state
     */
    vm.toggleAlarm = function() {
        vm.alarm = !vm.alarm;
    };

    /**
     * Scrolls the current date in specified direction:
     * to the next is isAdd is true, to the previous otherwise
     * @params {boolean} isAdd
     */
    vm.changeDay = function(isAdd) {
        if (isAdd) {
            vm.datesCursor++;
        } else {
            vm.datesCursor--;
        }

        vm.selectedDate = vm.dates[vm.datesCursor];
    }

    /**
     * Selects specified hour as active
     * @params {integer} hour
     */
    vm.highlightActive = function(hour) {
        vm.activeHighlight = hour;
    }

    /**
     * Resets specified hours message and span length to default values.
     * If date isn't specified current date is used.
     * @params {number} hour
     * @params {string} date
     */
    vm.reset = function(hour, date) {
        if (_.isUndefined(date))
            date = vm.selectedDate;

        vm.hoursPerDay[date][hour] = { message: '', span: 0 };
    }

    /**
     * Extends or decreases specified hour's span, based on isAdd value.
     * Span increased if isAdd is true, decreased otherwise.
     * @params {number} hour
     * @params {boolean} isAdd
     */
    vm.modifySpan = function(hour, isAdd) {
        vm.activeHighlight = hour;
        if (isAdd) {
            vm.hoursPerDay[vm.selectedDate][hour].span++;
        } else {
            vm.hoursPerDay[vm.selectedDate][hour].span--;
        }
    };

    /**
     * Returns array of hour values, where specified hour belongs to their spans.
     * @params {number} hour
     * @returns [{number}]
     */
    vm.inSpan = function(hour) {
        return inSpan = _.pickBy(vm.hoursPerDay[vm.selectedDate], function(value, key) {
            return parseInt(hour) > parseInt(key) && hour <= parseInt(key) + parseInt(value.span);
        });
    }

    /**
     * Checks whether specified hour belongs to any span
     * @params {number} hour
     * @returns {boolean}
     */
    vm.isInSpan = function(hour) {
        var span = vm.inSpan(hour);
        return _.keys(span).length > 0 || hour == _.keys(span)[0];
    }

    /**
     * Checks whether specified hour belong to active hour's span
     * @params {number} hour
     * @returns {boolean}
     */
    vm.isInActiveSpan = function(hour) {
        return _.keys(vm.inSpan(hour))[0] == vm.activeHighlight;
    }

    /**
     * Checks whether specified hour's span has place to extend by 1 hour further
     * @params {number} hour
     * @params {number} span
     * @returns {boolean}
     */
    vm.isExpandable = function(hour, span) {
        return parseInt(hour) + span < 22 && vm.hoursPerDay[vm.selectedDate][parseInt(hour) + span + 1].message == '';
    }

    /**
     * Controller's initialization. Checks whether there's TODO data saved in local storage.
     * If not - initializes it up to the end of next week.
     * Performs check whether there's day specified in location hash, if so, switches to
     * corresponding day.
     */
    vm.$onInit = function() {
        var loadedData = localStorage.getItem('todo');

        if (false === _.isNull(loadedData)) {
            vm.hoursPerDay = JSON.parse(loadedData);
            _.each(_.keys(vm.hoursPerDay), function(dateFormatted) {
                vm.dates.push(dateFormatted);
            });
        } else {
            var startDate = moment(),
                endDate = moment().add(1, 'weeks').endOf('isoWeek'),
                range = moment().range(startDate, endDate);

            range.by('days', function(day) {
                var dateFormatted = day.format('MMMM DD');
                vm.dates.push(dateFormatted);
                vm.hoursPerDay[dateFormatted] = {};
                _.each(_.range(8, 23), function(hour) {
                    vm.reset(hour, dateFormatted);
                });
            });
        }

        vm.selectedDate = (location.hash.length > 0) ?
            decodeURIComponent(location.hash.replace('#', '')) :
            vm.dates[0];

        vm.datesCursor = _.findIndex(vm.dates, function(date) {
            return date == vm.selectedDate;
        });

    }

    /**
     * Detects "Enter" key pressed on input, removes focus from both input and hour (hour span)
     * @params {object} $event
     */
    vm.messageKeydown = function($event) {
        if ($event.keyCode === 13) {
            vm.activeHighlight = false;
            $event.srcElement.blur();
        }
    }

    /**
     * Watches for selected date change and updates location hash accordingly
     */
    $scope.$watch(function() {
        return vm.selectedDate;
    }, function(newVal, oldVal) {
        if (newVal !== oldVal) location.hash = newVal;
    });

    /**
     * Watches for todo entries object changes and updates local storage entry.
     * Deep watch required due to shallow watch isn't enough for watched object.
     */
    $scope.$watch(function() {
        return vm.hoursPerDay;
    }, function() {
        localStorage.setItem('todo', JSON.stringify(vm.hoursPerDay));
    }, true);

}