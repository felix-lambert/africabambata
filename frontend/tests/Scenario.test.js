describe('avocadoo', function(){

    var width  = 1400;
    var height = 800;
    browser.driver.manage().window().setSize(width, height);

    it('should automatically redirect to / when location hash/fragment is empty', function() {
        browser.get('/');
        expect(browser.getLocationAbsUrl()).toMatch("/");
    });

    var email       = element(by.model('user.login'));
    var password    = element(by.model('user.password'));
    var loginButton = element(by.id('send'));

    it('should redirect an invalid email address and password', function() {
        email.sendKeys('lambertfeleix8@gmail.com');
        password.sendKeys('testtestr');
        loginButton.click();
        expect(browser.getCurrentUrl()).toEqual('https://localhost:3000/');
    });

    it('should press ok', function() {
        element(by.css('.confirm')).click().then(function () {
            expect(browser.getCurrentUrl()).toEqual('https://localhost:3000/');
        });
    });

    it('should accept a valid email address and password', function() {
        browser.driver.manage().deleteAllCookies();
        email.clear();
        password.clear();
        email.sendKeys('sysadmin@avocadoo.com');
        password.sendKeys('Gandhi84');
        loginButton.click();
        expect(browser.getCurrentUrl()).toEqual('https://localhost:3000/main');
    });

    it('should press ok', function() {
       element(by.css('.confirm')).click().then(function () {
            expect(browser.getCurrentUrl()).toEqual('https://localhost:3000/main');
       });
    });

    it('should go to admin page', function(){
        element(by.id('admin')).click().then(function() {
            expect(browser.getLocationAbsUrl()).toMatch("/admin");
        });
    });

    it('should go to parentfood page', function(){
        element(by.id('parent')).click().then(function() {
            expect(browser.getLocationAbsUrl()).toMatch("/admin/parentfood");
        });
    });

    var search   = element(by.model('searchText'));
    var itemList = element.all(by.repeater('food in foods'));

    it('should do pagination', function(){
        element(by.id('next')).click().then(function() {
            expect(itemList.count()).toEqual(50);
        });
    });

    it('should do pagination', function(){
        element(by.id('next')).click().then(function() {
            expect(itemList.count()).toEqual(50);
        });
    });

    it('should do pagination', function(){
        element(by.id('next')).click().then(function() {
            expect(itemList.count()).toEqual(50);
        });
    });

    it('should do pagination', function(){
        element(by.id('next')).click().then(function() {
            expect(itemList.count()).toEqual(50);
        });
    });
    
    it('should do pagination', function(){
        element(by.id('begin')).click().then(function() {
            expect(itemList.get(0).getText()).toEqual('Acai');
        });
    });


    it('should search for items', function(){
        search.sendKeys('Soup').then(function () {
            expect(itemList.count()).toEqual(2);
            expect(itemList.get(0).getText()).toEqual('Lentil soup');
        });
    });

    it('should control items per page', function(){
        var pageSize = element(by.model('pageSize'));
        pageSize.clear();
        search.clear();
        pageSize.sendKeys(20).then(function () {
            expect(itemList.count()).toEqual(20);
        });
    });

    it('should click on an item', function(){
        search.sendKeys('Soup').then(function () {
            var elem = element(by.repeater('food in foods')
            .row(0))
            .$('#cl')
            .click().then(function (args) {
                expect(browser.getLocationAbsUrl()).toMatch("/admin/parentfood/246");
            });
        });
    });

    var name     = element(by.model('food.name'));
    var Button   = element(by.id('searchMeal'));
    var mealList = element.all(by.repeater('meal in meals'));
    var foodList = element.all(by.repeater('food in foods'));

    it('should find a meal', function(){
        name.sendKeys('sugar');
        Button.click();
        expect(mealList.count()).toEqual(3);
    });


    it('should add a meal as parent food', function(){
        element(by.repeater('meal in meals')
            .row(0))
            .$('#add')
            .click().then(function (args) {
                expect(foodList.count()).toEqual(3);
                expect(foodList.get(2).getText()).toEqual('Sugar');
            });
    });

    it('should add a meal as parent food (main item)', function(){
        element(by.repeater('meal in meals')
            .row(1))
            .$('#addMain')
            .click().then(function (args) {
                expect(foodList.count()).toEqual(4);
                expect(foodList.get(3).getText()).toEqual('Sugar');
            });
    });

    it('should refresh page and check if meal is added', function(){
        browser.refresh();
        name.sendKeys('sugar');
        Button.click();
        expect(foodList.get(0).isDisplayed()).toBe(true);
    });

    it('should retrieve a parent food', function(){
        element(by.repeater('food in foods')
            .row(3))
            .$('#retrieve')
            .click().then(function (args) {
                expect(foodList.count()).toEqual(3);
            });
    });

    it('should retrieve a parent food', function(){
        element(by.repeater('food in foods')
            .row(2))
            .$('#retrieve')
            .click().then(function (args) {
                expect(foodList.count()).toEqual(2);
            });
    });

    it('should control items per page for meals', function(){
        var pageSize = element(by.model('pageSize'));
        pageSize.clear();
        pageSize.sendKeys(2).then(function () {
            expect(mealList.count()).toEqual(2);
        });
    });

    it('should control items per page for foods', function(){
        var pageSize = element(by.model('foodPageSize'));
        pageSize.clear();
        pageSize.sendKeys(1).then(function () {
            expect(foodList.count()).toEqual(1);
        });
    });

    it('should order by food name', function() {
        element(by.id('order')).click().then(function () {
            element(by.id('order')).click().then(function () {
                expect(foodList.get(0).getText()).toEqual("Amy's Organic Lentil Soup (Light in Sodium)");
            });
        });
    });

    var searchF   = element(by.model('searchItem.name'));

    it('should test filter for food name', function(){
        searchF.sendKeys('Lentil S').then(function () {
            expect(foodList.count()).toEqual(1);
            expect(foodList.get(0).getText()).toEqual("Amy's Organic Lentil Soup (Light in Sodium)");
        });
    });

    it('should go back to parent food list', function(){
        element(by.id('back')).click().then(function() {
            expect(browser.getLocationAbsUrl()).toMatch("/admin/parentfood");
        });
    });

    it('should go back to parent food list', function(){
        element(by.id('back')).click().then(function() {
            expect(browser.getLocationAbsUrl()).toMatch("/admin");
        });
    });

    it('should go to parentfood page', function(){
        element(by.id('ingredient')).click().then(function() {
            expect(browser.getLocationAbsUrl()).toMatch("/admin/ingredientalias");
        });
    });

    var searchIngredient = element(by.model('ingredient'));
    var ingredientList   = element.all(by.repeater('ingredient in ingredients'));


    it('should search for sugar', function(){
        searchIngredient.sendKeys('sugar').then(function () {
            expect(ingredientList.count()).toEqual(50);
        });
    });

    it('should control items per page for ingredients', function(){
        var pageSize = element(by.model('pageSize'));
        pageSize.clear();
        pageSize.sendKeys(23).then(function () {
            expect(ingredientList.count()).toEqual(23);
        });
    });

    var searchText = element(by.model('searchText'));

    it('should refilter sugar to sugar syrup', function() {
        searchText.sendKeys('sugar s').then(function () {
            expect(ingredientList.get(0).getText()).toEqual("sugar spices");
        });
    });

    it('should go on an ingredient', function(){
        var elem = element(by.repeater('ingredient in ingredients')
        .row(1))
        .$('#cl')
        .click().then(function (args) {
            expect(browser.getLocationAbsUrl()).toMatch("/admin/editingredientalias/49908");
        });
    });

    // it('should find for a', function(){
    //     searchText.sendKeys('').then(function () {
    //         searchIngredient.sendKeys('artificial').then(function () {
    //             expect(ingredientList.get(0).getText()).toEqual("artificial");
    //         });
    //     });

    // });

    // it('should do pagination', function(){
    //     element(by.id('next')).click().then(function() {
    //         expect(ingredientList.count()).toEqual(50);
    //     });
    // });

    // it('should do pagination', function(){
    //     element(by.id('next')).click().then(function() {
    //         expect(ingredientList.count()).toEqual(50);
    //     });
    // });

    // it('should do pagination', function(){
    //     element(by.id('next')).click().then(function() {
    //         expect(ingredientList.count()).toEqual(50);
    //     });
    // });

    // it('should do pagination', function(){
    //     element(by.id('next')).click().then(function() {
    //         expect(ingredientList.count()).toEqual(50);
    //     });
    // });

    // it('should do pagination', function(){
    //     element(by.id('next')).click().then(function() {
    //         expect(ingredientList.count()).toEqual(50);
    //     });
    // });


    // it('should do pagination', function(){
    //     element(by.id('begin')).click().then(function() {
    //         expect(ingredientList.count()).toEqual(50);
    //     });
    // });


    // it('should refilter sugar to artificial flavors', function() {
    //     searchText.sendKeys('artificial flavors').then(function () {
    //         expect(ingredientList.count()).toEqual(6);
    //     });
    // });

    // it('should check items per page', function() {
    //     var pageSize = element(by.model('pageSize'));
    //     pageSize.clear();
    //     pageSize.sendKeys(2).then(function () {
    //         expect(ingredientList.count()).toEqual(2);
    //     });
    // });

    var itList = element.all(by.repeater('item in items'));

    it('should order by item name', function() {
        element(by.id('order')).click().then(function () {
            element(by.id('order')).click().then(function () {
                expect(itList.count()).toEqual(4);
            });
        });
    });

    var searchNew = element(by.model('searchItem.name'));

    it('should go back to parent food list', function(){
        element(by.id('back')).click().then(function() {
            expect(browser.getLocationAbsUrl()).toMatch("/admin/ingredientalias");
        });
    });

    it('should go back to parent food list', function(){
        element(by.id('back')).click().then(function() {
            expect(browser.getLocationAbsUrl()).toMatch("/admin");
        });
    });

    it('should go to recipe page', function(){
        element(by.id('rec')).click().then(function() {
            expect(browser.getLocationAbsUrl()).toMatch("/recipes");
        });
    });
    
    // var recipeUrl     = element(by.model('recipe.url'));
    // var recipeName    = element(by.model('recipe.name'));
    // var recipePicture = element(by.model('recipe.picture'));
    // var recipe        = element(by.model('recipe.ingredients'));
    // var parseButton   = element(by.id('parse'));

    // it('should parse recipe', function() {
    //     recipeUrl.sendKeys('http://yummly.com/recipefortest');
    //     recipeName.sendKeys('recipefortest');
    //     recipePicture.sendKeys('http://yummly.com/recipefortest/picture');
    //     recipe.sendKeys("4 (6 ounce) fillets salmon\n2 tablespoons olive oil\n2 tablespoons capers\n1/8 teaspoon salt\n1/8 teaspoon ground black pepper\n4 slices lemon");
    //     parseButton.click();
    //     expect(browser.getCurrentUrl()).toEqual('https://localhost:3000/admin/monitorrecipe/17');
    // });

    it('should return to the login page after logout', function() {
        element(by.id('logout')).click().then(function () {
            expect(browser.getLocationAbsUrl()).toMatch("/");
        });
    });

});