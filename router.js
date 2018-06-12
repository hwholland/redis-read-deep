const redis = require('./redis');
const hash = require('./hash');
const list = require('./list');
const uuid = require('uuid/v1');
//var argv = require('minimist')(process.argv.slice(2));

function router(oApp, oExpress) {
    'use strict';
    this.router = oExpress.Router();
    this.app = oApp;
    this.app.use(this.router);
    this.redisHost = '127.0.0.1';
    this.redisPort = 6379;
    this.redisInstance = 0;
    this.subscribeClient = new redis(this.redisHost, this.redisPort, this.redisInstance);
    this.publishClient = new redis(this.redisHost, this.redisPort, this.redisInstance);
}

router.prototype.loadRoutes = function() {
    'use strict';
    var that = this;

    this.app.get("/read/deep/*", function(oRequest, oResponse) {
        var listKey = oRequest.params[0];
        var pubList = new list(listKey);
        function hashCallback(channel, message) {
            oResponse.send(message);
        }
        function listCallback(pattern, channel, message) {
            message = JSON.parse(message);
            var records = new hash(message);
            records.publish(that.publishClient, that.subscribeClient, hashCallback);
        }
        pubList.publish(that.publishClient, that.subscribeClient, listCallback);
    });
};

router.prototype.setMiddleware = function(sName, oMiddleware, mSettings) {
    'use strict';
    this[sName] = oMiddleware;
    var oProperties = Object.getOwnPropertyNames(mSettings);
    for (var i = 0; i < oProperties.length; i++) {
        this[oProperties[i]] = mSettings[oProperties[i]];
    }
};

module.exports = router;