<template>
  <v-layout column>
    <v-layout fluid row>
      <v-dialog v-model="newPlaylistDialog">
        <v-btn slot="activator" color="secondary">New Playlist</v-btn>
        <v-card>
          <v-card-title class="headline">New playlist</v-card-title>
          <v-card-text>
            <v-text-field
              label="Title"
              v-model="newPlaylistTitle"
              ></v-text-field>
            <v-text-field
              label="Author"
              v-model="newPlaylistAuthor"
              ></v-text-field>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click="newPlaylist()" :loading="newPlaylistSaving">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
    <v-layout fluid row justify-center>
      <v-flex md6>
        <v-card>
          <v-card-text>
            <v-list two-line>
              <v-list-tile v-for="playlist in playlists" :key="playlist.key">
                <v-list-tile-avatar>
                  <img :src="playlist.icon">
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title v-html="playlist.playlistTitle"></v-list-tile-title>
                  <v-list-tile-sub-title v-html="playlist.playlistAuthor"></v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-btn icon ripple>
                    <v-icon>delete</v-icon>
                  </v-btn>
                </v-list-tile-action>
              </v-list-tile>
            </v-list>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-layout>
</template>
<script type="text/javascript">
import { mapState } from 'vuex'
export default {
  async fetch({ store, params }) {
    await store.dispatch('sync')
  },
  data () {
    return {
      newPlaylistDialog: false,
      newPlaylistTitle: '',
      newPlaylistAuthor: '',
      newPlaylistSaving: false
    }
  },
  computed: {
    ...mapState(['playlists', 'songs'])    
  },
  methods: {
    async newPlaylist () {
      this.newPlaylistSaving = true
      await this.$store.dispatch('newPlaylist', { 
        title: this.newPlaylistTitle,
        author: this.newPlaylistAuthor
      })
      this.newPlaylistSaving = false
      this.newPlaylistDialog = false
    }
  }
}
</script>