angular.module('marketplace').controller('IngredientAngCtrl', IngredientAngCtrl);

IngredientAngCtrl.$inject = ['Alias', '$scope'];

function IngredientAngCtrl(Alias, $scope) {
    console.log('IngredientAngCtrl');
    
    $scope.currentPage      = 1;
    $scope.pageSize         = 50;
    $scope.searchIngredient = searchIngredient;

    function getAliases(res) {
        $scope.errorMessage = '';
        $scope.ingredients = res.ingredient;
        $scope.loading     = false;
    }

    function displayErrorMessage(data, status) {
        if (data.message) {
            $scope.errorMessage = "error: " + "Please enter a shorter string in your searchbox!";
        }
    }

    function endLoading() {
        $scope.loading = false;
    }

    function searchIngredient() {
        $scope.loading = true;
        Alias.search($scope.ingredient)
        .then(getAliases)
        .catch(displayErrorMessage)
        .finally(endLoading);
    }
}