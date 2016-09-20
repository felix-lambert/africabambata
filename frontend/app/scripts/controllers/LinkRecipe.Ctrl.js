angular.module('marketplace').controller('LinkRecipeAngCtrl', LinkRecipeAngCtrl);

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