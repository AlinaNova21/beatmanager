import Vue from 'vue'
import Vuex from 'vuex'
import api from '~/api'

export default () => {
  return new Vuex.Store({
    state: {
      songs: []
    },
    mutations: {
      UPDATE_SONGS: function (state, song) {
        Vue.set(state, 'songs', song)
      },
      ADD_SONG: function (state, song) {
        state.songs.push(song.key)
      },
      REMOVE_SONG: function (state, song) {
        const index = state.songs.indexOf(song.key)
        if (index > -1) {
          state.songs.splice(index, 1)
        }
      }
    },
    actions: {
      async sync ({ commit }) {
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
    }
  })
}