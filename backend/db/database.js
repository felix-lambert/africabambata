
if (process.env.NODE_ENV == 'prod') {
    var urlMongo = 'mongodb://localhost/marketplace_prod';
} else if (process.env.NODE_ENV == 'preprod') {
    var urlMongo = 'mongodb://localhost/marketplace_pre';
} else {
    var urlMongo = 'mongodb://localhost/marketplace';
}

module.exports = {
    port: process.env.PORT || 3000,
    db: urlMongo
};