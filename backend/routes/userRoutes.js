/*
 * Module dependencies
 */
var path     = require('path');
var UserCtrl = require('../controllers/userCtrl');
var auth     = require('../authentification/auth');

var routes = [{
    path: '/api/user/login',
    httpMethod: 'POST',
    middleware: [UserCtrl.login]
}, {
    path: '/api/user/logout',
    httpMethod: 'DELETE',
    middleware: [auth.ensureAuthenticated, UserCtrl.logout]
}, {
    path: '/api/user/status',
    httpMethod: 'POST',
    middleware: [auth.ensureAuthenticated]
}];

module.exports = routes;