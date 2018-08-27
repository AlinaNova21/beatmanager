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
      playlists: [],
      config: {}
    },
    mutations: {
      UPDATE_SONGS (state, songs) {
        state.songs = songs
        state.index = songs.map(s => s.key)
      },
      ADD_SONG (state, song) {
        state.songs.push(song)
        state.index.push(song.key)
      },
      REMOVE_SONG (state, song) {
        const index = state.index.indexOf(song.key)
        if (index > -1) {
          state.index.splice(index, 1)
        }
      },
      UPDATE_CONFIG (state, config) {
        state.config = config
      },
      UPDATE_PLAYLISTS (state, playlists) {
        state.playlists = playlists
      },
      ADD_PLAYLIST (state, playlist) {
        state.playlists.push(playlist)
      },
      REMOVE_PLAYLIST (state, playlist) {
        const index = state.playlists.findIndex(p => p.key === playlist.key)
        if (index > -1) {
          state.playlists.splice(index, 1)
        }
      },
      UPDATE_PLAYLIST (state, playlist) {
        const index = state.playlists.findIndex(p => p.key === playlist.key)
        if (index > -1) {
          state.playlists.splice(index, 1, playlist)
        }
      }
    },
    actions: {
      async sync ({ commit, state }) {
        if (!state.config.beatSaberDir) return
        api.beatSaberDir = state.config.beatSaberDir
        commit('UPDATE_SONGS', await api.getSongs())
        commit('UPDATE_PLAYLISTS', await api.getPlaylists())
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
      },
      async newPlaylist ({ commit }, { title, author }) {
        commit('ADD_PLAYLIST', await api.newPlaylist(title, author))
      },
      async playlistAddSong ({ commit }, playlist, song) {
        commit('UPDATE_PLAYLIST', await api.playlistAddSong(playlist, song))
      },
      async playlistRemoveSong ({ commit }, playlist, song) {
        commit('UPDATE_PLAYLIST', await api.playlistRemoveSong(playlist, song))
      }
    }
  })
}