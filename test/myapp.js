module.exports = function() {
    var http           = require('http');
    var express        = require('express');
    var mongoose       = require('mongoose');
    var config         = require('../backend/db/database');
    var cookieParser   = require('cookie-parser');
    var methodOverride = require('method-override');
    var bodyParser     = require('body-parser');
    var compress       = require('compression');
    var logger         = require("../utils/logger");

    /////////////////////////////////////////////////////////////////
    // CREATE AND CONFIG SERVER /////////////////////////////////////
    /////////////////////////////////////////////////////////////////
    var app = module.exports = express();

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    if (process.env.NODE_ENV === 'prod') {
        process.env.API_ROOT = "https://avocadoo.com";
    } else if (process.env.NODE_ENV === 'preprod') {
        process.env.API_ROOT = "http://preprod.avocado.com";
    } else {
        process.env.API_ROOT =  "https://avocadoo.dev";
    }

    /////////////////////////////////////////////////////////////////
    // CONNECT TO DATABASE //////////////////////////////////////////
    /////////////////////////////////////////////////////////////////
    require('../backend/db/mongotest');

    /////////////////////////////////////////////////////////////////
    // CONFIG DATA MODELS ///////////////////////////////////////////
    /////////////////////////////////////////////////////////////////
    require('../backend/models/')(mongoose);

    /////////////////////////////////////////////////////////////////
    // CONFIGURE APPLICATION ////////////////////////////////////////
    /////////////////////////////////////////////////////////////////
    app.use(methodOverride());
    app.use(cookieParser());
    // parse application/json
    app.use(bodyParser.json());
    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    logger.info('done');

    /////////////////////////////////////////////////////////////////
    // ROUTES ///////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////
    app.use(function(err, req, res, next) {
        logger.info(chalk.red('_________________ERROR_______________'));
        logger.error(chalk.red(err.message));
        logger.info(chalk.red('_________________ERROR_______________'));
        return res.status(err.status || 500).send(err.message);
    });


    /////////////////////////////////////////////////////////////////
    // ROUTES ///////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////
    require('../backend/routes/')(app);

    /////////////////////////////////////////////////////////////////
    // WEB SERVER /////////////////////////////////////
    /////////////////////////////////////////////////////////////////
    var server = http.createServer(app);

    app.set('port', process.env.PORT || 8000);
    return http.createServer(app);
};
