angular.module('marketplace').directive('parse', function () {
    // return the directive definition object 
    return {
        scope: true,
        controller: function (Recipe, $scope, $routeParams, $q, $http, $window, $rootScope) {
             // $scope.querySearchName = querySearchName;
             // $scope.querySearchUnit = querySearchUnit;




            // function querySearchName(query) {
            //     var defer = $q.defer();
            //     $http.post('/api/ingredientrecipe', {
            //             name: query
            //         })
            //         .success(function(res) {
            //             defer.resolve(res.ingredient);
            //         });
            //     return defer.promise;
            // }

            // function querySearchUnit(query) {
            //     var defer = $q.defer();
            //     $http.post('/api/unit', {
            //             name: query
            //         })
            //         .success(function(res) {
            //             defer.resolve(res.unit);
            //         });
            //     return defer.promise;
            // }

            // $scope.toggle = function(item, list) {
            //     var idx = list.indexOf(item);
            //     if (idx > -1) {
            //         list.splice(idx, 1);
            //     } else {
            //         list.push(item);
            //     }
            // };
            // $scope.exists = function(item, list) {
            //     return list.indexOf(item) > -1;
            // };
        },
        templateUrl: '/templates/parse.tpl.html'
    };
});