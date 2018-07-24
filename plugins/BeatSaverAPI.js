import Vue from 'vue'
import axios from 'axios'

const http = axios.create({
  baseURL: 'https://beatsaver.com/api'
})

Vue.prototype.$bsapi = {
  async byTop(start = 0) {
    const { data } = await http.get(`/songs/top/${start}`)
    return data
  },
  async byPlays(start = 0) {
    const { data } = await http.get(`/songs/plays/${start}`)
    return data
  },
  async byNew(start = 0) {
    const { data } = await http.get(`/songs/new/${start}`)
    return data
  },
  async byUser(user, start = 0) {
    const { data } = await http.get(`/songs/new/${user}/${start}`)
    return data
  },
  async detail(key) {
    const { data } = await http.get(`/songs/detail/${key}`)
    return data
  },
  async search(type, key) {
    const { data } = await http.get(`/songs/search/${type}/${key}`)
    return data
  }
}
export default ({ app }, inject) => {
}

