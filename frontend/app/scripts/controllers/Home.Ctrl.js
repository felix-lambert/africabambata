angular.module('marketplace').controller('HomeAngCtrl', HomeAngCtrl);

HomeAngCtrl.$inject = ['$location', 'Auth', '$scope', '$rootScope'];

function HomeAngCtrl($location, Auth, $scope, $rootScope) {
    console.log('HomeAngCtrl');
    if ($rootScope.currentUser) {
        $location.path('/recipes');
    }
    $scope.loading = false;
    $scope.login   = login;

    function login() {
        $scope.loading = true;
        Auth.login($scope.user);
    }

    $scope.loading = false;
}