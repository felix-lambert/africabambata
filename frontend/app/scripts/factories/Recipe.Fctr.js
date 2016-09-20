angular.module('marketplace').factory('Recipe', Recipe);

Recipe.$inject = ['$rootScope', '$http', '$q'];

function Recipe($rootScope, $http, $q) {

    if ($rootScope.currentUser) {
        $http.defaults.headers.common['auth-token'] = $rootScope.currentUser.token;
    }

    var Recipe = {
        save: save,
        get: get,
        getAll: getAll,
        parse: parse,
        add: add,
        destroy:destroy,
        edit: edit,
        editInfo: editInfo,
        eraze: eraze,
        testIfIngredientLinked: testIfIngredientLinked,
        deleteAndEdit: deleteAndEdit,
        ingredientSave: ingredientSave
    };

    return Recipe;

    function testIfIngredientLinked(id) {
        var deferred = $q.defer();
        $http.get('/api/recipe/testLinked/' + id)
        .success(deferred.resolve)
        .error(deferred.reject);
        return deferred.promise;
    }


    function eraze(id) {
        var deferred = $q.defer();
        $http.delete('/api/recipe/eraze/' + id)
        .success(deferred.resolve)
        .error(deferred.reject);
        return deferred.promise;
    }

    function destroy(recipe) {
        var deferred = $q.defer();
        $http.post('/api/recipe/destroy/', recipe)
        .success(deferred.resolve)
        .error(deferred.reject);
        return deferred.promise;
    }

    function edit(recipe) {
        var deferred = $q.defer();
        $http.post('/api/recipe/edit', recipe)
        .success(deferred.resolve)
        .error(deferred.reject);
        return deferred.promise;
    }

    function ingredientSave(ingredient) {
        var deferred = $q.defer();
        $http.post('/api/recipe/ingredientsave', ingredient)
        .success(deferred.resolve)
        .error(deferred.reject);
        return deferred.promise;
    }

    function editInfo(recipe) {
        var deferred = $q.defer();
        $http.post('/api/recipe/editinfo', recipe)
        .success(deferred.resolve)
        .error(deferred.reject);
        return deferred.promise;
    }

    function deleteAndEdit(recipe) {
        var deferred = $q.defer();
        $http.post('/api/recipe/deleteandedit', recipe)
        .success(deferred.resolve).error(deferred.reject);
        return deferred.promise;
    }

    function add(recipe) {
        var deferred = $q.defer();
        $http.post('/api/recipe/add', recipe)
        .success(deferred.resolve)
        .error(deferred.reject);
        return deferred.promise;
    }

    function save(recipe) {
        var deferred = $q.defer();
        $http.post('/api/recipe/create', recipe)
        .success(deferred.resolve)
        .error(deferred.reject);
        return deferred.promise;
    }

    function get(id) {
        var deferred = $q.defer();
        $http.get('/api/recipe/get/' + id)
        .success(deferred.resolve)
        .error(deferred.reject);
        return deferred.promise;
    }

    function getAll(id) {
        var deferred = $q.defer();
        $http.get('/api/recipe/getall/' + id)
        .success(deferred.resolve)
        .error(deferred.reject);
        return deferred.promise;
    }

    function parse(id) {
        var deferred = $q.defer();
        $http.get('/api/recipe/parse/' + id)
        .success(deferred.resolve)
        .error(deferred.reject);
        return deferred.promise;
    }
}