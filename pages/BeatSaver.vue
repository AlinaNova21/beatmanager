<template>
  <v-layout column>
    <v-text-field
      label="Search"
      solo
      @blur="mode='search'; doSearch()"
      v-model="term"
      ></v-text-field>
    <v-layout fluid row>
      <v-btn @click="mode = 'top'; doSearch()">Top</v-btn>
      <v-btn @click="mode = 'plays'; doSearch()">Plays</v-btn>
      <v-btn @click="mode = 'new'; doSearch()">New</v-btn>
      <v-btn @click="downloadAll()" v-if="mode === 'search'" :loading="downloadingAll">Download All</v-btn>
    </v-layout>
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
      term: '',
      total: 1,
      page: 1,
      mode: 'search',
      downloadingAll: false
    }
  },
  created () {
    this.mode = 'top'
    this.doSearch()
  },
  computed: {
    ...mapState({ existingSongs: 'songs' }),
    pages () {
      if (this.total > this.songs.length) {
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
        if (!this.existingSongs.includes(song.key)) {
          try {
            await this.downloadSong(song)
          } catch (e) {}
        }
      })
      await Promise.all(ps)
      this.downloadingAll = false
    },
    async doSearch () {
      const start = Math.max(0, (this.page - 1) * PAGE_LENGTH)
      const fns = {
        top: () => this.$bsapi.byTop(start),
        new: () => this.$bsapi.byNew(start),
        plays: () => this.$bsapi.byPlays(start),
        search: async () => {
          if (this.term.includes('https')) {
            const urls = this.term.split(' ')
            const keys = urls.map(u => u.split('/').slice(-1)[0])
            const ps = keys.map(this.$bsapi.detail)
            const responses = await Promise.all(ps)
            const songs = responses.map(r => r.song)
            const total = songs.length
            console.log(urls, keys, songs)
            return { total, songs }
          }
          return this.$bsapi.search(this.type, this.term, start)
        }
      }
      const { songs, total } = await fns[this.mode]()
      this.total = total
      this.songs.splice(0, this.songs.length, ...songs)
    }
  }
}
</script>
<style type="text/css"></style>