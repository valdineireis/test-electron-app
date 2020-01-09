// Modules to control application life and create native browser window
// Tray - Módulo para adicionar a aplicação perto do relório
// Menu - Personalizar o Menu da aplicação
// shell - Utilizo para abrir um arquivo armazenado no SO
const { app, BrowserWindow, Tray, Menu, shell } = require('electron')
const path = require('path')
const fs = require('fs')

if (process.env.NODE_ENV == 'development') {
  // Atualização automática da tela
  require('electron-reload')(__dirname)
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    frame: false,
    width: 800,
    height: 500,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  if (process.env.NODE_ENV == 'development') {
    mainWindow.webContents.openDevTools();
  }

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  /*
  let contextMenu = Menu.buildFromTemplate([
    {
      label: 'Mostrar aplicativo', click: () => {
        mainWindow.show();
      }
    },
    {
      label: 'Sair', click: () => {
        app.isQuiting = true;
        app.quit();
      }
    }
  ]);

  let tray = new Tray(path.join(__dirname, 'tray.png'));
  tray.setContextMenu(contextMenu);

  mainWindow.on('minimize', (e) => {
    e.preventDefault();
    mainWindow.hide();
  });

  mainWindow.on('close', (e) => {
    if (!app.isQuiting) {
      e.preventDefault();
      mainWindow.hide();
    }
  });

  tray.on('click', () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
  });
  */

  mainWindow.webContents.on('did-finish-load', () => {
    // Use default printing options
    /*mainWindow.webContents.printToPDF({}).then(data => {
      fs.writeFile('/tmp/print.pdf', data, (error) => {
        if (error) throw error
        console.log('Write PDF successfully.');
      });
    }).catch(error => {
      console.log(error);
    });
    shell.openItem('C:/tmp/print.pdf');
    */
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
