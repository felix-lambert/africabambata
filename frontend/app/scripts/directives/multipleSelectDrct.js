angular.module('marketplace').directive('retailerMultipleselect', function() {
    return {
        restrict: 'E',
        templateUrl: '/templates/dirMultipleSelect.tpl.html',
        scope: {
            model: '=',
        }
    };
});