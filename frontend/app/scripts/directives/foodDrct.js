angular.module('marketplace').directive('food', function () {
    // return the directive definition object 
    return {
        scope: true,
        controller: function (Food, $scope, $routeParams) {
            $scope.retrieve = retrieve;

            function retrieve(parent, id) {
                var remove = {
                    item_id: id,
                    parent_food_id: $routeParams.foodId
                };
                Food.retrieve(remove)
                    .then(function() {
                        $scope.foods.splice($scope.foods.indexOf(parent), 1);
                        angular.forEach($scope.meals, function(value, key) {
                            if (value.id == id) {
                                value.added        = false;
                                value.is_main_item = false;
                            }
                        });
                    })
                    .catch(function(data, status) {
                        console.log('error', data, status);
                        $scope.errorMessage = "error: " + data;
                    })
                    .finally(function () {
                        console.log('finally finished');
                    });
            }
        },
        templateUrl: '/templates/food.tpl.html'
    };

});