angular.module('marketplace')
    .controller('ParentAngCtrl', ParentAngCtrl)
    .controller('PaginateController', PaginateController);

ParentAngCtrl.$inject = ['$scope', 'getParentFoods'];

function ParentAngCtrl($scope, getParentFoods) {
    
    $scope.currentPage = 1;
    $scope.pageSize    = 50;
    $scope.loading     = true;
    var foods          = getParentFoods;

    if (foods !== null) {
        if (foods.error) {
            $scope.errorMessage = foods.error;
        } else {
            $scope.foods = foods.data.parent_foods;
        }
    }
    $scope.loading = false;
}


function PaginateController($scope) {
    $scope.pageChangeHandler = function(num) {

    };
}