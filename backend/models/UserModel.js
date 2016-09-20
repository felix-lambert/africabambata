exports = module.exports = function(mongoose) {

    /*
     * Module dependencies
     */
    var Schema                = mongoose.Schema;
    var Token                 = mongoose.model('Token');
    var moment                = require('moment');
    var jwt                   = require('jwt-simple');
    var passportLocalMongoose = require('passport-local-mongoose');
    var tokenSecret           = 'bloc';

    var UserSchema = new Schema({
        email: {
            type: String,
            lowercase: true,
            unique: true,
            sparse: true,
            index: {
                unique: true
            }
        },

        anonymUsername: String,
        token: {
            type: Object
        },
        username: {
            type: String,
            unique: true,
            sparse: true,
        },
        password: String,
        DATE_CREATE: {
            type: Date,
            default: Date.now
        },
        guest: Boolean,
        created: Date,
        FORMATTED_DATE: Date
    });

    UserSchema.statics = {

        createUserToken: function(email, session, user_id, cb) {

            var self = this;
            this.findOne({
                email: email
            }, function(err, usr) {
                if (err || !usr) {
                    console.log('err');
                }
                
                usr.token = new Token({
                    token: token,
                    session: session,
                    user_id: user_id
                });
                usr.save(function(err, usr) {
                    cb(err ? err : false, usr.token.token);
                });
            });
        },

        getUserToken: function(email, token, cb) {
            var self = this;
            this.findOne({
                email: email
            })
            .exec(function(err, usr) {
                if (err || !usr) {
                    cb(err, null);
                } else if (usr.token && usr.token.token && token === usr.token.token) {
                    FORMATTED_DATE = moment(usr.DATE_CREATED).format('DD/MM/YYYY');
                    usr.FORMATTED_DATE = FORMATTED_DATE;
                    cb(false, usr);
                } else {
                    cb(false, usr);
                }
            });
        },



        invalidateUserToken: function(email, cb) {
            var self = this;
            this.findOne({
                email: email
            }, function(err, usr) {
                if (err) {
                    cb(err);
                } else if (!usr) {
                    cb(null);
                }
                usr.token = null;
                usr.save(function(err, usr) {
                    cb(err ? err : false, err ? null : 'removed');
                });
            });
        }
    };

    UserSchema.plugin(passportLocalMongoose, {
        usernameField: 'email',
        usernameLowerCase: true
    });

    // create the model for User and expose it to our app
    mongoose.model('User', UserSchema);
};