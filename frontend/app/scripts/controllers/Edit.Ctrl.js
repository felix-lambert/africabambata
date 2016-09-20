angular.module('marketplace').controller('EditAngCtrl', EditAngCtrl).controller('PaginateController', PaginateController);

EditAngCtrl.$inject = ['Food', '$routeParams', '$filter', '$scope', '$timeout', '$q', '$location', '$localStorage', '$rootScope', 'updateFood'];

function EditAngCtrl(Food, $routeParams, $filter, $scope, $timeout, $q, $location, $localStorage, $rootScope, updateFood) {

    var orderBy            = $filter('orderBy');
    $scope.loading         = false;
    $scope.foods           = [];
    $scope.currentPage     = 1;
    $scope.currentFoodPage = 1;
    $scope.pageSize        = 50;
    $scope.foodPageSize    = 20;
    $scope.meals           = [];
    $scope.searchMeal      = searchMeal;
    $scope.orderFood       = orderFood;
    $scope.editMain        = editMain;

    $scope.foodId = $routeParams.foodId;
    var foods     = updateFood;

    if (foods !== null) {
        if (foods.error) {
            $scope.errorMessage = foods.error;
        } else {
            $scope.foods = foods.data;
        }
    }

    retailerList();

    $scope.addMain = addMain;
    $scope.add     = add;

    $scope.selectedToppings = [];
    $scope.printSelectedToppings = function printSelectedToppings() {
        var numberOfToppings = this.selectedToppings.length;
        // If there is more than one topping, we add an 'and'
        // to be gramatically correct. If there are 3+ toppings
        // we also add an oxford comma.
        if (numberOfToppings > 1) {
          var needsOxfordComma = numberOfToppings > 2;
          var lastToppingConjunction = (needsOxfordComma ? ',' : '') + ' and ';
          var lastTopping = lastToppingConjunction +
          this.selectedToppings[this.selectedToppings.length - 1];
          return this.selectedToppings.slice(0, -1).join(', ') + lastTopping;
      }
      return this.selectedToppings.join('');
  };

  function addMainItem(res) {
    angular.forEach($scope.meals, function(value, key) {
        if (value.id == res.parent.id) {
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
        id: res.parent.id,
        name: res.parent.name,
        retailer: res.parent.retailer,
        is_main_item: true
    });
}

function displayErrorMessage(data, status) {
    if (data) {
        if (data == "Issue decoding incoming token." || data == 'Invalid token.') {
            $scope.errorMessage = "error: " + data + " Disconnecting...";
            $localStorage.currentUser = null;
            $rootScope.currentUser    = null;
            $location.path('/#/');
        } else {
            $scope.errorMessage = "error: " + data;
        }
    } else {
        $scope.errorMessage = 'An error occured: please reload the page!';
    }
}

function endLoading() {
    $scope.loading = false;
}

function addMain(parent, id) {
    $scope.loading = true;
    var addFood = {
        item_id: id,
        parent_food_id: $routeParams.foodId,
        main_item: true
    };
    $q.all({
        parent: $q.when(parent),
        data: Food.save(id, addFood, $scope.foods)
    })
    .then(addMainItem)
    .catch(displayErrorMessage)
    .finally(endLoading);
}

function addItem(res) {
    angular.forEach($scope.meals, function(value, key) {
        if (value.id == res.parent.id) {
            value.added = true;
        }
    });
    $scope.foods.push({
        id: res.parent.id,
        name: res.parent.name,
        retailer: res.parent.retailer
    });
}

function add(parent, id) {
    $scope.loading = true;
    var addFood = {
        item_id: id,
        parent_food_id: $routeParams.foodId
    };
    $q.all({
        parent: $q.when(parent),
        data: Food.save(id, addFood, $scope.foods)
    })
    .then(addItem)
    .catch(displayErrorMessage)
    .finally(endLoading);
}

function getName(result) {
    if (result.message) {
        $scope.errorMessage = result.message;
    } else {
        $scope.errorMessage = false;
        $scope.parent = result[0].name;
    }
}

$scope.loading = true;
Food.findName($routeParams.foodId)
.then(getName)
.catch(displayErrorMessage)
.finally(endLoading);

function timeoutUpdateFood() {
    $timeout(function(){
        updateFood();
    }, 300);
}

function editMain(id) {
    $scope.loading = true;
    var edit_main = {
        item_id: id,
        parent_food_id: $routeParams.foodId
    };
    Food.editMain(edit_main)
    .then(timeoutUpdateFood)
    .catch(displayErrorMessage)
    .finally(endLoading);
}

function orderFood(predicate) {
    $scope.predicate = predicate;
    $scope.reverse   = ($scope.predicate === predicate) ? !$scope.reverse : false;
    $scope.foods     = orderBy($scope.foods, predicate, $scope.reverse);
}

function checkWhatIsAdded(result) {
    if (result.message) {
        $scope.errorMessage = result.message;
    } else {
        $scope.errorMessage = false;
        $scope.meals        = result;
        angular.forEach($scope.meals, function(value, key) {
            var found = false;
            for (var i = 0; i < $scope.foods.length; i++) {
                if ($scope.foods[i].id == value.id) {
                    value.added = true;
                    break;
                } else {
                    value.added = false;
                }
            }
        });
    }
}

function searchMeal() {
    $scope.loading = true;
    if ($scope.food && $scope.food.name ||$scope.food.retailers) {
        $scope.error = null;
        Food.find($scope.food)
        .then(checkWhatIsAdded)
        .catch(displayErrorMessage)
        .finally(endLoading);
    } else {
        $scope.error = "You need to choose a retailer and enter an ingredient";
        endLoading();
    }
}





function getRetailers(res) {
    $scope.retailers = res.retailers;
}

function retailerList() {
    Food.listRetailers()
    .then(getRetailers)
    .catch(displayErrorMessage)
    .finally(endLoading);
}

}

function PaginateController($scope) {
    $scope.pageChangeHandler = function(num) {

    };
}