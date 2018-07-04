const express = require("express");
const app = express();
const https = require("https");

const { getToken, getTweets } = require("./myTwApi");

app.use(express.static("./public"));

app.get("/links.json", function(req, res) {
    getToken(function(err, token) {
        if (err) {
            res.sendStatus(500);
        } else {
            getTweets(token, function(err, tweets) {
                if (err) {
                    res.sendStatus(500);
                } else {
                    let data = [];
                    for (var i = 0; i < tweets.length; i++) {
                        if (tweets[i].entities.urls.length == 1) {
                            data.push({
                                text: tweets[i].text,
                                href: tweets[i].entities.urls[0].url
                            });
                        }
                    }
                    res.json(data);
                }
            });
        }
    });
});

app.listen(8080, () => console.log("Listening on 8080"));
