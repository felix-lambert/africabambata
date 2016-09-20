angular.module('marketplace').directive('ingredient', function () {
    // return the directive definition object 
    return {
        scope: true,
        controller: function (Alias, $scope, $routeParams) {
            $scope.add = add;

            function add(parent, id, _id) {
                console.log('loading');
                $scope.loading     = true;
                $scope.loadingSpin = true;
                var addAlias = {
                    _id: _id,
                    id: $routeParams.ingredientId,
                    aliases: [id]
                };
                Alias.save(id, addAlias, $scope.aliases).then(function(res) {
                    angular.forEach($scope.ingredients, function(value, key) {
                        if (value._source.id == id) {
                            value._source.added = true;
                        }
                    });
                    $scope.aliases.push({
                        id: id,
                        name: parent.name
                    });
                }).catch(function(data, status) {
                    console.log('error', data, status);
                    $scope.errorMessage = "error: " + data;
                })
                .finally(function () {
                    $scope.loading     = false;
                    $scope.loadingSpin = false;
                    console.log('finally finished');
                });
            }
        },
        templateUrl: '/templates/ingredient.tpl.html'
    };

});