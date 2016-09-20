angular.module('marketplace').controller('BasketAngCtrl', BasketAngCtrl);

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