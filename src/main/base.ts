import * as https from 'https';

export function matchRegex(regex: RegExp, param?: any): any {
    return regex.exec(param);
}

export function getJSONCb(url: string, success: (body: string) => void): void {
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

export function getJSONTransformed(url: string, transformFunc: (data: string) => any): Promise<any> {
    return new Promise((success, failure) => {
        exports.getJSON(url)
            .then((res: string) => success(transformFunc(res)))
            .catch(failure);
    });
}
