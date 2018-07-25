import Vue from 'vue'
import Vuex from 'vuex'
import api from '~/api'
import VuexPersistence from 'vuex-persist'

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  reducer: ({ config }) => ({ config })
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