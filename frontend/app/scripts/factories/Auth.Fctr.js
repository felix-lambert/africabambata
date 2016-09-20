angular.module('marketplace').factory('Auth', Auth);

Auth.$inject = ['$location', '$localStorage', '$rootScope', '$http', '$q'];

function Auth($location, $localStorage, $rootScope, $http, $q) {

    var Auth = {
        login: login,
        logout: logout,
        status: status
    };

    return Auth;

    function login(user) {
        return $http({
            url: "/api/user/login/",
            method: "post",
            xhrFields: {
                withCredentials: true
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': '*/*',
                'Content-Transfer-Encoding': 'utf-8'
            },
            transformRequest: function(obj) {
                var str = [];
                for (var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                var foo = str.join("&");
                return foo;
            },
            data: user
        }).success(function(user) {
            $localStorage.currentUser = user;
            swal('Authentification réussie', '', 'success');
            $location.path('/#/recipes');
        }).error(function(response) {
            console.log(response);
            swal('Fail to log in', 'Try again', 'warning');       
            $location.path('/#/');
        });
    }

    function status() {
        var deferred = $q.defer();
        $http.post('/api/user/status')
        .success(deferred.resolve)
        .error(deferred.reject);
        return deferred.promise;
    }

    function logout() {
        console.log('logout');
        $http.delete('/api/user/logout/').success(function(data) {
            if (data) {
                if ($localStorage.currentUser && $rootScope.currentUser) {
                    $localStorage.currentUser = null;
                    $rootScope.currentUser    = null;
                    $location.path('/');
                }
            }
        }).error(function() {
            console.log('error');
        });
    }
}