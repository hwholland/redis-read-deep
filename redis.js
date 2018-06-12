function redis(redisHost, redisPort, redisInstance) {
    this.client = require('redis').createClient({
        host: redisHost,
        port: redisPort
    });
    this.host = redisHost;
    this.port = redisPort;
    this.instance = redisInstance;
    this.connect(this.instance);

}

redis.prototype.connect = function(instance) {
    this.client.select(instance, function(error, response) {
        if (error) {
            return error;
        }
    });

    this.client.on("error", function(error) {
        // TODO: Replace with hook into sentry
        console.log("Error connecting to client: " + error);
    });
};

redis.prototype.publish = function(channel, data) {
    this.client.publish(channel, data);
};

redis.prototype.psubscribe = function(channel, callback) {
    this.client.on("pmessage", callback);
    this.client.psubscribe(channel);
};

redis.prototype.subscribe = function(channel, callback) {
    this.client.on("message", callback);
    this.client.subscribe(channel);
};

redis.prototype.quit = function() {
    this.client.quit();
};

module.exports = redis;