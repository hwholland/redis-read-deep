function request() {
    const get = require('simple-get');
    get('http://127.0.0.1:3003/read/deep/business:nodes', function(err, res) {
        if (err) { 
            throw err;
        }
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            console.log("request/response: " + chunk);
            
        });
    });
}

request();