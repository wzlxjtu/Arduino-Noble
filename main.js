var electron = require ('electron');

//splitData;

var BrowserWindow = electron.BrowserWindow;
var app = electron.app;


app.on('ready', function(){
    var appWindow;
    //appWindow = new BrowserWindow();
    //appWindow.loadURL('file://' + __dirname + '/index.html');

    appWindow = new BrowserWindow();
    appWindow.loadURL('file://' + __dirname + '/index.html');
    appWindow.webContents.openDevTools()

});
