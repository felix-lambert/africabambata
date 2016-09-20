/*
 * Module dependencies
 */
var path      = require('path');
var FoodsCtrl = require('../controllers/foodCtrl');
var auth      = require('../authentification/auth');

var routes = [{
    path: '/api/foods',
    httpMethod: 'GET',
    middleware: [auth.ensureAuthenticated, FoodsCtrl.foods]
}, {
    path: '/api/parentfood/:id',
    httpMethod: 'GET',
    middleware: [auth.ensureAuthenticated, FoodsCtrl.edit]
}, {
    path: '/api/searchfood',
    httpMethod: 'POST',
    middleware: [auth.ensureAuthenticated, FoodsCtrl.search]
}, {
    path: '/api/parentfood/addItem',
    httpMethod: 'POST',
    middleware: [auth.ensureAuthenticated, FoodsCtrl.add]
}, {
    path: '/api/parentfood/removeItem',
    httpMethod: 'POST',
    middleware: [auth.ensureAuthenticated, FoodsCtrl.remove]
}, {
    path: '/api/retailer/list',
    httpMethod: 'GET',
    middleware: [auth.ensureAuthenticated, FoodsCtrl.retailerList]
}, {
    path: '/api/ingredient',
    httpMethod: 'POST',
    middleware: [auth.ensureAuthenticated, FoodsCtrl.ingredient]
}, {
    path: '/api/ingredientrecipe',
    httpMethod: 'POST',
    middleware: [auth.ensureAuthenticated, FoodsCtrl.ingredientRecipe]
}, {
    path: '/api/retailer/linked',
    httpMethod: 'POST',
    middleware: [auth.ensureAuthenticated, FoodsCtrl.isLinked]
}, {
    path: '/api/findname/:foodId',
    httpMethod: 'GET',
    middleware: [auth.ensureAuthenticated, FoodsCtrl.findName]
}, {
    path: '/api/parentfood/editmain',
    httpMethod: 'POST',
    middleware: [auth.ensureAuthenticated, FoodsCtrl.editMain]
}, {
    path: '/api/retailer/allLinked',
    httpMethod: 'POST',
    middleware: [auth.ensureAuthenticated, FoodsCtrl.allLinked]
}];

module.exports = routes;