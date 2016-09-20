angular.module('marketplace').controller('RecipeAngCtrl', RecipeAngCtrl);
RecipeAngCtrl.$inject = ['Auth', '$rootScope', 'Recipe', '$scope', '$location', '$localStorage', '$q', '$timeout', 'getAllRecipes'];

function RecipeAngCtrl(Auth, $rootScope, Recipe, $scope, $location, $localStorage, $q, $timeout, getAllRecipes) {
    console.log('RecipeAngCtrl');
    $scope.createRecipe   = createRecipe;
    $scope.eraze          = eraze;
    $scope.testPictureUrl = testPictureUrl;
    $scope.testTotalTime  = testTotalTime;
    $scope.testServings   = testServings;
    $scope.testUrl        = testUrl;
    $scope.recipes        = [];
    $scope.loading        = false;
    var recipes           = null;

    recipes = getAllRecipes ? getAllRecipes : null;

    if (recipes !== null) {
        if (recipes.error) {
            $scope.errorMessage = recipes.error;
        } else {
            $scope.recipes = recipes.data;
        }
    }
    
    function displayErrorMessage(data, status) {
        if (data) {
            if (data == "Issue decoding incoming token." || data == 'Invalid token.') {
                $scope.errorMessage = "error: " + data + " Disconnecting...";
                Auth.logout();
                $localStorage.currentUser = null;
                $rootScope.currentUser    = null;
                $location.path('/#/');
            } else {
                $scope.errorMessage = "error: " + data;
            }
        } else {
            $scope.errorMessage = 'An error occured: please reload the page!';
        }
    }

    function endLoading() {
        $scope.loading = false;
    }

    if ($rootScope.currentUser) {
        $scope.user = $rootScope.currentUser.firstName ? $rootScope.currentUser.firstName : $rootScope.currentUser.email;
    }

    function testUrl(url) {
        var testHttp = url.slice(0, 4);
        if (testHttp != 'http' && testHttp.length == 4) {
            $scope.error = 'Url must start with http or https';
        } else {
            $scope.error = null;
        }
    }

    function testPictureUrl(urlPicture) {
        var Http = urlPicture.slice(0, 4);
        if ('' === urlPicture) {
            $scope.pictureError = null;
        } else if (Http != 'http' && Http.length == 4) {
            $scope.pictureError = 'Url must start with http or https';
        } else {
            // check if is image
            isImage(urlPicture).then(function(success) {
                if (true === success) {
                    $scope.pictureError = null;
                } else {
                    $scope.pictureError = 'Must be an image url';
                }
            });
        }
    }
    /**
     * Total time must be an integer
     */
    function testTotalTime(totalTime) {
        if (0 === totalTime.length || (!isNaN(totalTime) && parseInt(Number(totalTime)) == totalTime && !isNaN(parseInt(totalTime, 10)))) {
            $scope.totalTimeError = null;
        } else {
            $scope.totalTimeError = 'Total time must be an integer';
        }
    }
    /**
     * Servings must be an integer
     */
    function testServings(servings) {
        if (0 === servings.length || (!isNaN(servings) && parseInt(Number(servings)) == servings && !isNaN(parseInt(servings, 10)))) {
            $scope.servingsError = null;
        } else {
            $scope.servingsError = 'Servings must be an integer';
        }
    }

    function isImage(src) {
        var deferred = $q.defer();
        var image = new Image();
        image.onerror = function() {
            deferred.resolve(false);
        };
        image.onload = function() {
            deferred.resolve(true);
        };
        image.src = src;
        return deferred.promise;
    }

    function redirect(res) {
        $location.path('/monitorrecipe/' + res.id + '/');
    }

    function createRecipe() {
        $scope.loading = true;
        Recipe.save($scope.recipe).then(redirect).catch(displayErrorMessage).finally(endLoading);
    }

    function eraze(id) {
        swal({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
            confirmButtonClass: 'btn btn-success',
            cancelButtonClass: 'btn btn-danger',
            buttonsStyling: false
        }).then(function() {
            Recipe.eraze(id).then(function(res) {
                getAllRecipes();
                swal('Recipe deleted', 'All items that are linked to this recipe are deleted', 'warning');
            }).catch(displayErrorMessage).finally(endLoading);
        }, function(dismiss) {
            // dismiss can be 'cancel', 'overlay', 'close', 'timer'
            if (dismiss === 'cancel') {
                swal('Cancelled', 'Your recipe is safe :)', 'error');
            }
        });
    }
}