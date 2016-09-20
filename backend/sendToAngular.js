/////////////////////////////////////////////////////////////////////////////////////////////////////////
// SEND /////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.send = function send(result, body, done) {
    if (result.statusCode !== 404) {
        if (body) {
            try {
                body = JSON.parse(body);
            } catch (e) {
                return done(e);
            }
            if (body.is_logged_in === true && body.success === true) {
                return done(null, body);
            } else if (body.is_logged_in === false) {
                return done({
                    status: 400,
                    message: 'Not logged in'
                });
            } else {
                return done({
                    status: 400,
                    message: body.message
                });
            }
        }
    } else {
        return done({
            status: 404,
            message: 'page not found!'
        });
    }
};