/////////////////////////////////////////////////////////////////
// MODULE DEPENDENCIES //////////////////////////////////////////
/////////////////////////////////////////////////////////////////
var logger   = require("../../utils/logger");
var jwt      = require('jwt-simple');
var pool     = require("../models/sqlConnexion.js");
var mysql    = require("mysql");
var moment   = require('moment');



///////////////////////////////////////////////////////////////////////////////////////AUTH TOKEN Route middleware to ensure user is authenticated //////////////////////////////////////////////////////////////////////////////////////////
exports.ensureAuthenticated = function ensureAuthenticated(req, res, next) {
    logger.debug('ensureAuthenticated');
    // return res.status(302).json('Invalid token.');
    var incomingToken = req.headers['auth-token'];
    if (incomingToken) {
        var decoded;
        try {
            decoded = jwt.decode(incomingToken, 'bloc');
        } catch (err) {
            return res.status(403).json({
                error: 'Issue decoding incoming token.'
            });
        }
        if (decoded && decoded.email) {
            pool.acquire(function(err, client) {
                if (err) {
                    return next({
                        status: 400,
                        message: err
                    });
                } else {
                    client.query('Select t.user_id, t.token, t.date FROM users u LEFT JOIN token as t on u.id = t.user_id WHERE email = ?', [decoded.email], function(e, rows, fields) {
                        if (e) {
                            return res.status(400).json(e.code);
                        }
                        var date = Date.now();
                        var now  = moment();
                        date     = now._d;
                        if (rows[0].token == incomingToken) {
                            var diff = moment.duration(now.diff(rows[0].date));
                            if (diff._data.minutes > 15 || diff._data.hours > 0 || diff._data.days > 0 || diff._data.months > 0 || diff._data.years > 0) {
                                client.query('DELETE FROM token where user_id = ' + mysql.escape(decoded.user_id) + ';', function(error, rows, fields) {
                                    if (error) {
                                        return next({
                                            status: 400,
                                            message: error
                                        });
                                    }
                                    pool.release(client);
                                    return res.status(403).json('Invalid token.');
                                });
                            } else {
                                client.query('UPDATE token SET date = ? WHERE user_id = ?;', [date, decoded.user_id], function(error, rows, fields) {
                                    if (error) {
                                        return next({
                                            status: 400,
                                            message: error
                                        });
                                    } else {
                                        req.user = {
                                            user_id: decoded.user_id,
                                            token: incomingToken
                                        };
                                        pool.release(client);
                                        return next();
                                    }
                                });
                            }
                        } else {
                            res.status(403).json('Invalid token.');
                        }
                        
                    });
                }
            });
        }
    } else {
        res.status(403).json('Issue decoding incoming token.');
    }
};

