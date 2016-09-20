/*
 * Module dependencies
 */
var path      = require('path');
var AliasCtrl = require('../controllers/aliasCtrl');
var auth      = require('../authentification/auth');

var routes = [{
    path: '/api/ingredient/get/:id',
    httpMethod: 'GET',
    middleware: [auth.ensureAuthenticated, AliasCtrl.get]
}, {
    path: '/api/ingredient/addAliases',
    httpMethod: 'POST',
    middleware: [auth.ensureAuthenticated, AliasCtrl.add]
} 
];

module.exports = routes;