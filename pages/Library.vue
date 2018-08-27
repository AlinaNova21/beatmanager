<template>
  <v-layout column>
    <v-layout row>
      <v-spacer></v-spacer>
      <v-flex md8>
        <v-text-field
          label="Filter"
          solo
          v-model="filter"
          ></v-text-field>
      </v-flex>
      <v-flex md1 class="py-1 px-2">
        <v-btn-toggle v-model="viewMode" mandatory>
          <v-btn flat icon value="list">
            <v-icon>view_list</v-icon>
          </v-btn>
          <v-btn flat icon value="grid">
            <v-icon>view_module</v-icon>
          </v-btn>
        </v-btn-toggle>
      </v-flex>
      <v-spacer></v-spacer>
    </v-layout>
    <songList :songs="filteredSongs" :viewMode="viewMode"></songList>
  </v-layout>
</template>
<script type="text/javascript">
import { mapState, mapActions } from 'vuex'
import songList from '~/components/songList.vue'

const PAGE_LENGTH = 15

export default {
  components: {
    songList
  },
  async fetch({ store, params }) {
    await store.dispatch('sync')
  },
  data() {
    return {
      cache: {},
      filter: '',
      viewMode: 'list'
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