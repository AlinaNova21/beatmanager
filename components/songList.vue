<template>
  <v-container fluid grid-list-lg>
    <v-layout fluid row justify-center v-if="viewMode === 'list'">
      <v-flex md8>
        <v-card>
          <v-card-text>
            <v-list two-line>
              <songListItem v-for="song in songs" :key="song.key" :song="song"></songListItem>
            </v-list>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout row wrap v-if="viewMode === 'grid'">
      <v-flex xs6 md3 v-for="song in songs" :key="song.key">
        <song-card :song="song"></song-card>
      </v-flex>
      <div class="headline" v-if="!songs.length">No Songs</div>
    </v-layout>
  </v-container>
</template>
<script type="text/javascript">
import songCard from '~/components/songCard.vue'
import songListItem from '~/components/songListItem.vue'
export default {
  props: ['songs','viewMode'],
  components: { 
    songCard, 
    songListItem
  }
}
</script>