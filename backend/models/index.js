exports = module.exports = function(mongoose) {
    require('./TokenModel')(mongoose);
    require('./UserModel')(mongoose);
    require('./ESModel');
};