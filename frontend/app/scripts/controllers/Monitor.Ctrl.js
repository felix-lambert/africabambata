angular.module('marketplace').controller('MonitorAngCtrl', MonitorAngCtrl);

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