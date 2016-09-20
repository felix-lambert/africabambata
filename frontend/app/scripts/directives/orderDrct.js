angular.module('marketplace').directive('order', function () {
    // return the directive definition object 
    return {
        scope: true,
        controller: function (Food, $scope, $routeParams, $filter) {
             $scope.orderItem       = orderItem;
             $scope.orderFood       = orderFood;
             
            function orderItem(predicate) {
                $scope.predicateMeal = predicate;
                $scope.reverseMeal   = ($scope.predicateMeal === predicate) ? !$scope.reverseMeal : false;
                $scope.meals         = orderBy($scope.meals, predicate, $scope.reverseMeal);
            }

            function orderFood(predicate) {
                $scope.predicate = predicate;
                $scope.reverse   = ($scope.predicate === predicate) ? !$scope.reverse : false;
                $scope.foods     = orderBy($scope.foods, predicate, $scope.reverse);
            }
        },
        templateUrl: '/templates/order.tpl.html'
    };

});
