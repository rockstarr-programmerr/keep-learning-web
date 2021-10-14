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
import { mapGetters } from 'vuex'

@Component({
  computed: {
    ...mapGetters('account', [
      'isTeacher',
      'isStudent'
    ])
  }
})
export default class Home extends Vue {
  breadcrumbs = [
    { text: 'Home', to: { name: 'Home' } }
  ]

  isTeacher!: boolean
  isStudent!: boolean

  created (): void {
    if (this.isStudent) {
      this.$router.push({ name: 'ClassroomList' })
    }
  }

  // eslint-disable-next-line
  get links () {
    const links = [
      { text: 'Classrooms', to: { name: 'ClassroomList' } }
    ]
    if (this.isTeacher) {
      links.push(
        { text: 'Reading exercises', to: { name: 'ReadingExerciseList' } }
      )
    }
    return links
  }
}
</script>
