var port           = process.env.PORT || 8080;
var chalk          = require('chalk');
var mongoose       = require('mongoose');
var config         = require('./backend/db/database');
var cookieParser   = require('cookie-parser');
var methodOverride = require('method-override');
var bodyParser     = require('body-parser');
var compress       = require('compression');
var elasticsearch  = require("elasticsearch");
var fs             = require('fs');
var https          = require('https');
var logger         = require("./utils/logger");
var express        = require('express');
var app            = express();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

if (process.env.NODE_ENV == 'prod') {
    process.env.API_ROOT = "https://avocadoo.com";
} else if (process.env.NODE_ENV == 'preprod') {
    process.env.API_ROOT = "http://preprod.avocadoo.com";
} else {
    process.env.API_ROOT =  "https://avocadoo.dev";
}

/////////////////////////////////////////////////////////////////
// CONFIG DATA MODELS ////////////////////////
/////////////////////////////////////////////////////////////////
logger.debug('check the models...');
require('./backend/models/')(mongoose);
logger.info('done');

logger.debug('check the config...');
app.use(methodOverride());
app.use(cookieParser());
// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(compress());
app.use('/apidoc', express.static('apidoc'));
app.use(express.static(__dirname + '/frontend/public'));

logger.info('done');

/////////////////////////////////////////////////////////////////
// ROUTES ///////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
logger.debug('check routes...');
require('./backend/routes/')(app);
logger.info('done');

app.all('/*', function(req, res) {
    res.sendFile('index.html', { root: __dirname + '/frontend/public' });
});

app.use(function(err, req, res, next) {
    logger.info(chalk.red('_________________ERROR_______________'));
    logger.error(chalk.red(err.message));
    logger.info(chalk.red('_________________ERROR_______________'));
    return res.status(err.status || 500).send(err.message);
});

console.log('listen');
app.listen(port);

logger.info('Listening on port ' + port);
