/*
 * Module dependencies
 */
var path      = require('path');
var RecipeCtrl = require('../controllers/recipeCtrl');
var auth      = require('../authentification/auth');

var routes = [{
    path: '/api/recipe/create',
    httpMethod: 'POST',
    middleware: [auth.ensureAuthenticated, RecipeCtrl.create]
}, {
    path: '/api/recipe/add',
    httpMethod: 'POST',
    middleware: [auth.ensureAuthenticated, RecipeCtrl.add]
}, {
    path: '/api/recipe/get/:id',
    httpMethod: 'GET',
    middleware: [auth.ensureAuthenticated, RecipeCtrl.get]
}, {
    path: '/api/recipe/getall/:id',
    httpMethod: 'GET',
    middleware: [auth.ensureAuthenticated, RecipeCtrl.getAll]
}, {
    path: '/api/recipe/parse/:id',
    httpMethod: 'GET',
    middleware: [auth.ensureAuthenticated, RecipeCtrl.parse]
}, {
    path: '/api/recipe/destroy',
    httpMethod: 'POST',
    middleware: [auth.ensureAuthenticated, RecipeCtrl.destroy]
}, {
    path: '/api/recipe/eraze/:id',
    httpMethod: 'DELETE',
    middleware: [auth.ensureAuthenticated, RecipeCtrl.eraze]
}, {
    path: '/api/recipe/edit',
    httpMethod: 'POST',
    middleware: [auth.ensureAuthenticated, RecipeCtrl.edit]
}, {
    path: '/api/recipe/editinfo',
    httpMethod: 'POST',
    middleware: [auth.ensureAuthenticated, RecipeCtrl.editInfo]
}, {
    path: '/api/recipe/testLinked/:id',
    httpMethod: 'GET',
    middleware: [auth.ensureAuthenticated, RecipeCtrl.testLinked]
}, {
    path: '/api/recipe/deleteandedit',
    httpMethod: 'POST',
    middleware: [auth.ensureAuthenticated, RecipeCtrl.deleteAndEdit]
}, {
    path: '/api/recipe/ingredientsave',
    httpMethod: 'POST',
    middleware: [auth.ensureAuthenticated, RecipeCtrl.ingredientSave]
}];

module.exports = routes;