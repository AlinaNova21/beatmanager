import Vue from 'vue'
import Vuex from 'vuex'
import api from '~/api'
import VuexPersistence from 'vuex-persist'
import fs from 'fs'
import util from 'util'
import path from 'path'
import { remote } from 'electron'

const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

const BASE_DIR = remote.app.getPath('userData')

const vuexLocal = new VuexPersistence({
  // storage: window.localStorage,
  reducer: ({ config }) => ({ config }),
  async restoreState (key, storage) {
    const configPath = path.join(BASE_DIR, `${key}.json`)
    try {
      const contents = await readFile(configPath, 'utf8')
      return JSON.parse(contents)
    } catch (e) {
      return {}
    }
  },
  async saveState (key, state, storage) {
    const configPath = path.join(BASE_DIR, `${key}.json`)
    return writeFile(configPath, JSON.stringify(state))
  },
  asyncStorage: true
})

export default () => {
  return new Vuex.Store({
    plugins: [vuexLocal.plugin],
    state: {
      index: [],
      songs: [],
      config: {}
    },
    mutations: {
      UPDATE_SONGS: function (state, songs) {
        state.songs = songs
        state.index = songs.map(s => s.key)
      },
      ADD_SONG: function (state, song) {
        state.songs.push(song)
        state.index.push(song.key)
      },
      REMOVE_SONG: function (state, song) {
        const index = state.index.indexOf(song.key)
        if (index > -1) {
          state.index.splice(index, 1)
        }
      },
      UPDATE_CONFIG: function (state, config) {
        state.config = config
      }
    },
    actions: {
      async sync ({ commit, state }) {
        if (!state.config.beatSaberDir) return
        api.beatSaberDir = state.config.beatSaberDir
        commit('UPDATE_SONGS', await api.getSongs())
      },
      async downloadSong ({ commit }, song) {
        await api.downloadSong(song)
        commit('ADD_SONG', song)
      },
      async removeSong ({ commit }, song) {
        await api.removeSong(song)
        commit('REMOVE_SONG', song)
      },
      async saveConfig ({ commit }, config) {
        commit('UPDATE_CONFIG', config)
      }
    }
  })
}