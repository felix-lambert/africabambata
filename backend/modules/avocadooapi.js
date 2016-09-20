// var auth    = require('../authentification/auth.js');
var request = require('request');

module.exports = {
    call: call,
    getSessionId: getSessionId,
    createSessionId: createSessionId,
};

function call(path, data, onSuccess, onFailure, onError) {
    // set proxy's url
    console.log('CREATE SESSION_ID');
    createSessionId();
    console.log('SESSION_ID : ' + getSessionId());
    console.log('URL CALLED');
    console.log(process.env.API_ROOT + '/proxy/proxy_marketplace.php' + '?session_id=' + getSessionId() + '&url=' + process.env.API_ROOT + '/api/' + path);
    console.log('API CALL TO ' + path + ' with params : ');
    console.log(data);
    request({
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        jar: true,
        uri: process.env.API_ROOT + '/proxy/proxy_marketplace.php' + '?session_id=' + getSessionId() + '&url=' + process.env.API_ROOT + '/api/' + path,
        form: data,
        method: 'POST',
    }, function(err, result, body) {
        console.log('RESPONSE');
        console.log(body);
        // handle callbacks
        if (null !== onSuccess) {
            onSuccess(err, result, body);
        }
        if (null !== onFailure && undefined !== onFailure) {
            onFailure(err, result, body);
        }
        if (null !== onError && undefined !== onError) {
            onError(err, result, body);
        }
    });
}
/*
 * @param lenght of string returned
 * @return random string for session id generation
 */
function randomString(length, chars) {
  var result = '';
  for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
  return result;
}

/**
 * Get stored session id
 */
function getSessionId() {
  return (null === module.exports.sessionId || undefined === module.exports.sessionId) ? '' : module.exports.sessionId;
}

/**
 * Create and store session id for php session cookie
 */
function createSessionId() {
  if ('' === getSessionId()) {
    process.env.API_SESSION_ID = randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
    module.exports.sessionId = process.env.API_SESSION_ID;
  }
}