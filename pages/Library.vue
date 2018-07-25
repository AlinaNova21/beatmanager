<template>
  <v-layout column>
    <v-text-field
      label="Filter"
      solo
      v-model="filter"
      ></v-text-field>
    <v-container fluid grid-list-lg>
      <v-layout row wrap>
        <v-slide-y-transition  v-for="song in filteredSongs" :key="song.key">
          <v-flex xs6 md3>
            <song-card :song="song"></song-card>
          </v-flex>
        </v-slide-y-transition>
        <div class="headline" v-if="!filteredSongs.length">No Songs</div>
      </v-layout>
    </v-container>
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
      cache: {},
      filter: ''
    }
  },
  created () {
  },
  computed: {
    ...mapState(['songs','index']),
    filteredSongs () {
      return this.songs.filter(s => {
        if (!this.index.includes(s.key)) return false
        const str = [s.name, s.authorName, s.songName, s.songSubName, s.uploader].join(' ').toLowerCase()
        return str.includes(this.filter.toLowerCase())
      })
    }    
  },
  methods: {
  }
}
</script>
<style type="text/css"></style>