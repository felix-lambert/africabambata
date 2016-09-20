var request       = require("request");
var async         = require("async");
var ES            = require("../models/ESModel");
var sendToAngular = require("../sendToAngular");
var logger        = require("../../utils/logger");
var apikey        = '3TbLhwULPeGVgyxqv2GsHEvRk4GRf7';

module.exports = {
    get: get,
    add: add
};

if (process.env.NODE_ENV === "prod") {
    var ingredient = "ingredient_prod";
} else if (process.env.NODE_ENV === "preprod") {
    var ingredient = "ingredient_pre";
} else {
    var ingredient = "ingredient";
}

 /**
 * @api {get} /api/ingredient/get Get ingredients from id
 * @apiName Get id ingredients
 * @apiGroup Ingredients
 */
function get(req, res, next) {
    logger.debug("get ingredient from id");
    var get = {
        id: req.params.id,
        token: req.user.token,
        apikey: apikey
    };
    request({
        url: process.env.API_ROOT + "/api/ingredient/get",
        method: "POST",
        headers: {
            "content-type": "application/x-www-form-urlencoded"
        },
        form: get
    }, function(nothing, result, body) {
        sendToAngular.send(result, body, function(error, results) {
                if (error) {
                    return next({
                        status: 400,
                        message: error
                    });
                } else {
                    return res.status(200).json(results);
                }
        });
    });
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Delete in ES before adding an alias for synchronization /////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @api {post} /api/ingredient/addAlias Add alias from ingredient
 * @apiName Add alias
 * @apiGroup Ingredients
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "errors":[],
 *          "added":"9811",
 *          "success":true,
 *          "user_groups":["admin","customer"],
 *          "is_logged_in":true
 *      }
 *
 * @apiErrorExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "success":false,
 *          "message":"Nothing added",
 *          "user_groups":["admin","customer"],
 *          "is_logged_in":true
 *      }
 */
function add(req, res, next) {
    var send = {
        id: req.body.id,
        aliases: req.body.aliases, 
        token: req.user.token,
        apikey: apikey
    };
    function requestApiAddAlias(callback) {
        request({
            url: process.env.API_ROOT + "/api/ingredient/addAlias",
            method: "POST",
            timeout: 30000,
            headers: {
                "Accept": "/",
                "content-type": "application/x-www-form-urlencoded",
            },
            form: send
        }, function(nothing, result, body) {
            callback(null, result, body);
        });
    }

    function checkRequest(result, body, cb) {
        sendToAngular.send(result, body, function(error, results) {
            if (error) {
                return cb(error);
            } else {
                return cb(null, results);
            }
        });
    }

    function ESdelete(results, callbackES) {
        ES.delete({
            index: ingredient,
            type: "ing",
            id: req.body._id
        }, function(err) {
            callbackES(err, results);
        });
    }

    // Faire une promise
    async.waterfall([
        requestApiAddAlias,
        checkRequest,
        ESdelete
    ], function(err, result) {
        if (!err) return res.status(200).json(result);
        else return next(err);
    });
}
