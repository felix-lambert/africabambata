angular.module('marketplace').factory('Alias', Alias);

Alias.$inject = ['$location', '$rootScope', '$http', '$q'];

function Alias($location, $rootScope, $http, $q) {

    if ($rootScope.currentUser) {
        $http.defaults.headers.common['auth-token'] = $rootScope.currentUser.token;
    }

    var Alias = {
        get: get,
        save: save,
        retrieve: retrieve,
        search: search
    };

    return Alias;

    function search(ingredient) {
        var deferred = $q.defer();
        $http.post('/api/ingredient', {
            name: ingredient
        })
        .success(deferred.resolve)
        .error(deferred.reject);
        return deferred.promise;
    }

    function get(id) {
        var deferred = $q.defer();
        $http.get('/api/ingredient/get/' + id)
        .success(deferred.resolve)
        .error(deferred.reject);
        return deferred.promise;
    }

    function save(id, add, aliases) {
        var deferred = $q.defer();
        var found = false;
        for (var i = 0; i < aliases.length; i++) {
            if (aliases[i].id == id) {
                found = true;
                break;
            }
        }
        if (found === false) {
            $http.post('/api/ingredient/addAliases', add)
            .success(deferred.resolve)
            .error(deferred.reject);
            return deferred.promise;
        }
    }

    function retrieve(remove) {
        var deferred = $q.defer();
        $http.post('/api/ingredient/removeAliases', remove)
        .success(deferred.resolve)
        .error(deferred.reject);
        return deferred.promise;
    }
}