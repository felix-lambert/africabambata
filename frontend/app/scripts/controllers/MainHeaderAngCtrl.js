angular.module('marketplace')
    .controller('MainHeaderAngCtrl', MainHeaderAngCtrl);

MainHeaderAngCtrl.$inject = ['Auth', '$localStorage', '$location', '$scope', '$http', '$rootScope'];

function MainHeaderAngCtrl(Auth, $localStorage, $location, $scope, $http, $rootScope) {

    console.log('************ Main HEADER CTRL **********');
    $scope.logout = logout;
    $scope.admin  = admin;

    function logout() {
        $http.defaults.headers.common['auth-token'] = $rootScope.currentUser.token;
        Auth.logout();
        $localStorage.currentUser = null;
        $rootScope.currentUser    = null;
        $location.path('/#/');
    }

    function admin() {
        $location.path('/#/admin');
    }
}