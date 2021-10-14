<template>
  <LayoutDefault>
    <v-container>
      <v-progress-circular
        v-if="loading"
        indeterminate
        color="primary"
      ></v-progress-circular>

      <div v-else-if="classroom !== undefined">
        <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>

        <h1 v-text="classroom.name"></h1>
        <v-divider></v-divider>
        <p
          class="mt-5"
          v-text="classroom.description"
        ></p>  <!-- TODO: multiline -->

        <v-tabs>
          <v-tab
            v-for="tab of tabs"
            :key="tab.text"
            v-text="tab.text"
            link
            :to="tab.to"
          ></v-tab>
        </v-tabs>

        <router-view v-if="classroomFound" class="mt-5"></router-view>
      </div>
    </v-container>
  </LayoutDefault>
</template>

<script lang="ts">
import { Classroom } from '@/interfaces/classroom'
import { unexpectedExc } from '@/utils'
import { Vue, Component } from 'vue-property-decorator'
import { mapMutations, mapState } from 'vuex'
import LayoutDefault from './LayoutDefault.vue'

@Component({
  components: {
    LayoutDefault
  },
  computed: {
    ...mapState('classroom', {
      classroom: 'currentClassroom'
    })
  },
  methods: {
    ...mapMutations('classroom', {
      setCurrentClassroom: 'SET_CURRENT_CLASSROOM'
    })
  }
})
export default class LayoutClassroomStudent extends Vue {
  // eslint-disable-next-line no-undef
  [key: string]: unknown

  classroom!: Classroom
  setCurrentClassroom!: CallableFunction

  get breadcrumbs (): unknown[] {
    if (this.classroom === undefined) return []
    return [
      { text: 'Home', to: { name: 'Home' }, exact: true },
      { text: 'Classrooms', to: { name: 'ClassroomList' }, exact: true },
      { text: this.classroom.name, disabled: true }
    ]
  }

  get pk (): string {
    return this.$route.params.pk
  }

  get loading (): boolean {
    return this.classroom === undefined
  }

  created (): void {
    this.setClassroom()
  }

  classroomFound = false

  setClassroom (): void {
    this.$store.dispatch('classroom/detail', this.pk)
      .then(() => {
        this.classroomFound = true
      })
      .catch(unexpectedExc)
  }

  tabs = [
    { text: 'Reading exercises', to: { name: 'ClassroomExercisesReading' } },
    { text: 'Listening exercises', to: { name: 'ClassroomExercisesListening' } }
  ]

  // @ts-expect-error: don't care
  // eslint-disable-next-line
  beforeRouteLeave (to, from, next): void {
    this.setCurrentClassroom(undefined)
    next()
  }
}
</script>

<style scoped lang="scss">

</style>
