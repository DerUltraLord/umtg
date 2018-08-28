import { app, BrowserWindow } from 'electron';
import path from 'path';
import { format } from 'url';

let window: any;
app.on('ready', () => {
    window = new BrowserWindow({ title: 'UMTG', show: false});
    window.maximize();
    window.show();
    //window.setMenu(null);
    //window.webContents.openDevTools();
    

    let production = process.env.NODE_ENV === 'production';

    if (!production) {
        window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
    } else {
        window.loadURL(format({
            pathname: path.join(__dirname, 'index.html'),
            protocol: 'file',
            slashes: true,
        }))
    }
});

app.on('window-all-closed', () => {
    app.quit();
    window = null;
});

