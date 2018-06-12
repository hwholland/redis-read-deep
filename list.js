const redis = require('./redis');
const hash = require('./hash');
const uuid = require('uuid/v1');

function list(key) {
    this.key = 'view:list:' + key;
}

list.prototype.publish = function(publishClient, subscribeClient, callback) {
    var uId = uuid();
    subscribeClient.psubscribe(uId, callback);
    publishClient.publish(this.key, uId);
};

module.exports = list;