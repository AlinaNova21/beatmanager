<template>
	<v-app dark>
    <v-toolbar app>
      <v-toolbar-title>Beat Manager</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn flat to="BeatSaver">Beat Saver</v-btn>
      <v-btn flat to="Playlists">Playlists</v-btn>
      <v-btn flat to="Library">My Library</v-btn>
      <v-btn flat icon to="Config"><v-icon>settings</v-icon></v-btn>
    </v-toolbar>
    <v-content>
      <v-container fluid>
		    <nuxt/>
      </v-container>
    </v-content>
	</v-app>
</template>
