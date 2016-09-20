angular.module('marketplace').directive('meal', function () {
    // return the directive definition object 
    return {
        scope: true,
        controller: function (Food, $scope, $routeParams) {
            $scope.addMain = addMain;
            $scope.add     = add;

            function addMain(parent, id) {
                var addFood = {
                    item_id: id,
                    parent_food_id: $routeParams.foodId,
                    main_item: true
                };
                Food.save(id, addFood, $scope.foods).then(function() {
                    angular.forEach($scope.meals, function(value, key) {
                        if (value.id == id) {
                            value.is_main_item = true;
                            value.added        = true;
                        }
                    });
                    angular.forEach($scope.foods, function(value, key) {
                        if (value.is_main_item === true) {
                            value.is_main_item = false;
                        }
                    });
                    $scope.foods.push({
                        id: id,
                        name: parent.name,
                        retailer: parent.retailer,
                        is_main_item: true
                    });
                }).catch(function(data, status) {
                    $scope.errorMessage = "error: " + data;
                })
                .finally(function () {
                    console.log('finally finished');
                });

            }

            function add(parent, id) {
                var addFood = {
                    item_id: id,
                    parent_food_id: $routeParams.foodId
                };
                Food.save(id, addFood, $scope.foods).then(function(res) {
                    angular.forEach($scope.meals, function(value, key) {
                        if (value.id == id) {
                            value.added = true;
                        }
                    });
                    $scope.foods.push({
                        id: id,
                        name: parent.name,
                        retailer: parent.retailer
                    });
                }).catch(function(data, status) {
                    $scope.errorMessage = "error: " + data;
                })
                .finally(function () {
                    console.log('finally finished');
                });
            }
        },
        templateUrl: '/templates/meal.tpl.html'
    };

});