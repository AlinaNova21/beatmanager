// const { autoUpdater } = require("electron-updater")
// autoUpdater.checkForUpdatesAndNotify()
const _NUXT_URL_ = `app://beatmanager/`

/*
** Electron
*/
let win = null // Current window
const fs = require('fs')
const electron = require('electron')
const path = require('path')
const app = electron.app
const protocol = electron.protocol
protocol.registerStandardSchemes(['app'])
const newWin = () => {
  protocol.registerFileProtocol('app', (req, cb) => {
    const url = req.url.slice(18)
    const filepath = path.normalize(`${__dirname}/${url}`)
    fs.stat(filepath, (err,stats) => {
      if (err) return cb(err)
      if (stats.isDirectory()) {
        cb(`${filepath}/index.html`)
      } else {
        cb(filepath)
      }
    })
  })
  win = new electron.BrowserWindow({
    icon: path.join(__dirname, 'static/icon.png')
  })
  win.maximize()
  win.on('closed', () => win = null)
  return win.loadURL(_NUXT_URL_)
}
app.on('ready', newWin)
app.on('window-all-closed', () => app.quit())
app.on('activate', () => win === null && newWin())
