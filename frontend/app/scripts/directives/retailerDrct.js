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