angular.module('marketplace').directive('myParents', function () {
    return {
        restrict:"E",
        scope:{
            parentfoods:'=',
            ondelete:'&'
        },
        templateUrl:'/templates/parent-directive.html',
        controller:function ($scope, $attrs) {
            $scope.deleteFood = function (id) {
                $scope.ondelete({id:id});
            }
        }
    };
});