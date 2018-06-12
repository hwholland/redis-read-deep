const redis = require('./redis');
const uuid = require('uuid/v1');

function hash(list) {
    this.list = list;
}

hash.prototype.publish = function(publishClient, subscribeClient, callback) {
    var redisChannel = 'view:hash:data';
    var uId = uuid();
    var data = {
        publishTo: uId,
        keys: this.list
    };
    subscribeClient.subscribe(uId, callback);
    publishClient.publish(redisChannel, JSON.stringify(data));

};

module.exports = hash;