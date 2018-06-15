const fs = require('fs');
const https = require('https');

exports.prop = obj => name =>
    obj ? obj[name] : null;

exports.matchRegex = regex => param =>
    regex.exec(param);

exports.matchRegexGroup = regex => param =>
    exports.prop(exports.matchRegex(regex)(param))('groups');

exports.readFile = filename => {
    return new Promise((success, failure) => {
        fs.readFile(filename, "ascii", function(err, data) {
            if (err) {
                failure(err);
            } else {
                success(data);
            }
        });
    });
};

exports.ls = directory => {
    return new Promise((success, failure) => {
        fs.readdir(directory, (err, files) => {
            if (err) {
                failure(err);
            } else {
                success(files);
            }
        });
    });
};

exports.getJSON = url => {
    return new Promise((success, failure) => {
        https.get(url, res => {
            res.setEncoding("utf8");
            let body = "";
            res.on("data", data => {
                body += data;
            });
            res.on("end", () => {
                body = JSON.parse(body);
                success(body);
            });
            res.on("error", (error) => {
                failure(error);
            });
        });
    });
};

exports.getJSONTransformed = (url, transformFunc) => {
    return new Promise((success, failure) => {
        exports.getJSON(url)
        .then((res) => success(transformFunc(res)))
        .catch(failure);
    });
}
