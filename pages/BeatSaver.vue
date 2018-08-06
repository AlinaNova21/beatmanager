<template>
  <v-layout column>
    <v-layout fluid row>
      <v-btn color="secondary" @click="changeMode('top')">Top</v-btn>
      <v-btn color="secondary" @click="changeMode('plays')">Plays</v-btn>
      <v-btn color="secondary" @click="changeMode('new')">New</v-btn>
      <v-btn color="secondary" @click="downloadAll()" v-if="mode === 'search'" :loading="downloadingAll">Download All</v-btn>
    </v-layout>
    <v-flex xs12>
      <v-layout row>
        <v-flex xs4 md3 class="ma-2">
          <v-select
            label="Field"
            solo
            :items="searchFields"
            item-text="label"
            item-value="key"
            v-model="searchField"
          ></v-select>
        </v-flex>
        <v-flex xs8 md9 class="ma-2">
          <v-text-field
            label="Search"
            solo
            @keyup.enter="changeMode('search')"
            v-model="searchTerm"
          ></v-text-field>
        </v-flex>
      </v-layout>
    </v-flex>
    <v-pagination v-if="pages" v-model="page" :length="pages" @input="doSearch"></v-pagination>
    <v-container fluid grid-list-lg>
      <v-layout row wrap>
        <v-flex xs6 md3 v-for="song in songs" :key="song.key">
          <song-card :song="song"></song-card>
        </v-flex>
      </v-layout>
    </v-container>
    <v-pagination v-if="pages" v-model="page" :length="pages" @input="doSearch"></v-pagination>
  </v-layout>
</template>
<script type="text/javascript">
import { mapState, mapActions } from 'vuex'
import songCard from '~/components/songCard.vue'

const PAGE_LENGTH = 15

export default {
  middleware: 'config',
  components: {
    songCard
  },
  async fetch({ store, params }) {
    await store.dispatch('sync')
  },
  data() {
    return {
      songs: [],
      type: 'name',
      total: 1,
      page: 1,
      mode: 'search',
      downloadingAll: false,
      searchField: 'all',
      searchTerm: '',
      searchFields: [
        { key: 'name', label: 'Name' },
        { key: 'song', label: 'Song' },
        { key: 'author', label: 'Author' },
        { key: 'user', label: 'User' },
        { key: 'all', label: 'All' }
      ]
    }
  },
  created () {
    this.mode = 'top'
    this.doSearch()
  },
  computed: {
    ...mapState([ 'index' ]),
    pages () {
      if (this.songs.length && this.total > this.songs.length) {
        return Math.ceil(this.total / PAGE_LENGTH)
      } else {
        return 0
      }
    }
  },
  methods: {
    ...mapActions(['downloadSong', 'removeSong']),
    async downloadAll() {
      this.downloadingAll = true
      const ps = this.songs.map(async song => {
        if (!this.index.includes(song.key)) {
          try {
            await this.downloadSong(song)
          } catch (e) {}
        }
      })
      await Promise.all(ps)
      this.downloadingAll = false
    },
    async changeMode(mode) {
      this.mode = mode
      this.page = 1
      return this.doSearch()
    },
    async doSearch () {
      const start = Math.max(0, (this.page - 1) * PAGE_LENGTH)
      const fns = {
        top: () => this.$bsapi.byTop(start),
        new: () => this.$bsapi.byNew(start),
        plays: () => this.$bsapi.byPlays(start),
        search: async () => {
          if (this.searchTerm.includes('https')) {
            const urls = this.searchTerm.split(' ')
            const keys = urls.map(u => u.split('/').slice(-1)[0])
            const ps = keys.map(this.$bsapi.detail)
            const responses = await Promise.all(ps)
            const songs = responses.map(r => r.song)
            const total = songs.length
            console.log(urls, keys, songs)
            return { total, songs }
          }
          return this.$bsapi.search(this.searchField, this.searchTerm, start)
        }
      }
      const { songs, total } = await fns[this.mode]()
      this.total = total
      this.songs.splice(0, this.songs.length, ...Object.values(songs))
    }
  }
}
</script>
<style type="text/css"></style>