import Vue from 'vue'
import axios from 'axios'
import jszip from 'jszip'
import fs from 'fs'
import path from 'path'
import util from 'util'
import rimraf from 'rimraf'

const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)
const mkdir = util.promisify(fs.mkdir)
const readdir = util.promisify(fs.readdir)
const rm = util.promisify(rimraf)

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'))

export default {
  songs: [],
  customSongsDir: path.join(config.beatSaberDir, 'CustomSongs'),
  async songDir(song) {
    const dirname = `[${song.key}] ${song.songName}`.replace(/[\/\\]/g, '')
    return path.join(this.customSongsDir, dirname)
  },
  async downloadSong(song) {
    console.log(song)
    const { data } = await axios.get(song.downloadUrl, { 
      responseType: 'arraybuffer' 
    })

    const zip = new jszip()
    await zip.loadAsync(data)
    const [infoFile] = await zip.file(/info\.json$/)
    // const info = JSON.parse(await infoFile.async('string'))
    const zipdir = path.dirname(infoFile.name)
    const dirname = await this.songDir(song)
    try { await mkdir(dirname) } catch(e) { console.error(e) }
    const filesToExtract = []
    zip
      .folder(zipdir)
      .forEach(f => {
        if (!f.includes('/')) {
          filesToExtract.push(f)
        }
      })
    for (const filename of filesToExtract) {
      const data = await zip.folder(zipdir).file(filename).async('arraybuffer')
      await writeFile(path.join(dirname, filename), Buffer.from(data))
    }
    await writeFile(path.join(dirname, 'beatManager.json'), JSON.stringify(song))
  },
  async removeSong (song) {
    const dirname = await this.songDir(song)
    await rm(dirname)
  },
  async getSongs () {
    const dirs = await readdir(this.customSongsDir)
    const keys = dirs.map(d => d.match(/^\[(.+?)\]/)[1])
    return keys
  },
  songExists(song) {
    return this.songs.includes(song.key)
  }
}
