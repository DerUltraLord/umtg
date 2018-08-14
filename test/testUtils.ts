import * as sinon from 'sinon';
import * as base from '../src/main/base';
import * as fs from 'fs';

let sandbox: sinon.SinonSandbox;

export function initSandbox() {
    if (!sandbox) {
        sandbox = sinon.createSandbox();
        exports.sandbox = sandbox;
    }
}

let mock = function(module: any, func: any, mockedFunc: any) {
    sandbox.stub(module, func).callsFake(mockedFunc);
};

let mockSuccessPromise = function(module: any, func: any, result: any) {
    return mock(module, func ,() => Promise.resolve(result));
};

export function promiseShouldFail(p: Promise<any>) {
    return new Promise((success, failure) => {
        p
        .then(() => failure(new Error('Promise should fail')))
        .catch(() => success());
    });
}

export function mockFileRead(result: any) {
    sandbox.stub(fs, 'readFile').callsFake((path, encoding, callback) => {
        callback(null, result);
    });
}

export function mockReadDir(result: any) {
    sandbox.stub(fs, 'readdir').callsFake((path, callback) => {
        callback(null, result);
    });
}

export function mockGetJson(result: any) {
    return mockSuccessPromise(base, 'getJSON', result);
}

export function mockBasicReturn(module: any, func: any, result: any) {
    return mock(module, func, () => {
        return result;
    });
}

export function mockToDoNothing(module: any, func: any) {
    return mock(module, func, (arg: any) => null);
}

export function shutdown() {
    sandbox.restore();
}

export function assertPromiseResult(p: Promise<any>, done: any, assertCallback: any) {
    p.then((res) => {
        assertCallback(res);
        done();
    })
    .catch(console.error);
}
