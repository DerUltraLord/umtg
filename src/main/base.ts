const fs = require('fs');
const https = require('https');

export function prop(obj, name) {
    return obj ? obj[name] : null;
}

export function matchRegex(regex, param? : any) {
    return regex.exec(param);
}

export function matchRegexGroup(regex, param? : any) {
    return exports.prop(exports.matchRegex(regex, param), 'groups');
}

export function readFile(filename) {
    return new Promise((success, failure) => {
        fs.readFile(filename, 'ascii', function(err, data) {
            if (err) {
                failure(err);
            } else {
                success(data);
            }
        });
    });
};

export function writeFile(filename, contents) {
    return new Promise((success, failure) => {
        fs.writeFile(filename, contents, (err) => {
            if (err) {
                failure(err);
            } else {
                success();
            }

        });
    });

};

export function writeFileSync(filename, contents) {
    fs.writeFileSync(filename, contents);
};

export function ls(directory) {
    return exports._simpleCallbackFunctionToPromise(fs.readdir, [directory]);
}

export function mkdir(directory) {
    return exports._simpleCallbackFunctionToPromise(fs.mkdir, [directory]);
}

export function isdir(path) {
    return fs.lstatSync(path).isDirectory();
}

export function isfile(path) {
    return fs.lstatSync(path).isFile();
}

export function _simpleCallbackFunctionToPromise(func, args) {
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
};

export function getJSONCb(url, success) {
    https.get(url, res => {
        res.setEncoding('utf8');
        let body = '';
        res.on('data', data => {
            body += data;
        });
        res.on('end', () => {
            body = JSON.parse(body);
            success(body);
        });
        res.on('error', () => {
        });
    });
};

export function getJSON(url) {
    return new Promise((success, failure) => {
        https.get(url, res => {
            res.setEncoding('utf8');
            let body = '';
            res.on('data', data => {
                body += data;
            });
            res.on('end', () => {
                body = JSON.parse(body);
                success(body);
            });
            res.on('error', (error) => {
                failure(error);
            });
        });
    });
};

export function getJSONTransformed(url, transformFunc) {
    return new Promise((success, failure) => {
        exports.getJSON(url)
            .then((res) => success(transformFunc(res)))
            .catch(failure);
    });
};
