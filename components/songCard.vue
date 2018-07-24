<template>
  <v-card>
    <!-- <v-layout>
      <v-flex xs3>
        <v-card-media
          class="white--text"
          height="200px"
          :src="song.coverUrl"
          contain
          ></v-card-media>
        </v-flex>
      <v-flex xs7>
        <v-card-title>
          <div>
            <div class="headline">{{ song.name }}</div>
            <div>{{ song.authorName }}</div>
            <div>
              <v-chip v-for="(data, key) in song.difficulties" :key="key" small>{{ key }}</v-chip>                
            </div>
          </div>
        </v-card-title>
      </v-flex>
    </v-layout> -->
    <v-card-media
      class="white--text"
      height="200px"
      :src="song.coverUrl"
      ></v-card-media>
    <v-card-title>
      <div>
        <div class="headline">{{ song.songName }}</div>
        <div>{{ song.songSubName }}</div>
        <div>{{ song.authorName }}</div>
        <div>
          <v-chip v-for="(data, key) in song.difficulties" :key="key" small>{{ key }}</v-chip>                
        </div>
      </div>
    </v-card-title>
    <v-card-text>
      {{ song.description }}
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn flat v-if="!exists" @click="download()" :loading="active">Download</v-btn>
      <v-btn flat v-if="exists" disabled>In Library</v-btn>
      <v-btn flat v-if="exists"  @click="remove()" :loading="active">Remove</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script type="text/javascript">
import { mapState, mapActions } from 'vuex'
export default {
  props: ['song'],
  data() {
    return {
      active: false
    }
  },
  computed: {
    ...mapState(['songs']),
    exists () {
      return this.songs.includes(this.song.key)
    },
    difficulties () {
      return Object.keys(this.song.difficulties)
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