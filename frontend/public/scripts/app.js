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
;angular.module('marketplace').controller('AdminAngCtrl', AdminAngCtrl);

AdminAngCtrl.$inject = ['$location', '$scope'];

function AdminAngCtrl($location, $scope) {
    console.log('AdminAngCtrl');

    $scope.recipe     = recipe;
    $scope.parentfood = parentfood;
    $scope.ingredient = ingredient;
    $scope.loading    = false;

    function recipe() {
        $scope.loading = true;
        $location.path('/#/admin/recipe');
    }

    function parentfood() {
        $scope.loading = true;
        $location.path('/#/admin/parentfood');
    }

    function ingredient() {
        $scope.loading = true;
        $location.path('/#/admin/ingredientalias');
    }
}

;angular.module('marketplace').controller('AliasAngCtrl', AliasAngCtrl);

AliasAngCtrl.$inject = ['Alias', '$routeParams', '$scope', '$filter', '$q', '$http', '$location', '$timeout', '$localStorage', '$rootScope', 'updateAlias'];

function AliasAngCtrl(Alias, $routeParams, $scope, $filter, $q, $http, $location, $timeout, $localStorage, $rootScope, updateAlias) {

    console.log('AliasAngCtrl');
    var orderBy             = $filter('orderBy');
    $scope.currentPage      = 1;
    $scope.pageSize         = 50;
    $scope.currentFoodPage  = 1;
    $scope.foodPageSize     = 20;
    $scope.aliases          = [];
    $scope.items            = [];
    $scope.orderAlias       = orderAlias;
    $scope.orderItems       = orderItems;
    $scope.ingredient       = [];
    $scope.querySearchName  = querySearchName;
    $scope.searchIngredient = searchIngredient;
    $scope.loading          = true;
    $scope.names            = [];
    $scope.setAlias         = setAlias;
    
    var aliases             = null;
    aliases                 = updateAlias ? updateAlias : null;
    
    if (aliases !== null) {
        if (aliases.error) {
            $scope.errorMessage = aliases.error;
        } else {
            $scope.ingredientId = $routeParams.ingredientId;
            $scope.alias        = aliases.data.aliases[0];
            
            $scope.aliases      = aliases.data.aliases;
            $scope.items        = aliases.data.items;
            angular.forEach($scope.aliases, function(value, key) {
                $scope.names.push(value.name);
            });
            $scope.loading = false;
        }
    }

    function callAtTimeout() {
        $location.path('/admin/ingredientalias/');
    }

    function setAlias(_id, id) {
        $scope.loading     = true;
        $scope.loadingSpin = true;
        var addAlias = {
            _id: _id,
            id: id,
            aliases: [$routeParams.ingredientId]
        };
        Alias.save(id, addAlias, $scope.aliases).then(function(res) {
            swal('Set!', 'The alias is set', 'success');
            $timeout(callAtTimeout, 3000);
        }).catch(function(data, status) {
            console.log('error', data, status);
            $scope.errorMessage = "error: " + data;
        })
        .finally(function () {
            console.log('finally finished');
            $scope.loading     = false;
            $scope.loadingSpin = false;
        });
    }

    function querySearchName(query) {
        var defer = $q.defer();
        $http.post('/api/ingredient', {
            name: query
        })
        .success(function(res) {
            defer.resolve(res.ingredient);
        });
        return defer.promise;
    }

    function setIngredients(res) {
        angular.forEach(res.ingredient, function(value, key) {
            for (var i = 0; i < $scope.aliases.length; i++) {
                if ($scope.aliases[i].id == value._source.id) {
                    value._source.added = true;
                    break;
                } else {
                    value._source.added = false;
                }
            }
        });
        $scope.ingredients = res.ingredient;
    }

    function displayErrorMessage(data, status) {
        if (data) {
            if (data == "Issue decoding incoming token." || data == 'Invalid token.') {
                $scope.errorMessage = "error: " + data + " Disconnecting...";
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
        $scope.loadingSpin = false;
        $scope.loading     = false;
    }

    function searchIngredient() {
        $scope.loading = true;
        Alias.search($scope.ingredient)
        .then(setIngredients)
        .catch(displayErrorMessage)
        .finally(endLoading);
    }

    function orderAlias(predicate) {
        $scope.predicateMeal = predicate;
        $scope.reverseMeal   = ($scope.predicateMeal === predicate) ? !$scope.reverseMeal : false;
        $scope.aliases       = orderBy($scope.aliases, predicate, $scope.reverseMeal);
    }

    function orderItems(predicate) {
        $scope.predicateMeal = predicate;
        $scope.reverseMeal   = ($scope.predicateMeal === predicate) ? !$scope.reverseMeal : false;
        $scope.items         = orderBy($scope.items, predicate, $scope.reverseMeal);
    }

}

function PaginateController($scope) {
    $scope.pageChangeHandler = function(num) {};
}
;angular.module('marketplace').controller('BasketAngCtrl', BasketAngCtrl);

BasketAngCtrl.$inject = ['Auth', 'Food', '$location', '$scope', '$routeParams', '$timeout', '$q', '$localStorage', '$rootScope'];

function BasketAngCtrl(Auth, Food, $location, $scope, $routeParams, $timeout, $q, $localStorage, $rootScope) {
    console.log('________________BasketAngCtrl____________________________');
    $scope.loadingSpin = false;
    $scope.loading     = true;
    $scope.parsed      = [];
    $scope.retailers   = [];
    var retailers      = [];
    var parsed         = [];
    $scope.prices      = [];

    function callAtTimeout() {
        Auth.logout();
        $localStorage.currentUser = null;
        $rootScope.currentUser    = null;
        $location.path('/#/');
    }

    function displayErrorMessage(data, status) {
        if (data) {
            if (data == "Issue decoding incoming token." || data == 'Invalid token.') {
                $scope.errorMessage = "error: " + data + " Disconnecting...";
                $timeout(callAtTimeout, 3000);
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

    function parseSentenceForNumber(sentence) {
        if (sentence) {
            var matches = sentence.match(/(\+|-)?((\d+(\.\d+)?)|(\.\d+))/);
            return matches && matches[0] || null;
        } else {
            return 0;
        }
    }

    function round(value, decimals) {
        return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
    }

    function linkIngredients(res) {
        $scope.safewayPrice     = 0;
        $scope.shiptPrice       = 0;
        $scope.walmartPrice     = 0;
        $scope.freshdirectPrice = 0;
        $scope.peapodPrice      = 0;
        $scope.instacartPrice   = 0;
        $scope.walmart          = [];
        $scope.freshdirect      = [];
        $scope.shipt            = [];
        $scope.peapod           = [];
        $scope.instacart        = [];
        $scope.safeway          = [];

        angular.forEach(res, function(value, key) {
            if (value.name) {
                switch (value.retailer_id) {
                    case 2:
                        $scope.safeway.push({
                            name: value.name,
                            quantity: value.quantity,
                            unit: value.unit,
                            id: value.id,
                            _id: value._id,
                            description: value.description,
                            qty: value.qty,
                            retailer_id: value.retailer_id,
                            price: value.price,
                            image_url: value.image_url
                        });
                        if (value.price || !isNaN(value.price)) {
                            $scope.safewayPrice = $scope.safewayPrice + parseFloat(parseSentenceForNumber(value.price)) * parseInt(value.qty);
                        }
                        break;
                    case 6:
                        $scope.peapod.push({
                            name: value.name,
                            quantity: value.quantity,
                            unit: value.unit,
                            id: value.id,
                            _id: value._id,
                            description: value.description,
                            qty: value.qty,
                            retailer_id: value.retailer_id,
                            price: value.price,
                            image_url: value.image_url
                        });
                        if (value.price || !isNaN(value.price)) {
                            $scope.peapodPrice = $scope.peapodPrice + parseFloat(parseSentenceForNumber(value.price)) * parseInt(value.qty);
                        }
                        break;
                    case 8:
                        $scope.walmart.push({
                            name: value.name,
                            quantity: value.quantity,
                            unit: value.unit,
                            id: value.id,
                            _id: value._id,
                            description: value.description,
                            qty: value.qty,
                            retailer_id: value.retailer_id,
                            price: value.price,
                            image_url: value.image_url
                        });
                        if (value.price || !isNaN(value.price)) {
                            $scope.walmartPrice = $scope.walmartPrice + parseFloat(parseSentenceForNumber(value.price)) * parseInt(value.qty);
                        }
                        break;
                    case 9:
                        $scope.freshdirect.push({
                            name: value.name,
                            quantity: value.quantity,
                            unit: value.unit,
                            id: value.id,
                            _id: value._id,
                            description: value.description,
                            qty: value.qty,
                            retailer_id: value.retailer_id,
                            price: value.price,
                            image_url: value.image_url
                        });

                        if (value.price || !isNaN(value.price)) {
                            $scope.freshdirectPrice = $scope.freshdirectPrice + parseFloat(parseSentenceForNumber(value.price)) * parseInt(value.qty);
                        }
                        break;
                    case 207:
                        $scope.instacart.push({
                            name: value.name,
                            quantity: value.quantity,
                            unit: value.unit,
                            id: value.id,
                            _id: value._id,
                            description: value.description,
                            qty: value.qty,
                            retailer_id: value.retailer_id,
                            price: value.price,
                            image_url: value.image_url
                        });
                        if (value.price || !isNaN(value.price)) {
                            $scope.instacartPrice = $scope.instacartPrice + parseFloat(parseSentenceForNumber(value.price)) * parseInt(value.qty);
                        }
                        break;
                    case 209:
                        $scope.shipt.push({
                            name: value.name,
                            quantity: value.quantity,
                            unit: value.unit,
                            id: value.id,
                            _id: value._id,
                            description: value.description,
                            qty: value.qty,
                            retailer_id: value.retailer_id,
                            price: value.price,
                            image_url: value.image_url
                        });
                        if (value.price || !isNaN(value.price)) {
                            $scope.shiptPrice = $scope.shiptPrice + parseFloat(parseSentenceForNumber(value.price)) * parseInt(value.qty);
                        }
                        break;
                }
            }
        });
        $scope.safewayPrice     = Math.round($scope.safewayPrice * 100) / 100;
        $scope.shiptPrice       = Math.round($scope.shiptPrice * 100) / 100;
        $scope.walmartPrice     = Math.round($scope.walmartPrice * 100) / 100;
        $scope.freshdirectPrice = Math.round($scope.freshdirectPrice * 100) / 100;
        $scope.peapodPrice      = Math.round($scope.peapodPrice * 100) / 100;
        $scope.instacartPrice   = Math.round($scope.instacartPrice * 100) / 100;
        
    }

    Food.seeIfAllRetailersAreLinked($routeParams.recipeId)
    .then(linkIngredients)
    .catch(displayErrorMessage)
    .finally(endLoading);
}
;angular.module('marketplace').controller('EditAngCtrl', EditAngCtrl).controller('PaginateController', PaginateController);

EditAngCtrl.$inject = ['Food', '$routeParams', '$filter', '$scope', '$timeout', '$q', '$location', '$localStorage', '$rootScope', 'updateFood'];

function EditAngCtrl(Food, $routeParams, $filter, $scope, $timeout, $q, $location, $localStorage, $rootScope, updateFood) {

    var orderBy            = $filter('orderBy');
    $scope.loading         = false;
    $scope.foods           = [];
    $scope.currentPage     = 1;
    $scope.currentFoodPage = 1;
    $scope.pageSize        = 50;
    $scope.foodPageSize    = 20;
    $scope.meals           = [];
    $scope.searchMeal      = searchMeal;
    $scope.orderFood       = orderFood;
    $scope.editMain        = editMain;

    $scope.foodId = $routeParams.foodId;
    var foods     = updateFood;

    if (foods !== null) {
        if (foods.error) {
            $scope.errorMessage = foods.error;
        } else {
            $scope.foods = foods.data;
        }
    }

    retailerList();

    $scope.addMain = addMain;
    $scope.add     = add;

    $scope.selectedToppings = [];
    $scope.printSelectedToppings = function printSelectedToppings() {
        var numberOfToppings = this.selectedToppings.length;
        // If there is more than one topping, we add an 'and'
        // to be gramatically correct. If there are 3+ toppings
        // we also add an oxford comma.
        if (numberOfToppings > 1) {
          var needsOxfordComma = numberOfToppings > 2;
          var lastToppingConjunction = (needsOxfordComma ? ',' : '') + ' and ';
          var lastTopping = lastToppingConjunction +
          this.selectedToppings[this.selectedToppings.length - 1];
          return this.selectedToppings.slice(0, -1).join(', ') + lastTopping;
      }
      return this.selectedToppings.join('');
  };

  function addMainItem(res) {
    angular.forEach($scope.meals, function(value, key) {
        if (value.id == res.parent.id) {
            value.is_main_item = true;
            value.added        = true;
        }
    });
    angular.forEach($scope.foods, function(value, key) {
        if (value.is_main_item === true) {
            value.is_main_item = false;
        }
    });
    $scope.foods.push({
        id: res.parent.id,
        name: res.parent.name,
        retailer: res.parent.retailer,
        is_main_item: true
    });
}

function displayErrorMessage(data, status) {
    if (data) {
        if (data == "Issue decoding incoming token." || data == 'Invalid token.') {
            $scope.errorMessage = "error: " + data + " Disconnecting...";
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

function addMain(parent, id) {
    $scope.loading = true;
    var addFood = {
        item_id: id,
        parent_food_id: $routeParams.foodId,
        main_item: true
    };
    $q.all({
        parent: $q.when(parent),
        data: Food.save(id, addFood, $scope.foods)
    })
    .then(addMainItem)
    .catch(displayErrorMessage)
    .finally(endLoading);
}

function addItem(res) {
    angular.forEach($scope.meals, function(value, key) {
        if (value.id == res.parent.id) {
            value.added = true;
        }
    });
    $scope.foods.push({
        id: res.parent.id,
        name: res.parent.name,
        retailer: res.parent.retailer
    });
}

function add(parent, id) {
    $scope.loading = true;
    var addFood = {
        item_id: id,
        parent_food_id: $routeParams.foodId
    };
    $q.all({
        parent: $q.when(parent),
        data: Food.save(id, addFood, $scope.foods)
    })
    .then(addItem)
    .catch(displayErrorMessage)
    .finally(endLoading);
}

function getName(result) {
    if (result.message) {
        $scope.errorMessage = result.message;
    } else {
        $scope.errorMessage = false;
        $scope.parent = result[0].name;
    }
}

$scope.loading = true;
Food.findName($routeParams.foodId)
.then(getName)
.catch(displayErrorMessage)
.finally(endLoading);

function timeoutUpdateFood() {
    $timeout(function(){
        updateFood();
    }, 300);
}

function editMain(id) {
    $scope.loading = true;
    var edit_main = {
        item_id: id,
        parent_food_id: $routeParams.foodId
    };
    Food.editMain(edit_main)
    .then(timeoutUpdateFood)
    .catch(displayErrorMessage)
    .finally(endLoading);
}

function orderFood(predicate) {
    $scope.predicate = predicate;
    $scope.reverse   = ($scope.predicate === predicate) ? !$scope.reverse : false;
    $scope.foods     = orderBy($scope.foods, predicate, $scope.reverse);
}

function checkWhatIsAdded(result) {
    if (result.message) {
        $scope.errorMessage = result.message;
    } else {
        $scope.errorMessage = false;
        $scope.meals        = result;
        angular.forEach($scope.meals, function(value, key) {
            var found = false;
            for (var i = 0; i < $scope.foods.length; i++) {
                if ($scope.foods[i].id == value.id) {
                    value.added = true;
                    break;
                } else {
                    value.added = false;
                }
            }
        });
    }
}

function searchMeal() {
    $scope.loading = true;
    if ($scope.food && $scope.food.name ||$scope.food.retailers) {
        $scope.error = null;
        Food.find($scope.food)
        .then(checkWhatIsAdded)
        .catch(displayErrorMessage)
        .finally(endLoading);
    } else {
        $scope.error = "You need to choose a retailer and enter an ingredient";
        endLoading();
    }
}





function getRetailers(res) {
    $scope.retailers = res.retailers;
}

function retailerList() {
    Food.listRetailers()
    .then(getRetailers)
    .catch(displayErrorMessage)
    .finally(endLoading);
}

}

function PaginateController($scope) {
    $scope.pageChangeHandler = function(num) {

    };
}
;angular.module('marketplace').controller('HomeAngCtrl', HomeAngCtrl);

HomeAngCtrl.$inject = ['$location', 'Auth', '$scope', '$rootScope'];

function HomeAngCtrl($location, Auth, $scope, $rootScope) {
    console.log('HomeAngCtrl');
    if ($rootScope.currentUser) {
        $location.path('/recipes');
    }
    $scope.loading = false;
    $scope.login   = login;

    function login() {
        $scope.loading = true;
        Auth.login($scope.user);
    }

    $scope.loading = false;
}
;angular.module('marketplace').controller('IngredientAngCtrl', IngredientAngCtrl);

IngredientAngCtrl.$inject = ['Alias', '$scope'];

function IngredientAngCtrl(Alias, $scope) {
    console.log('IngredientAngCtrl');
    
    $scope.currentPage      = 1;
    $scope.pageSize         = 50;
    $scope.searchIngredient = searchIngredient;

    function getAliases(res) {
        $scope.errorMessage = '';
        $scope.ingredients = res.ingredient;
        $scope.loading     = false;
    }

    function displayErrorMessage(data, status) {
        if (data.message) {
            $scope.errorMessage = "error: " + "Please enter a shorter string in your searchbox!";
        }
    }

    function endLoading() {
        $scope.loading = false;
    }

    function searchIngredient() {
        $scope.loading = true;
        Alias.search($scope.ingredient)
        .then(getAliases)
        .catch(displayErrorMessage)
        .finally(endLoading);
    }
}
;angular.module('marketplace').controller('LinkRecipeAngCtrl', LinkRecipeAngCtrl);

LinkRecipeAngCtrl.$inject = ['Food', '$http', '$scope', 'Recipe', '$q', '$routeParams', '$location', '$window', 'getRecipeForLink'];

function LinkRecipeAngCtrl(Food, $http, $scope, Recipe, $q, $routeParams, $location, $window, getRecipeForLink) {
    console.log('LinkRecipeAngCtrl');

    $scope.watch           = null;
    $scope.querySearchName = querySearchName;
    $scope.querySearchAdd  = querySearchAdd;
    $scope.link            = link;
    $scope.selectedItem    = [];
    $scope.add             = [];
    $scope.retailer        = {};
    
    $scope.items           = [];
    $scope.recipeId        = $routeParams.recipeId;
    $scope.text            = text;
    $scope.edit            = edit;
    $scope.myModel         = null;
    
    $scope.loadingSpin     = false;
    $scope.loading         = true;
    $scope.parsed          = [];
    $scope.retailers       = [];
    var retailers          = [];
    var parsed             = [];
    $scope.prices          = [];

    var res = getRecipeForLink;


    if (res !== null) {
        if (res.error) {
            $scope.errorMessage = res.error;
            $scope.loading      = false;
        } else {
            $scope.res              = res.data;
            $scope.safewayPrice     = 0;
            $scope.shiptPrice       = 0;
            $scope.walmartPrice     = 0;
            $scope.freshdirectPrice = 0;
            $scope.peapodPrice      = 0;
            $scope.instacartPrice   = 0;
            $scope.walmart          = [];
            $scope.freshdirect      = [];
            $scope.shipt            = [];
            $scope.peapod           = [];
            $scope.instacart        = [];
            $scope.safeway          = [];

            angular.forEach(res.data, function(value, key) {
                if (value.name) {
                    switch (value.retailer_id) {
                        case 2:
                            $scope.safeway.push({
                                name: value.name,
                                quantity: value.quantity,
                                unit: value.unit,
                                id: value.id,
                                _id: value._id,
                                description: value.description,
                                qty: value.qty,
                                retailer_id: value.retailer_id,
                                price: value.price,
                                image_url: value.image_url
                            });
                            if (value.price || !isNaN(value.price)) {
                                $scope.safewayPrice = $scope.safewayPrice + parseFloat(parseSentenceForNumber(value.price)) * parseInt(value.qty);
                            }
                            break;
                        case 6:
                            $scope.peapod.push({
                                name: value.name,
                                quantity: value.quantity,
                                unit: value.unit,
                                id: value.id,
                                _id: value._id,
                                description: value.description,
                                qty: value.qty,
                                retailer_id: value.retailer_id,
                                price: value.price,
                                image_url: value.image_url
                            });
                            if (value.price || !isNaN(value.price)) {
                                $scope.peapodPrice = $scope.peapodPrice + parseFloat(parseSentenceForNumber(value.price)) * parseInt(value.qty);
                            }
                            break;
                        case 8:
                            $scope.walmart.push({
                                name: value.name,
                                quantity: value.quantity,
                                unit: value.unit,
                                id: value.id,
                                _id: value._id,
                                description: value.description,
                                qty: value.qty,
                                retailer_id: value.retailer_id,
                                price: value.price,
                                image_url: value.image_url
                            });
                            if (value.price || !isNaN(value.price)) {
                                $scope.walmartPrice = $scope.walmartPrice + parseFloat(parseSentenceForNumber(value.price)) * parseInt(value.qty);
                            }
                            break;
                        case 9:
                            console.log(value);
                            $scope.freshdirect.push({
                                name: value.name,
                                quantity: value.quantity,
                                unit: value.unit,
                                id: value.id,
                                _id: value._id,
                                description: value.description,
                                qty: value.qty,
                                retailer_id: value.retailer_id,
                                price: value.price,
                                image_url: value.image_url
                            });

                            if (value.price || !isNaN(value.price)) {
                                $scope.freshdirectPrice = $scope.freshdirectPrice + parseFloat(parseSentenceForNumber(value.price)) * parseInt(value.qty);
                            }
                            break;
                        case 207:
                            $scope.instacart.push({
                                name: value.name,
                                quantity: value.quantity,
                                unit: value.unit,
                                id: value.id,
                                _id: value._id,
                                description: value.description,
                                qty: value.qty,
                                retailer_id: value.retailer_id,
                                price: value.price,
                                image_url: value.image_url
                            });
                            if (value.price || !isNaN(value.price)) {
                                $scope.instacartPrice = $scope.instacartPrice + parseFloat(parseSentenceForNumber(value.price)) * parseInt(value.qty);
                            }
                            break;
                        case 209:
                            $scope.shipt.push({
                                name: value.name,
                                quantity: value.quantity,
                                unit: value.unit,
                                id: value.id,
                                _id: value._id,
                                description: value.description,
                                qty: value.qty,
                                retailer_id: value.retailer_id,
                                price: value.price,
                                image_url: value.image_url
                            });
                            if (value.price || !isNaN(value.price)) {
                                $scope.shiptPrice = $scope.shiptPrice + parseFloat(parseSentenceForNumber(value.price)) * parseInt(value.qty);
                            }
                            break;
                    }
                }
            });

            $scope.safewayPrice     = Math.round($scope.safewayPrice * 100) / 100;
            $scope.shiptPrice       = Math.round($scope.shiptPrice * 100) / 100;
            $scope.walmartPrice     = Math.round($scope.walmartPrice * 100) / 100;
            $scope.freshdirectPrice = Math.round($scope.freshdirectPrice * 100) / 100;
            $scope.peapodPrice      = Math.round($scope.peapodPrice * 100) / 100;
            $scope.instacartPrice   = Math.round($scope.instacartPrice * 100) / 100;
            $scope.loadingSpin      = false;
            $scope.main             = true;
            $scope.loading = false;
        }
    }

    function parseSentenceForNumber(sentence) {
        if (sentence) {
            var matches = sentence.match(/(\+|-)?((\d+(\.\d+)?)|(\.\d+))/);
            return matches && matches[0] || null;
        } else {
            return 0;
        }
    }

    function round(value, decimals) {
        return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
    }


    function displayField(res) {
        $scope.parsed = [];
        var parsed    = [];
        angular.forEach(res.data, function(value, key) {
            if (value.name != res.name) {
                parsed.push({
                    name: value.name,
                    quantity: value.quantity,
                    unit: value.unit,
                    id: value.id,
                    _id: value._id,
                    description: value.description,
                    qty: value.qty,
                    text: true
                });
            } else {
                parsed.push({
                    name: value.name,
                    quantity: value.quantity,
                    unit: value.unit,
                    id: value.id,
                    text: false,
                    description: value.description,
                    qty: value.qty
                });
            }
        });
        $scope.parsed = parsed.reverse();
        parsed = [];
    }

    function resetDisplay() {
        $scope.watch  = 'watch';
        $scope.noLink = null;
    }



    function edit(name) {
        $q.all({
            name: $q.when(name),
            data: Food.seeIfRetailerIsLinked($routeParams.recipeId, $scope.retailer.id)
        })
        .then(displayField)
        .then(resetDisplay);
    }

    function text() {
        checkIfRetailerIsLinked();
    }

    function getRecipe(res) {
        var parsed = [];
        angular.forEach(res, function(value, key) {
            if (value.name) {
                parsed.push({
                    name: value.name,
                    quantity: value.quantity,
                    unit: value.unit,
                    id: value.id,
                });
            }
            if (value.ingredient_id === null) {
                $location.path('/monitorrecipe/' + $routeParams.recipeId);
            }
            value.text = true;
        });
        $scope.parsed = parsed.reverse();
    }

    function displayErrorMessage(data, status) {
        if (data) {
            if (data == "Issue decoding incoming token." || data == 'Invalid token.') {
                $scope.errorMessage = "error: " + data + " Disconnecting...";
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


    function getLinkingRecipe() {
        Recipe.parse($routeParams.recipeId).then(getRecipe)
        .catch(displayErrorMessage)
        .finally(endLoading);
    }

    function getLinkedRecipe(res) {
        $scope.parsed = [];
        var parsed    = [];
        angular.forEach(res, function(value, key) {
            if (value.name) {
                parsed.push({
                    name: value.name,
                    quantity: value.quantity,
                    unit: value.unit,
                    id: value.id,
                    _id: value._id,
                    description: value.description,
                    qty: value.qty,
                    text: true
                });
            }
        });
        $scope.parsed = parsed.reverse();
        $scope.watch  = 'watch';
        $scope.noLink = null;
    }

    function checkIfRetailerIsLinked() {
        Food.seeIfRetailerIsLinked($routeParams.recipeId, $scope.retailer.id)
        .then(getLinkedRecipe)
        .catch(displayErrorMessage)
        .finally(endLoading);
    }

    $scope.clearValue = function() {
        $scope.watch   = null;
        $scope.myModel = undefined;
        $scope.noLink  = null;
    };

    function linking() {
        swal('Linking!', 'The link has been added', 'success');
        checkIfRetailerIsLinked();
    }

    $scope.addL = function(item, qty, index, retailerId) {
        var addLink                       = {};
        addLink.widget_item_ingredient_id = $scope.parsed[index].id;
        addLink.retailer_id               = retailerId;
        if (item) {
            addLink.item_id = item;
        }
        if (qty) {
            addLink.quantity = qty;
        }
        addLink.unit_id = null;
        $http.post('/api/items/addLink', addLink)
        .success(linking)
        .error(endLoading);
    };

    $scope.editL = function(item, qty, index, retailerId) {
        var editLink                       = {};
        editLink.id                        = $scope.parsed[index].id;
        editLink.widget_item_ingredient_id = $scope.parsed[index]._id;
        editLink.retailer_id               = retailerId;
        editLink.item_id = item;
        if (qty) {
            editLink.quantity = qty;
        }
        editLink.unit_id = null;
        $http.post('/api/items/editLink', editLink).success(function(res) {
            swal('Linking!', 'The link has been edited', 'success');
            checkIfRetailerIsLinked();
        });
    };

    function linkIngredients(res) {
        console.log('linkIngredients');
        if (res.length === 0) {
            console.log('getLinkingRecipe');
            getLinkingRecipe();
            $scope.noLink      = 'noLink';
            $scope.watch       = null;
            $scope.loadingSpin = false;
        } else {
            console.log(res);
            $scope.parsed     = [];
            var parsed        = [];
            var totallyLinked = true;
            angular.forEach(res, function(value, key) {
                if (value.name) {
                    parsed.push({
                        name: value.name,
                        quantity: value.quantity,
                        unit: value.unit,
                        id: value.id,
                        _id: value._id,
                        description: value.description,
                        qty: value.qty,
                        text: true
                    });
                }
                if (!value.description) {
                    totallyLinked = false;
                }
            });
            $scope.parsed = parsed.reverse();
            if (totallyLinked) {
                swal('Linking!', 'Recipe already linked', 'success');
            } else {
                swal('Linking!', 'To publish the recipe, all ingredients needs to be linked', 'warning');
            }
            $scope.watch       = 'watch';
            $scope.noLink      = null;
            $scope.loadingSpin = false;
        }
    }


    $scope.save = function(retailer) {
        $scope.main         = false;
        $scope.loadingSpin  = true;
        $scope.watch        = null;
        $scope.noLink       = null;
        $scope.parsed       = [];
        $scope.selectedItem = [];
        $scope.add          = [];
        $scope.retailer.name = retailer;
        switch (retailer) {
            case 'safeway':
            $scope.retailer.id = 2;
            $scope.url = "https://shop.safeway.com/ecom/my-cart";
            break;
            case 'peapod':
            $scope.retailer.id = 6;
            $scope.url = "https://www.peapod.com/shop";
            break;
            case 'walmart':
            $scope.retailer.id = 8;
            $scope.url = "http://www.walmart.com/cp/food/976759";
            break;
            case 'freshdirect':
            $scope.retailer.id = 9;
            $scope.url = "https://www.freshdirect.com";
            break;
            case 'instacart':
            $scope.retailer.id = 207;
            $scope.url = "https://www.instacart.com";
            break;
            case 'shipt':
            $scope.retailer.id = 209;
            $scope.url = "https://app.shipt.com/shop";
            break;
        }
        Food.seeIfRetailerIsLinked($routeParams.recipeId, $scope.retailer.id)
        .then(linkIngredients)
        .catch(displayErrorMessage)
        .finally(endLoading);
    };

    function setRetailers(res) {
        $scope.retailers = res.retailers;
    }

    function retailerList() {
        Food.listRetailers()
        .then(setRetailers)
        .catch(displayErrorMessage)
        .finally(endLoading);
    }

    function link(item, qty) {
        var items = [];
        var linked;
        for (var j = 0; j < item.length; j++) {
            if (item[j].name._source.name === null || !qty[j] || qty[j].quantity === null) {
                swal('Please link all the ingredients', 'Try again', 'warning');
                linked = 'notLinked';
                break;
            } else {
                items.push({
                    widget_item_ingredient_id: $scope.parsed[j].id,
                    item_id: item[j].name._source.suggest.payload.item_id,
                    retailer_id: $scope.retailer.id,
                    quantity: qty[j] ? qty[j].quantity : null,
                    unit_id: null
                });
            }
        }
        if (linked !== 'notLinked') {
            var publish = {
                widget_item_id: $routeParams.recipeId,
                retailer_id: $scope.retailer.id
            };
            $http.post('/api/items/link', items)
            .success(function(err) {
                if (!err) {
                    swal({
                      title: 'The recipe is linked to a retailer',
                      text: 'Do you wish to link your recipe to an other retailer?',
                      type: 'warning',
                      showCancelButton: true,
                      confirmButtonColor: '#3085d6',
                      cancelButtonColor: '#d33',
                      confirmButtonText: 'Yes!',
                      cancelButtonText: 'No!',
                      confirmButtonClass: 'btn btn-success',
                      cancelButtonClass: 'btn btn-danger',
                      buttonsStyling: false
                    }).then(function() {
                        $http.post('/api/items/publish', publish)
                        .success(function(res) {
                            swal('Continue...', 'Choose an other retailer', 'warning');
                            $window.location.reload();
                        });
                    }, function(dismiss) {
                      // dismiss can be 'cancel', 'overlay', 'close', 'timer'
                      if (dismiss === 'cancel') {
                        $http.post('/api/items/publish', publish)
                        .success(function(res) {
                            console.log('yeah');
                            swal('Linking!', 'Your job is done.', 'success');
                            $location.path('/basket/' + $routeParams.recipeId);
                        });
                      }
                    });
                            
                } else {
                    swal('Error...', 'Linking failed', 'warning');
                }
            });
        }
    }

    function querySearchAdd(query) {
        var defer = $q.defer();
        $http.post('/api/items/' + $scope.retailer.name, {
            name: query
        })
        .success(function(res) {
            $scope.errorMessage = null;
            defer.resolve(res.item);
        }).error(function(error) {
            defer.reject(error);
            if (error.displayName !== "RequestTimeout") {
                $scope.errorMessage = "error: " + "Please enter a shorter string in your searchbox!";
            }
        });
        return defer.promise;
    }

    function querySearchName(query) {
        var defer = $q.defer();
        $http.post('/api/ingredientrecipe', {
            name: query
        })
        .success(function(res) {
            defer.resolve(res.item);
        });
        return defer.promise;
    }
}
;angular.module('marketplace').controller('MainAngCtrl', MainAngCtrl);

MainAngCtrl.$inject = ['$localStorage', '$rootScope', '$http', '$scope', '$location', 'Auth'];

function MainAngCtrl($localStorage, $rootScope, $http, $scope, $location, Auth) {
    console.log('MainAngCtrl');


}
;angular.module('marketplace')
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
;angular.module('marketplace').controller('MonitorAngCtrl', MonitorAngCtrl);

MonitorAngCtrl.$inject = ['Food', 'Recipe', '$scope', '$routeParams', '$q', '$http', '$location', '$localStorage', '$rootScope', 'parseRecipe'];

function MonitorAngCtrl(Food, Recipe, $scope, $routeParams, $q, $http, $location, $localStorage, $rootScope, parseRecipe) {
    console.log('MonitorAngCtrl');
    
    $scope.testPictureUrl     = testPictureUrl;
    $scope.testTotalTime      = testTotalTime;
    $scope.testServings       = testServings;
    $scope.editRecipe         = editRecipe;
    $scope.addIngredient      = addIngredient;
    $scope.destroy            = destroy;
    $scope.linkRecipe         = linkRecipe;
    $scope.simulateQuery      = true;
    $scope.names              = [];
    $scope.querySearchAdd     = querySearchAdd;
    $scope.querySearchUnitAdd = querySearchUnitAdd;
    $scope.update             = update;
    $scope.edit               = edit;
    $scope.isDisabled         = true;
    $scope.firstLoad          = [];
    $scope.text               = text;
    $scope.selected           = [];
    $scope.loading            = true;

    var parsed             = null;
    parsed                 = parseRecipe ? parseRecipe : null;

    if (parsed !== null) {
        if (parsed.error) {
            $scope.errorMessage = parsed.error;
            $scope.loading = false;
        } else {
            $scope.parsed  = parsed.data;
            getRecipe();
            $scope.loading = false;
        }
    }

    function displayErrorMessage(data, status) {
        $scope.recipe  = {};
        $scope.picture = '';
        $scope.url     = '';
        if (data) {
            if (data == "Issue decoding incoming token." || data == 'Invalid token.') {
                $scope.errorMessage = "error: " + data + " Disconnecting...";
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
        $scope.loading     = false;
        $scope.selected    = [];
        $scope.queryName   = '';
        $scope.loadingSpin = false;
    }

    function setRecipe(result) {
        if (result[0]) {
            $scope.recipe  = result[0];
            $scope.picture = result[0].picture;
            $scope.url     = result[0].referer;
        }
    }

    function getRecipe() {
        // get recipe data
        Recipe.get($routeParams.recipeId)
        .then(setRecipe)
        .catch(displayErrorMessage)
        .finally(endLoading);
    }

    $scope.selectedItemChange= function() {
        // clear input
        $scope.searchTextName = '';
        $scope.selectedItem   = undefined;
    };

    function testPictureUrl(urlPicture) {
        var Http  = urlPicture.slice(0, 4);
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

    function querySearchUnitAdd(query) {
        var defer = $q.defer();
        $http.post('/api/unit', {
            name: query
        })
        .success(function(res) {
            defer.resolve(res.unit);
        });
        return defer.promise;
    }

    function querySearchAdd(query) {
        var defer        = $q.defer();
        $scope.queryName = query;
        $http.post('/api/ingredientrecipe', {
            name: query
        })
        .success(function(res) {
            defer.resolve(res.ingredient.data);
        }).error(function(error) {
            defer.reject(error);
            if (error.message != 'Request Timeout after 6000ms') {
                $scope.errorMessage = "error: " + "Please enter a shorter string in your searchbox!";
            }
        });

        return defer.promise;
    }

    function linkRecipe() {
        var parsedProblem = false;
        // Using for here to break if parsedProblem is true
        for (var i = 0; i < $scope.parsed.length; i++) {
            if ($scope.parsed[i].name == "No name" || $scope.parsed[i].has_error == 1) {
                parsedProblem = true;
                break;
            }
        }
        if (parsedProblem) {
            swal('Cancel', "You need to parse all items well", 'error');
            return;
        } else {
            $location.path('/linkrecipe/' + $routeParams.recipeId + '/');
        }
    }

    $scope.clearValue = function() {
        $scope.myModel = undefined;
    };

    $scope.save = function() {
        var reviewed = [];
        angular.forEach($scope.selected, function(value, key) {
            if (value.id) {
                reviewed.push({
                    id: value.id
                });
            }
        });
        return $http.post('/api/recipe/reviewed', reviewed)
        .success(function(res) {
            parseResult();
        });
    };

    $scope.isIndeterminate = function() {
        if ($scope.selected) {
            return ($scope.selected.length !== 0 &&
                $scope.selected.length !== $scope.parsed.length);
        }
    };
    $scope.isChecked = function() {
        if ($scope.selected) {
            return $scope.selected.length === $scope.parsed.length;
        }
    };
    $scope.toggleAll = function() {
        if ($scope.selected) {
            if ($scope.selected.length === $scope.parsed.length) {
                $scope.selected = [];
            } else if ($scope.selected.length === 0 || $scope.selected.length > 0) {
                $scope.selected = $scope.parsed.slice(0);
            }
        }
    };

    function setEdit(res) {
        $scope.editSuccess = 'Updated';
        $scope.picture     = recipe.picture;
    }

    function editRecipe() {
        $scope.loadingSpin = true;
        var recipe = {
            name: $scope.recipe.name,
            picture: $scope.recipe.picture,
            total_time: $scope.recipe.total_time,
            servings: $scope.recipe.servings
        };
        recipe.id = $routeParams.recipeId;
        Recipe.editInfo(recipe)
        .then(setEdit)
        .catch(displayErrorMessage)
        .finally(endLoading);
    }

    function switchResSetUnit(unit) {
        switch(unit) {
            case '1':
            return 'g';
            case '2':
            return 'mg';
            case '3':
            return 'mcg';
            case '6':
            return 'cup';
            case '7':
            return 'fluid once';
            case '8':
            return 'fl';
            case '9':
            return 'gal';
            case '10':
            return 'oz';
            case '11':
            return 'pt';
            case '12':
            return 'qt';
            case '13':
            return 'tbs';
            case '14':
            return 'tsp';
            case '15':
            return 'stick';
            case '16':
            return 'l';
            case '17':
            return 'ml';
            case '18':
            return 'dl';
            case '19':
            return 'lb';
            case '20':
            return 'kg';
            case '21':
            return 'dkg';
            case '22':
            return 'cl';
        }
    }

    function pushParsed(res) {
        var unit = switchResSetUnit(res.set.unit);
        $scope.parsed.unshift({
            id: res.data.id,
            name: res.set.name,
            unit: unit,
            quantity: res.set.quantity,
            ingredient_id: res.set.ingredient_id,
            has_error: 0,
            text: true,
            is_reviewed: 'no'
        });
        $scope.add                   = {};
        $scope.selectedItemChangeAdd = {};
    }

    function cancelPublish() {
        $http.delete('/api/items/cancelpublish/' + $routeParams.recipeId)
        .success(function(succ) {
            swal('Added', "This ingredient has been added", 'success');
        });
    }

    function clearInput() {
        $scope.$broadcast('angucomplete-alt:clearInput');
        $scope.selected  = [];
        $scope.queryName = '';
    }

    function addIngredient(selectedItems, qty) {
        $scope.loadingSpin = true;
        var name = '';
        if (!$scope.selected.description && $scope.queryName) {
            name = $scope.queryName;
        } else if ($scope.selected.description) {
            var ingredient_id = $scope.selected.description.id;
            name              = $scope.selected.description.name;
        } else {
            swal('Cancel', "This ingredient has'nt been added because the name field of an ingredient is empty: please enter an ingredient", 'error');
            return;
        }
        if (qty === 0 || !qty) {
            $scope.$broadcast('angucomplete-alt:clearInput');
            $scope.selected  = [];
            $scope.queryName = '';
            swal('Cancel', "This ingredient has'nt been added because the quantity field of an ingredient is empty or is equal of zero. Please add a positive quantity.", 'error');
            clearInput();
            return;
        }
        var unit_id = null;
        var unit    = null;
        if (selectedItems) {
            unit_id = selectedItems.unit;
            unit    = selectedItems.unit;
        }
        var addIng = {
            unit_id: unit_id,
            name: name,
            unit: unit,
            quantity: qty ? qty: '0',
            widget_item_id: $routeParams.recipeId,
            has_error: 0
        };
        if (!addIng.ingredient_id) {
            delete edit.ingredient_id;
        }
        if (!addIng.unit_id) {
            delete edit.unit_id;
        }
        if (!addIng.name) {
            delete edit.name;
        }
        if (!addIng.unit) {
            delete edit.unit;
        }
        if (!addIng.quantity) {
            delete edit.quantity;
        }
        $q.all({
            set: $q.when(addIng),
            data: Recipe.add(addIng)
        }).then(pushParsed)
        .then(cancelPublish)
        .catch(displayErrorMessage)
        .finally(clearInput);
    }

    function setUpdatedIngredients(res) {
        var unit = switchResSetUnit(res.set.unit);
        angular.forEach($scope.parsed, function(value, key) {
            if (value.id == res.set.id) {
                value.id   = res.set.id;
                value.name = res.set.name;
                if (unit) {
                    value.unit          = unit;
                }
                if (value.is_reviewed == 1) {
                    value.is_reviewed = 'yes';
                }
                if (value.is_reviewed === 0) {
                    value.is_reviewed = 'no';
                } 
                value.unit_id       = unit;
                value.quantity      = res.set.quantity;
                value.ingredient_id = res.set.ingredient_id,
                value.has_error     = 0;
                value.text          = true;
            }
        });
    }


    function update(unit, qty, id, index, nameField) {
        $scope.loadingSpin = true;
        Recipe.testIfIngredientLinked(id).then(function(res) {
            var edit = {};
            if ($scope.selected) {
                var name = '';
                if (!$scope.selected.description && $scope.queryName) {
                    name = $scope.queryName;
                    edit = {
                        id: id,
                        name: name,
                        unit: unit,
                        unit_id: unit,
                        quantity: qty
                    };
                } else {
                    name          = nameField;
                    var ingredient_id = null;
                    if ($scope.selected.description) {
                        ingredient_id = $scope.selected.description.id;
                        name          = $scope.selected.description.name;
                    } else if ($scope.parsed[index].name !== 'No name') {
                        edit.noNameChanged  = true;
                    } else {
                        swal('Cancel', "This ingredient has'nt been edited because the name field of an ingredient is empty: please enter an ingredient", 'error');
                        return;
                    }

                    edit = {
                        id: id,
                        name: name,
                        unit: unit,
                        unit_id: unit,
                        quantity: qty,
                        ingredient_id: ingredient_id,
                        noNameChanged: true ? !$scope.selected.description : false
                    };
                }
                edit.has_error = 0;
                if (!edit.ingredient_id) {
                    delete edit.ingredient_id;
                }
                if (!edit.unit_id) {
                    delete edit.unit_id;
                }
                if (!edit.unit) {
                    delete edit.unit;
                }
                if (!edit.quantity) {
                    delete edit.quantity;
                }
                if (res.length > 0) {
                    swal({
                      title: 'Are you sure?',
                      text: "This recipe is already linked to a retailer!",
                      type: 'warning',
                      showCancelButton: true,
                      confirmButtonColor: '#3085d6',
                      cancelButtonColor: '#d33',
                      confirmButtonText: 'Yes, edit it!',
                      cancelButtonText: 'No, cancel!',
                      confirmButtonClass: 'btn btn-success',
                      cancelButtonClass: 'btn btn-danger',
                      buttonsStyling: false
                  }).then(function() {
                    $q.all({
                        set: $q.when(edit),
                        data: Recipe.deleteAndEdit(edit)
                    }).then(setUpdatedIngredients)
                    .then(cancelPublish)
                    .catch(displayErrorMessage)
                    .finally(endLoading);
                }, function(dismiss) {
                    if (dismiss === 'cancel') {
                        swal('Cancel', "This ingredient has'nt been edited", 'error');
                    }
                });
              } else {
                $q.all({
                    set: $q.when(edit),
                    data: Recipe.edit(edit)
                })
                .then(setUpdatedIngredients)
                .catch(displayErrorMessage)
                .finally(endLoading);
            }
        } else {
            $scope.errorMessage = "error: please refresh your page";
        }

    }).catch(displayErrorMessage)
        .finally(endLoading);
    }


    function edit(id) {
        angular.forEach($scope.parsed, function(value, key) {
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
            if (value.id == id) {
                value.text = false;
            } else {
                value.text = true;
            }
        });
    }

    function text() {
        $scope.loadingSpin = true;
        angular.forEach($scope.parsed, function(value, key) {
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
    }

    function checkIfRecipeIsTotallyLinked(res) {
        var totallyLinked = true;
        angular.forEach(res, function(value) {
            if (!value.description) {
                totallyLinked = false;
            }
        });
        return totallyLinked;
    }

    Array.prototype.contains = function(v) {
        for(var i = 0; i < this.length; i++) {
            if(this[i] === v) return true;
        }
        return false;
    };

    Array.prototype.unique = function() {
        var arr = [];
        for(var i = 0; i < this.length; i++) {
            if(!arr.contains(this[i])) {
                arr.push(this[i]);
            }
        }
        return arr; 
    };

    function destroy(id, index) {
        $scope.loadingSpin = true;
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
        Recipe.destroy({
            id: id, 
            recipeId: $routeParams.recipeId
        })
        .then(function(res) {
            console.log(res);
            $scope.parsed.splice(index, 1);
            if (res.retailers && res.retailers.length > 0) {
                var linkedRetailerMessages = [];
                angular.forEach(res.retailers, function(value, key){
                    switch (value) {
                        case 2:
                        linkedRetailerMessages.push("Safeway is Linked!");
                        break;
                        case 6:
                        linkedRetailerMessages.push("Peapod is Linked!");
                        break;
                        case 8:
                        linkedRetailerMessages.push("Walmart is Linked!");
                        break;
                        case 9:
                        linkedRetailerMessages.push("Freshdirect is Linked!");
                        break;
                        case 207:
                        linkedRetailerMessages.push("Instacart is Linked!");
                        break;
                        case 209:
                        linkedRetailerMessages.push("Shipt is Linked!");
                        break;
                    }

                });
                var uniques = linkedRetailerMessages.unique();
                swal.setDefaults({
                     confirmButtonText: 'Next &rarr;',
                     showCancelButton: true,
                     animation: true
                 });
                swal.queue(uniques).then(function() {
                    swal({
                       title: 'All done!',
                       confirmButtonText: 'Lovely!',
                       showCancelButton: false
                    });
                });
            } else {
                swal('Deleted!', 'This line has been deleted.', 'success');
            }
        }).catch(displayErrorMessage).finally(endLoading);

    }, function(dismiss) {
          // dismiss can be 'cancel', 'overlay', 'close', 'timer'
          if (dismiss === 'cancel') {
            swal(
              'Cancelled',
              'Your ingredient is safe :)',
              'error'
              );
        }
    });
  }

  $scope.itemSelected = function(selected) {
    $scope.selected = selected;
};
}
;angular.module('marketplace')
    .controller('ParentAngCtrl', ParentAngCtrl)
    .controller('PaginateController', PaginateController);

ParentAngCtrl.$inject = ['$scope', 'getParentFoods'];

function ParentAngCtrl($scope, getParentFoods) {
    
    $scope.currentPage = 1;
    $scope.pageSize    = 50;
    $scope.loading     = true;
    var foods          = getParentFoods;

    if (foods !== null) {
        if (foods.error) {
            $scope.errorMessage = foods.error;
        } else {
            $scope.foods = foods.data.parent_foods;
        }
    }
    $scope.loading = false;
}


function PaginateController($scope) {
    $scope.pageChangeHandler = function(num) {

    };
}
;angular.module('marketplace').controller('RecipeAngCtrl', RecipeAngCtrl);
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
;angular.module('marketplace').directive('food', function () {
    // return the directive definition object 
    return {
        scope: true,
        controller: function (Food, $scope, $routeParams) {
            $scope.retrieve = retrieve;

            function retrieve(parent, id) {
                var remove = {
                    item_id: id,
                    parent_food_id: $routeParams.foodId
                };
                Food.retrieve(remove)
                    .then(function() {
                        $scope.foods.splice($scope.foods.indexOf(parent), 1);
                        angular.forEach($scope.meals, function(value, key) {
                            if (value.id == id) {
                                value.added        = false;
                                value.is_main_item = false;
                            }
                        });
                    })
                    .catch(function(data, status) {
                        console.log('error', data, status);
                        $scope.errorMessage = "error: " + data;
                    })
                    .finally(function () {
                        console.log('finally finished');
                    });
            }
        },
        templateUrl: '/templates/food.tpl.html'
    };

});
angular.module('marketplace').directive('triggerChange', function ($sniffer) {
    return {
        link : function(scope, elem, attrs) {
            elem.bind('click', function(){
                $(attrs.triggerChange).trigger($sniffer.hasEvent('input') ? 'input' : 'change');
            });
        },
        priority : 1
    };
});
angular.module('marketplace').directive('backImg', function () {
    return function(scope, element, attrs){
        attrs.$observe('backImg', function(value) {
            element.css({
                'background-image': 'url(' + value +')',
                'background-size' : 'cover'
            });
        });
    };
});
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
angular.module('marketplace').directive('loading', function() {
    return {
        templateUrl: '/templates/loading.tpl.html'
    };
});
angular.module('marketplace').directive('loadingSpin', function() {
    return {
        templateUrl: '/templates/loadingSpin.tpl.html'
    };
});
angular.module('marketplace').directive('login', function() {
      return {
            templateUrl: '/templates/login.tpl.html'
      };
});
angular.module('marketplace').directive('meal', function () {
    // return the directive definition object 
    return {
        scope: true,
        controller: function (Food, $scope, $routeParams) {
            $scope.addMain = addMain;
            $scope.add     = add;

            function addMain(parent, id) {
                var addFood = {
                    item_id: id,
                    parent_food_id: $routeParams.foodId,
                    main_item: true
                };
                Food.save(id, addFood, $scope.foods).then(function() {
                    angular.forEach($scope.meals, function(value, key) {
                        if (value.id == id) {
                            value.is_main_item = true;
                            value.added        = true;
                        }
                    });
                    angular.forEach($scope.foods, function(value, key) {
                        if (value.is_main_item === true) {
                            value.is_main_item = false;
                        }
                    });
                    $scope.foods.push({
                        id: id,
                        name: parent.name,
                        retailer: parent.retailer,
                        is_main_item: true
                    });
                }).catch(function(data, status) {
                    $scope.errorMessage = "error: " + data;
                })
                .finally(function () {
                    console.log('finally finished');
                });

            }

            function add(parent, id) {
                var addFood = {
                    item_id: id,
                    parent_food_id: $routeParams.foodId
                };
                Food.save(id, addFood, $scope.foods).then(function(res) {
                    angular.forEach($scope.meals, function(value, key) {
                        if (value.id == id) {
                            value.added = true;
                        }
                    });
                    $scope.foods.push({
                        id: id,
                        name: parent.name,
                        retailer: parent.retailer
                    });
                }).catch(function(data, status) {
                    $scope.errorMessage = "error: " + data;
                })
                .finally(function () {
                    console.log('finally finished');
                });
            }
        },
        templateUrl: '/templates/meal.tpl.html'
    };

});
angular.module('marketplace').directive('retailerMultipleselect', function() {
    return {
        restrict: 'E',
        templateUrl: '/templates/dirMultipleSelect.tpl.html',
        scope: {
            model: '=',
        }
    };
});
angular.module('marketplace').directive('order', function () {
    // return the directive definition object 
    return {
        scope: true,
        controller: function (Food, $scope, $routeParams, $filter) {
             $scope.orderItem       = orderItem;
             $scope.orderFood       = orderFood;
             
            function orderItem(predicate) {
                $scope.predicateMeal = predicate;
                $scope.reverseMeal   = ($scope.predicateMeal === predicate) ? !$scope.reverseMeal : false;
                $scope.meals         = orderBy($scope.meals, predicate, $scope.reverseMeal);
            }

            function orderFood(predicate) {
                $scope.predicate = predicate;
                $scope.reverse   = ($scope.predicate === predicate) ? !$scope.reverse : false;
                $scope.foods     = orderBy($scope.foods, predicate, $scope.reverse);
            }
        },
        templateUrl: '/templates/order.tpl.html'
    };

});

/**
 * dirPagination - AngularJS module for paginating (almost) anything.
 *
 *

 * Credits

 * =======

 *

 * Daniel Tabuenca: https://groups.google.com/d/msg/angular/an9QpzqIYiM/r8v-3W1X5vcJ

 * for the idea on how to dynamically invoke the ng-repeat directive.

 *

 * I borrowed a couple of lines and a few attribute names from the AngularUI Bootstrap project:

 * https://github.com/angular-ui/bootstrap/blob/master/src/pagination/pagination.js

 *

 * Copyright 2014 Michael Bromley <michael@michaelbromley.co.uk>

 */


(function() {
    /**
     * Config
     */
    var moduleName = 'angularUtils.directives.dirPagination';
    var DEFAULT_ID = '__default';

    /**
     * Module
     */
    var module;
    try {
        module = angular.module(moduleName);
    } catch(err) {
        // named module does not exist, so create one
        module = angular.module(moduleName, []);
    }

    module
        .directive('dirPaginate', ['$compile', '$parse', 'paginationService', dirPaginateDirective])
        .directive('dirPaginateNoCompile', noCompileDirective)
        .directive('dirPaginationControls', ['paginationService', 'paginationTemplate', dirPaginationControlsDirective])
        .filter('itemsPerPage', ['paginationService', itemsPerPageFilter])
        .service('paginationService', paginationService)
        .provider('paginationTemplate', paginationTemplateProvider);

    function dirPaginateDirective($compile, $parse, paginationService) {
        return  {
            terminal: true,
            multiElement: true,
            compile: dirPaginationCompileFn
        };

        function dirPaginationCompileFn(tElement, tAttrs){
            var expression = tAttrs.dirPaginate;

            // regex taken directly from https://github.com/angular/angular.js/blob/master/src/ng/directive/ngRepeat.js#L211
            var match = expression.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);
            var filterPattern = /\|\s*itemsPerPage\s*:[^|]*/;
            if (match[2].match(filterPattern) === null) {
                throw 'pagination directive: the \'itemsPerPage\' filter must be set.';
            }
            var itemsPerPageFilterRemoved = match[2].replace(filterPattern, '');
            var collectionGetter = $parse(itemsPerPageFilterRemoved);
            addNoCompileAttributes(tElement);
            // If any value is specified for paginationId, we register the un-evaluated expression at this stage for the benefit of any
            // dir-pagination-controls directives that may be looking for this ID.
            var rawId = tAttrs.paginationId || DEFAULT_ID;
            paginationService.registerInstance(rawId);
            return function dirPaginationLinkFn(scope, element, attrs){
                // Now that we have access to the `scope` we can interpolate any expression given in the paginationId attribute and
                // potentially register a new ID if it evaluates to a different value than the rawId.
                var paginationId = $parse(attrs.paginationId)(scope) || attrs.paginationId || DEFAULT_ID;
                paginationService.registerInstance(paginationId);
                var repeatExpression = getRepeatExpression(expression, paginationId);
                addNgRepeatToElement(element, attrs, repeatExpression);
                removeTemporaryAttributes(element);
                var compiled =  $compile(element);
                var currentPageGetter = makeCurrentPageGetterFn(scope, attrs, paginationId);
                paginationService.setCurrentPageParser(paginationId, currentPageGetter, scope);
                if (typeof attrs.totalItems !== 'undefined') {
                    paginationService.setAsyncModeTrue(paginationId);
                    scope.$watch(function() {
                        return $parse(attrs.totalItems)(scope);
                    }, function (result) {
                        if (0 <= result) {
                            paginationService.setCollectionLength(paginationId, result);
                        }
                    });
                } else {
                    scope.$watchCollection(function() {
                        return collectionGetter(scope);
                    }, function(collection) {
                        if (collection) {
                            paginationService.setCollectionLength(paginationId, collection.length);
                        }
                    });
                }
                // Delegate to the link function returned by the new compilation of the ng-repeat
                compiled(scope);
            };
        }
        /**
         * If a pagination id has been specified, we need to check that it is present as the second argument passed to
         * the itemsPerPage filter. If it is not there, we add it and return the modified expression.
         *
         * @param expression
         * @param paginationId
         * @returns {*}
         */
        function getRepeatExpression(expression, paginationId) {
            var repeatExpression,
                idDefinedInFilter = !!expression.match(/(\|\s*itemsPerPage\s*:[^|]*:[^|]*)/);
            if (paginationId !== DEFAULT_ID && !idDefinedInFilter) {
                repeatExpression = expression.replace(/(\|\s*itemsPerPage\s*:[^|]*)/, "$1 : '" + paginationId + "'");
            } else {
                repeatExpression = expression;
            }
            return repeatExpression;
        }
        /**
         * Adds the ng-repeat directive to the element. In the case of multi-element (-start, -end) it adds the
         * appropriate multi-element ng-repeat to the first and last element in the range.
         * @param element
         * @param attrs
         * @param repeatExpression
         */
        function addNgRepeatToElement(element, attrs, repeatExpression) {
            if (element[0].hasAttribute('dir-paginate-start') || element[0].hasAttribute('data-dir-paginate-start')) {
                // using multiElement mode (dir-paginate-start, dir-paginate-end)
                attrs.$set('ngRepeatStart', repeatExpression);
                element.eq(element.length - 1).attr('ng-repeat-end', true);
            } else {
                attrs.$set('ngRepeat', repeatExpression);
            }
        }

        /**
         * Adds the dir-paginate-no-compile directive to each element in the tElement range.
         * @param tElement
         */
        function addNoCompileAttributes(tElement) {
            angular.forEach(tElement, function(el) {
                if (el.nodeType === Node.ELEMENT_NODE) {
                    angular.element(el).attr('dir-paginate-no-compile', true);
                }
            });
        }

        /**
         * Removes the variations on dir-paginate (data-, -start, -end) and the dir-paginate-no-compile directives.
         * @param element
         */
        function removeTemporaryAttributes(element) {
            angular.forEach(element, function(el) {
                if (el.nodeType === Node.ELEMENT_NODE) {
                    angular.element(el).removeAttr('dir-paginate-no-compile');
                }
            });
            element.eq(0).removeAttr('dir-paginate-start').removeAttr('dir-paginate').removeAttr('data-dir-paginate-start').removeAttr('data-dir-paginate');
            element.eq(element.length - 1).removeAttr('dir-paginate-end').removeAttr('data-dir-paginate-end');
        }
        /**
         * Creates a getter function for the current-page attribute, using the expression provided or a default value if
         * no current-page expression was specified.
         *
         * @param scope
         * @param attrs
         * @param paginationId
         * @returns {*}
         */
        function makeCurrentPageGetterFn(scope, attrs, paginationId) {
            var currentPageGetter;
            if (attrs.currentPage) {
                currentPageGetter = $parse(attrs.currentPage);
            } else {
                // if the current-page attribute was not set, we'll make our own
                var defaultCurrentPage = paginationId + '__currentPage';
                scope[defaultCurrentPage] = 1;
                currentPageGetter = $parse(defaultCurrentPage);
            }
            return currentPageGetter;
        }
    }

    function noCompileDirective() {
        return {
            priority: 5000,
            terminal: true
        };
    }


    function dirPaginationControlsDirective(paginationService, paginationTemplate) {


        var numberRegex = /^\d+$/;


        return {

            restrict: 'AE',

            templateUrl: function(elem, attrs) {

                return attrs.templateUrl || paginationTemplate.getPath();

            },

            scope: {

                maxSize: '=?',

                onPageChange: '&?',

                paginationId: '=?'

            },

            link: dirPaginationControlsLinkFn

        };


        function dirPaginationControlsLinkFn(scope, element, attrs) {


            // rawId is the un-interpolated value of the pagination-id attribute. This is only important when the corresponding dir-paginate directive has

            // not yet been linked (e.g. if it is inside an ng-if block), and in that case it prevents this controls directive from assuming that there is

            // no corresponding dir-paginate directive and wrongly throwing an exception.

            var rawId = attrs.paginationId ||  DEFAULT_ID;

            var paginationId = scope.paginationId || attrs.paginationId ||  DEFAULT_ID;


            if (!paginationService.isRegistered(paginationId) && !paginationService.isRegistered(rawId)) {

                var idMessage = (paginationId !== DEFAULT_ID) ? ' (id: ' + paginationId + ') ' : ' ';

                throw 'pagination directive: the pagination controls' + idMessage + 'cannot be used without the corresponding pagination directive.';

            }


            if (!scope.maxSize) { scope.maxSize = 9; }

            scope.directionLinks = angular.isDefined(attrs.directionLinks) ? scope.$parent.$eval(attrs.directionLinks) : true;

            scope.boundaryLinks = angular.isDefined(attrs.boundaryLinks) ? scope.$parent.$eval(attrs.boundaryLinks) : false;


            var paginationRange = Math.max(scope.maxSize, 5);

            scope.pages = [];

            scope.pagination = {

                last: 1,

                current: 1

            };

            scope.range = {

                lower: 1,

                upper: 1,

                total: 1

            };


            scope.$watch(function() {

                return (paginationService.getCollectionLength(paginationId) + 1) * paginationService.getItemsPerPage(paginationId);

            }, function(length) {

                if (0 < length) {

                    generatePagination();

                }

            });


            scope.$watch(function() {

                return (paginationService.getItemsPerPage(paginationId));

            }, function(current, previous) {

                if (current != previous && typeof previous !== 'undefined') {

                    goToPage(scope.pagination.current);

                }

            });


            scope.$watch(function() {

                return paginationService.getCurrentPage(paginationId);

            }, function(currentPage, previousPage) {

                if (currentPage != previousPage) {

                    goToPage(currentPage);

                }

            });


            scope.setCurrent = function(num) {

                if (isValidPageNumber(num)) {

                    num = parseInt(num, 10);

                    paginationService.setCurrentPage(paginationId, num);

                }

            };


            function goToPage(num) {

                if (isValidPageNumber(num)) {

                    scope.pages = generatePagesArray(num, paginationService.getCollectionLength(paginationId), paginationService.getItemsPerPage(paginationId), paginationRange);

                    scope.pagination.current = num;

                    updateRangeValues();


                    // if a callback has been set, then call it with the page number as an argument

                    if (scope.onPageChange) {

                        scope.onPageChange({ newPageNumber : num });

                    }

                }

            }


            function generatePagination() {

                var page = parseInt(paginationService.getCurrentPage(paginationId)) || 1;


                scope.pages = generatePagesArray(page, paginationService.getCollectionLength(paginationId), paginationService.getItemsPerPage(paginationId), paginationRange);

                scope.pagination.current = page;

                scope.pagination.last = scope.pages[scope.pages.length - 1];

                if (scope.pagination.last < scope.pagination.current) {

                    scope.setCurrent(scope.pagination.last);

                } else {

                    updateRangeValues();

                }

            }


            /**

             * This function updates the values (lower, upper, total) of the `scope.range` object, which can be used in the pagination

             * template to display the current page range, e.g. "showing 21 - 40 of 144 results";

             */

            function updateRangeValues() {

                var currentPage = paginationService.getCurrentPage(paginationId),

                    itemsPerPage = paginationService.getItemsPerPage(paginationId),

                    totalItems = paginationService.getCollectionLength(paginationId);


                scope.range.lower = (currentPage - 1) * itemsPerPage + 1;

                scope.range.upper = Math.min(currentPage * itemsPerPage, totalItems);

                scope.range.total = totalItems;

            }


            function isValidPageNumber(num) {
                return (numberRegex.test(num) && (0 < num && num <= scope.pagination.last));
            }
        }


        /**
         * Generate an array of page numbers (or the '...' string) which is used in an ng-repeat to generate the
         * links used in pagination
         *
         * @param currentPage
         * @param rowsPerPage
         * @param paginationRange
         * @param collectionLength
         * @returns {Array}

         */

        function generatePagesArray(currentPage, collectionLength, rowsPerPage, paginationRange) {
            var pages = [];
            var totalPages = Math.ceil(collectionLength / rowsPerPage);
            var halfWay = Math.ceil(paginationRange / 2);
            var position;
            if (currentPage <= halfWay) {
                position = 'start';
            } else if (totalPages - halfWay < currentPage) {
                position = 'end';
            } else {
                position = 'middle';
            }

            var ellipsesNeeded = paginationRange < totalPages;
            var i = 1;
            while (i <= totalPages && i <= paginationRange) {
                var pageNumber = calculatePageNumber(i, currentPage, paginationRange, totalPages);
                var openingEllipsesNeeded = (i === 2 && (position === 'middle' || position === 'end'));
                var closingEllipsesNeeded = (i === paginationRange - 1 && (position === 'middle' || position === 'start'));
                if (ellipsesNeeded && (openingEllipsesNeeded || closingEllipsesNeeded)) {
                    pages.push('...');
                } else {
                    pages.push(pageNumber);
                }
                i ++;
            }
            return pages;
        }


        /**
         * Given the position in the sequence of pagination links [i], figure out what page number corresponds to that position.
         *

         * @param i

         * @param currentPage

         * @param paginationRange

         * @param totalPages

         * @returns {*}

         */

        function calculatePageNumber(i, currentPage, paginationRange, totalPages) {
            var halfWay = Math.ceil(paginationRange/2);
            if (i === paginationRange) {
                return totalPages;
            } else if (i === 1) {
                return i;
            } else if (paginationRange < totalPages) {
                if (totalPages - halfWay < currentPage) {
                    return totalPages - paginationRange + i;
                } else if (halfWay < currentPage) {
                    return currentPage - halfWay + i;
                } else {
                    return i;
                }
            } else {
                return i;
            }
        }
    }


    /**

     * This filter slices the collection into pages based on the current page number and number of items per page.

     * @param paginationService

     * @returns {Function}

     */

    function itemsPerPageFilter(paginationService) {
        return function(collection, itemsPerPage, paginationId) {
            if (typeof (paginationId) === 'undefined') {
                paginationId = DEFAULT_ID;
            }
            if (!paginationService.isRegistered(paginationId)) {
                throw 'pagination directive: the itemsPerPage id argument (id: ' + paginationId + ') does not match a registered pagination-id.';
            }
            var end;
            var start;
            if (collection instanceof Array) {
                itemsPerPage = parseInt(itemsPerPage) || 9999999999;
                if (paginationService.isAsyncMode(paginationId)) {
                    start = 0;
                } else {
                    start = (paginationService.getCurrentPage(paginationId) - 1) * itemsPerPage;
                }
                end = start + itemsPerPage;
                paginationService.setItemsPerPage(paginationId, itemsPerPage);
                return collection.slice(start, end);
            } else {
                return collection;
            }
        };
    }


    /**
     * This service allows the various parts of the module to communicate and stay in sync.
     */
    function paginationService() {
        var instances = {};
        var lastRegisteredInstance;
        this.registerInstance = function(instanceId) {
            if (typeof instances[instanceId] === 'undefined') {
                instances[instanceId] = {
                    asyncMode: false
                };
                lastRegisteredInstance = instanceId;
            }
        };


        this.isRegistered = function(instanceId) {

            return (typeof instances[instanceId] !== 'undefined');

        };


        this.getLastInstanceId = function() {

            return lastRegisteredInstance;

        };


        this.setCurrentPageParser = function(instanceId, val, scope) {

            instances[instanceId].currentPageParser = val;

            instances[instanceId].context = scope;

        };

        this.setCurrentPage = function(instanceId, val) {

            instances[instanceId].currentPageParser.assign(instances[instanceId].context, val);

        };

        this.getCurrentPage = function(instanceId) {

            var parser = instances[instanceId].currentPageParser;

            return parser ? parser(instances[instanceId].context) : 1;

        };


        this.setItemsPerPage = function(instanceId, val) {

            instances[instanceId].itemsPerPage = val;

        };

        this.getItemsPerPage = function(instanceId) {

            return instances[instanceId].itemsPerPage;

        };


        this.setCollectionLength = function(instanceId, val) {

            instances[instanceId].collectionLength = val;

        };

        this.getCollectionLength = function(instanceId) {

            return instances[instanceId].collectionLength;

        };


        this.setAsyncModeTrue = function(instanceId) {

            instances[instanceId].asyncMode = true;

        };


        this.isAsyncMode = function(instanceId) {

            return instances[instanceId].asyncMode;

        };

    }


    /**

     * This provider allows global configuration of the template path used by the dir-pagination-controls directive.

     */

    function paginationTemplateProvider() {
        var templatePath = '/templates/dirPagination.tpl.html';
        this.setPath = function(path) {
            templatePath = path;
        };

        this.$get = function() {
            return {
                getPath: function() {
                    return templatePath;
                }
            };
        };
    }
})();
angular.module('marketplace').directive('myParent', function () {
    return {
        restrict:'E',
        scope:{
            delete: '&',
            foods: '='
        },
        link:function (scope, element, attrs) {
            var $el = $(element);

            $el.hide().fadeIn('slow');

            $('.thumbnails').sortable({
                placeholder:"ui-state-highlight", forcePlaceholderSize:true
            });
        }
    };
});
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
angular.module('marketplace').directive('ngRetailer', function ($q, $http) {
    return {
        scope: {
            retailer: '=',
            id: '='
        },
        templateUrl: '/templates/retailer.tpl.html',
        link: function(scope, element, attrs) {
            
            scope.editMain = editMain;
            scope.text     = text;
            
            scope.querySearchAdd = querySearchAdd;

            function querySearchAdd(query) {
                var retailerName = null;
                switch (scope.id) {
                    case 2:
                    retailerName = 'safeway';
                    break;
                    case 6:
                    retailerName = 'peapod';
                    break;
                    case 8:
                    retailerName = 'walmart';
                    break;
                    case 9:
                    retailerName = 'freshdirect';
                    break;
                    case 207:
                    retailerName = 'instacart';
                    break;
                    case 209:
                    retailerName = 'shipt';
                    break;
                }
                var defer = $q.defer();
                $http.post('/api/items/' + retailerName, {
                    name: query
                })
                .success(function(res) {
                    scope.errorMessage = null;
                    defer.resolve(res.item);
                }).error(function(error) {
                    defer.reject(error);
                    if (error.displayName !== "RequestTimeout") {
                        scope.errorMessage = "error: " + "Please enter a shorter string in your searchbox!";
                    }
                });
                return defer.promise;
            }

            scope.editL = function(item, qty, retailerId) {
                console.log(item);
                console.log(qty);
                console.log(retailerId);
                console.log(scope.retailer);
                console.log(item);
                var editLink                       = {};
                editLink.id                        = scope.retailer.id;
                editLink.widget_item_ingredient_id = scope.retailer._id;
                editLink.retailer_id               = retailerId;
                editLink.item_id                   = item;
                if (qty) {
                    editLink.quantity = qty;
                }
                editLink.unit_id = null;
                $http.post('/api/items/editLink', editLink).success(function(res) {
                    swal('Linking!', 'The link has been edited', 'success');
                });
            };

            function editMain() {
                scope.input = true;
            }

            function text() {
                scope.input = false;
            }
        }
    };

});
angular.module('marketplace').directive('retailerSelect', function() {
    return {
        restrict: 'E',
        templateUrl: '/templates/dirSelect.tpl.html',
        scope: {
            model: '=',
        }
    };
});
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
;angular.module('marketplace').factory('Auth', Auth);

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
;angular.module('marketplace').factory('Delay', Delay);

Delay.$inject = ['$q', '$timeout'];

function Delay($q, $timeout) {

    var Delay = {
        start: start
    };

    return Delay;

    function start() {
        var deferred = $q.defer();
        $timeout(deferred.resolve, 100);
        return deferred.promise;
    }
}
;angular.module('marketplace').factory('Food', Food);

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
;angular.module('marketplace').factory('Recipe', Recipe);

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
;!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):e.Sweetalert2=t()}(this,function(){"use strict";function e(){if(void 0===arguments[0])return console.error("SweetAlert2 expects at least 1 attribute!"),!1;var e=c({},H);switch(typeof arguments[0]){case"string":e.title=arguments[0],e.text=arguments[1]||"",e.type=arguments[2]||"";break;case"object":c(e,arguments[0]),e.extraParams=arguments[0].extraParams,"email"===e.input&&null===e.inputValidator&&(e.inputValidator=function(e){return new Promise(function(t,n){var o=/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;o.test(e)?t():n("Invalid email address")})});break;default:return console.error('SweetAlert2: Unexpected type of argument! Expected "string" or "object", got '+typeof arguments[0]),!1}N(e);var o=f();return new Promise(function(r,a){function l(e,t){for(var n=0;n<V.length;n++)if(e+=t,e===V.length?e=0:-1===e&&(e=V.length-1),V[e].offsetWidth||V[e].offsetHeight||V[e].getClientRects().length)return void V[e].focus()}function c(n){var o=n||window.event,i=o.keyCode||o.which;if(-1!==[9,13,32,27].indexOf(i)){for(var r=o.target||o.srcElement,c=-1,s=0;s<V.length;s++)if(r===V[s]){c=s;break}9===i?(o.shiftKey?l(c,-1):l(c,1),T(o)):13===i||32===i?-1===c&&P(M,o):27===i&&e.allowEscapeKey===!0&&(t.closeModal(e.onClose),a("esc"))}}e.timer&&(o.timeout=setTimeout(function(){t.closeModal(e.onClose),a("timer")},e.timer));var u=function(){switch(e.input){case"select":return k(o,i.select);case"radio":return o.querySelector("."+i.radio+" input:checked")||o.querySelector("."+i.radio+" input:first-child");case"checkbox":return o.querySelector("#"+i.checkbox);case"textarea":return k(o,i.textarea);default:return k(o,i.input)}},p=function(){var t=u();switch(e.input){case"checkbox":return t.checked?1:0;case"radio":return t.checked?t.value:null;case"file":return t.files.length?t.files[0]:null;default:return e.inputAutoTrim?t.value.trim():t.value}};e.input&&setTimeout(function(){var e=u();e&&g(e)},0);var f,A=function(n){e.showLoaderOnConfirm&&t.showLoading(),e.preConfirm?e.preConfirm(n,e.extraParams).then(function(o){t.closeModal(e.onClose),r(o||n)},function(e){t.hideLoading(),e&&t.showValidationError(e)}):(t.closeModal(e.onClose),r(n))},L=function(n){var i=n||window.event,r=i.target||i.srcElement,l=v(),c=y(),u=l===r||l.contains(r),d=c===r||c.contains(r),f=b(o,"visible");switch(i.type){case"mouseover":case"mouseup":e.buttonsStyling&&(u?l.style.backgroundColor=s(e.confirmButtonColor,-.1):d&&(c.style.backgroundColor=s(e.cancelButtonColor,-.1)));break;case"mouseout":e.buttonsStyling&&(u?l.style.backgroundColor=e.confirmButtonColor:d&&(c.style.backgroundColor=e.cancelButtonColor));break;case"mousedown":e.buttonsStyling&&(u?l.style.backgroundColor=s(e.confirmButtonColor,-.2):d&&(c.style.backgroundColor=s(e.cancelButtonColor,-.2)));break;case"click":if(u&&f)if(e.input){var m=p();e.inputValidator?(t.disableInput(),e.inputValidator(m,e.extraParams).then(function(){t.enableInput(),A(m)},function(e){t.enableInput(),e&&t.showValidationError(e)})):A(m)}else A(!0);else d&&f&&(t.closeModal(e.onClose),a("cancel"))}},q=o.querySelectorAll("button");for(f=0;f<q.length;f++)q[f].onclick=L,q[f].onmouseover=L,q[f].onmouseout=L,q[f].onmousedown=L;h().onclick=function(){t.closeModal(e.onClose),a("close")},m().onclick=function(){e.allowOutsideClick&&(t.closeModal(e.onClose),a("overlay"))};var M=v(),O=y(),V=[M,O].concat(Array.prototype.slice.call(o.querySelectorAll("button:not([class^="+n+"]), input:not([type=hidden]), textarea, select")));e.reverseButtons&&M.parentNode.insertBefore(O,M),d.previousWindowKeyDown=window.onkeydown,window.onkeydown=c,e.buttonsStyling&&(M.style.borderLeftColor=e.confirmButtonColor,M.style.borderRightColor=e.confirmButtonColor),t.showLoading=t.enableLoading=function(){w(M,"loading"),w(o,"loading"),M.disabled=!0,O.disabled=!0},t.hideLoading=t.disableLoading=function(){C(M,"loading"),C(o,"loading"),M.disabled=!1,O.disabled=!1},t.enableButtons=function(){M.disabled=!1,O.disabled=!1},t.disableButtons=function(){M.disabled=!0,O.disabled=!0},t.enableConfirmButton=function(){M.disabled=!1},t.disableConfirmButton=function(){M.disabled=!0},t.enableInput=function(){var e=u();if("radio"===e.type)for(var t=e.parentNode.parentNode,n=t.querySelectorAll("input"),o=0;o<n.length;o++)n[o].disabled=!1;else e.disabled=!1},t.disableInput=function(){var e=u();if("radio"===e.type)for(var t=e.parentNode.parentNode,n=t.querySelectorAll("input"),o=0;o<n.length;o++)n[o].disabled=!0;else e.disabled=!0},t.showValidationError=function(e){var t=o.querySelector("."+i.validationerror);t.innerHTML=e,E(t);var n=u();g(n),w(n,"error")},t.resetValidationError=function(){var e=o.querySelector("."+i.validationerror);B(e);var t=u();t&&C(t,"error")},t.enableButtons(),t.hideLoading(),t.resetValidationError();var H,N=["input","select","radio","checkbox","textarea"];for(f=0;f<N.length;f++){var j=i[N[f]];for(H=k(o,j);H.attributes.length>0;)H.removeAttribute(H.attributes[0].name);for(var K in e.inputAttributes)H.setAttribute(K,e.inputAttributes[K]);H.className=j,e.inputClass&&w(H,e.inputClass),S(H)}var U;switch(e.input){case"text":case"email":case"password":case"file":H=k(o,i.input),H.value=e.inputValue,H.placeholder=e.inputPlaceholder,H.type=e.input,x(H);break;case"select":var W=k(o,i.select);if(W.innerHTML="",e.inputPlaceholder){var z=document.createElement("option");z.innerHTML=e.inputPlaceholder,z.value="",z.disabled=!0,z.selected=!0,W.appendChild(z)}U=function(t){for(var n in t){var o=document.createElement("option");o.value=n,o.innerHTML=t[n],e.inputValue===n&&(o.selected=!0),W.appendChild(o)}x(W),W.focus()};break;case"radio":var R=k(o,i.radio);R.innerHTML="",U=function(t){for(var n in t){var o=1,r=document.createElement("input"),a=document.createElement("label"),l=document.createElement("span");r.type="radio",r.name=i.radio,r.value=n,r.id=i.radio+"-"+o++,e.inputValue===n&&(r.checked=!0),l.innerHTML=t[n],a.appendChild(r),a.appendChild(l),a["for"]=r.id,R.appendChild(a)}x(R);var c=R.querySelectorAll("input");c.length&&c[0].focus()};break;case"checkbox":var Z=k(o,i.checkbox),$=o.querySelector("#"+i.checkbox);$.value=1,$.checked=Boolean(e.inputValue);var _=Z.getElementsByTagName("span");_.length&&Z.removeChild(_[0]),_=document.createElement("span"),_.innerHTML=e.inputPlaceholder,Z.appendChild(_),x(Z);break;case"textarea":var F=k(o,i.textarea);F.value=e.inputValue,F.placeholder=e.inputPlaceholder,x(F);break;case null:break;default:console.error('SweetAlert2: Unexpected type of input! Expected "text" or "email" or "password", "select", "checkbox", "textarea" or "file", got "'+e.input+'"')}"select"!==e.input&&"radio"!==e.input||(e.inputOptions instanceof Promise?(t.showLoading(),e.inputOptions.then(function(e){t.hideLoading(),U(e)})):"object"==typeof e.inputOptions?U(e.inputOptions):console.error("SweetAlert2: Unexpected type of inputOptions! Expected object or Promise, got "+typeof e.inputOptions)),I(),D(e.animation,e.onOpen),l(-1,1)})}function t(){var n=arguments,o=f();return null===o&&(t.init(),o=f()),b(o,"visible")&&V(),e.apply(this,n)}var n="swal2-",o=function(e){var t={};for(var o in e)t[e[o]]=n+e[o];return t},i=o(["container","modal","overlay","close","content","spacer","confirm","cancel","icon","image","input","select","radio","checkbox","textarea","validationerror"]),r=o(["success","warning","info","question","error"]),a={title:"",text:"",html:"",type:null,animation:!0,allowOutsideClick:!0,allowEscapeKey:!0,showConfirmButton:!0,showCancelButton:!1,preConfirm:null,confirmButtonText:"OK",confirmButtonColor:"#3085d6",confirmButtonClass:null,cancelButtonText:"Cancel",cancelButtonColor:"#aaa",cancelButtonClass:null,buttonsStyling:!0,reverseButtons:!1,showCloseButton:!1,showLoaderOnConfirm:!1,imageUrl:null,imageWidth:null,imageHeight:null,imageClass:null,timer:null,width:500,padding:20,background:"#fff",input:null,inputPlaceholder:"",inputValue:"",inputOptions:{},inputAutoTrim:!0,inputClass:null,inputAttributes:{},inputValidator:null,onOpen:null,onClose:null},l='<div class="'+i.overlay+'" tabIndex="-1"></div><div class="'+i.modal+'" style="display: none" tabIndex="-1"><div class="'+i.icon+" "+r.error+'"><span class="x-mark"><span class="line left"></span><span class="line right"></span></span></div><div class="'+i.icon+" "+r.question+'">?</div><div class="'+i.icon+" "+r.warning+'">!</div><div class="'+i.icon+" "+r.info+'">i</div><div class="'+i.icon+" "+r.success+'"><span class="line tip"></span> <span class="line long"></span><div class="placeholder"></div> <div class="fix"></div></div><img class="'+i.image+'"><h2></h2><div class="'+i.content+'"></div><input class="'+i.input+'"><select class="'+i.select+'"></select><div class="'+i.radio+'"></div><label for="'+i.checkbox+'" class="'+i.checkbox+'"><input type="checkbox" id="'+i.checkbox+'"></label><textarea class="'+i.textarea+'"></textarea><div class="'+i.validationerror+'"></div><hr class="'+i.spacer+'"><button class="'+i.confirm+'">OK</button><button class="'+i.cancel+'">Cancel</button><span class="'+i.close+'">&times;</span></div>',c=function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n]);return e},s=function(e,t){e=String(e).replace(/[^0-9a-f]/gi,""),e.length<6&&(e=e[0]+e[0]+e[1]+e[1]+e[2]+e[2]),t=t||0;for(var n="#",o=0;3>o;o++){var i=parseInt(e.substr(2*o,2),16);i=Math.round(Math.min(Math.max(0,i+i*t),255)).toString(16),n+=("00"+i).substr(i.length)}return n},u=n+"mediaquery",d={previousWindowKeyDown:null,previousActiveElement:null},p=function(e){return document.querySelector("."+e)},f=function(){return p(i.modal)},m=function(){return p(i.overlay)},v=function(){return p(i.confirm)},y=function(){return p(i.cancel)},h=function(){return p(i.close)},b=function(e,t){return e.classList.contains(t)},g=function(e){e.focus();var t=e.value;e.value="",e.value=t},w=function(e,t){if(e&&t){var n=t.split(/\s+/);n.forEach(function(t){e.classList.add(t)})}},C=function(e,t){if(e&&t){var n=t.split(/\s+/);n.forEach(function(t){e.classList.remove(t)})}},k=function(e,t){for(var n=0;n<e.childNodes.length;n++)if(b(e.childNodes[n],t))return e.childNodes[n]},x=function(e){e.style.opacity="",e.style.display="block"},E=function(e){if(e&&!e.length)return x(e);for(var t=0;t<e.length;++t)x(e[t])},S=function(e){e.style.opacity="",e.style.display="none"},B=function(e){if(e&&!e.length)return S(e);for(var t=0;t<e.length;++t)S(e[t])},A=function(e,t){e.style.removeProperty?e.style.removeProperty(t):e.style.removeAttribute(t)},L=function(e){var t=e.style.display;e.style.left="-9999px",e.style.display="block";var n=e.clientHeight;return e.style.left="",e.style.display=t,"-"+parseInt(n/2,10)+"px"},q=function(e,t){if(+e.style.opacity<1){t=t||16,e.style.opacity=0,e.style.display="block";var n=+new Date,o=function(){var i=+e.style.opacity+(new Date-n)/100;e.style.opacity=i>1?1:i,n=+new Date,+e.style.opacity<1&&setTimeout(o,t)};o()}},M=function(e,t){if(+e.style.opacity>0){t=t||16;var n=e.style.opacity,o=+new Date,i=function(){var r=new Date-o,a=+e.style.opacity-r/(100*n);e.style.opacity=a,o=+new Date,+e.style.opacity>0?setTimeout(i,t):S(e)};i()}},P=function(e){if("function"==typeof MouseEvent){var t=new MouseEvent("click",{view:window,bubbles:!1,cancelable:!0});e.dispatchEvent(t)}else if(document.createEvent){var n=document.createEvent("MouseEvents");n.initEvent("click",!1,!1),e.dispatchEvent(n)}else document.createEventObject?e.fireEvent("onclick"):"function"==typeof e.onclick&&e.onclick()},T=function(e){"function"==typeof e.stopPropagation?(e.stopPropagation(),e.preventDefault()):window.event&&window.event.hasOwnProperty("cancelBubble")&&(window.event.cancelBubble=!0)},O=function(){var e=document.createElement("div"),t={WebkitAnimation:"webkitAnimationEnd",MozAnimation:"animationend",OAnimation:"oAnimationEnd oanimationend",msAnimation:"MSAnimationEnd",animation:"animationend"};for(var n in t)if(t.hasOwnProperty(n)&&void 0!==e.style[n])return t[n];return!1}(),V=function(){var e=f();window.onkeydown=d.previousWindowKeyDown,d.previousActiveElement&&d.previousActiveElement.focus(),clearTimeout(e.timeout);var t=document.getElementsByTagName("head")[0],n=document.getElementById(u);n&&t.removeChild(n)},H=c({},a),N=function(e){var t=f();for(var n in e)a.hasOwnProperty(n)||"extraParams"===n||console.warn('SweetAlert2: Unknown parameter "'+n+'"');t.style.width=e.width+"px",t.style.padding=e.padding+"px",t.style.marginLeft=-e.width/2+"px",t.style.background=e.background;var o=document.getElementsByTagName("head")[0],l=document.createElement("style");l.type="text/css",l.id=u;var c=5,s=e.width+parseInt(e.width*(c/100)*2,10);l.innerHTML="@media screen and (max-width: "+s+"px) {."+i.modal+" {width: auto !important;left: "+c+"% !important;right: "+c+"% !important;margin-left: 0 !important;}}",o.appendChild(l);var d=t.querySelector("h2"),p=t.querySelector("."+i.content),m=v(),h=y(),b=t.querySelector("."+i.spacer),g=t.querySelector("."+i.close);if(d.innerHTML=e.title.split("\n").join("<br>"),e.text||e.html){if("object"==typeof e.html)if(p.innerHTML="",0 in e.html)for(var k=0;k in e.html;k++)p.appendChild(e.html[k]);else p.appendChild(e.html);else p.innerHTML=e.html||e.text.split("\n").join("<br>");E(p)}else B(p);if(e.showCloseButton?E(g):B(g),t.className=i.modal,e.customClass&&w(t,e.customClass),B(t.querySelectorAll("."+i.icon)),e.type){var x=!1;for(var S in r)if(e.type===S){x=!0;break}if(!x)return console.error("SweetAlert2: Unknown alert type: "+e.type),!1;var L=t.querySelector("."+i.icon+"."+r[e.type]);switch(E(L),e.type){case"success":w(L,"animate"),w(L.querySelector(".tip"),"animate-success-tip"),w(L.querySelector(".long"),"animate-success-long");break;case"error":w(L,"animate-error-icon"),w(L.querySelector(".x-mark"),"animate-x-mark");break;case"warning":w(L,"pulse-warning")}}var q=t.querySelector("."+i.image);e.imageUrl?(q.setAttribute("src",e.imageUrl),E(q),e.imageWidth?q.setAttribute("width",e.imageWidth):q.removeAttribute("width"),e.imageHeight?q.setAttribute("height",e.imageHeight):q.removeAttribute("height"),e.imageClass&&w(q,e.imageClass)):B(q),e.showCancelButton?h.style.display="inline-block":B(h),e.showConfirmButton?A(m,"display"):B(m),e.showConfirmButton||e.showCancelButton?E(b):B(b),m.innerHTML=e.confirmButtonText,h.innerHTML=e.cancelButtonText,e.buttonsStyling&&(m.style.backgroundColor=e.confirmButtonColor,h.style.backgroundColor=e.cancelButtonColor),m.className=i.confirm,w(m,e.confirmButtonClass),h.className=i.cancel,w(h,e.cancelButtonClass),e.buttonsStyling?(w(m,"styled"),w(h,"styled")):(C(m,"styled"),C(h,"styled"),m.style.backgroundColor=m.style.borderLeftColor=m.style.borderRightColor="",h.style.backgroundColor=h.style.borderLeftColor=h.style.borderRightColor=""),e.animation===!0?C(t,"no-animation"):w(t,"no-animation")},D=function(e,t){var n=f();e?(q(m(),10),w(n,"show-swal2"),C(n,"hide-swal2")):E(m()),E(n),d.previousActiveElement=document.activeElement,w(n,"visible"),null!==t&&"function"==typeof t&&t.call(this,n)},I=function(){var e=f();e.style.marginTop=L(e)};return t.queue=function(e){return new Promise(function(n,o){!function i(r,a){r<e.length?t(e[r]).then(function(){i(r+1,a)},function(e){o(e)}):n()}(0)})},t.close=t.closeModal=function(e){var t=f();C(t,"show-swal2"),w(t,"hide-swal2"),C(t,"visible");var n=t.querySelector("."+i.icon+"."+r.success);C(n,"animate"),C(n.querySelector(".tip"),"animate-success-tip"),C(n.querySelector(".long"),"animate-success-long");var o=t.querySelector("."+i.icon+"."+r.error);C(o,"animate-error-icon"),C(o.querySelector(".x-mark"),"animate-x-mark");var a=t.querySelector("."+i.icon+"."+r.warning);C(a,"pulse-warning"),V(),O&&!b(t,"no-animation")?t.addEventListener(O,function l(){t.removeEventListener(O,l),b(t,"hide-swal2")&&(S(t),M(m(),0))}):(S(t),S(m())),null!==e&&"function"==typeof e&&e.call(this,t)},t.clickConfirm=function(){v().click()},t.clickCancel=function(){y().click()},t.init=function(){if("undefined"==typeof document)return void console.log("SweetAlert2 requires document to initialize");if(!document.getElementsByClassName(i.container).length){var e=document.createElement("div");e.className=i.container,e.innerHTML=l,document.body.appendChild(e);var n=f(),o=k(n,i.input),r=k(n,i.select),a=n.querySelector("#"+i.checkbox),c=k(n,i.textarea);o.oninput=function(){t.resetValidationError()},o.onkeyup=function(e){e.stopPropagation(),13===e.keyCode&&t.clickConfirm()},r.onchange=function(){t.resetValidationError()},a.onchange=function(){t.resetValidationError()},c.oninput=function(){t.resetValidationError()},window.addEventListener("resize",I,!1)}},t.setDefaults=function(e){if(!e)throw new Error("userParams is required");if("object"!=typeof e)throw new Error("userParams has to be a object");c(H,e)},t.resetDefaults=function(){H=c({},a)},t.version="4.0.15",window.sweetAlert=window.swal=t,function(){"complete"===document.readyState||"interactive"===document.readyState&&document.body?t.init():document.addEventListener("DOMContentLoaded",function e(){document.removeEventListener("DOMContentLoaded",e,!1),t.init()},!1)}(),"function"==typeof Promise&&(Promise.prototype.done=function(){return this["catch"](function(){})}),t});
angular.module("ui.bootstrap",["ui.bootstrap.tpls","ui.bootstrap.transition","ui.bootstrap.collapse","ui.bootstrap.accordion","ui.bootstrap.alert","ui.bootstrap.buttons","ui.bootstrap.carousel","ui.bootstrap.datepicker","ui.bootstrap.dialog","ui.bootstrap.dropdownToggle","ui.bootstrap.modal","ui.bootstrap.pagination","ui.bootstrap.position","ui.bootstrap.tooltip","ui.bootstrap.popover","ui.bootstrap.progressbar","ui.bootstrap.rating","ui.bootstrap.tabs","ui.bootstrap.timepicker","ui.bootstrap.typeahead"]),angular.module("ui.bootstrap.tpls",["template/accordion/accordion-group.html","template/accordion/accordion.html","template/alert/alert.html","template/carousel/carousel.html","template/carousel/slide.html","template/datepicker/datepicker.html","template/dialog/message.html","template/pagination/pager.html","template/pagination/pagination.html","template/tooltip/tooltip-html-unsafe-popup.html","template/tooltip/tooltip-popup.html","template/popover/popover.html","template/progressbar/bar.html","template/progressbar/progress.html","template/rating/rating.html","template/tabs/tab.html","template/tabs/tabset.html","template/timepicker/timepicker.html","template/typeahead/typeahead.html"]),angular.module("ui.bootstrap.transition",[]).factory("$transition",["$q","$timeout","$rootScope",function(e,t,n){function a(e){for(var t in e)if(void 0!==i.style[t])return e[t]}var o=function(a,i,r){r=r||{};var l=e.defer(),s=o[r.animation?"animationEndEventName":"transitionEndEventName"],c=function(){n.$apply(function(){a.unbind(s,c),l.resolve(a)})};return s&&a.bind(s,c),t(function(){angular.isString(i)?a.addClass(i):angular.isFunction(i)?i(a):angular.isObject(i)&&a.css(i),s||l.resolve(a)}),l.promise.cancel=function(){s&&a.unbind(s,c),l.reject("Transition cancelled")},l.promise},i=document.createElement("trans"),r={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd",transition:"transitionend"},l={WebkitTransition:"webkitAnimationEnd",MozTransition:"animationend",OTransition:"oAnimationEnd",transition:"animationend"};return o.transitionEndEventName=a(r),o.animationEndEventName=a(l),o}]),angular.module("ui.bootstrap.collapse",["ui.bootstrap.transition"]).directive("collapse",["$transition",function(e){var t=function(e,t,n){t.removeClass("collapse"),t.css({height:n}),t[0].offsetWidth,t.addClass("collapse")};return{link:function(n,a,o){var i,r=!0;n.$watch(function(){return a[0].scrollHeight},function(){0!==a[0].scrollHeight&&(i||(r?t(n,a,a[0].scrollHeight+"px"):t(n,a,"auto")))}),n.$watch(o.collapse,function(e){e?u():c()});var l,s=function(t){return l&&l.cancel(),l=e(a,t),l.then(function(){l=void 0},function(){l=void 0}),l},c=function(){r?(r=!1,i||t(n,a,"auto")):s({height:a[0].scrollHeight+"px"}).then(function(){i||t(n,a,"auto")}),i=!1},u=function(){i=!0,r?(r=!1,t(n,a,0)):(t(n,a,a[0].scrollHeight+"px"),s({height:"0"}))}}}}]),angular.module("ui.bootstrap.accordion",["ui.bootstrap.collapse"]).constant("accordionConfig",{closeOthers:!0}).controller("AccordionController",["$scope","$attrs","accordionConfig",function(e,t,n){this.groups=[],this.closeOthers=function(a){var o=angular.isDefined(t.closeOthers)?e.$eval(t.closeOthers):n.closeOthers;o&&angular.forEach(this.groups,function(e){e!==a&&(e.isOpen=!1)})},this.addGroup=function(e){var t=this;this.groups.push(e),e.$on("$destroy",function(){t.removeGroup(e)})},this.removeGroup=function(e){var t=this.groups.indexOf(e);-1!==t&&this.groups.splice(this.groups.indexOf(e),1)}}]).directive("accordion",function(){return{restrict:"EA",controller:"AccordionController",transclude:!0,replace:!1,templateUrl:"template/accordion/accordion.html"}}).directive("accordionGroup",["$parse","$transition","$timeout",function(e){return{require:"^accordion",restrict:"EA",transclude:!0,replace:!0,templateUrl:"template/accordion/accordion-group.html",scope:{heading:"@"},controller:["$scope",function(){this.setHeading=function(e){this.heading=e}}],link:function(t,n,a,o){var i,r;o.addGroup(t),t.isOpen=!1,a.isOpen&&(i=e(a.isOpen),r=i.assign,t.$watch(function(){return i(t.$parent)},function(e){t.isOpen=e}),t.isOpen=i?i(t.$parent):!1),t.$watch("isOpen",function(e){e&&o.closeOthers(t),r&&r(t.$parent,e)})}}}]).directive("accordionHeading",function(){return{restrict:"EA",transclude:!0,template:"",replace:!0,require:"^accordionGroup",compile:function(e,t,n){return function(e,t,a,o){o.setHeading(n(e,function(){}))}}}}).directive("accordionTransclude",function(){return{require:"^accordionGroup",link:function(e,t,n,a){e.$watch(function(){return a[n.accordionTransclude]},function(e){e&&(t.html(""),t.append(e))})}}}),angular.module("ui.bootstrap.alert",[]).directive("alert",function(){return{restrict:"EA",templateUrl:"template/alert/alert.html",transclude:!0,replace:!0,scope:{type:"=",close:"&"},link:function(e,t,n){e.closeable="close"in n}}}),angular.module("ui.bootstrap.buttons",[]).constant("buttonConfig",{activeClass:"active",toggleEvent:"click"}).directive("btnRadio",["buttonConfig",function(e){var t=e.activeClass||"active",n=e.toggleEvent||"click";return{require:"ngModel",link:function(e,a,o,i){i.$render=function(){a.toggleClass(t,angular.equals(i.$modelValue,e.$eval(o.btnRadio)))},a.bind(n,function(){a.hasClass(t)||e.$apply(function(){i.$setViewValue(e.$eval(o.btnRadio)),i.$render()})})}}}]).directive("btnCheckbox",["buttonConfig",function(e){var t=e.activeClass||"active",n=e.toggleEvent||"click";return{require:"ngModel",link:function(e,a,o,i){var r=e.$eval(o.btnCheckboxTrue),l=e.$eval(o.btnCheckboxFalse);r=angular.isDefined(r)?r:!0,l=angular.isDefined(l)?l:!1,i.$render=function(){a.toggleClass(t,angular.equals(i.$modelValue,r))},a.bind(n,function(){e.$apply(function(){i.$setViewValue(a.hasClass(t)?l:r),i.$render()})})}}}]),angular.module("ui.bootstrap.carousel",["ui.bootstrap.transition"]).controller("CarouselController",["$scope","$timeout","$transition","$q",function(e,t,n){function a(){function n(){i?(e.next(),a()):e.pause()}o&&t.cancel(o);var r=+e.interval;!isNaN(r)&&r>=0&&(o=t(n,r))}var o,i,r=this,l=r.slides=[],s=-1;r.currentSlide=null,r.select=function(o,i){function c(){r.currentSlide&&angular.isString(i)&&!e.noTransition&&o.$element?(o.$element.addClass(i),o.$element[0].offsetWidth=o.$element[0].offsetWidth,angular.forEach(l,function(e){angular.extend(e,{direction:"",entering:!1,leaving:!1,active:!1})}),angular.extend(o,{direction:i,active:!0,entering:!0}),angular.extend(r.currentSlide||{},{direction:i,leaving:!0}),e.$currentTransition=n(o.$element,{}),function(t,n){e.$currentTransition.then(function(){u(t,n)},function(){u(t,n)})}(o,r.currentSlide)):u(o,r.currentSlide),r.currentSlide=o,s=p,a()}function u(t,n){angular.extend(t,{direction:"",active:!0,leaving:!1,entering:!1}),angular.extend(n||{},{direction:"",active:!1,leaving:!1,entering:!1}),e.$currentTransition=null}var p=l.indexOf(o);void 0===i&&(i=p>s?"next":"prev"),o&&o!==r.currentSlide&&(e.$currentTransition?(e.$currentTransition.cancel(),t(c)):c())},r.indexOfSlide=function(e){return l.indexOf(e)},e.next=function(){var t=(s+1)%l.length;return e.$currentTransition?void 0:r.select(l[t],"next")},e.prev=function(){var t=0>s-1?l.length-1:s-1;return e.$currentTransition?void 0:r.select(l[t],"prev")},e.select=function(e){r.select(e)},e.isActive=function(e){return r.currentSlide===e},e.slides=function(){return l},e.$watch("interval",a),e.play=function(){i||(i=!0,a())},e.pause=function(){e.noPause||(i=!1,o&&t.cancel(o))},r.addSlide=function(t,n){t.$element=n,l.push(t),1===l.length||t.active?(r.select(l[l.length-1]),1==l.length&&e.play()):t.active=!1},r.removeSlide=function(e){var t=l.indexOf(e);l.splice(t,1),l.length>0&&e.active?t>=l.length?r.select(l[t-1]):r.select(l[t]):s>t&&s--}}]).directive("carousel",[function(){return{restrict:"EA",transclude:!0,replace:!0,controller:"CarouselController",require:"carousel",templateUrl:"template/carousel/carousel.html",scope:{interval:"=",noTransition:"=",noPause:"="}}}]).directive("slide",["$parse",function(e){return{require:"^carousel",restrict:"EA",transclude:!0,replace:!0,templateUrl:"template/carousel/slide.html",scope:{},link:function(t,n,a,o){if(a.active){var i=e(a.active),r=i.assign,l=t.active=i(t.$parent);t.$watch(function(){var e=i(t.$parent);return e!==t.active&&(e!==l?l=t.active=e:r(t.$parent,e=l=t.active)),e})}o.addSlide(t,n),t.$on("$destroy",function(){o.removeSlide(t)}),t.$watch("active",function(e){e&&o.select(t)})}}}]),angular.module("ui.bootstrap.datepicker",[]).constant("datepickerConfig",{dayFormat:"dd",monthFormat:"MMMM",yearFormat:"yyyy",dayHeaderFormat:"EEE",dayTitleFormat:"MMMM yyyy",monthTitleFormat:"yyyy",showWeeks:!0,startingDay:0,yearRange:20}).directive("datepicker",["dateFilter","$parse","datepickerConfig",function(e,t,n){return{restrict:"EA",replace:!0,scope:{model:"=ngModel",dateDisabled:"&"},templateUrl:"template/datepicker/datepicker.html",link:function(a,o,r){function l(e,t,n){a.rows=e,a.labels=t,a.title=n}function s(){a.showWeekNumbers="day"===a.mode&&p}function c(e,t){return"year"===a.mode?t.getFullYear()-e.getFullYear():"month"===a.mode?new Date(t.getFullYear(),t.getMonth())-new Date(e.getFullYear(),e.getMonth()):"day"===a.mode?new Date(t.getFullYear(),t.getMonth(),t.getDate())-new Date(e.getFullYear(),e.getMonth(),e.getDate()):void 0}function u(e){return d&&c(e,d)>0||m&&0>c(e,m)||a.dateDisabled&&a.dateDisabled({date:e,mode:a.mode})}a.mode="day";var p,d,m,g=new Date,f={};f.day=angular.isDefined(r.dayFormat)?a.$eval(r.dayFormat):n.dayFormat,f.month=angular.isDefined(r.monthFormat)?a.$eval(r.monthFormat):n.monthFormat,f.year=angular.isDefined(r.yearFormat)?a.$eval(r.yearFormat):n.yearFormat,f.dayHeader=angular.isDefined(r.dayHeaderFormat)?a.$eval(r.dayHeaderFormat):n.dayHeaderFormat,f.dayTitle=angular.isDefined(r.dayTitleFormat)?a.$eval(r.dayTitleFormat):n.dayTitleFormat,f.monthTitle=angular.isDefined(r.monthTitleFormat)?a.$eval(r.monthTitleFormat):n.monthTitleFormat;var h=angular.isDefined(r.startingDay)?a.$eval(r.startingDay):n.startingDay,v=angular.isDefined(r.yearRange)?a.$eval(r.yearRange):n.yearRange;r.showWeeks?a.$parent.$watch(t(r.showWeeks),function(e){p=!!e,s()}):(p=n.showWeeks,s()),r.min&&a.$parent.$watch(t(r.min),function(e){d=new Date(e),w()}),r.max&&a.$parent.$watch(t(r.max),function(e){m=new Date(e),w()});var b=function(e,t){for(var n=[];e.length>0;)n.push(e.splice(0,t));return n},$=function(e,t){return new Date(e,t+1,0).getDate()},y={day:function(){function t(t,a,i){for(var r=0;a>r;r++)n.push({date:new Date(t),isCurrent:i,isSelected:k(t),label:e(t,f.day),disabled:u(t)}),t.setDate(t.getDate()+1);o=t}var n=[],a=[],o=null,r=new Date(g);r.setDate(1);var s=h-r.getDay(),c=s>0?7-s:-s;for(c>0&&(r.setDate(-c+1),t(r,c,!1)),t(o||r,$(g.getFullYear(),g.getMonth()),!0),t(o,(7-n.length%7)%7,!1),i=0;7>i;i++)a.push(e(n[i].date,f.dayHeader));l(b(n,7),a,e(g,f.dayTitle))},month:function(){for(var t=[],n=0,a=g.getFullYear();12>n;){var o=new Date(a,n++,1);t.push({date:o,isCurrent:!0,isSelected:k(o),label:e(o,f.month),disabled:u(o)})}l(b(t,3),[],e(g,f.monthTitle))},year:function(){for(var t=[],n=parseInt((g.getFullYear()-1)/v,10)*v+1,a=0;v>a;a++){var o=new Date(n+a,0,1);t.push({date:o,isCurrent:!0,isSelected:k(o),label:e(o,f.year),disabled:u(o)})}var i=t[0].label+" - "+t[t.length-1].label;l(b(t,5),[],i)}},w=function(){y[a.mode]()},k=function(e){if(a.model&&a.model.getFullYear()===e.getFullYear()){if("year"===a.mode)return!0;if(a.model.getMonth()===e.getMonth())return"month"===a.mode||"day"===a.mode&&a.model.getDate()===e.getDate()}return!1};a.$watch("model",function(e,t){angular.isDate(e)&&(g=angular.copy(e)),angular.equals(e,t)||w()}),a.$watch("mode",function(){s(),w()}),a.select=function(e){g=new Date(e),"year"===a.mode?(a.mode="month",g.setFullYear(e.getFullYear())):"month"===a.mode?(a.mode="day",g.setMonth(e.getMonth())):"day"===a.mode&&(a.model=new Date(g))},a.move=function(e){"day"===a.mode?g.setMonth(g.getMonth()+e):"month"===a.mode?g.setFullYear(g.getFullYear()+e):"year"===a.mode&&g.setFullYear(g.getFullYear()+e*v),w()},a.toggleMode=function(){a.mode="day"===a.mode?"month":"month"===a.mode?"year":"day"},a.getWeekNumber=function(e){if("day"===a.mode&&a.showWeekNumbers&&7===e.length){var t=h>4?11-h:4-h,n=new Date(e[t].date);return n.setHours(0,0,0),Math.ceil(((n-new Date(n.getFullYear(),0,1))/864e5+1)/7)}}}}}]);var dialogModule=angular.module("ui.bootstrap.dialog",["ui.bootstrap.transition"]);dialogModule.controller("MessageBoxController",["$scope","dialog","model",function(e,t,n){e.title=n.title,e.message=n.message,e.buttons=n.buttons,e.close=function(e){t.close(e)}}]),dialogModule.provider("$dialog",function(){var e={backdrop:!0,dialogClass:"modal",backdropClass:"modal-backdrop",transitionClass:"fade",triggerClass:"in",resolve:{},backdropFade:!1,dialogFade:!1,keyboard:!0,backdropClick:!0},t={},n={value:0};this.options=function(e){t=e},this.$get=["$http","$document","$compile","$rootScope","$controller","$templateCache","$q","$transition","$injector",function(a,o,i,r,l,s,c,u,p){function d(e){var t=angular.element("<div>");return t.addClass(e),t}function m(n){var a=this,o=this.options=angular.extend({},e,t,n);this._open=!1,this.backdropEl=d(o.backdropClass),o.backdropFade&&(this.backdropEl.addClass(o.transitionClass),this.backdropEl.removeClass(o.triggerClass)),this.modalEl=d(o.dialogClass),o.dialogFade&&(this.modalEl.addClass(o.transitionClass),this.modalEl.removeClass(o.triggerClass)),this.handledEscapeKey=function(e){27===e.which&&(a.close(),e.preventDefault(),a.$scope.$apply())},this.handleBackDropClick=function(e){a.close(),e.preventDefault(),a.$scope.$apply()},this.handleLocationChange=function(){a.close()}}var g=o.find("body");return m.prototype.isOpen=function(){return this._open},m.prototype.open=function(e,t){var n=this,a=this.options;if(e&&(a.templateUrl=e),t&&(a.controller=t),!a.template&&!a.templateUrl)throw Error("Dialog.open expected template or templateUrl, neither found. Use options or open method to specify them.");return this._loadResolves().then(function(e){var t=e.$scope=n.$scope=e.$scope?e.$scope:r.$new();if(n.modalEl.html(e.$template),n.options.controller){var a=l(n.options.controller,e);n.modalEl.children().data("ngControllerController",a)}i(n.modalEl)(t),n._addElementsToDom(),setTimeout(function(){n.options.dialogFade&&n.modalEl.addClass(n.options.triggerClass),n.options.backdropFade&&n.backdropEl.addClass(n.options.triggerClass)}),n._bindEvents()}),this.deferred=c.defer(),this.deferred.promise},m.prototype.close=function(e){function t(e){e.removeClass(a.options.triggerClass)}function n(){a._open&&a._onCloseComplete(e)}var a=this,o=this._getFadingElements();if(o.length>0)for(var i=o.length-1;i>=0;i--)u(o[i],t).then(n);else this._onCloseComplete(e)},m.prototype._getFadingElements=function(){var e=[];return this.options.dialogFade&&e.push(this.modalEl),this.options.backdropFade&&e.push(this.backdropEl),e},m.prototype._bindEvents=function(){this.options.keyboard&&g.bind("keydown",this.handledEscapeKey),this.options.backdrop&&this.options.backdropClick&&this.backdropEl.bind("click",this.handleBackDropClick)},m.prototype._unbindEvents=function(){this.options.keyboard&&g.unbind("keydown",this.handledEscapeKey),this.options.backdrop&&this.options.backdropClick&&this.backdropEl.unbind("click",this.handleBackDropClick)},m.prototype._onCloseComplete=function(e){this._removeElementsFromDom(),this._unbindEvents(),this.deferred.resolve(e)},m.prototype._addElementsToDom=function(){g.append(this.modalEl),this.options.backdrop&&(0===n.value&&g.append(this.backdropEl),n.value++),this._open=!0},m.prototype._removeElementsFromDom=function(){this.modalEl.remove(),this.options.backdrop&&(n.value--,0===n.value&&this.backdropEl.remove()),this._open=!1},m.prototype._loadResolves=function(){var e,t=[],n=[],o=this;return this.options.template?e=c.when(this.options.template):this.options.templateUrl&&(e=a.get(this.options.templateUrl,{cache:s}).then(function(e){return e.data})),angular.forEach(this.options.resolve||[],function(e,a){n.push(a),t.push(angular.isString(e)?p.get(e):p.invoke(e))}),n.push("$template"),t.push(e),c.all(t).then(function(e){var t={};return angular.forEach(e,function(e,a){t[n[a]]=e}),t.dialog=o,t})},{dialog:function(e){return new m(e)},messageBox:function(e,t,n){return new m({templateUrl:"template/dialog/message.html",controller:"MessageBoxController",resolve:{model:function(){return{title:e,message:t,buttons:n}}}})}}}]}),angular.module("ui.bootstrap.dropdownToggle",[]).directive("dropdownToggle",["$document","$location",function(e){var t=null,n=angular.noop;return{restrict:"CA",link:function(a,o){a.$watch("$location.path",function(){n()}),o.parent().bind("click",function(){n()}),o.bind("click",function(a){var i=o===t;a.preventDefault(),a.stopPropagation(),t&&n(),i||(o.parent().addClass("open"),t=o,n=function(a){a&&(a.preventDefault(),a.stopPropagation()),e.unbind("click",n),o.parent().removeClass("open"),n=angular.noop,t=null},e.bind("click",n))})}}}]),angular.module("ui.bootstrap.modal",["ui.bootstrap.dialog"]).directive("modal",["$parse","$dialog",function(e,t){return{restrict:"EA",terminal:!0,link:function(n,a,o){var i,r=angular.extend({},n.$eval(o.uiOptions||o.bsOptions||o.options)),l=o.modal||o.show;r=angular.extend(r,{template:a.html(),resolve:{$scope:function(){return n}}});var s=t.dialog(r);a.remove(),i=o.close?function(){e(o.close)(n)}:function(){angular.isFunction(e(l).assign)&&e(l).assign(n,!1)},n.$watch(l,function(e){e?s.open().then(function(){i()}):s.isOpen()&&s.close()})}}}]),angular.module("ui.bootstrap.pagination",[]).controller("PaginationController",["$scope",function(e){e.noPrevious=function(){return 1===e.currentPage},e.noNext=function(){return e.currentPage===e.numPages},e.isActive=function(t){return e.currentPage===t},e.selectPage=function(t){!e.isActive(t)&&t>0&&e.numPages>=t&&(e.currentPage=t,e.onSelectPage({page:t}))}}]).constant("paginationConfig",{boundaryLinks:!1,directionLinks:!0,firstText:"First",previousText:"Previous",nextText:"Next",lastText:"Last",rotate:!0}).directive("pagination",["paginationConfig",function(e){return{restrict:"EA",scope:{numPages:"=",currentPage:"=",maxSize:"=",onSelectPage:"&"},controller:"PaginationController",templateUrl:"template/pagination/pagination.html",replace:!0,link:function(t,n,a){function o(e,t,n,a){return{number:e,text:t,active:n,disabled:a}}var i=angular.isDefined(a.boundaryLinks)?t.$eval(a.boundaryLinks):e.boundaryLinks,r=angular.isDefined(a.directionLinks)?t.$eval(a.directionLinks):e.directionLinks,l=angular.isDefined(a.firstText)?t.$parent.$eval(a.firstText):e.firstText,s=angular.isDefined(a.previousText)?t.$parent.$eval(a.previousText):e.previousText,c=angular.isDefined(a.nextText)?t.$parent.$eval(a.nextText):e.nextText,u=angular.isDefined(a.lastText)?t.$parent.$eval(a.lastText):e.lastText,p=angular.isDefined(a.rotate)?t.$eval(a.rotate):e.rotate;t.$watch("numPages + currentPage + maxSize",function(){t.pages=[];var e=1,n=t.numPages,a=angular.isDefined(t.maxSize)&&t.maxSize<t.numPages;a&&(p?(e=Math.max(t.currentPage-Math.floor(t.maxSize/2),1),n=e+t.maxSize-1,n>t.numPages&&(n=t.numPages,e=n-t.maxSize+1)):(e=(Math.ceil(t.currentPage/t.maxSize)-1)*t.maxSize+1,n=Math.min(e+t.maxSize-1,t.numPages)));for(var d=e;n>=d;d++){var m=o(d,d,t.isActive(d),!1);t.pages.push(m)}if(a&&!p){if(e>1){var g=o(e-1,"...",!1,!1);t.pages.unshift(g)}if(t.numPages>n){var f=o(n+1,"...",!1,!1);t.pages.push(f)}}if(r){var h=o(t.currentPage-1,s,!1,t.noPrevious());t.pages.unshift(h);var v=o(t.currentPage+1,c,!1,t.noNext());t.pages.push(v)}if(i){var b=o(1,l,!1,t.noPrevious());t.pages.unshift(b);var $=o(t.numPages,u,!1,t.noNext());t.pages.push($)}t.currentPage>t.numPages&&t.selectPage(t.numPages)})}}}]).constant("pagerConfig",{previousText:"« Previous",nextText:"Next »",align:!0}).directive("pager",["pagerConfig",function(e){return{restrict:"EA",scope:{numPages:"=",currentPage:"=",onSelectPage:"&"},controller:"PaginationController",templateUrl:"template/pagination/pager.html",replace:!0,link:function(t,n,a){function o(e,t,n,a,o){return{number:e,text:t,disabled:n,previous:l&&a,next:l&&o}}var i=angular.isDefined(a.previousText)?t.$parent.$eval(a.previousText):e.previousText,r=angular.isDefined(a.nextText)?t.$parent.$eval(a.nextText):e.nextText,l=angular.isDefined(a.align)?t.$parent.$eval(a.align):e.align;t.$watch("numPages + currentPage",function(){t.pages=[];var e=o(t.currentPage-1,i,t.noPrevious(),!0,!1);t.pages.unshift(e);var n=o(t.currentPage+1,r,t.noNext(),!1,!0);t.pages.push(n),t.currentPage>t.numPages&&t.selectPage(t.numPages)})}}}]),angular.module("ui.bootstrap.position",[]).factory("$position",["$document","$window",function(e,t){function n(e,n){return e.currentStyle?e.currentStyle[n]:t.getComputedStyle?t.getComputedStyle(e)[n]:e.style[n]}function a(e){return"static"===(n(e,"position")||"static")}var o,i;e.bind("mousemove",function(e){o=e.pageX,i=e.pageY});var r=function(t){for(var n=e[0],o=t.offsetParent||n;o&&o!==n&&a(o);)o=o.offsetParent;return o||n};return{position:function(t){var n=this.offset(t),a={top:0,left:0},o=r(t[0]);return o!=e[0]&&(a=this.offset(angular.element(o)),a.top+=o.clientTop,a.left+=o.clientLeft),{width:t.prop("offsetWidth"),height:t.prop("offsetHeight"),top:n.top-a.top,left:n.left-a.left}},offset:function(n){var a=n[0].getBoundingClientRect();return{width:n.prop("offsetWidth"),height:n.prop("offsetHeight"),top:a.top+(t.pageYOffset||e[0].body.scrollTop),left:a.left+(t.pageXOffset||e[0].body.scrollLeft)}},mouse:function(){return{x:o,y:i}}}}]),angular.module("ui.bootstrap.tooltip",["ui.bootstrap.position"]).provider("$tooltip",function(){function e(e){var t=/[A-Z]/g,n="-";return e.replace(t,function(e,t){return(t?n:"")+e.toLowerCase()})}var t={placement:"top",animation:!0,popupDelay:0},n={mouseenter:"mouseleave",click:"click",focus:"blur"},a={};this.options=function(e){angular.extend(a,e)},this.setTriggers=function(e){angular.extend(n,e)},this.$get=["$window","$compile","$timeout","$parse","$document","$position","$interpolate",function(o,i,r,l,s,c,u){return function(o,p,d){function m(e){var t,a;return t=e||g.trigger||d,a=angular.isDefined(g.trigger)?n[g.trigger]||t:n[t]||t,{show:t,hide:a}}var g=angular.extend({},t,a),f=e(o),h=m(void 0),v=u.startSymbol(),b=u.endSymbol(),$="<"+f+"-popup "+'title="'+v+"tt_title"+b+'" '+'content="'+v+"tt_content"+b+'" '+'placement="'+v+"tt_placement"+b+'" '+'animation="tt_animation()" '+'is-open="tt_isOpen"'+">"+"</"+f+"-popup>";return{restrict:"EA",scope:!0,link:function(e,t,n){function a(){e.tt_isOpen?d():u()}function u(){e.tt_popupDelay?y=r(f,e.tt_popupDelay):e.$apply(f)}function d(){e.$apply(function(){v()})}function f(){var n,a,o,i;if(e.tt_content){switch(b&&r.cancel(b),k.css({top:0,left:0,display:"block"}),x?(w=w||s.find("body"),w.append(k)):t.after(k),n=g.appendToBody?c.offset(t):c.position(t),a=k.prop("offsetWidth"),o=k.prop("offsetHeight"),e.tt_placement){case"mouse":var l=c.mouse();i={top:l.y,left:l.x};break;case"right":i={top:n.top+n.height/2-o/2,left:n.left+n.width};break;case"bottom":i={top:n.top+n.height,left:n.left+n.width/2-a/2};break;case"left":i={top:n.top+n.height/2-o/2,left:n.left-a};break;default:i={top:n.top-o,left:n.left+n.width/2-a/2}}i.top+="px",i.left+="px",k.css(i),e.tt_isOpen=!0}}function v(){e.tt_isOpen=!1,r.cancel(y),angular.isDefined(e.tt_animation)&&e.tt_animation()?b=r(function(){k.remove()},500):k.remove()}var b,y,w,k=i($)(e),x=angular.isDefined(g.appendToBody)?g.appendToBody:!1;e.tt_isOpen=!1,n.$observe(o,function(t){e.tt_content=t}),n.$observe(p+"Title",function(t){e.tt_title=t}),n.$observe(p+"Placement",function(t){e.tt_placement=angular.isDefined(t)?t:g.placement}),n.$observe(p+"Animation",function(t){e.tt_animation=angular.isDefined(t)?l(t):function(){return g.animation}}),n.$observe(p+"PopupDelay",function(t){var n=parseInt(t,10);e.tt_popupDelay=isNaN(n)?g.popupDelay:n}),n.$observe(p+"Trigger",function(e){t.unbind(h.show),t.unbind(h.hide),h=m(e),h.show===h.hide?t.bind(h.show,a):(t.bind(h.show,u),t.bind(h.hide,d))}),n.$observe(p+"AppendToBody",function(t){x=angular.isDefined(t)?l(t)(e):x}),x&&e.$on("$locationChangeSuccess",function(){e.tt_isOpen&&v()}),e.$on("$destroy",function(){e.tt_isOpen?v():k.remove()})}}}}]}).directive("tooltipPopup",function(){return{restrict:"E",replace:!0,scope:{content:"@",placement:"@",animation:"&",isOpen:"&"},templateUrl:"template/tooltip/tooltip-popup.html"}}).directive("tooltip",["$tooltip",function(e){return e("tooltip","tooltip","mouseenter")}]).directive("tooltipHtmlUnsafePopup",function(){return{restrict:"E",replace:!0,scope:{content:"@",placement:"@",animation:"&",isOpen:"&"},templateUrl:"template/tooltip/tooltip-html-unsafe-popup.html"}}).directive("tooltipHtmlUnsafe",["$tooltip",function(e){return e("tooltipHtmlUnsafe","tooltip","mouseenter")}]),angular.module("ui.bootstrap.popover",["ui.bootstrap.tooltip"]).directive("popoverPopup",function(){return{restrict:"EA",replace:!0,scope:{title:"@",content:"@",placement:"@",animation:"&",isOpen:"&"},templateUrl:"template/popover/popover.html"}}).directive("popover",["$compile","$timeout","$parse","$window","$tooltip",function(e,t,n,a,o){return o("popover","popover","click")}]),angular.module("ui.bootstrap.progressbar",["ui.bootstrap.transition"]).constant("progressConfig",{animate:!0,autoType:!1,stackedTypes:["success","info","warning","danger"]}).controller("ProgressBarController",["$scope","$attrs","progressConfig",function(e,t,n){function a(e){return r[e]}var o=angular.isDefined(t.animate)?e.$eval(t.animate):n.animate,i=angular.isDefined(t.autoType)?e.$eval(t.autoType):n.autoType,r=angular.isDefined(t.stackedTypes)?e.$eval("["+t.stackedTypes+"]"):n.stackedTypes;this.makeBar=function(e,t,n){var r=angular.isObject(e)?e.value:e||0,l=angular.isObject(t)?t.value:t||0,s=angular.isObject(e)&&angular.isDefined(e.type)?e.type:i?a(n||0):null;return{from:l,to:r,type:s,animate:o}},this.addBar=function(t){e.bars.push(t),e.totalPercent+=t.to},this.clearBars=function(){e.bars=[],e.totalPercent=0},this.clearBars()}]).directive("progress",function(){return{restrict:"EA",replace:!0,controller:"ProgressBarController",scope:{value:"=percent",onFull:"&",onEmpty:"&"},templateUrl:"template/progressbar/progress.html",link:function(e,t,n,a){e.$watch("value",function(e,t){if(a.clearBars(),angular.isArray(e))for(var n=0,o=e.length;o>n;n++)a.addBar(a.makeBar(e[n],t[n],n));else a.addBar(a.makeBar(e,t))},!0),e.$watch("totalPercent",function(t){t>=100?e.onFull():0>=t&&e.onEmpty()},!0)}}}).directive("progressbar",["$transition",function(e){return{restrict:"EA",replace:!0,scope:{width:"=",old:"=",type:"=",animate:"="},templateUrl:"template/progressbar/bar.html",link:function(t,n){t.$watch("width",function(a){t.animate?(n.css("width",t.old+"%"),e(n,{width:a+"%"})):n.css("width",a+"%")})}}}]),angular.module("ui.bootstrap.rating",[]).constant("ratingConfig",{max:5}).directive("rating",["ratingConfig","$parse",function(e,t){return{restrict:"EA",scope:{value:"="},templateUrl:"template/rating/rating.html",replace:!0,link:function(n,a,o){var i=angular.isDefined(o.max)?n.$eval(o.max):e.max;n.range=[];for(var r=1;i>=r;r++)n.range.push(r);n.rate=function(e){n.readonly||(n.value=e)},n.enter=function(e){n.readonly||(n.val=e)},n.reset=function(){n.val=angular.copy(n.value)},n.reset(),n.$watch("value",function(e){n.val=e}),n.readonly=!1,o.readonly&&n.$parent.$watch(t(o.readonly),function(e){n.readonly=!!e})}}}]),angular.module("ui.bootstrap.tabs",[]).directive("tabs",function(){return function(){throw Error("The `tabs` directive is deprecated, please migrate to `tabset`. Instructions can be found at http://github.com/angular-ui/bootstrap/tree/master/CHANGELOG.md")}}).controller("TabsetController",["$scope","$element",function(e){var t=this,n=t.tabs=e.tabs=[];t.select=function(e){angular.forEach(n,function(e){e.active=!1}),e.active=!0},t.addTab=function(e){n.push(e),1==n.length&&t.select(e)},t.removeTab=function(e){var a=n.indexOf(e);if(e.active&&n.length>1){var o=a==n.length-1?a-1:a+1;t.select(n[o])}n.splice(a,1)}}]).directive("tabset",function(){return{restrict:"EA",transclude:!0,scope:{},controller:"TabsetController",templateUrl:"template/tabs/tabset.html",link:function(e,t,n){e.vertical=angular.isDefined(n.vertical)?e.$eval(n.vertical):!1,e.type=angular.isDefined(n.type)?e.$parent.$eval(n.type):"tabs"}}}).directive("tab",["$parse","$http","$templateCache","$compile",function(e){return{require:"^tabset",restrict:"EA",replace:!0,templateUrl:"template/tabs/tab.html",transclude:!0,scope:{heading:"@",onSelect:"&select"},controller:function(){},compile:function(t,n,a){return function(t,n,o,i){var r,l;t.active=!1,o.active?(r=e(o.active),l=r.assign,t.$parent.$watch(r,function(e){e&&t.disabled?l(t.$parent,!1):t.active=!!e})):l=r=angular.noop,t.$watch("active",function(e){l(t.$parent,e),e&&(i.select(t),t.onSelect())}),t.disabled=!1,o.disabled&&t.$parent.$watch(e(o.disabled),function(e){t.disabled=!!e}),t.select=function(){t.disabled||(t.active=!0)},i.addTab(t),t.$on("$destroy",function(){i.removeTab(t)}),t.active&&l(t.$parent,!0),a(t.$parent,function(e){var n,a=[];angular.forEach(e,function(e){e.tagName&&(e.hasAttribute("tab-heading")||e.hasAttribute("data-tab-heading")||"tab-heading"==e.tagName.toLowerCase()||"data-tab-heading"==e.tagName.toLowerCase())?n=e:a.push(e)}),n&&(t.headingElement=angular.element(n)),t.contentElement=angular.element(a)})}}}}]).directive("tabHeadingTransclude",[function(){return{restrict:"A",require:"^tab",link:function(e,t){e.$watch("headingElement",function(e){e&&(t.html(""),t.append(e))})}}}]).directive("tabContentTransclude",["$parse",function(e){return{restrict:"A",require:"^tabset",link:function(t,n,a){t.$watch(e(a.tabContentTransclude),function(e){n.html(""),e&&n.append(e.contentElement)})}}}]),angular.module("ui.bootstrap.timepicker",[]).filter("pad",function(){return function(e){return angular.isDefined(e)&&2>(""+e).length&&(e="0"+e),e}}).constant("timepickerConfig",{hourStep:1,minuteStep:1,showMeridian:!0,meridians:["AM","PM"],readonlyInput:!1,mousewheel:!0}).directive("timepicker",["padFilter","$parse","timepickerConfig",function(e,t,n){return{restrict:"EA",require:"ngModel",replace:!0,templateUrl:"template/timepicker/timepicker.html",scope:{model:"=ngModel"},link:function(a,o,i){function r(){var e=parseInt(a.hours,10),t=a.showMeridian?e>0&&13>e:e>=0&&24>e;return t?(a.showMeridian&&(12===e&&(e=0),a.meridian===u[1]&&(e+=12)),e):void 0}function l(){var t=c.getHours();a.showMeridian&&(t=0===t||12===t?12:t%12),a.hours="h"===b?t:e(t),a.validHours=!0;var n=c.getMinutes();a.minutes="m"===b?n:e(n),a.validMinutes=!0,a.meridian=a.showMeridian?12>c.getHours()?u[0]:u[1]:"",b=!1}function s(e){var t=new Date(c.getTime()+6e4*e);t.getDate()!==c.getDate()&&t.setDate(t.getDate()-1),c.setTime(t.getTime()),a.model=new Date(c)}var c=new Date,u=n.meridians,p=n.hourStep;i.hourStep&&a.$parent.$watch(t(i.hourStep),function(e){p=parseInt(e,10)});var d=n.minuteStep;i.minuteStep&&a.$parent.$watch(t(i.minuteStep),function(e){d=parseInt(e,10)}),a.showMeridian=n.showMeridian,i.showMeridian&&a.$parent.$watch(t(i.showMeridian),function(e){if(a.showMeridian=!!e,a.model)l();else{var t=new Date(c),n=r();angular.isDefined(n)&&t.setHours(n),a.model=new Date(t)}});var m=o.find("input"),g=m.eq(0),f=m.eq(1),h=angular.isDefined(i.mousewheel)?a.$eval(i.mousewheel):n.mousewheel;if(h){var v=function(e){return e.originalEvent&&(e=e.originalEvent),e.detail||e.wheelDelta>0};g.bind("mousewheel",function(e){a.$apply(v(e)?a.incrementHours():a.decrementHours()),e.preventDefault()}),f.bind("mousewheel",function(e){a.$apply(v(e)?a.incrementMinutes():a.decrementMinutes()),e.preventDefault()})}var b=!1;a.readonlyInput=angular.isDefined(i.readonlyInput)?a.$eval(i.readonlyInput):n.readonlyInput,a.readonlyInput?(a.updateHours=angular.noop,a.updateMinutes=angular.noop):(a.updateHours=function(){var e=r();angular.isDefined(e)?(b="h",null===a.model&&(a.model=new Date(c)),a.model.setHours(e)):(a.model=null,a.validHours=!1)},g.bind("blur",function(){a.validHours&&10>a.hours&&a.$apply(function(){a.hours=e(a.hours)
})}),a.updateMinutes=function(){var e=parseInt(a.minutes,10);e>=0&&60>e?(b="m",null===a.model&&(a.model=new Date(c)),a.model.setMinutes(e)):(a.model=null,a.validMinutes=!1)},f.bind("blur",function(){a.validMinutes&&10>a.minutes&&a.$apply(function(){a.minutes=e(a.minutes)})})),a.$watch(function(){return+a.model},function(e){!isNaN(e)&&e>0&&(c=new Date(e),l())}),a.incrementHours=function(){s(60*p)},a.decrementHours=function(){s(60*-p)},a.incrementMinutes=function(){s(d)},a.decrementMinutes=function(){s(-d)},a.toggleMeridian=function(){s(720*(12>c.getHours()?1:-1))}}}}]),angular.module("ui.bootstrap.typeahead",["ui.bootstrap.position"]).factory("typeaheadParser",["$parse",function(e){var t=/^\s*(.*?)(?:\s+as\s+(.*?))?\s+for\s+(?:([\$\w][\$\w\d]*))\s+in\s+(.*)$/;return{parse:function(n){var a=n.match(t);if(!a)throw Error("Expected typeahead specification in form of '_modelValue_ (as _label_)? for _item_ in _collection_' but got '"+n+"'.");return{itemName:a[3],source:e(a[4]),viewMapper:e(a[2]||a[1]),modelMapper:e(a[1])}}}}]).directive("typeahead",["$compile","$parse","$q","$timeout","$document","$position","typeaheadParser",function(e,t,n,a,o,i,r){var l=[9,13,27,38,40];return{require:"ngModel",link:function(s,c,u,p){var d,m=s.$eval(u.typeaheadMinLength)||1,g=s.$eval(u.typeaheadWaitMs)||0,f=r.parse(u.typeahead),h=s.$eval(u.typeaheadEditable)!==!1,v=t(u.typeaheadLoading).assign||angular.noop,b=t(u.typeaheadOnSelect),$=angular.element("<typeahead-popup></typeahead-popup>");$.attr({matches:"matches",active:"activeIdx",select:"select(activeIdx)",query:"query",position:"position"});var y=s.$new();s.$on("$destroy",function(){y.$destroy()});var w=function(){y.matches=[],y.activeIdx=-1},k=function(e){var t={$viewValue:e};v(s,!0),n.when(f.source(y,t)).then(function(n){if(e===p.$viewValue){if(n.length>0){y.activeIdx=0,y.matches.length=0;for(var a=0;n.length>a;a++)t[f.itemName]=n[a],y.matches.push({label:f.viewMapper(y,t),model:n[a]});y.query=e,y.position=i.position(c),y.position.top=y.position.top+c.prop("offsetHeight")}else w();v(s,!1)}},function(){w(),v(s,!1)})};w(),y.query=void 0,p.$parsers.push(function(e){var t;return w(),d?e:(e&&e.length>=m&&(g>0?(t&&a.cancel(t),t=a(function(){k(e)},g)):k(e)),h?e:void 0)}),p.$render=function(){var e={};e[f.itemName]=d||p.$viewValue,c.val(f.viewMapper(y,e)||p.$viewValue),d=void 0},y.select=function(e){var t,n,a={};a[f.itemName]=n=d=y.matches[e].model,t=f.modelMapper(y,a),p.$setViewValue(t),p.$render(),b(y,{$item:n,$model:t,$label:f.viewMapper(y,a)}),c[0].focus()},c.bind("keydown",function(e){0!==y.matches.length&&-1!==l.indexOf(e.which)&&(e.preventDefault(),40===e.which?(y.activeIdx=(y.activeIdx+1)%y.matches.length,y.$digest()):38===e.which?(y.activeIdx=(y.activeIdx?y.activeIdx:y.matches.length)-1,y.$digest()):13===e.which||9===e.which?y.$apply(function(){y.select(y.activeIdx)}):27===e.which&&(e.stopPropagation(),w(),y.$digest()))}),o.bind("click",function(){w(),y.$digest()}),c.after(e($)(y))}}}]).directive("typeaheadPopup",function(){return{restrict:"E",scope:{matches:"=",query:"=",active:"=",position:"=",select:"&"},replace:!0,templateUrl:"template/typeahead/typeahead.html",link:function(e){e.isOpen=function(){return e.matches.length>0},e.isActive=function(t){return e.active==t},e.selectActive=function(t){e.active=t},e.selectMatch=function(t){e.select({activeIdx:t})}}}}).filter("typeaheadHighlight",function(){function e(e){return e.replace(/([.?*+^$[\]\\(){}|-])/g,"\\$1")}return function(t,n){return n?t.replace(RegExp(e(n),"gi"),"<strong>$&</strong>"):n}}),angular.module("template/accordion/accordion-group.html",[]).run(["$templateCache",function(e){e.put("template/accordion/accordion-group.html",'<div class="accordion-group">\n  <div class="accordion-heading" ><a class="accordion-toggle" ng-click="isOpen = !isOpen" accordion-transclude="heading">{{heading}}</a></div>\n  <div class="accordion-body" collapse="!isOpen">\n    <div class="accordion-inner" ng-transclude></div>  </div>\n</div>')}]),angular.module("template/accordion/accordion.html",[]).run(["$templateCache",function(e){e.put("template/accordion/accordion.html",'<div class="accordion" ng-transclude></div>')}]),angular.module("template/alert/alert.html",[]).run(["$templateCache",function(e){e.put("template/alert/alert.html","<div class='alert' ng-class='type && \"alert-\" + type'>\n    <button ng-show='closeable' type='button' class='close' ng-click='close()'>&times;</button>\n    <div ng-transclude></div>\n</div>\n")}]),angular.module("template/carousel/carousel.html",[]).run(["$templateCache",function(e){e.put("template/carousel/carousel.html",'<div ng-mouseenter="pause()" ng-mouseleave="play()" class="carousel">\n    <ol class="carousel-indicators" ng-show="slides().length > 1">\n        <li ng-repeat="slide in slides()" ng-class="{active: isActive(slide)}" ng-click="select(slide)"></li>\n    </ol>\n    <div class="carousel-inner" ng-transclude></div>\n    <a ng-click="prev()" class="carousel-control left" ng-show="slides().length > 1">&lsaquo;</a>\n    <a ng-click="next()" class="carousel-control right" ng-show="slides().length > 1">&rsaquo;</a>\n</div>\n')}]),angular.module("template/carousel/slide.html",[]).run(["$templateCache",function(e){e.put("template/carousel/slide.html","<div ng-class=\"{\n    'active': leaving || (active && !entering),\n    'prev': (next || active) && direction=='prev',\n    'next': (next || active) && direction=='next',\n    'right': direction=='prev',\n    'left': direction=='next'\n  }\" class=\"item\" ng-transclude></div>\n")}]),angular.module("template/datepicker/datepicker.html",[]).run(["$templateCache",function(e){e.put("template/datepicker/datepicker.html",'<table class="well well-large">\n  <thead>\n    <tr class="text-center">\n      <th><button class="btn pull-left" ng-click="move(-1)"><i class="icon-chevron-left"></i></button></th>\n      <th colspan="{{rows[0].length - 2 + showWeekNumbers}}"><button class="btn btn-block" ng-click="toggleMode()"><strong>{{title}}</strong></button></th>\n      <th><button class="btn pull-right" ng-click="move(1)"><i class="icon-chevron-right"></i></button></th>\n    </tr>\n    <tr class="text-center" ng-show="labels.length > 0">\n      <th ng-show="showWeekNumbers">#</th>\n      <th ng-repeat="label in labels">{{label}}</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr ng-repeat="row in rows">\n      <td ng-show="showWeekNumbers" class="text-center"><em>{{ getWeekNumber(row) }}</em></td>\n      <td ng-repeat="dt in row" class="text-center">\n        <button style="width:100%;" class="btn" ng-class="{\'btn-info\': dt.isSelected}" ng-click="select(dt.date)" ng-disabled="dt.disabled"><span ng-class="{muted: ! dt.isCurrent}">{{dt.label}}</span></button>\n      </td>\n    </tr>\n  </tbody>\n</table>\n')}]),angular.module("template/dialog/message.html",[]).run(["$templateCache",function(e){e.put("template/dialog/message.html",'<div class="modal-header">\n	<h3>{{ title }}</h3>\n</div>\n<div class="modal-body">\n	<p>{{ message }}</p>\n</div>\n<div class="modal-footer">\n	<button ng-repeat="btn in buttons" ng-click="close(btn.result)" class="btn" ng-class="btn.cssClass">{{ btn.label }}</button>\n</div>\n')}]),angular.module("template/modal/backdrop.html",[]).run(["$templateCache",function(e){e.put("template/modal/backdrop.html",'<div class="modal-backdrop"></div>')}]),angular.module("template/modal/window.html",[]).run(["$templateCache",function(e){e.put("template/modal/window.html",'<div class="modal in" ng-transclude></div>')}]),angular.module("template/pagination/pager.html",[]).run(["$templateCache",function(e){e.put("template/pagination/pager.html",'<div class="pager">\n  <ul>\n    <li ng-repeat="page in pages" ng-class="{disabled: page.disabled, previous: page.previous, next: page.next}"><a ng-click="selectPage(page.number)">{{page.text}}</a></li>\n  </ul>\n</div>\n')}]),angular.module("template/pagination/pagination.html",[]).run(["$templateCache",function(e){e.put("template/pagination/pagination.html",'<div class="pagination"><ul>\n  <li ng-repeat="page in pages" ng-class="{active: page.active, disabled: page.disabled}"><a ng-click="selectPage(page.number)">{{page.text}}</a></li>\n  </ul>\n</div>\n')}]),angular.module("template/tooltip/tooltip-html-unsafe-popup.html",[]).run(["$templateCache",function(e){e.put("template/tooltip/tooltip-html-unsafe-popup.html",'<div class="tooltip {{placement}}" ng-class="{ in: isOpen(), fade: animation() }">\n  <div class="tooltip-arrow"></div>\n  <div class="tooltip-inner" ng-bind-html-unsafe="content"></div>\n</div>\n')}]),angular.module("template/tooltip/tooltip-popup.html",[]).run(["$templateCache",function(e){e.put("template/tooltip/tooltip-popup.html",'<div class="tooltip {{placement}}" ng-class="{ in: isOpen(), fade: animation() }">\n  <div class="tooltip-arrow"></div>\n  <div class="tooltip-inner" ng-bind="content"></div>\n</div>\n')}]),angular.module("template/popover/popover.html",[]).run(["$templateCache",function(e){e.put("template/popover/popover.html",'<div class="popover {{placement}}" ng-class="{ in: isOpen(), fade: animation() }">\n  <div class="arrow"></div>\n\n  <div class="popover-inner">\n      <h3 class="popover-title" ng-bind="title" ng-show="title"></h3>\n      <div class="popover-content" ng-bind="content"></div>\n  </div>\n</div>\n')}]),angular.module("template/progressbar/bar.html",[]).run(["$templateCache",function(e){e.put("template/progressbar/bar.html",'<div class="bar" ng-class=\'type && "bar-" + type\'></div>')}]),angular.module("template/progressbar/progress.html",[]).run(["$templateCache",function(e){e.put("template/progressbar/progress.html",'<div class="progress"><progressbar ng-repeat="bar in bars" width="bar.to" old="bar.from" animate="bar.animate" type="bar.type"></progressbar></div>')}]),angular.module("template/rating/rating.html",[]).run(["$templateCache",function(e){e.put("template/rating/rating.html",'<span ng-mouseleave="reset()">\n	<i ng-repeat="number in range" ng-mouseenter="enter(number)" ng-click="rate(number)" ng-class="{\'icon-star\': number <= val, \'icon-star-empty\': number > val}"></i>\n</span>\n')}]),angular.module("template/tabs/pane.html",[]).run(["$templateCache",function(e){e.put("template/tabs/pane.html",'<div class="tab-pane" ng-class="{active: selected}" ng-show="selected" ng-transclude></div>\n')}]),angular.module("template/tabs/tab.html",[]).run(["$templateCache",function(e){e.put("template/tabs/tab.html",'<li ng-class="{active: active, disabled: disabled}">\n  <a ng-click="select()" tab-heading-transclude>{{heading}}</a>\n</li>\n')}]),angular.module("template/tabs/tabs.html",[]).run(["$templateCache",function(e){e.put("template/tabs/tabs.html",'<div class="tabbable">\n  <ul class="nav nav-tabs">\n    <li ng-repeat="pane in panes" ng-class="{active:pane.selected}">\n      <a ng-click="select(pane)">{{pane.heading}}</a>\n    </li>\n  </ul>\n  <div class="tab-content" ng-transclude></div>\n</div>\n')}]),angular.module("template/tabs/tabset.html",[]).run(["$templateCache",function(e){e.put("template/tabs/tabset.html",'\n<div class="tabbable">\n  <ul class="nav {{type && \'nav-\' + type}}" ng-class="{\'nav-stacked\': vertical}" ng-transclude>\n  </ul>\n  <div class="tab-content">\n    <div class="tab-pane" \n         ng-repeat="tab in tabs" \n         ng-class="{active: tab.active}"\n         tab-content-transclude="tab" tt="tab">\n    </div>\n  </div>\n</div>\n')}]),angular.module("template/timepicker/timepicker.html",[]).run(["$templateCache",function(e){e.put("template/timepicker/timepicker.html",'<table class="form-inline">\n	<tr class="text-center">\n		<td><a ng-click="incrementHours()" class="btn btn-link"><i class="icon-chevron-up"></i></a></td>\n		<td>&nbsp;</td>\n		<td><a ng-click="incrementMinutes()" class="btn btn-link"><i class="icon-chevron-up"></i></a></td>\n		<td ng-show="showMeridian"></td>\n	</tr>\n	<tr>\n		<td class="control-group" ng-class="{\'error\': !validHours}"><input type="text" ng-model="hours" ng-change="updateHours()" class="span1 text-center" ng-mousewheel="incrementHours()" ng-readonly="readonlyInput" maxlength="2" /></td>\n		<td>:</td>\n		<td class="control-group" ng-class="{\'error\': !validMinutes}"><input type="text" ng-model="minutes" ng-change="updateMinutes()" class="span1 text-center" ng-readonly="readonlyInput" maxlength="2"></td>\n		<td ng-show="showMeridian"><button ng-click="toggleMeridian()" class="btn text-center">{{meridian}}</button></td>\n	</tr>\n	<tr class="text-center">\n		<td><a ng-click="decrementHours()" class="btn btn-link"><i class="icon-chevron-down"></i></a></td>\n		<td>&nbsp;</td>\n		<td><a ng-click="decrementMinutes()" class="btn btn-link"><i class="icon-chevron-down"></i></a></td>\n		<td ng-show="showMeridian"></td>\n	</tr>\n</table>')}]),angular.module("template/typeahead/typeahead.html",[]).run(["$templateCache",function(e){e.put("template/typeahead/typeahead.html",'<ul class="typeahead dropdown-menu" ng-style="{display: isOpen()&&\'block\' || \'none\', top: position.top+\'px\', left: position.left+\'px\'}">\n    <li ng-repeat="match in matches" ng-class="{active: isActive($index) }" ng-mouseenter="selectActive($index)">\n        <a tabindex="-1" ng-click="selectMatch($index)" ng-bind-html-unsafe="match.label | typeaheadHighlight:query"></a>\n    </li>\n</ul>')}]);

//# sourceMappingURL=app.js.map