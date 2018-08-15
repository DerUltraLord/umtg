import * as sinon from 'sinon';
import * as base from '../src/renderer/store/base';
import * as fs from 'fs';

let sandbox: sinon.SinonSandbox;

export function initSandbox(): void {
    if (!sandbox) {
        sandbox = sinon.createSandbox();
        exports.sandbox = sandbox;
    }
}

let mock = function(module: any, func: any, mockedFunc: any): void {
    sandbox.stub(module, func).callsFake(mockedFunc);
};

let mockSuccessPromise = function(module: any, func: any, result: any): void {
    return mock(module, func ,() => Promise.resolve(result));
};

export function promiseShouldFail(p: Promise<any>): Promise<any> {
    return new Promise((success, failure) => {
        p
        .then(() => failure(new Error('Promise should fail')))
        .catch(() => success());
    });
}

export function mockFileRead(result: any): void {
    sandbox.stub(fs, 'readFile').callsFake((path, encoding, callback) => {
        callback(null, result);
    });
}

export function mockReadDir(result: any): void {
    sandbox.stub(fs, 'readdir').callsFake((path, callback) => {
        callback(null, result);
    });
}

export function mockGetJson(result: any): void {
    return mockSuccessPromise(base, 'getJSON', result);
}

export function mockBasicReturn(module: any, func: any, result: any): void {
    return mock(module, func, () => {
        return result;
    });
}

export function mockToDoNothing(module: any, func: any): void {
    return mock(module, func, (arg: any) => null);
}

export function shutdown(): void {
    sandbox.restore();
}

export function assertPromiseResult(p: Promise<any>, done: any, assertCallback: any): void {
    p.then((res) => {
        assertCallback(res);
        done();
    })
    .catch(console.error);
}
