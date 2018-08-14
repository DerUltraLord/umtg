import * as https from 'https';

export function matchRegex(regex: RegExp, param?: any) {
    return regex.exec(param);
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
