<template>
  <v-list-tile>
    <v-list-tile-avatar>
      <img :src="song.coverUrl">
    </v-list-tile-avatar>
    <v-list-tile-content>
      <v-list-tile-title v-html="song.songName"></v-list-tile-title>
      <v-list-tile-sub-title v-html="song.songSubName" class="text--primary"></v-list-tile-sub-title>
      <v-list-tile-sub-title v-html="difficulties"></v-list-tile-sub-title>
    </v-list-tile-content>
    <v-list-tile-action>
      <v-btn icon ripple v-if="!exists" @click="download()" :loading="active">
        <v-icon>get_app</v-icon>
      </v-btn>
      <v-dialog v-if="exists" v-model="confirmDelete" max-width="400px">
        <v-btn slot="activator" icon ripple>
          <v-icon>delete</v-icon>
        </v-btn>
        <v-card>
          <v-card-title class="headline">Remove Song</v-card-title>
          <v-card-text>
            <div>Are you sure you wish to delete this song?</div>
            <v-layout row fluid>
              <img :src="song.coverUrl" width="100px" height="100px">
              <v-layout column class="pl-1">
                <div class="headline">{{ song.name }}</div>
                <div>{{ song.songName }}</div>
                <div>{{ song.songSubName }}</div>
                <div>{{ song.authorName }}</div>
              </v-layout>
            </v-layout>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat @click="confirmDelete = false">Cancel</v-btn>
            <v-btn flat color="red" @click="remove();confirmDelete = false">Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-list-tile-action>
  </v-list-tile>
</template>
<script type="text/javascript">
import { mapState, mapActions } from 'vuex'
export default {
  props: ['song'],
  data() {
    return {
      active: false,
      confirmDelete: false
    }
  },
  computed: {
    ...mapState(['index']),
    exists () {
      return this.index.includes(this.song.key)
    },
    difficulties () {
      const ret = Object.keys(this.song.difficulties)
      ret.reverse()
      return ret.join(' - ')
    }
  },
  methods: {
    ...mapActions(['downloadSong', 'removeSong']),
    async download() {
      this.active = true
      try {
        await this.downloadSong(this.song)
      } catch (e) {}
      this.active = false
    },
    async remove() {
      this.active = true
      try {
        await this.removeSong(this.song)
      } catch (e) {}
      this.active = false
    }
  }
}
</script>