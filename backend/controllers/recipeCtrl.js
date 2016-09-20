var request         = require('request');
var async           = require('async');
var ES              = require("../models/ESModel");
var sendToAngular   = require('../sendToAngular');
var pool            = require('../models/sqlConnexion.js');
var mysql           = require("mysql");
var moment          = require('moment');
var logger          = require("../../utils/logger");
var utils           = require("../../utils/");
var _               = require('underscore');
var separateReqPool = {maxSockets : 10};
var apikey          = '3TbLhwULPeGVgyxqv2GsHEvRk4GRf7';

module.exports = {
    add: add,
    get: get,
    getAll: getAll,
    parse: parse,
    create: create,
    destroy: destroy,
    edit: edit,
    editInfo: editInfo,
    eraze: eraze,
    testLinked: testLinked,
    deleteAndEdit: deleteAndEdit,
    ingredientSave: ingredientSave
};

/**
 * @api {post} /api/recipe/reviewed Review ingredients in recipe
 * @apiName Review ingredients
 * @apiGroup Ingredients
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "message":"Done"
 *       }
 *
 */
// function reviewed(req, res, next) {
//     logger.debug('___________________Review ingredients in recipe___________________');
//     req.on('close', function() {
//         console.log('reviewed closed the connection');
//     });

//     function queryResult(err) {
//         if (err) {
//             return next({
//                 status: 400,
//                 message: err
//             });
//         }
//     }
//     request({
//         headers: {
//             "Cookie": req.user.token.session,
//             'Content-Type': 'application/x-www-form-urlencoded'
//         },
//         uri: process.env.API_ROOT + '/api/user/status',
//         method: 'POST',
//         pool: separateReqPool
//     }, function(nothing, result, body) {
//         if (req.body.length > 0) {
//             sendToAngular.send(result, body, function(error, results) {
//                 if (error) {
//                     return next(error);
//                 } else {
//                     pool.acquire(function(err, client) {
//                         if (err) {
//                             return next({
//                                 status: 400,
//                                 message: err
//                             });
//                         } else {
//                             for (var i = 0; i < req.body.length; i++) {
//                                 client.query('UPDATE widget_item_ingredient SET ? Where id = ?', [req.body[i], req.body[i].id], queryResult);
//                             }
//                             pool.release(client);
//                             return res.status(200).json({
//                                 message: 'done'
//                             });
//                         }
//                     });
//                 }
//             });
//         } else {
//             return next({
//                 status: 400,
//                 message: "body is empty"
//             });
//         }
//     });
// }
/**
 * @api {post} /api/recipe/edit Destroy ingredient in recipe
 * @apiName Delete ingredient
 * @apiGroup Ingredients
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "message":"Done",
 *          "id":"14",
 *       }
 *
 */
function edit(req, res, next) {
    logger.debug('_____Edit ingredient in recipe_________');
    req.on('close', function() {
        console.log('edit closed the connection');
    });

    pool.acquire(function(err, client) {
        if (err) {
            return next({
                status: 400,
                message: err
            });
        } else {
            if (req.body.ingredient_id || req.body.noNameChanged) {
                delete req.body.noNameChanged;
                client.query('UPDATE widget_item_ingredient SET ? Where id = ?', [req.body, req.body.id], function(error, rows, fields) {
                    if (error) {
                        return next({
                            status: 400,
                            message: error
                        });
                    }
                    pool.release(client);
                    return res.status(200).json({
                        message: 'done',
                        id: req.body.id
                    });
                });
            } else {
                client.query("INSERT INTO ingredient SET ?", {
                    name: req.body.name
                }, function(err, rows, fields) {
                    client.query("INSERT INTO recipe_ingredient SET ?", {
                        name: req.body.name,
                        ingredient_id: rows.insertId,
                        is_reviewed: null
                    }, function(error, rirows, fields) {
                        if (error) {
                            return next({
                                status: 400,
                                message: error
                            });
                        }
                        client.query("INSERT INTO ingredient_alias SET ?", {
                            name: req.body.name,
                            ingredient_id: insertId,
                            is_reviewed: 0
                        }, function(error, rows, fields) {
                            if (error) {
                                return next({
                                    status: 400,
                                    message: error
                                });
                            }
                            req.body.ingredient_id = rirows.insertId;
                            client.query('UPDATE widget_item_ingredient SET ? Where id = ?', [
                                req.body, req.body.id
                            ], function(error, rows, fielts) {
                                if (error) {
                                    return next({
                                        status: 400,
                                        message: error
                                    });
                                }
                                pool.release(client);
                                return res.status(200).json({
                                    message: 'done'
                                });
                            });
                        });
                    });
                });
            }
        }
    });
}
/**
 * @api {post} /api/recipe/editinfo Search for items with retailers
 * @apiName Edit recipe informations
 * @apiGroup Recipes
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "success":true,
 *          "user_groups":["admin","widget"],
 *          "is_logged_in":true
 *       }
 *
 *  @apiErrorExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "success":false,
 *          "message":"API :: RecipeController :: create :: error : ERROR MESSAGE",
 *          "user_groups":["admin","widget"],
 *          "is_logged_in":true
 *      }
 */
function editInfo(req, res, next) {
    logger.debug('__________edit recipe____________');
    req.on('close', function() {
        console.log('editInfo closed the connection');
    });
    req.body.token  = req.user.token;
    req.body.apikey = apikey;
    request({
        url: process.env.API_ROOT + '/api/recipe/edit',
        method: "POST",
        headers: {
            'Accept': '/',
            "content-type": "application/x-www-form-urlencoded",
        },
        form: req.body,
        pool: separateReqPool
    }, function(nothing, result, body) {
        sendToAngular.send(result, body, function(error, results) {
            if (error) {
                return next(error);
            } else {
                return res.status(200).json(results);
            }
        });
    });
}
/**
 * @api {delete} /api/recipe/destroy/:id Destroy ingredient in recipe
 * @apiName Delete ingredient
 * @apiGroup Ingredients
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "message":"Done",
 *          "id":"14",
 *       }
 *
 */
function destroy(req, res, next) {
    logger.debug('_____Destroy ingredient in recipe_______');
    req.on('close', function() {
        console.log('destroy closed the connection');
    });

    console.log('destroyWidgetItemIngredient');
    pool.acquire(function(err, client) {
        if (err) {
            return next({
                status: 400,
                message: err
            });
        } else {
            client.query('DELETE FROM widget_item_ingredient WHERE id = ?;SELECT wii.id, wii.widget_item_id, wii.ingredient_id, wii.quantity, i.name AS name FROM widget_item_ingredient wii LEFT JOIN recipe_ingredient i ON wii.ingredient_id = i.id LEFT JOIN unit u ON wii.unit_id = u.id WHERE widget_item_id = ' + mysql.escape(req.body.recipeId) + ' AND i.name is not null;SELECT i.description, i.price, i.image_url, wi.id, wii.id as _id, rii.widget_item_ingredient_id, rii.id, rii.quantity as qty, rii.retailer_id from widget_item AS wi LEFT JOIN widget_item_ingredient as wii on wii.widget_item_id = wi.id LEFT JOIN recipe_ingredient_item as rii on rii.widget_item_ingredient_id = wii.id LEFT JOIN item as i on rii.item_id = i.id where user_id = ' + mysql.escape(req.user.user_id) + ' AND wi.id = ' + mysql.escape(req.body.recipeId) + ';', [req.body.id], function(error, rows, fields) {
                if (error) {
                    return next({status: 400, message: error});
                } else if (!_.isEmpty(rows[1])) {
                    utils.testLinkConcatenation(rows[1], rows[2], function(recipes, linked) {
                        var retailers = [];
                        if (linked === true) {
                            _.each(recipes, function(re) {
                                if (re.retailer_id) {
                                    retailers.push(re.retailer_id);
                                    utils.publishRecipe(req.body.recipeId, re.retailer_id, function(err) {
                                        if (err) {
                                            return next({
                                                status: 400,
                                                message: err
                                            });
                                        }
                                    });
                                }
                            });
                            return res.status(200).json({
                                id: req.params.id,
                                message: 'done',
                                retailers: retailers
                            });
                        }
                        pool.release(client);
                        return res.status(200).json({
                            id: req.params.id,
                            message: 'done'
                        });
                    });
                } else {
                    pool.release(client);
                    return res.status(200).json({
                        id: req.params.id,
                        message: 'done'
                    });
                }
            });
        }
    });


}
/**
 * @api {post} /api/recipe/add Add ingredient in recipe
 * @apiName Add ingredient
 * @apiGroup Ingredients
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "message":"Done"
 *       }
 *
 */
function add(req, res, next) {
    logger.debug('___________________Add ingredient in recipe___________________');
    req.on('close', function() {
        console.log('add closed the connection');
    });

    pool.acquire(function(err, client) {
        if (err) {
            return next({
                status: 400,
                message: err
            });
        } else {
            if (req.body.ingredient_id) {
                req.body.date = Date.now();
                var now       = moment();
                req.body.date = now._d;
                client.query("INSERT INTO widget_item_ingredient SET ?", req.body, function(error, rows, fields) {
                    if (error) {
                        return next({
                            status: 400,
                            message: error
                        });
                    }
                    pool.release(client);
                    return res.status(200).json({
                        message: 'done',
                        id: rows.insertId
                    });
                });
            } else {
                client.query("INSERT INTO ingredient SET ?", {
                    name: req.body.name
                }, function(err, rows, fields) {
                    var insertId = rows.insertId;
                    client.query("INSERT INTO recipe_ingredient SET ?", {
                        name: req.body.name,
                        ingredient_id: insertId,
                        is_reviewed: null
                    }, function(error, rirows, fields) {
                        if (error) {
                            return next({
                                status: 400,
                                message: error
                            });
                        }
                        client.query("INSERT INTO ingredient_alias SET ?", {
                            name: req.body.name,
                            ingredient_id: insertId,
                            is_reviewed: 0
                        }, function(error, rows, fields) {
                            if (error) {
                                return next({
                                    status: 400,
                                    message: error
                                });
                            }
                            req.body.ingredient_id = rirows.insertId;
                            req.body.date = Date.now();
                            var now = moment();
                            req.body.date = now._d;
                            client.query('INSERT INTO widget_item_ingredient SET ?', req.body, function(error, rows, fielts) {
                                if (error) {
                                    return next({
                                        status: 400,
                                        message: error
                                    });
                                }
                                pool.release(client);
                                return res.status(200).json({
                                    id: rows.insertId,
                                    message: 'done'
                                });
                            });
                        });
                    });
                });
            }
        }
    });
}
/**
 * @api {post} /api/recipe/add Add ingredient in recipe
 * @apiName Add ingredient
 * @apiGroup Ingredients
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "message":"Done"
 *       }
 *
 */
function ingredientSave(req, res, next) {
    logger.debug('___________________Add ingredient___________________');
    req.on('close', function() {
        console.log('ingredientSave closed the connection');
    });

    pool.acquire(function(err, client) {
        if (err) {
            return next({
                status: 400,
                message: err
            });
        } else {
            client.query("INSERT INTO ingredient SET ?", req.body, function(error, rows, fields) {
                if (error) {
                    return next({
                        status: 400,
                        message: error
                    });
                }
                pool.release(client);
                return res.status(200).json({
                    message: 'done'
                });
            });
        }
    });
}
/**
 * @api {delete} /api/recipe/delete/:id Delete all the recipe
 * @apiName Delete recipe
 * @apiGroup Recipe
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "success":true,
 *          "message":"Done",
 *          "user_groups":["admin","widget"],
 *          "is_logged_in":true
 *      }
 */
function eraze(req, res, next) {
    logger.debug('___________________Delete all the recipe___________________');
    req.on('close', function() {
        console.log('eraze closed the connection');
    });
    if (req.user.token) {
        request({
            url: process.env.API_ROOT + '/api/recipe/delete',
            method: "POST",
            headers: {
                'Accept': '/',
                "content-type": "application/x-www-form-urlencoded",
            },
            pool: separateReqPool,
            form: {
                id: req.params.id,
                token: req.user.token,
                apikey: apikey
            }
        }, function(nothing, result, body) {
            sendToAngular.send(result, body, function(error, results) {
                if (error) {
                    return next(error);
                } else {
                    return res.status(200).json(results);
                }
            });
        });
    } else {
        return next({
            status: 400,
            message: 'diconnected'
        });
    }
}
/**
 * @api {post} /api/recipe/create Search for items with retailers
 * @apiName Search for items
 * @apiGroup Items
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "success":true,
 *          "message":"Done",
 *          "id":"14",
 *          "user_groups":["admin","widget"],
 *          "is_logged_in":true
 *       }
 *
 *  @apiErrorExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "success":false,
 *          "message":"createItem :: Error : no widget found.",
 *          "user_groups":["admin","widget"],
 *          "is_logged_in":true
 *      }
 */
function create(req, res, next) {
    logger.debug('___________________create recipe_________________________');
    req.body.token  = req.user.token;
    req.body.apikey = apikey;
    req.on('close', function() {
        console.log('create recipe closed the connection');
    });
    request({
        url: process.env.API_ROOT + '/api/recipe/create',
        method: "POST",
        headers: {
            'Accept': '/',
            "content-type": "application/x-www-form-urlencoded",
        },
        form: req.body,
        pool: separateReqPool
    }, function(nothing, result, body) {
        sendToAngular.send(result, body, function(error, results) {
            if (error) {
                return next(error);
            } else {
                return res.status(200).json(results);
            }
        });
    });
}
/**
 * Get specific recipe
 */
function get(req, res, next) {
    logger.debug('GET RECIPE ' + req.params.id + ' (user ' + req.user.user_id + ')');
    req.on('close', function() {
        console.log('Client closed the connection');
    });

    pool.acquire(function(err, client) {
        if (err) {
            return next({
                status: 400,
                message: err
            });
        } else {
            client.query("SELECT * FROM widget_item WHERE user_id = " + mysql.escape(req.user.user_id) + ' AND id =' + mysql.escape(req.params.id) + ';', function(error, rows, fields) {
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
/**
 * Get all user recipes
 */
function getAll(req, res, next) {
    req.on('close', function() {
        console.log('getAll closed the connection');
    });

    pool.acquire(function(err, client) {
        if (err) {
            return next({
                status: 400,
                message: err
            });
        } else {
            console.log('test');
            client.query("SELECT * from widget_item where user_id = " + mysql.escape(req.user.user_id) + ';', function(error, rows, fields) {
                if (error) {
                    return callback({
                        status: 400,
                        message: error
                    });
                }
                pool.release(client);
                pool.acquire(function(err, client) {
                    if (err) {
                        return next({
                            status: 400,
                            message: err
                        });
                    } else {
                        console.log('getLinkedRetailers');
                        async.each(rows, function(value, callback) {
                            client.query('select * from recipe_retailer_published where widget_item_id = ' + mysql.escape(value.id) + ';', function(err, r, fields) {
                                value.notLinkedRecipe = _.isEmpty(r);
                                callback();
                            });
                        }, function() {
                            pool.release(client);
                            if (!err) return res.status(200).json(rows);
                            else return next(err);
                        });
                    }
                });
            });
        }
    });
}
/**
 * @api {get} /api/recipe/parse/:id Get recipe ingredients
 * @apiName Get recipe ingredients
 * @apiGroup Ingredients
 */
function parse(req, res, next) {
    logger.debug('_____get recipe ingredients________');
    req.on('close', function() {
        console.log('parse closed the connection');
    });
    pool.acquire(function(err, client) {
        console.log('after');
        if (err) {
            return next({
                status: 400,
                message: err
            });
        } else {
            client.query('SELECT wii.id, wii.widget_item_id, wii.unit, wii.ingredient_id, wii.quantity, wii.info, wii.original_text, wii.has_error, wii.date, wii.is_reviewed, ri.name AS name, u.name AS unit FROM widget_item_ingredient wii LEFT JOIN recipe_ingredient ri ON wii.ingredient_id = ri.id LEFT JOIN unit u ON wii.unit_id = u.id WHERE widget_item_id = ' + mysql.escape(req.params.id) + ';', function(error, rows, fields) {
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

function testLinked(req, res, next) {
    logger.debug('test linked');
    req.on('close', function() {
        console.log('test linked closed the connection');
    });

    pool.acquire(function(err, client) {
        if (err) {
            return next({
                status: 400,
                message: err
            });
        } else {
            var query = 'SELECT * from recipe_ingredient_item where widget_item_ingredient_id = ' + mysql.escape(req.params.id) + ';';
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

function deleteAndEdit(req, res, next) {
    logger.debug('delete and edit');
    req.on('close', function() {
        console.log('delete and edit closed the connection');
    });

    function destroyRecipeIngredientItem(callback) {
        pool.acquire(function(err, client) {
            if (err) {
                return next({
                    status: 400,
                    message: err
                });
            } else {
                client.query('DELETE FROM recipe_ingredient_item WHERE widget_item_ingredient_id = ?', [req.body.id], function(error, rows, fields) {
                    if (error) {
                        return callback({
                            status: 400,
                            message: error
                        });
                    } else {
                        pool.release(client);
                        return callback(null);
                    }
                });
            }
        });
    }

    function updateWidgetItemIngredient(callback) {
        pool.acquire(function(err, client) {
            if (err) {
                // handle error - this is generally the err from your
                // factory.create function
                return next({
                    status: 400,
                    message: err
                });
            } else {
                if (req.body.ingredient_id || req.body.noNameChanged) {
                    delete req.body.noNameChanged;
                    client.query('UPDATE widget_item_ingredient SET ? Where id = ?', [req.body, req.body.id], function(errors, rows, fields) {
                        if (errors) {
                            return callback({
                                status: 400,
                                message: errors
                            });
                        }
                        pool.release(client);
                        return callback(null, rows);
                    });
                } else {
                    client.query("INSERT INTO ingredient SET ?", {
                        name: req.body.name
                    }, function(error, rows, fields) {
                        if (error) {
                            return callback({
                                status: 400,
                                message: error
                            });
                        }
                        var insertId = rows.insertId;
                        client.query("INSERT INTO recipe_ingredient SET ?", {
                            name: req.body.name,
                            ingredient_id: insertId,
                            is_reviewed: null
                        }, function(error, rirows, fields) {
                            req.body.ingredient_id = rirows.insertId;
                            client.query('UPDATE widget_item_ingredient SET ? Where id = ?', [
                                req.body, req.body.id
                            ], function(error, rows, fielts) {
                                if (error) {
                                    return callback({
                                        status: 400,
                                        message: error
                                    });
                                }
                                pool.release(client);
                                return callback(null, {
                                    message: 'done'
                                });
                            });
                        });
                    });
                }
            }
        });
    }
    // Faire une promise
    async.waterfall([
        destroyRecipeIngredientItem,
        updateWidgetItemIngredient
    ], function(err, result) {
        if (!err) return res.status(200).json(result);
        else return next(err);
    });
}