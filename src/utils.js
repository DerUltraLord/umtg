const https = require("https");

exports.getJSON = (url, callback, fail) => {

    https.get(url, res => {
        res.setEncoding("utf8");
        let body = "";
        res.on("data", data => {
            body += data;
        });
        res.on("end", () => {
            body = JSON.parse(body);
            callback(body);
        });
        if (fail) {
            res.on("error", () => {
                fail();
            });
        }
    });

};
