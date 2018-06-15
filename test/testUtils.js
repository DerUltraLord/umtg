const sinon = require('sinon');
const base = require('../src/base.js');
const fs = require('fs');
let sandbox = null

exports.promiseShouldFail = p => {
    return new Promise((success, failure) => {
        p
        .then(() => { failure(new Error("Promise should fail")) })
        .catch(() => success());
    });
};

exports.mockFileRead = result => {
    initSandbox();
    sandbox.stub(fs, 'readFile').callsFake((path, encoding, callback) => {
        callback(null, result);
    });
};

exports.mockReadDir = result => {
    initSandbox();
    sandbox.stub(fs, 'readdir').callsFake((path, callback) => {
        callback(null, result);
    });
};

exports.mockGetJson = result => {
    initSandbox();
    sandbox.stub(base, 'getJSON').callsFake(url => {
        return Promise.resolve(result);
    });

};

initSandbox = () => {
    if (!sandbox) {
        sandbox = sinon.sandbox.create();
    }
};

exports.shutdown = () => {
    sandbox.restore();
    sandbox = null;
};

exports.assertPromiseResult = (p, done, assertCallback) => {
    p.then((res) => {
        assertCallback(res);
        done();
    })
    .catch(console.error);
};
