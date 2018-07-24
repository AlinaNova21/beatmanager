<template>
  <v-layout column>
    <v-text-field
      label="Filter"
      solo
      v-model="filter"
      ></v-text-field>
    <v-container fluid grid-list-lg>
      <v-layout row wrap>
        <v-flex xs6 md3 v-for="song in filteredSongs" :key="song.key">
          <song-card :song="song"></song-card>
        </v-flex>
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
      songs: [],
      cache: {},
      filter: ''
    }
  },
  created () {
    this.doSearch()
  },
  computed: {
    ...mapState({ songKeys: 'songs' }),
    filteredSongs () {
      return this.songs.filter(s => {
        if (!this.songKeys.includes(s.key)) return false
        return s.songName.toLowerCase().includes(this.filter.toLowerCase())
      })
    }    
  },
  methods: {
    async doSearch () {
      this.songs.splice(0,this.songs.length)
      for (const key of this.songKeys) {
        const { song } = await this.$bsapi.detail(key)
        this.songs.push(song)
      }
    }
  }
}
</script>
<style type="text/css"></style>