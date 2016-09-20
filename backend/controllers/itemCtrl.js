var request       = require('request');
var async         = require('async');
var ES            = require("../models/ESModel");
var sendToAngular = require('../sendToAngular');
var pool          = require('../models/sqlConnexion.js');
var logger        = require("../../utils/logger");
var moment        = require('moment');
var mysql         = require("mysql");

module.exports = {
    freshdirect: freshdirect,
    peapod: peapod,
    instacart: instacart,
    walmart: walmart,
    shipt: shipt,
    safeway: safeway,
    link: link,
    editLink: editLink,
    addLink: addLink,
    publishLink: publishLink,
    cancelPublish: cancelPublish
};

if (process.env.NODE_ENV === 'prod') {
    var safeway     = 'safeway_prod';
    var peapod      = 'peapod_prod';
    var freshdirect = 'freshdirect_prod';
    var shipt       = 'shipt_prod';
    var instacart   = 'instacart_prod';
    var walmart     = 'walmart_prod';
} else if (process.env.NODE_ENV === 'preprod') {
    var safeway     = 'safeway_pre';
    var peapod      = 'peapod_pre';
    var freshdirect = 'freshdirect_pre';
    var shipt       = 'shipt_pre';
    var instacart   = 'instacart_pre';
    var walmart     = 'walmart_pre';
} else {
    var safeway     = 'safeway';
    var peapod      = 'peapod';
    var freshdirect = 'freshdirect';
    var shipt       = 'shipt';
    var instacart   = 'instacart';
    var walmart     = 'walmart';
}

/**
 * @api {post} /api/items/link Link items to ingredient
 * @apiName Link items
 * @apiGroup Items
 */
function link(req, res, next) {
    logger.debug('_____________Link items to ingredient_____');

    pool.acquire(function(err, client) {
        if (err) {
            // handle error - this is generally the err from your
            // factory.create function
            return next({
                status: 400,
                message: err
            });
        } else {
            var error;
            for (var i = 0; i < req.body.length; i++) {
                client.query("INSERT INTO recipe_ingredient_item SET ?", req.body[i], function(error, rows, fields) {
                    if (error) {
                        return next({
                            status: 400,
                            message: error
                        });
                    }
                });
                
            }
            pool.release(client);
            return next(error);
        }
    });
}

/**
 * @api {post} /api/items/editLink Edit items linked to ingredient
 * @apiName Edit linked items
 * @apiGroup Items
 */
function editLink(req, res, next) {
    logger.debug('editLink');

    pool.acquire(function(err, client) {
        if (err) {
            return next({
                status: 400,
                message: err
            });
        } else {
            console.log(req.body);
            console.log(req.body.id);
            client.query('UPDATE recipe_ingredient_item SET ? Where id = ?',
            [req.body, req.body.id], function(error, rows, fields) {
                console.log(error);
                console.log(rows);
                if (error) {
                    return next({
                        status: 400,
                        message: error
                    });
                }
                pool.release(client);
                return res.status(200).json(null);
            });
        }
    });
}

/**
 * @api {post} /api/items/addLink Add items linked to ingredient
 * @apiName Add linked items
 * @apiGroup Items
 */
function addLink(req, res, next) {
    logger.debug('___________addlink____________');

    pool.acquire(function(err, client) {
        if (err) {
            return next({
                status: 400,
                message: err
            });
        } else {
            client.query('INSERT INTO recipe_ingredient_item SET ?', req.body, 
            function(error, rows, fields) {
                if (error) {
                    return next({
                        status: 400,
                        message: error
                    });
                }
                pool.release(client);
                return res.status(200).json(null);
            });
        }
    });
}

/**
 * @api {post} /api/items/publish Publish recipes that are linked 
 * @apiName Publish linked recipes
 * @apiGroup Items
 */
function publishLink(req, res, next) {

    logger.debug('___________publishlink____________');
    pool.acquire(function(err, client) {
        if (err) {
            return next({
                status: 400,
                message: err
            });
        } else {
            client.query('select * from recipe_retailer_published where retailer_id = ' + mysql.escape(req.body.retailer_id) + ' and widget_item_id = ' + mysql.escape(req.body.widget_item_id) + ';', function(err, rows, fields) {
                if (err) {
                    return next({
                        status: 400,
                        message: err
                    });
                }
                if (rows && rows.length === 0) {
                    req.body.date = Date.now();
                    var now       = moment();
                    req.body.date = now._d;
                    client.query('INSERT INTO recipe_retailer_published SET ?', req.body, 
                    function(error, rows, fields) {
                        if (error) {
                            return next({
                                status: 400,
                                message: error
                            });
                        }
                        pool.release(client);
                        return res.status(200).json(result);
                    });
                } else {
                    pool.release(client);
                    return res.status(200).json(result);
                }
            });
        }
    });

}


/**
 * @api {post} /api/items/publish Publish recipes that are linked 
 * @apiName Publish linked recipes
 * @apiGroup Items
 */
function cancelPublish(req, res, next) {
    logger.debug('___________cancelpublish____________');

    pool.acquire(function(err, client) {
        if (err) {
            return next({
                status: 400,
                message: err
            });
        } else {
            client.query('DELETE FROM recipe_retailer_published WHERE widget_item_id = ?',
            [req.params.id], function(error, rows, fields) {
                if (error) {
                    return next({
                        status: 400,
                        message: error
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

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Search items from safeway in ES /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @api {post} /api/items/safeway Search for safeway items in ES
 * @apiName Search for safeway items
 * @apiGroup Items
 */
function safeway(req, res, next) {
    logger.debug('safeway search in ES');

    ES.search({
        index: safeway,
        body: {
            'size': 10,
            'query': {
                'match': {
                    'name': req.body.name
                }
            }
        }
    }).then(function(resp) {
        return res.status(200).json({
            total: resp.hits.total,
            item: resp.hits.hits
        });
    }, function(err) {
        return next({
            status: 400,
            message: err
        });
    });
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Search items from shipt in ES ///////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @api {post} /api/items/shipt Search for shipt items in ES
 * @apiName Search for shipt items
 * @apiGroup Items
 */
function shipt(req, res, next) {
    logger.debug('safeway search in ES');
    ES.search({
        index: shipt,
        body: {
            'size': 10,
            'query': {
                'match': {
                    'name': req.body.name
                }
            }
        }
    }).then(function(resp) {
        return res.status(200).json({
            total: resp.hits.total,
            item: resp.hits.hits
        });
    }, function(err) {
        return next({
            status: 400,
            message: err
        });
    });
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Search items from walmart in ES /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @api {post} /api/items/walmart Search for walmart items in ES
 * @apiName Search for walmart items
 * @apiGroup Items
 */
function walmart(req, res, next) {
    logger.debug('walmart search in ES');

    ES.search({
        index: walmart,
        body: {
            'size': 10,
            'query': {
                'match': {
                    'name': req.body.name
                }
            }
        }
    }).then(function(resp) {
        return res.status(200).json({
            total: resp.hits.total,
            item: resp.hits.hits
        });
    }, function(err) {
        return next({
            status: 400,
            message: err
        });
    });
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Search items from instacart in ES ///////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @api {post} /api/items/instacart Search for instacart items in ES
 * @apiName Search for instacart items
 * @apiGroup Items
 */
function instacart(req, res, next) {
    logger.debug('instacart search in ES');
    ES.search({
        index: instacart,
        body: {
            'size': 10,
            'query': {
                'match': {
                    'name': req.body.name
                }
            }
        }
    }).then(function(resp) {
        return res.status(200).json({
            total: resp.hits.total,
            item: resp.hits.hits
        });
    }, function(err) {
        return next({
            status: 400,
            message: err
        });
    });
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Search items from peapod in ES ///////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @api {post} /api/items/peapod Search for peapod items in ES
 * @apiName Search for peapod items
 * @apiGroup Items
 */
function peapod(req, res, next) {
    logger.debug('peapod search in ES');

    ES.search({
        index: peapod,
        body: {
            'size': 10,
            'query': {
                'match': {
                    'name': req.body.name
                }
            }
        }
    }).then(function(resp) {
        return res.status(200).json({
            total: resp.hits.total,
            item: resp.hits.hits
        });
    }, function(err) {
        return next({
            status: 400,
            message: err
        });
    });
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Search items from freshdirect in ES /////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @api {post} /api/items/freshdirect Search for freshdirect items in ES
 * @apiName Search for freshdirect items
 * @apiGroup Items
 */
function freshdirect(req, res, next) {
    logger.debug('freshdirect search in ES');

    ES.search({
        index: freshdirect,
        body: {
            'size': 10,
            'query': {
                'match': {
                    'name': req.body.name
                }
            }
        }
    }).then(function(resp) {
        return res.status(200).json({
            total: resp.hits.total,
            item: resp.hits.hits
        });
    }, function(err) {
        console.log(err);
        return next({
            status: 400,
            message: err
        });
    });
}
