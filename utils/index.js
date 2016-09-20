exports.testLinkConcatenation = testLinkConcatenation; 
exports.publishRecipe         = publishRecipe; 
var pool                      = require('../backend/models/sqlConnexion.js');
var _                         = require('underscore');
var moment                    = require('moment');
var mysql                     = require("mysql");

function testLinkConcatenation(WIIResult, WIResult, cb) {
    var recipes = [];
    _.each(WIResult, function(el) {
        _.extend(el, _.where(WIIResult, {
            _id: el.id
        })[0] || {});
        recipes.push(el);
    });
    var linked = true;
    for (var i = 0; i < recipes.length; i++) {
        if (!recipes[i].description ||  !recipes[i].qty) {
            linked = false;
            break;
        }
    }
    cb(recipes, linked);
}


function publishRecipe(recipeId, retailerId, cb) {
    var now  = moment();
    var date = now._d;
    var publish = {
        widget_item_id: recipeId,
        retailer_id: retailerId,
        date: date
    };
    pool.acquire(function(err, client) {
        if (err) {
            return cb(err);
        } else {
            client.query('select * from recipe_retailer_published where retailer_id = ' + mysql.escape(retailerId) + ' and widget_item_id = ' + mysql.escape(recipeId) + ';', function(err, rows, fields) {
                if (err) {
                    return cb(err);
                }
                if (_.isEmpty(rows)) {
                    client.query('INSERT INTO recipe_retailer_published SET ?', publish, function(er, rows, fields) {
                        if (er) {
                            return cb(er);
                        }
                        pool.release(client);
                        cb(null);
                    });
                }
                pool.release(client);
                cb(null);
            });
        }
    });
}
