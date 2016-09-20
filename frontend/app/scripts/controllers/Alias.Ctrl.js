angular.module('marketplace').controller('AliasAngCtrl', AliasAngCtrl);

AliasAngCtrl.$inject = ['Alias', '$routeParams', '$scope', '$filter', '$q', '$http', '$location', '$timeout', '$localStorage', '$rootScope', 'updateAlias'];

function AliasAngCtrl(Alias, $routeParams, $scope, $filter, $q, $http, $location, $timeout, $localStorage, $rootScope, updateAlias) {

    console.log('AliasAngCtrl');
    var orderBy             = $filter('orderBy');
    $scope.currentPage      = 1;
    $scope.pageSize         = 50;
    $scope.currentFoodPage  = 1;
    $scope.foodPageSize     = 20;
    $scope.aliases          = [];
    $scope.items            = [];
    $scope.orderAlias       = orderAlias;
    $scope.orderItems       = orderItems;
    $scope.ingredient       = [];
    $scope.querySearchName  = querySearchName;
    $scope.searchIngredient = searchIngredient;
    $scope.loading          = true;
    $scope.names            = [];
    $scope.setAlias         = setAlias;
    
    var aliases             = null;
    aliases                 = updateAlias ? updateAlias : null;
    
    if (aliases !== null) {
        if (aliases.error) {
            $scope.errorMessage = aliases.error;
        } else {
            $scope.ingredientId = $routeParams.ingredientId;
            $scope.alias        = aliases.data.aliases[0];
            
            $scope.aliases      = aliases.data.aliases;
            $scope.items        = aliases.data.items;
            angular.forEach($scope.aliases, function(value, key) {
                $scope.names.push(value.name);
            });
            $scope.loading = false;
        }
    }

    function callAtTimeout() {
        $location.path('/admin/ingredientalias/');
    }

    function setAlias(_id, id) {
        $scope.loading     = true;
        $scope.loadingSpin = true;
        var addAlias = {
            _id: _id,
            id: id,
            aliases: [$routeParams.ingredientId]
        };
        Alias.save(id, addAlias, $scope.aliases).then(function(res) {
            swal('Set!', 'The alias is set', 'success');
            $timeout(callAtTimeout, 3000);
        }).catch(function(data, status) {
            console.log('error', data, status);
            $scope.errorMessage = "error: " + data;
        })
        .finally(function () {
            console.log('finally finished');
            $scope.loading     = false;
            $scope.loadingSpin = false;
        });
    }

    function querySearchName(query) {
        var defer = $q.defer();
        $http.post('/api/ingredient', {
            name: query
        })
        .success(function(res) {
            defer.resolve(res.ingredient);
        });
        return defer.promise;
    }

    function setIngredients(res) {
        angular.forEach(res.ingredient, function(value, key) {
            for (var i = 0; i < $scope.aliases.length; i++) {
                if ($scope.aliases[i].id == value._source.id) {
                    value._source.added = true;
                    break;
                } else {
                    value._source.added = false;
                }
            }
        });
        $scope.ingredients = res.ingredient;
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
        $scope.loadingSpin = false;
        $scope.loading     = false;
    }

    function searchIngredient() {
        $scope.loading = true;
        Alias.search($scope.ingredient)
        .then(setIngredients)
        .catch(displayErrorMessage)
        .finally(endLoading);
    }

    function orderAlias(predicate) {
        $scope.predicateMeal = predicate;
        $scope.reverseMeal   = ($scope.predicateMeal === predicate) ? !$scope.reverseMeal : false;
        $scope.aliases       = orderBy($scope.aliases, predicate, $scope.reverseMeal);
    }

    function orderItems(predicate) {
        $scope.predicateMeal = predicate;
        $scope.reverseMeal   = ($scope.predicateMeal === predicate) ? !$scope.reverseMeal : false;
        $scope.items         = orderBy($scope.items, predicate, $scope.reverseMeal);
    }

}

function PaginateController($scope) {
    $scope.pageChangeHandler = function(num) {};
}