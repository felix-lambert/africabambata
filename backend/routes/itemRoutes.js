/*
 * Module dependencies
 */
var path     = require('path');
var ItemCtrl = require('../controllers/itemCtrl');
var auth     = require('../authentification/auth');

var routes = [{
    path: '/api/items/freshdirect',
    httpMethod: 'POST',
    middleware: [auth.ensureAuthenticated, ItemCtrl.freshdirect]
}, {
    path: '/api/items/peapod',
    httpMethod: 'POST',
    middleware: [auth.ensureAuthenticated, ItemCtrl.peapod]
}, {
    path: '/api/items/safeway',
    httpMethod: 'POST',
    middleware: [auth.ensureAuthenticated, ItemCtrl.safeway]
}, {
    path: '/api/items/shipt',
    httpMethod: 'POST',
    middleware: [auth.ensureAuthenticated, ItemCtrl.shipt]
}, {
    path: '/api/items/walmart',
    httpMethod: 'POST',
    middleware: [auth.ensureAuthenticated, ItemCtrl.walmart]
}, {
    path: '/api/items/instacart',
    httpMethod: 'POST',
    middleware: [auth.ensureAuthenticated, ItemCtrl.instacart]
}, {
    path: '/api/items/link',
    httpMethod: 'POST',
    middleware: [auth.ensureAuthenticated, ItemCtrl.link]
}, {
    path: '/api/items/editLink',
    httpMethod: 'POST',
    middleware: [auth.ensureAuthenticated, ItemCtrl.editLink]
}, {
    path: '/api/items/addLink',
    httpMethod: 'POST',
    middleware: [auth.ensureAuthenticated, ItemCtrl.addLink]
}, {
    path: '/api/items/publish',
    httpMethod: 'POST',
    middleware: [auth.ensureAuthenticated, ItemCtrl.publishLink]
}, {
    path: '/api/items/cancelpublish/:id',
    httpMethod: 'DELETE',
    middleware: [auth.ensureAuthenticated, ItemCtrl.cancelPublish]
}];

module.exports = routes;