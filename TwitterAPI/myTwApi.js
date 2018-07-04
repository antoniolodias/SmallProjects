const https = require("https");
const { consumerKey, consumerSecret } = require("./secrets");

function getToken(callback) {
    var options = {
        method: "POST",
        host: "api.twitter.com",
        path: "/oauth2/token",
        headers: {
            Authorization:
                "Basic " +
                new Buffer(consumerKey + ":" + consumerSecret).toString(
                    "base64"
                ),
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
        }
    };

    var cb = res => {
        if (res.statusCode != 200) {
            callback(new Error(res.statusCode));
            return;
        }
        var body = "";
        res.on("data", chunk => {
            body += chunk;
        });
        res.on("end", () => {
            try {
                callback(undefined, JSON.parse(body));
            } catch (e) {
                callback(e);
            }
        });
    };
    const req = https.request(options, cb);

    req.write("grant_type=client_credentials");
    req.end();
}

function getTweets(token, callback) {
    const req = https.request(
        {
            method: "GET",
            host: "api.twitter.com",
            path: "/1.1/statuses/user_timeline.json?screen_name=cnn",
            headers: {
                Authorization: "Bearer " + token.access_token
            }
        },
        function(res) {
            var body = "";
            res.on("data", function(chunk) {
                body += chunk;
            });
            res.on("end", function() {
                try {
                    callback(undefined, JSON.parse(body));
                } catch (e) {
                    callback(e);
                }
            });
        }
    );
    req.end();
}

exports.getToken = getToken;
exports.getTweets = getTweets;
