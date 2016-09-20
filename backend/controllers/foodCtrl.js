var request       = require('request');
var async         = require('async');
var sendToAngular = require('../sendToAngular');
var pool          = require("../models/sqlConnexion.js");
var mysql         = require("mysql");
var logger        = require("../../utils/logger");
var _             = require('underscore');
var moment        = require('moment');
var ES            = require("../models/ESModel");
var utils         = require("../../utils/");
var apikey        = '3TbLhwULPeGVgyxqv2GsHEvRk4GRf7';

module.exports = {
    foods: foods,
    add: add,
    remove: remove,
    edit: edit,
    search: search,
    retailerList: retailerList,
    ingredientRecipe: ingredientRecipe,
    ingredient: ingredient,
    isLinked: isLinked,
    allLinked: allLinked,
    findName: findName,
    editMain: editMain
};
if (process.env.NODE_ENV === 'prod') {
    var ingredient       = 'ingredient_prod';
    var recipeIngredient = 'recipe_ingredient_prod';
    var safeway          = 'safeway_prod';
    var peapod           = 'peapod_prod';
    var freshdirect      = 'freshdirect_prod';
    var shipt            = 'shipt_prod';
    var instacart        = 'instacart_prod';
    var walmart          = 'walmart_prod';
} else if (process.env.NODE_ENV === 'preprod') {
    var safeway          = 'safeway_pre';
    var peapod           = 'peapod_pre';
    var freshdirect      = 'freshdirect_pre';
    var shipt            = 'shipt_pre';
    var instacart        = 'instacart_pre';
    var walmart          = 'walmart_pre';
    var ingredient       = 'ingredient_pre';
    var recipeIngredient = 'recipe_ingredient_pre';
} else {
    var safeway          = 'safeway';
    var peapod           = 'peapod';
    var freshdirect      = 'freshdirect';
    var shipt            = 'shipt';
    var instacart        = 'instacart';
    var walmart          = 'walmart';
    var ingredient       = 'ingredient';
    var recipeIngredient = 'recipe_ingredient';
}

function getRetailerName(retailer_id) {
    switch (retailer_id) {
        case 2:
            return 'safeway';
        case 6:
            return 'peapod';
        case 8:
            return 'walmart';
        case 9:
            return 'fresh_direct';
        case 207:
            return 'instacart';
        case 209:
            return 'shipt';
    }
}

function editMain(req, res, next) {
    logger.debug('edit main');

    function updateItemParentFoodMainItem0(callbackMainItem0) {
        client.query('UPDATE item_parent_food SET is_main_item=0 WHERE parent_food_id= ' + mysql.escape(req.body.parent_food_id) + ';', function(error, rows, fields) {
            callbackMainItem0(error);
        });
    }

    function updateItemParentFoodMainItem1(callbackMainItem1) {
        client.query('UPDATE item_parent_food SET is_main_item=1 WHERE item_id= ' + mysql.escape(req.body.item_id) + ';', function(err, rows, fields) {
            callbackMainItem1(err);
        });
    }

    pool.acquire(function(err, client) {
        if (err) {
            return next({
                status: 400,
                message: err
            });
        } else {
            async.parallel([updateItemParentFoodMainItem0, updateItemParentFoodMainItem1], function(err) {
                if (err) {
                    return next({
                        status: 400,
                        message: err
                    });
                } else {
                    pool.release(client);
                    return res.status(200).json(null);
                }
            });
        }
    });
}
/**
 * @api {get} /api/retailer/list Get all the retailers
 * @apiName Retailer list
 * @apiGroup Retailers
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          { success: true,
 *            retailers:
 *             [ { id: 9, name: 'FreshDirect' },
 *               { id: 207, name: 'Instacart' },
 *               { id: 6, name: 'Peapod' },
 *               { id: 2, name: 'Safeway' },
 *               { id: 209, name: 'Shipt' },
 *               { id: 8, name: 'Walmart' } ],
 *            user_groups: [ 'admin', 'widget' ],
 *            is_logged_in: true }
 *      }
 *
 * @apiErrorExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "success": false,
 *          "message": "One or more parameter is missing.",
 *          "user_groups": ["admin", "customer"],
 *          "is_logged_in": true
 *      }
 *
 */
function retailerList(req, res, next) {
    logger.debug("retailer list");
    request({
        url: process.env.API_ROOT + '/api/retailer/list',
        method: "POST",
        headers: {
            "content-type": "application/x-www-form-urlencoded"
        },
        form: {token: req.user.token, apikey: apikey}
    }, function(nothing, result, body) {
        sendToAngular.send(result, body, function(err, results) {
            if (err) {
                return next(err);
            } else {
                logger.info(results);
                return res.status(200).json(results);
            }
        });
    });
}
/**
 * @api {post} /api/parentfood/list Get parent food with associate items
 * @apiName Parent food list
 * @apiGroup Parent food
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "success": true,
 *          "parent_food": "parent_foods":[{"id":"353","name":"Acai"},{"id":"368","name":"Acorn Squash"},{"id":"527","name":"almond milk"},{"id":"284","name":"Almond pecan crunch"},{"id":"501","name":"almond yogurt"},{"id":"404","name":"Almonds"},{"id":"336","name":"Apple"},{"id":"423","name":"Apple Sauce"},{"id":"469","name":"Apples"},{"id":"263","name":"Apples Breaburn"},{"id":"262","name":"Apples Honeycrisp"},{"id":"257","name":"Apricot 5 Grain Oats Yogurt"}],
 *          "user_groups": ["admin", "customer"],
 *          "is_logged_in": true
 *      }
 *
 * @apiErrorExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "success": false,
 *          "message": "One or more parameter is missing.",
 *          "user_groups": ["admin", "customer"],
 *          "is_logged_in": true
 *      }
 *
 */
function foods(req, res, next) {
    logger.debug('foods');
    request({
        url: process.env.API_ROOT + '/api/parentfood/list',
        method: "POST",
        headers: {
            'Accept': '/',
            "content-type": "application/x-www-form-urlencoded",
        },
        form: {token: req.user.token, apikey: apikey}
    }, function(nothing, result, body) {
        sendToAngular.send(result, body, function(err, results) {
            if (err) {
                return next(err);
            } else {
                return res.status(200).json(results);
            }
        });
    });
}
/**
 * @api {post} /api/parentfood/addItem Add item
 * @apiName Add item
 * @apiGroup Parent food
 * @apiParam {Id} item_id Id of item.
 * @apiParam {Id} parent_food_id Id of parent food.
 * @apiParam {Boolean} main_item Default to false (facultative)
 *
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "success": true,
 *          "user_groups": ["admin", "customer"],
 *          "is_logged_in": true
 *      }
 *
 * @apiErrorExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "success": false,
 *          "message": "Already added to a parent food.",
 *          "user_groups": ["admin", "customer"],
 *          "is_logged_in": true
 *      }
 *
 */
function add(req, res, next) {
    logger.debug('add item');
    req.body.token  = req.user.token;
    req.body.apikey = apikey;
    request({
        url: process.env.API_ROOT + '/api/parentfood/addItem',
        method: "POST",
        headers: {
            'Accept': '/',
            "content-type": "application/x-www-form-urlencoded",
        },
        form: req.body
    }, function(nothing, result, body) {
        sendToAngular.send(result, body, function(err, results) {
            if (err) {
                return next(err);
            } else {
                return res.status(200).json(results);
            }
        });
    });
}
/**
 * @api {post} /api/parentfood/removeItem Remove item
 * @apiName Remove item
 * @apiGroup Parent food
 * @apiParam {Id} item_id Id of item.
 * @apiParam {Id} parent_food_id Id of parent food.
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "success": true,
 *          "user_groups": ["admin", "customer"],
 *          "is_logged_in": true
 *      }
 *
 * @apiErrorExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "success": false,
 *          "message": "One or more parameter is missing.",
 *          "user_groups": ["admin", "customer"],
 *          "is_logged_in": true
 *      }
 *
 *  @apiErrorExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "success": false,
 *          "message": "Error while removing item from parent food.",
 *          "user_groups": ["admin", "customer"],
 *          "is_logged_in": true
 *      }
 *
 */
function remove(req, res, next) {
    logger.debug('remove item');
    req.body.token  = req.user.token;
    req.body.apikey = apikey;
    request({
        url: process.env.API_ROOT + '/api/parentfood/removeItem',
        method: "POST",
        headers: {
            'Accept': '/',
            "content-type": "application/x-www-form-urlencoded",
        },
        form: req.body
    }, function(nothing, result, body) {
        sendToAngular.send(result, body, function(err, results) {
            if (err) {
                return next(err);
            } else {
                logger.info(results);
                return res.status(200).json(results);
            }
        });
    });
}
/**
 * @api {get} /api/parentfood/get Parent food list
 * @apiName Parent food list
 * @apiGroup Parent food
 * @apiParam {Id} id Id of parent food.
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "success": true,
 *          "parent_food": {"id":"245","name":"Lentils"},
 *          "items": [{"id":"165208","name":"Goya Kidney Beans Red Dry","is_main_item":true},{"id":"174826","name":"Signature Kitchens Kidney Beans Red - 16 Oz","is_main_item":false}],
 *          "user_groups": ["admin", "customer"],
 *          "is_logged_in": true
 *      }
 *
 * @apiErrorExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "success": false,
 *          "message": "One or more parameter is missing.",
 *          "user_groups": ["admin", "customer"],
 *          "is_logged_in": true
 *      }
 *
 */
function edit(req, res, next) {
    logger.debug('get parentfood');
    var id = {
        id: req.params.id,
        token: req.user.token,
        apikey: apikey
    };
    request({
        url: process.env.API_ROOT + '/api/parentfood/get',
        method: "POST",
        headers: {
            'Accept': '/',
            "content-type": "application/x-www-form-urlencoded",
        },
        form: id
    }, function(nothing, result, body) {
        sendToAngular.send(result, body, function(err, results) {
            if (err) {
                return next(err);
            } else {
                logger.info(results);
                return res.status(200).json(results);
            }
        });
    });
}
/**
 * @api {post} /api/item/search Search for items with retailers
 * @apiName Search for items
 * @apiGroup Items
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "success": true,
 *          "items":[{"id":"85839","name":"Sugar Snap Peas","retailer":"freshdirect"},{"id":"89125","name":"Sugar in the Raw Granulated Sugar","retailer":"freshdirect"}],
 *          "user_groups": ["admin", "customer"],
 *          "is_logged_in": true
 *      }
 *
 * @apiErrorExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "success": false,
 *          "message":"No items found.",
 *          "user_groups": ["admin", "customer"],
 *          "is_logged_in": true
 *      }
 *
 *  @apiErrorExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "success": false,
 *          "message":"CDbCommand failed to execute the SQL statement: SQLSTATE[42S02]: Base table or view not found: 1146 Table 'avocadoo.retailer_item_' doesn't exist. The SQL statement executed was: SELECT i.id, i.description as name, retailers.slug as retailer\n            FROM item i\n            INNER JOIN (SELECT item_id, '' as slug FROM retailer_item_ UNION ALL SELECT item_id, 'safeway' as slug FROM retailer_item_safeway UNION ALL SELECT item_id, '' as slug FROM retailer_item_ UNION ALL SELECT item_id, '' as slug FROM retailer_item_ UNION ALL SELECT item_id, 'peapod' as slug FROM retailer_item_peapod UNION ALL SELECT item_id, 'walmart' as slug FROM retailer_item_walmart UNION ALL SELECT item_id, 'freshdirect' as slug FROM retailer_item_fresh_direct UNION ALL SELECT item_id, 'instacart' as slug FROM retailer_item_instacart UNION ALL SELECT item_id, 'amazon_fresh' as slug FROM retailer_item_amazon_fresh UNION ALL SELECT item_id, 'shipt' as slug FROM retailer_item_shipt) retailers ON retailers.item_id = i.id WHERE i.description=:name. Bound with :name='sugar'",
 *          "user_groups": ["admin", "customer"],
 *          "is_logged_in": true
 *      }
 */
function search(req, res, next) {
    logger.debug('search item');
    var suggestions = [];
    if (req.body.retailers) {
        for (var i = 0; i < req.body.retailers.length; i++) {
            switch (req.body.retailers[i]) {
                case 2:
                    suggestions.push(safeway);
                    break;
                case 6:
                    suggestions.push(peapod);
                    break;
                case 8:
                    suggestions.push(walmart);
                    break;
                case 9:
                    suggestions.push(freshdirect);
                    break;
                case 207:
                    suggestions.push(instacart);
                    break;
                case 209:
                    suggestions.push(shipt);
                    break;
            }
        }
        ES.search({
            index: suggestions,
            body: {
                'size': 500,
                'query': {
                    'match': {
                        'name': req.body.name,
                    }
                }
            }
        }).then(function(resp) {
            var items = [];
            for (var i = 0; i < resp.hits.hits.length; i++) {
                var retailer = resp.hits.hits[i]._index.replace('_pre', '') || resp.hits.hits[i]._index.replace('_prod', '');
                items.push({
                    'name': resp.hits.hits[i]._source.name,
                    'retailer': retailer,
                    'id': resp.hits.hits[i]._source.suggest.payload.item_id
                });
            }
            var uniqueList = _.uniq(items, function(item, key, a) {
                return item.id;
            });
            return res.status(200).json(uniqueList);
        }, function(error) {
            return next({
                status: 400,
                message: error
            });
        });
    } else {
        return next({
            status: 400,
            message: 'No retailers are selected'
        });
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Search ingredient in ES with size 20 ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @api {post} /api/ingredientrecipe Search for ingredients in ES
 * @apiName Search for ingredients
 * @apiGroup Ingredients
 */
function ingredientRecipe(req, res, next) {
    logger.debug("Search 1000 for ingredients in ES");
    
    ES.search({
        index: recipeIngredient,
        body: {
            'size': 10,
            'query': {
                'match': {
                    'name': req.body.name,
                }
            }
        }
    }).then(function(resp) {
        var ingredients  = {};
        ingredients.data = [];
        for (var i = 0; i < resp.hits.hits.length; i++) {
            ingredients.data.push({
                _id: resp.hits.hits[i]._id,
                name: resp.hits.hits[i]._source.name,
                id: resp.hits.hits[i]._source.suggest.payload.id
            });
        }
        return res.status(200).json({
            total: resp.hits.total,
            ingredient: ingredients
        });
    }, function(error) {
        return next({
            status: 400,
            message: error
        });
    });
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Search ingredient in ES with size 100 //////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @api {post} /api/ingredient Search for ingredients in ES
 * @apiName Search for ingredients
 * @apiGroup Ingredients
 */
function ingredient(req, res, next) {
    console.log("Search 100 for ingredients in ES");

    ES.search({
        index: ingredient,
        body: {
            'size': 100,
            'query': {
                'match': {
                    'name': req.body.name
                }
            }
        }
    }).then(function(resp) {
        return res.status(200).json({
            total: resp.hits.total,
            ingredient: resp.hits.hits
        });
    }, function(error) {
        return next({
            status: 400,
            message: error
        });
    });
}
/**
 * @api {post} /api/retailer/linked Check if a retailer has linked ingredients
 * @apiName Linked ingredients
 * @apiGroup Retailers
 */
function isLinked(req, res, next) {
    logger.debug('________________get recipe ingredients__________________________');

    function getWidgetItemIngredient(callback) {
        pool.acquire(function(err, client) {
            if (err) {
                return next({
                    status: 400,
                    message: err
                });
            } else {
                var query = 'SELECT wii.id, wii.widget_item_id, wii.ingredient_id, wii.quantity, i.name AS name FROM widget_item_ingredient wii LEFT JOIN recipe_ingredient i ON wii.ingredient_id = i.id LEFT JOIN unit u ON wii.unit_id = u.id WHERE widget_item_id = ' + mysql.escape(req.body.recipeId) + ' AND i.name is not null;SELECT i.description, i.price, i.image_url, wi.id, wii.id as _id, rii.widget_item_ingredient_id, rii.id, rii.quantity as qty, rii.retailer_id from widget_item AS wi LEFT JOIN widget_item_ingredient as wii on wii.widget_item_id = wi.id LEFT JOIN recipe_ingredient_item as rii on rii.widget_item_ingredient_id = wii.id LEFT JOIN item as i on rii.item_id = i.id where user_id = ' + mysql.escape(req.user.user_id) + ' AND rii.retailer_id = ' + mysql.escape(req.body.retailerId) + ' AND wi.id = ' + mysql.escape(req.body.recipeId) + ';';
                client.query(query, function(error, result, fields) {
                    if (error) {
                        callback({
                            status: 400,
                            message: error
                        });
                    } else {
                        pool.release(client);
                        callback(null, result);
                    }
                });
            }
        });
    }

    function getRecipeIngredientItem(rows, RIIcallback) {
        pool.acquire(function(err, client) {
            if (err) {
                return next({
                    status: 400,
                    message: err
                });
            } else if (!_.isEmpty(rows[1])) {
                utils.testLinkConcatenation(rows[1], rows[0], function(recipes, linked) {
                    if (linked === true) {
                        utils.publishRecipe(req.body.recipeId, req.body.retailerId, function(err) {
                            if (err) {
                                return next({
                                    status: 400,
                                    message: err
                                });
                            }
                        });
                    } else {
                        client.query('DELETE FROM recipe_retailer_published WHERE widget_item_id = ? and retailer_id = ?', [req.body.recipeId, req.body.retailerId], function(e, rows, fields) {
                            if (e) {
                                return res.status(400).json(e.code);
                            }
                            pool.release(client);
                        });
                    }
                    return RIIcallback(null, recipes);
                });
                
            } else {
                pool.release(client);
                return RIIcallback(null, rows[1]);
            }
        });
    }
    // Faire une promise
    async.waterfall([
        getWidgetItemIngredient,
        getRecipeIngredientItem
    ], function(err, result) {
        if (!err) return res.status(200).json(result);
        else return next(err);
    });
}

function allLinked(req, res, next) {
    logger.debug('________________get all linked____________________________');


    function getRecipeRetailerPublished(callback) {
        pool.acquire(function(err, client) {
            client.query('select * from recipe_retailer_published where widget_item_id = ' + mysql.escape(req.body.recipeId) + ';', function(err, results, fields) {
                if (err) {
                    return next({
                        status: 400,
                        message: err
                    });
                } else {
                    pool.release(client);
                    async.map(results, getWidgetItems, callback);
                }
            });
        });
    }

    function getWidgetItems(resultItem, callback) {
        var retailer_name = getRetailerName(resultItem.retailer_id);
        pool.acquire(function(err, client) {
            if (err) {
                return next({
                    status: 400,
                    message: err
                });
            } else {
                client.query('SELECT i.id as item_id, wii.id as _id, ri.name, i.description, i.price, i.image_url, rir.picture, rir.url, rii.id, rii.quantity as qty, rii.retailer_id FROM widget_item AS wi LEFT JOIN widget_item_ingredient as wii on wii.widget_item_id = wi.id LEFT JOIN recipe_ingredient as ri on wii.ingredient_id = ri.id LEFT JOIN recipe_ingredient_item as rii on rii.widget_item_ingredient_id = wii.id LEFT JOIN item as i on rii.item_id = i.id LEFT JOIN retailer_item_' + retailer_name + ' AS rir on rir.item_id = i.id where wii.widget_item_id = ' + mysql.escape(req.body.recipeId) + ' and rii.retailer_id = ' + mysql.escape(resultItem.retailer_id) + ';', function(error, r) {
                    pool.release(client);
                    async.map(r, callCallback, callback);
                });
            }
        });

        function callCallback(resultItem, callback) {
            callback(null, resultItem);
        }
    }

    getRecipeRetailerPublished(function(err, result) {
        var unifyBasketItems = _.uniq(_.flatten(result), function(item, key, a) {
            return item.item_id;
        });
        return res.status(200).json(unifyBasketItems);
    });
}

function findName(req, res, next) {
    logger.debug("find parent food name");
    pool.acquire(function(err, client) {
        if (err) {
            return next({
                status: 400,
                message: err
            });
        } else {
            var query = 'SELECT * from parent_food where id = ' + req.params.foodId + ';';
            client.query(query, function(error, rows, fields) {
                if (error) {
                    return next({
                        status: 400,
                        message: error
                    });
                }
                pool.release(client);
                return res.status(200).json(rows);
            });
        }
    });
}