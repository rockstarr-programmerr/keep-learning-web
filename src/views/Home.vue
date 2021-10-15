<template>
  <v-container>
    <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>

    <v-row>
      <v-col
        cols="3"
        v-for="link of links"
        :key="link.text"
      >
        <v-card
          link
          :to="link.to"
          hover
        >
          <v-card-title>
            {{ link.text }}
          </v-card-title>
          <v-card-subtitle>
            {{ link.description }}
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>

    <!--
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
    -->
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
    const classroomTeacherDescription = 'Create classrooms, add students, track their progress.'
    const classroomStudentDescription = 'Join classrooms, practice exercises and get instant feedback.'

    const links = [
      {
        text: 'Classrooms',
        to: { name: 'ClassroomList' },
        description: this.isTeacher ? classroomTeacherDescription : classroomStudentDescription
      }
    ]
    if (this.isTeacher) {
      links.push(
        {
          text: 'Reading exercises',
          to: { name: 'ReadingExerciseList' },
          description: 'Create reading exercises for using in your classrooms.'
        }
      )
    }
    return links
  }
}
</script>
