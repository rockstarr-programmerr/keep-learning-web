<template>
  <v-container>
    <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
    <router-link
      :to="{
        name: 'ClassroomList'
      }"
    >
      Classrooms
    </router-link>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class Home extends Vue {
  breadcrumbs = [
    { text: 'Home', to: { name: 'Home' } }
  ]
}
</script>
