var async         = require('async');
var moment        = require('moment');
var request       = require('request');
var auth          = require('../authentification/auth.js');
var sendToAngular = require('../sendToAngular');
var con           = require('../models/sqlConnexion.js');
var logger        = require("../../utils/logger");
var jwt           = require('jwt-simple');
var tokenSecret   = 'bloc';
var pool          = require('../models/sqlConnexion.js');
var mysql         = require("mysql");

module.exports = {
    login: login,
    logout: logout
};

/////////////////////////////////////////////////////////////////
// LOGIN ///////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
/**
 * @api {post} /api/user/login Login
 * @apiName Login
 * @apiGroup User session
 * @apiParam {login} Email
 * @apiParam {password} Password
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "success": true,
 *          "message": "successfully logged in",
 *          "user_groups": ["admin", "customer"],
 *          "is_logged_in": true 
 *      }
 *
 * @apiErrorExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "success": false,
 *          "message": "Wrong login and / or password.",
 *      }
 *
 * @apiErrorExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "success": false,
 *          "message": "Already logged in.",
 *          "user_groups": ["admin", "customer"],
 *          "is_logged_in": true
 *      }
 */
function login(req, res, next) {
    logger.debug('login');
    var jar         = request.jar();
    var url         = process.env.API_ROOT + '/api/user/login';
    req.body.apikey = '3TbLhwULPeGVgyxqv2GsHEvRk4GRf7';

    function requestApi(requestApiCallback) {
        request({
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': '/'
            },
            followAllRedirects: true,
            jar: jar,
            url: url,
            form: req.body,
            method: 'POST'
        }, function(nothing, response, body) {
            try {
                body = JSON.parse(body);
            } catch (e) {
                return next({
                    status: 401,
                    message: 'parsing error on JSON.parse'
                });
            }
            if (body.success === true) {
                requestApiCallback(null, body);
            } else {
                return next({
                    status: 400,
                    message: 'login error'
                });
            }
        });

    }

    function createToken(body, createTokenCallback) {
        console.log('createToken');
        var token;
        try {
            token = jwt.encode({
                email: req.body.login,
                user_id: body.user_id
            }, tokenSecret);
        } catch (err) {
            console.log(err);
            return next({
                status: 400,
                message: err
            });
        }
        var date = Date.now();
        var now  = moment();
        date     = now._d;
        var tokenData = {
            token: token,
            date: date,
            user_id: body.user_id
        };
        pool.acquire(function(err, client) {
            if (err) {
                // handle error - this is generally the err from your
                // factory.create function
                return next({
                    status: 400,
                    message: err
                });
            } else {
                client.query("INSERT INTO token SET ?", tokenData, function(error, rows, fields) {
                    if (error) {
                        console.log(error);
                        return createTokenCallback({
                            status: 400,
                            message: error
                        });
                    } else {
                        createTokenCallback(err ? err : null, {_id: body.user_id, email: req.body.login, token: token}, body);
                    }
                });
            }
        });
    }
    
    // Faire une promise
    async.waterfall([
        requestApi,
        createToken
    ], function(error, result, body) {
        if (error) {
            return next({
                status: 400,
                message: error
            });
        } else {
            res.status(200).json({
                _id: result._id,
                email: result.email,
                token: result.token,
                user_groupe: body.user_groups
            });
        }
    });
}

/////////////////////////////////////////////////////////////////
// LOGOUT ///////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
/**
 * @api {post} /api/user/logout Logout
 * @apiName Logout
 * @apiGroup User session
 *
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "success": true,
 *          "message": "Successfully logged out."
 *      }
 *
 * @apiErrorExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "success": false,
 *          "message": "Hybridauth Library needs the CURL PHP extension."
 *      }
 *
 */
function logout(req, res, next) {
    logger.debug('logout');
    pool.acquire(function(err, client) {
        if (err) {
            return next({
                status: 400,
                message: err
            });
        } else {
            console.log(req.user.user_id);
            client.query('DELETE FROM token where user_id = ' + mysql.escape(req.user.user_id) + ';', function(error, rows, fields) {
                if (error) {
                    return next({
                        status: 400,
                        message: error
                    });
                }
                pool.release(client);
                res.status(200).json('loggedOut');
            });
        }
    });
}
