angular.module('marketplace').directive('retailerSelect', function() {
    return {
        restrict: 'E',
        templateUrl: '/templates/dirSelect.tpl.html',
        scope: {
            model: '=',
        }
    };
});