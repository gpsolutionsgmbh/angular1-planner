angular.module('todo', [])
    .config(function($locationProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false,
            rewriteLinks: false
        });
    })
    .controller('MainController', MainController)
    .component('dateTime', dateTimeComponent);