import * as fs from 'fs';
import * as https from 'https';

export function prop(obj: any, name: string) {
    return obj ? obj[name] : null;
}

export function matchRegex(regex: RegExp, param?: any) {
    return regex.exec(param);
}

export function matchRegexGroup(regex: RegExp, param?: any) {
    return exports.prop(exports.matchRegex(regex, param), 'groups');
}

export function readFile(filename: string): Promise<string> {
    return new Promise((success, failure) => {
        fs.readFile(filename, 'ascii', function(err, data) {
            if (err) {
                failure(err);
            } else {
                success(data);
            }
        });
    });
}

export function writeFile(filename: string, contents: string) {
    return new Promise((success, failure) => {
        fs.writeFile(filename, contents, (err) => {
            if (err) {
                failure(err);
            } else {
                success();
            }

        });
    });

}

export function writeFileSync(filename: string, contents: string) {
    fs.writeFileSync(filename, contents);
}

export function ls(directory: string) {
    return exports._simpleCallbackFunctionToPromise(fs.readdir, [directory]);
}

export function mkdir(directory: string) {
    return exports._simpleCallbackFunctionToPromise(fs.mkdir, [directory]);
}

export function isdir(path: string) {
    return fs.lstatSync(path).isDirectory();
}

export function isfile(path: string) {
    return fs.lstatSync(path).isFile();
}

export function _simpleCallbackFunctionToPromise(func: () => void, args: any) {
    return new Promise((success, failure) => {
        let cb = ((err: string, res: string) => {
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

export function getJSONCb(url: string, success: (body: string) => void) {
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
        res.on('error', () => console.error);
    });
}

export function getJSON(url: string): Promise<string> {
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
}

export function getJSONTransformed(url: string, transformFunc: (data: string) => any) {
    return new Promise((success, failure) => {
        exports.getJSON(url)
            .then((res: string) => success(transformFunc(res)))
            .catch(failure);
    });
}
