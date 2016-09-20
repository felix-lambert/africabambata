var mysql    = require("mysql");
var fs       = require('fs');
var readline = require('readline');
var path     = require('path');
var username;
var password;
var fs       = require('fs');
var path     = require('path');
var Pool     = require('generic-pool').Pool;
var logger   = require('../../utils/logger');

// Buffer mydata
var username = bufferFile('../../config/username.txt');
var password = bufferFile('../../config/password.txt');
var database = bufferFile('../../config/database.txt');
var host     = bufferFile('../../config/host.txt');

function bufferFile(relPath) {
    return fs.readFileSync(path.join(__dirname, relPath), { encoding: 'utf8' });
}

host     = host.replace(/\r?\n|\r/g, "");
username = username.replace(/\r?\n|\r/g, "");
password = password.replace(/\r?\n|\r/g, "");
database = database.replace(/\r?\n|\r/g, "");

var pool = new Pool({
  name     : 'mysql',
  create   : function(callback) {
    var c = mysql.createConnection({
      multipleStatements: true,
      host: host,
      user: username,
      password: password,
      database: database
    });
    // parameter order: err, resource
    callback(null, c);
  },
  destroy  : function(client) { client.end(); },
    max      : 10,
    // specifies how long a resource can stay idle in pool before being removed
    idleTimeoutMillis : 30000
});

module.exports = pool;