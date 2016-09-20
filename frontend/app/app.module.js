angular.module('marketplace', [
    'ngRoute',
    'nya.bootstrap.select',
    'angularUtils.directives.dirPagination',
    'ngStorage',
    'ngMaterial',
    'ngMessages',
    'angucomplete-alt',
    'ngAnimate',
    'ui.bootstrap'
]).config(appConfig).run(appRun);

var routeObject = {
    '/': {
        templateUrl: 'partials/home.html',
        controller: 'HomeAngCtrl',
        requireLogin: false,
        requireAdmin: false
    },
    '/admin/parentfood': {
        templateUrl: 'partials/parent.html',
        controller: 'ParentAngCtrl',
        requireAdmin: true,
        requireLogin: true,
        requireBlogger: false,
        resolve: {
            getParentFoods: function ($http, $localStorage, $rootScope, $location) {
                return $http.get('/api/foods/')
                .success(function(res) {
                    return res.parent_foods;
                })
                .error(function(error) {
                    if (error) {
                        if (error == "Issue decoding incoming token." || error == 'Invalid token.') {
                            $localStorage.currentUser = null;
                            $rootScope.currentUser    = null;
                            $location.path('/#/');
                            return null;
                        } else {
                            return {error: "error: " + error};
                        }
                    } else {
                        return {error: 'An error occured: please reload the page!'};
                    }
                });
            }
        }
    },
    '/admin/parentfood/:foodId': {
        templateUrl: 'partials/editParent.html',
        controller: 'EditAngCtrl',
        requireAdmin: true,
        requireLogin: true,
        requireBlogger: false,
        resolve: {
            updateFood: function ($localStorage, $rootScope, $location, $route, Food) {

                function displayErrorMessage(data, status) {
                    if (data) {
                        if (data == "Issue decoding incoming token." || data == 'Invalid token.') {
                            $localStorage.currentUser = null;
                            $rootScope.currentUser    = null;
                            $location.path('/#/');
                            return null;
                        } else {
                            return {error: "error: " + data};
                        }
                    } else {
                        return {error: 'An error occured: please reload the page!'};
                    }
                }


                function displayFoods(res) {
                    return {data: res.items};
                }
                return Food.update($route.current.params.foodId)
                .then(displayFoods)
                .catch(displayErrorMessage);
            }
        }
    },
    '/admin': {
        templateUrl: 'partials/admin.html',
        controller: 'AdminAngCtrl',
        requireLogin: true,
        requireAdmin: true,
        requireBlogger: false,
        resolve: {
            checkTokenTime: function(Auth, $localStorage, $rootScope, $location) {
                console.log("checktokentime");
                function displayErrorMessage(data) {
                    if (data) {
                        if (data == "Issue decoding incoming token." || data == 'Invalid token.') {
                            $localStorage.currentUser = null;
                            $rootScope.currentUser    = null;
                            $location.path('/#/');
                        } else {
                            return {error:data};
                        }
                    } else {
                        return {error: 'An error occured: please reload the page!'};
                    }
                }

                return Auth.status()
                .catch(displayErrorMessage);
            }
        }
    },
    '/main': {
        templateUrl: 'partials/main.html',
        controller: 'MainAngCtrl',
        requireAdmin: true,
        requireLogin: true,
        requireBlogger: true,
        resolve: {
            checkTokenTime: function(Auth, $localStorage, $rootScope, $location) {
                function displayErrorMessage(data) {
                    console.log('displayErrorMessage');
                    if (data) {
                        if (data == "Issue decoding incoming token." || data == 'Invalid token.') {
                            $localStorage.currentUser = null;
                            $rootScope.currentUser    = null;
                            $location.path('/#/');
                        } else {
                            return {error:data};
                        }
                    } else {
                        return {error: 'An error occured: please reload the page!'};
                    }
                }

                return Auth.status().catch(displayErrorMessage);
            }
        }
    },
    '/admin/ingredientalias': {
        templateUrl: 'partials/ingredient.html',
        controller: 'IngredientAngCtrl',
        requireAdmin: true,
        requireLogin: true,
        requireBlogger: false,
        resolve: {
            checkTokenTime: function(Auth, $localStorage, $rootScope, $location) {
                function displayErrorMessage(data) {
                    console.log('displayErrorMessage');
                    if (data) {
                        if (data == "Issue decoding incoming token." || data == 'Invalid token.') {
                            $localStorage.currentUser = null;
                            $rootScope.currentUser    = null;
                            $location.path('/#/');
                        } else {
                            return {error:data};
                        }
                    } else {
                        return {error: 'An error occured: please reload the page!'};
                    }
                }

                return Auth.status().catch(displayErrorMessage);
            }
        }
    },
    '/admin/editingredientalias/:ingredientId': {
        templateUrl: 'partials/editIngredient.html',
        controller: 'AliasAngCtrl',
        requireAdmin: true,
        requireLogin: true,
        requireBlogger: false,
        resolve: {
            updateAlias: function(Alias, $localStorage, $rootScope, $location, $route) {
                console.log("update");
                function setAliases(res) {
                    console.log("setAliases");
                    console.log(res);
                    return {data: res};
                }

                function displayErrorMessage(data) {
                    console.log('displayErrorMessage');
                    if (data) {
                        if (data == "Issue decoding incoming token." || data == 'Invalid token.') {
                            $localStorage.currentUser = null;
                            $rootScope.currentUser    = null;
                            $location.path('/#/');
                        } else {
                            return {error:data};
                        }
                    } else {
                        return {error: 'An error occured: please reload the page!'};
                    }
                }
                return Alias.get($route.current.params.ingredientId)
                .then(setAliases)
                .catch(displayErrorMessage);
            }
        }
    },
    '/recipes': {
        templateUrl: 'partials/recipe.html',
        controller: 'RecipeAngCtrl',
        requireAdmin: true,
        requireLogin: true,
        requireBlogger: true,
        resolve: {
            getAllRecipes: function (Recipe, $localStorage, $rootScope, $location) {
                function setRecipes(res) {
                    if (angular.equals(res, [])) {
                        return {error: "No recipe found for this user. Please create one."};
                    }
                    else {
                        return {data: res};
                    }
                }

                function displayErrorMessage(data, status) {
                    if (data) {
                        if (data == "Issue decoding incoming token." || data == 'Invalid token.') {
                            $localStorage.currentUser = null;
                            $rootScope.currentUser    = null;
                            $location.path('/#/');
                        } else {
                            return {error:data};
                        }
                    } else {
                        return {error: 'An error occured: please reload the page!'};
                    }
                }
                return Recipe.getAll($rootScope.currentUser._id).then(setRecipes).catch(displayErrorMessage);
            }
        }
    },
    '/monitorrecipe/:recipeId': {
        templateUrl: 'partials/monitorRecipe.html',
        controller: 'MonitorAngCtrl',
        requireAdmin: true,
        requireLogin: true,
        requireBlogger: true,
        resolve: {
            parseRecipe: function (Recipe, $localStorage, $rootScope, $location, $route) {

                function displayErrorMessage(data, status) {
                    if (data) {
                        if (data == "Issue decoding incoming token." || data == 'Invalid token.') {
                            $localStorage.currentUser = null;
                            $rootScope.currentUser    = null;
                            $location.path('/#/');
                        } else {
                            return {error:data};
                        }
                    } else {
                        return {error: 'An error occured: please reload the page!'};
                    }
                }

                function setIngredients(res) {
                    angular.forEach(res, function(value, key) {
                        if (!value.unit) {
                            value.unit = 'No unit';
                        }
                        if (!value.name) {
                            value.name = 'No name';
                        }
                        if (value.is_reviewed == 1) {
                            value.is_reviewed = 'yes';
                        }
                        if (value.is_reviewed === 0) {
                            value.is_reviewed = 'no';
                        }
                        value.text = true;
                    });
                    return {data: res.reverse()};
                    
                }

                return Recipe.parse($route.current.params.recipeId)
                .then(setIngredients)
                .catch(displayErrorMessage);

            }
        }
    },
    '/linkrecipe/:recipeId': {
        templateUrl: 'partials/linkRecipe.html',
        controller: 'LinkRecipeAngCtrl',
        requireAdmin: true,
        requireLogin: true,
        requireBlogger: true,
        resolve: {
            getRecipeForLink: function (Food, $localStorage, $rootScope, $location, $route) {

                function displayErrorMessage(data, status) {
                    if (data) {
                        if (data == "Issue decoding incoming token." || data == 'Invalid token.') {
                            $localStorage.currentUser = null;
                            $rootScope.currentUser    = null;
                            $location.path('/#/');
                        } else {
                            return {error:data};
                        }
                    } else {
                        return {error: 'An error occured: please reload the page!'};
                    }
                }

                function ingredientsList(res) {
                    return {data: res};
                }

                return Food.seeIfAllRetailersAreLinked($route.current.params.recipeId)
                .then(ingredientsList)
                .catch(displayErrorMessage);
            }
        }
    },
    '/basket/:recipeId': {
        templateUrl: 'partials/basket.html',
        controller: 'BasketAngCtrl',
        requireAdmin: true,
        requireLogin: true,
        requireBlogger: true,
        resolve: {

        }
    }
};

appConfig.$inject = ['$httpProvider', '$routeProvider', '$locationProvider'];

function appConfig($httpProvider, $routeProvider, $locationProvider) {
    for (var path in routeObject) {
        $routeProvider.when(path, routeObject[path]);
    }
    $routeProvider.otherwise({
        redirectTo: '/'
    });
    $locationProvider.html5Mode(true);
}

appRun.$inject = ['$http', '$localStorage', '$rootScope', '$location', 'Auth'];

function appRun($http, $localStorage, $rootScope, $location, Auth) {
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
        console.log('__________ROUTE TEST_________________');
        var currentUser        = $localStorage.currentUser;
        $rootScope.currentUser = currentUser;
        if ($rootScope.currentUser) {
            $http.defaults.headers.common['auth-token'] = $rootScope.currentUser.token;
        }
        for (var i in routeObject) {
            if (next.originalPath == i) {
                if (routeObject[i].requireLogin && !$rootScope.currentUser) {
                    console.log(i + ' require log in');
                    $location.path('/');
                } else if (routeObject[i].requireAdmin &&
                    $rootScope.currentUser.user_groupe.indexOf('admin') === 0 ||
                    routeObject[i].requireBlogger && $rootScope.currentUser.user_groupe.indexOf('blogger') === 0) {
                    console.log('authorized');
                    console.log(i + ' authorized');
                } else {
                    console.log('not authorized blogger');
                    $location.path('/');
                }
            }
        }
    });
}