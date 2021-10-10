<template>
  <v-container>
    <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
    <v-list>
      <v-list-item
        v-for="link of links"
        :key="link.text"
      >
        <router-link :to="link.to">
          {{ link.text }}
        </router-link>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class Home extends Vue {
  breadcrumbs = [
    { text: 'Home', to: { name: 'Home' } }
  ]

  links = [
    { text: 'Classrooms', to: { name: 'ClassroomList' } },
    { text: 'Reading exercises', to: { name: 'ReadingExerciseList' } }
  ]
}
</script>
