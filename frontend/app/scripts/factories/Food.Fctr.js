angular.module('marketplace').factory('Food', Food);

Food.$inject = ['$rootScope', '$http', '$q'];

function Food($rootScope, $http, $q) {

    if ($rootScope.currentUser) {
        $http.defaults.headers.common['auth-token'] = $rootScope.currentUser.token;
    }

    var Food = {
        find: find,
        save: save,
        retrieve: retrieve,
        update: update,
        listRetailers: listRetailers,
        seeIfRetailerIsLinked: seeIfRetailerIsLinked,
        seeIfAllRetailersAreLinked: seeIfAllRetailersAreLinked,
        findName: findName,
        editMain: editMain
    };

    return Food;

    function seeIfRetailerIsLinked(recipeId, retailerId) {
        var deferred = $q.defer();
        var data = {
            recipeId: recipeId,
            retailerId: retailerId
        };
        $http.post('/api/retailer/linked/', data)
        .success(deferred.resolve)
        .error(deferred.reject);
        return deferred.promise;
    }

    function seeIfAllRetailersAreLinked(recipeId) {
        console.log('seeIfRetailerIsLinked');
        var deferred = $q.defer();
        var data = {
            recipeId: recipeId,
        };
        $http.post('/api/retailer/allLinked/', data)
        .success(deferred.resolve)
        .error(deferred.reject);
        return deferred.promise;
    }


    function retrieve(remove) {
        var deferred = $q.defer();
        $http.post('/api/parentfood/removeItem', remove)
        .success(deferred.resolve)
        .error(deferred.reject);
        return deferred.promise;
    }


    function editMain(body) {
        var deferred = $q.defer();
        $http.post('/api/parentfood/editMain', body)
        .success(deferred.resolve)
        .error(deferred.reject);
        return deferred.promise;
    }

    function save(id, add, foods) {
        var found = false;
        for (var i = 0; i < foods.length; i++) {
            if (foods[i].id == id) {
                found = true;
                break;
            }
        }
        if (found === false) {
            var deferred = $q.defer();
            $http.post('/api/parentfood/addItem', add)
            .success(deferred.resolve)
            .error(deferred.reject);
            return deferred.promise;
        }
    }

    function find(food) {
        var deferred = $q.defer();
        $http.post('/api/searchfood/', food)
        .success(deferred.resolve)
        .error(deferred.reject);
        return deferred.promise;
    }

    function findName(id) {
        var deferred = $q.defer();
        $http.get('/api/findname/' + id)
        .success(deferred.resolve)
        .error(deferred.reject);
        return deferred.promise;
    }

    function update(id) {
        var deferred = $q.defer();
        $http.get('/api/parentfood/' + id)
        .success(deferred.resolve)
        .error(deferred.reject);
        return deferred.promise;
    }

    function listRetailers() {
        var deferred = $q.defer();
        $http.get('/api/retailer/list')
        .success(deferred.resolve)
        .error(deferred.reject);
        return deferred.promise;
    }
}