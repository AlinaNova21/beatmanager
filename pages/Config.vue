<template>
  <v-layout row justify-center>
    <v-flex md8 xs12>
      <v-card>
        <v-card-title>
          <div class="headline">Config</div>
        </v-card-title>
        <v-card-text>
          <v-divider></v-divider>
          <v-layout row>
            <v-flex md10>
              <div class="pt-3">
                Beat Saber Path: 
                {{ beatSaberDir || 'No Path Selected' }}
              </div>
            </v-flex>
            <v-flex md2>
              <v-btn flat @click="doBrowse()">Browse</v-btn>
              <input ref="file" type="file" @change="dirSelected($event)" webkitdirectory style="display: none">
            </v-flex>
          </v-layout>
          <v-divider></v-divider>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click="doSave()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script type="text/javascript">
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
      beatSaberDir: ''
    }
  },
  created() {
    this.loadConfig()
  },
  computed: {
    ...mapState(['config'])
  },
  methods: {
    ...mapActions(['saveConfig']),
    loadConfig () {
      for (const [key, value] of Object.entries(this.config)) {
        this[key] = value
      }
    },
    doSave () {
      const { beatSaberDir } = this
      this.saveConfig({ beatSaberDir })
    },
    doBrowse (){
      this.$refs.file.click()
    },
    dirSelected ($event) {
      const { files: [{ path } = {}] = [] } = $event.target
      if (path) {
        this.beatSaberDir = path
      }
    }
  }
}
</script>