import {app, BrowserWindow } from 'electron'

app.on('ready', () => {
    let window = new BrowserWindow();

    let production = process.env.NODE_ENV == 'production';

    if (!production) {
        window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
    }
})
