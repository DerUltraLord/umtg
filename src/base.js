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

exports.writeFile = (filename, contents) => {
    return new Promise((success, failure) => {
        fs.writeFile(filename, contents, (err) => {
            if (err) {
                failure(err);
            } else {
                success();
            }

        })
    });

};

exports.ls = directory =>
    exports._simpleCallbackFunctionToPromise(fs.readdir)([directory]);

exports.mkdir = directory => 
    exports._simpleCallbackFunctionToPromise(fs.mkdir)([directory]);

exports.isdir = path =>
    fs.lstatSync(path).isDirectory();

exports.isfile = path =>
    fs.lstatSync(path).isFile();

exports._simpleCallbackFunctionToPromise = func => args => {
    return new Promise((success, failure) => {
        let cb = ((err, res) => {
            if (err) {
                failure(err);
            } else {
                res ? success(res) : success();
            }
        });
        args.push(cb);
        func.apply(null, args);
    });
}


exports.getJSON = url => {
    return new Promise((success, failure) => {
        console.log("HIER");
        console.log(url);
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
