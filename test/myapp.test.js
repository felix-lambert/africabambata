// test/myapp.test.js
var assert = require('chai').assert;
var request = require('supertest');
var server = require('./myapp');
var app = server();

it('get /api/foods return a 302 response', function(done) {
    request(app)
        .get('/api/foods')
        .expect(302, done);
});

it('get /api/parentfood/:id/ return a 302 response', function(done) {
    request(app)
        .get('/api/parentfood/12568746456546')
        .expect(302, done);
});

it('Login user', function(done) {
    request(app).post('/api/user/login')
        .send({
            login: 'frepirtjiupghtr',
            password: 'frejrpijgtripjgtr'
        })
        .expect(400, done);
});

it('Login user', function(done) {
    request(app).post('/auth/login')
        .send({
            login: 'frepirtjiupghtr@gmail.com',
            password: 'frejrpijgtripjgtr'
        })
        .expect(404, done);
});

var Token;

describe('Token session', function() {
    it("When I send a request to log in", function(done) {
        request(app).post('/api/user/login')
        .set('Accept','application/json')
        .send({
            login: 'sysadmin@avocadoo.com',
            password: 'Gandhi84'
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
            Token = res.body.token;
            done();
        });
    });

    it("And I get an ingredient with a wrong id", function(done) {
        request(app)
        .get('/api/ingredient/get/45455686788')
        .set('auth-token', Token)
        .expect(400, done)
    });

    it("And I get all ingredients with no params", function(done) {
        request(app)
        .post('/api/ingredient')
        .set('auth-token', Token)
        .expect(400, done)
    });

    var id;

    it("And I get all ingredients with size 20", function(done) {
        request(app)
        .post('/api/ingredientrecipe')
        .send({
            name: 'sugar'
        })
        .set('auth-token', Token)
        .expect(200)
        .end(function (err, res) {
            done();
        });
    });

    it("And I search unit with size 20", function(done) {
        request(app)
        .post('/api/unit')
        .send({
            name: 'grams'
        })
        .set('auth-token', Token)
        .expect(200)
        .end(function (err, res) {
            done();
        });
    });

    it("And I get all ingredients with size 1000", function(done) {
        request(app).post('/api/items/ingredient').send({
            name: 'sugar'
        })
        .set('auth-token', Token)
        .expect(200)
        .end(function (err, res) {
            done();
        });
    });

    it("And I get items from safeway", function(done) {
        request(app).post('/api/items/safeway').send({
            name: 'sugar'
        })
        .set('auth-token', Token)
        .expect(200)
        .end(function (err, res) {
            done();
        });
    });

    it("And I get items from peapod", function(done) {
        request(app).post('/api/items/peapod').send({
            name: 'sugar'
        })
        .set('auth-token', Token)
        .expect(200)
        .end(function (err, res) {
            done();
        });
    });


    it("And I get items from shipt", function(done) {
        request(app).post('/api/items/shipt').send({
            name: 'sugar'
        })
        .set('auth-token', Token)
        .expect(200)
        .end(function (err, res) {
            done();
        });
    });

    it("And I get items from freshdirect", function(done) {
        request(app).post('/api/items/freshdirect').send({
            name: 'sugar'
        })
        .set('auth-token', Token)
        .expect(200)
        .end(function (err, res) {
            done();
        });
    });


    it("And I get items from walmart", function(done) {
        request(app).post('/api/items/walmart').send({
            name: 'sugar'
        })
        .set('auth-token', Token)
        .expect(200)
        .end(function (err, res) {
            done();
        });
    });

    it("And I get items from instacart", function(done) {
        request(app).post('/api/items/instacart').send({
            name: 'sugar'
        })
        .set('auth-token', Token)
        .expect(200)
        .end(function (err, res) {
            done();
        });
    });

    it("And I get the recipes", function(done) {
        request(app)
        .get('/api/recipe/get/' + 9047)
        .set('auth-token', Token)
        .expect(200, done)
    });



    it("And I get an ingredient with a good id", function(done) {
        request(app)
        .get('/api/ingredient/get/' + 9047)
        .set('auth-token', Token)
        .expect(200, done)
    });

    it("And I add item as parent food", function(done) {
        request(app)
        .post('/api/parentfood/addItem')
        .send({
            item_id: "208116",
            parent_food_id: "527"
        })
        .set('auth-token', Token)
        .expect(200, done)
    });

    it("And I remove item as parent food", function(done) {
        request(app)
        .post('/api/parentfood/removeItem')
        .send({
            item_id: "208116",
            parent_food_id: "527"
        })
        .set('auth-token', Token)
        .expect(200, done)
    });

    it("And I list retailers", function(done) {
        request(app)
        .get('/api/retailer/list')
        .set('auth-token', Token)
        .expect(200, done)
    });

    var id;

    it("And I list foods", function(done) {
        request(app)
        .get('/api/foods')
        .set('auth-token', Token)
        .expect(200)
        .end(function (err, result) {
            id = result.body.parent_foods[0].id;
            done();
        });
    });

    it("And I list parent foods", function(done) {
        request(app)
        .get('/api/parentfood/' + id)
        .set('auth-token', Token)
        .expect(200, done)
    });

    it("And I search for items", function(done) {
        this.timeout(15000);
        setTimeout(done, 15000);
        request(app)
        .post('/api/searchfood')
        .send({
            name: "sugar"
        })
        .set('auth-token', Token)
        .expect(200, done)
    });


    it("And I search for not found items", function(done) {
        this.timeout(15000);
        setTimeout(done, 15000);
        request(app)
        .post('/api/searchfood')
        .send({
            name: "dezfrrgtrgtrtgrtr"
        })
        .set('auth-token', Token)
        .expect(400, done)
    });


    it("And I disconnect to session", function(done) {
        request(app)
        .delete('/api/user/logout')
        .set('auth-token', Token)
        .expect(200, done)
    });
});

it('Login', function(done) {
    request(app).post('/api/user/login')
        .send({
            email: 'lambertfelix8@gmail.com',
            password: 'lebarbfrerfdn'
        })
        .expect(400, done)
});


it('Logout', function(done) {
    request(app)
        .delete('/api/user/logout')
        .set('auth-token', 'ifuheriuhreiuhpruguit')
        .expect(401, done)
});




// it('When I send a request to log in', function(done) {
//     request(app).post('/api/user/login')
//         .send({
//             email: 'lambertfelix8@gmail.com',
//             password: 'lebarbarelemelodn'
//         }), done
// });

// it('And I disconnected user', function(done) {
//     request(app).post('/api/user/login')
//         .send({
//             email: 'lambertfelix8@gmail.com',
//             password: 'lebarbarelemelodn'
//         }), done
// });
