angular.module('marketplace').controller('AdminAngCtrl', AdminAngCtrl);

AdminAngCtrl.$inject = ['$location', '$scope'];

function AdminAngCtrl($location, $scope) {
    console.log('AdminAngCtrl');

    $scope.recipe     = recipe;
    $scope.parentfood = parentfood;
    $scope.ingredient = ingredient;
    $scope.loading    = false;

    function recipe() {
        $scope.loading = true;
        $location.path('/#/admin/recipe');
    }

    function parentfood() {
        $scope.loading = true;
        $location.path('/#/admin/parentfood');
    }

    function ingredient() {
        $scope.loading = true;
        $location.path('/#/admin/ingredientalias');
    }
}
