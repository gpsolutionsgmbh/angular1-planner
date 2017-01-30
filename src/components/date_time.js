var dateTimeComponent = {
    bindings: {},
    controller: function($timeout) {
        var vm = this;

        /**
         * Sets component attributes of date and time to formatted values from current datetime
         */
        function assignDateTime() {
            var currentDateTime = moment();
            vm.time = currentDateTime.format('HH:mm');
            vm.date = currentDateTime.format('MMMM DD')
        }

        /**
         * Retrieves current date and time, repeats every second after that
         */
        this.$onInit = function() {
            assignDateTime();
            $timeout(assignDateTime, 1000);
        };


    },
    template: '<div>{{ $ctrl.time }}</div><div>{{ $ctrl.date }}</div>'
};