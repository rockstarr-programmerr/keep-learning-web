<template>
  <LayoutDefault>
    <v-container>
      <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>

      <v-progress-circular
        v-if="loading"
        indeterminate
        color="primary"
      ></v-progress-circular>

      <div v-else-if="classroom !== undefined">
        <v-row
          justify="space-between"
          align="center"
        >
          <v-col cols="auto">
            <h1 v-text="classroom.name"></h1>
          </v-col>
          <v-col cols="auto">
            <v-menu
              offset-x
              left
              nudge-left="12"
            >
              <template #activator="{ on, attrs }">
                <v-icon
                  v-on="on"
                  v-bind="attrs"
                >
                  mdi-dots-vertical
                </v-icon>
              </template>
              <v-list dense>
                <v-list-item
                  link
                  :to="{
                    name: 'ClassroomUpdate',
                    params: { pk: classroom.pk }
                  }"
                >
                  <v-list-item-icon>
                    <v-icon>mdi-pencil-outline</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title class="mr-3">Edit</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item @click="confirmDelete = true">
                  <v-list-item-icon>
                    <v-icon>mdi-delete-outline</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title class="mr-3">Delete</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <p
          class="mt-5 description"
          v-text="classroom.description"
        ></p>

        <div
          v-if="classroom.reading_exercises.length === 0"
          class="my-5 error--text"
        >
          <v-icon color="error" class="mr-3">
            mdi-alert-outline
          </v-icon>
          You haven't added any reading exercises to this classroom yet.
          <router-link
            :to="{
              name: 'ClassroomExercisesReading',
              params: { pk: classroom.pk }
            }"
          >
            Add exercises
          </router-link>
        </div>

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

        <KLDialogConfirm
          v-model="confirmDelete"
          :loading="deleting"
          @confirm="deleteClassroom"
          @cancel="confirmDelete = false"
        >
          <div>
            <p>
              You are deleting classroom <strong>{{ classroom.name }}</strong>.
            </p>
            <div class="error--text">
              <v-icon color="error">
                mdi-alert-outline
              </v-icon>
              This cannot be undone!
            </div>
          </div>
        </KLDialogConfirm>
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
import KLDialogConfirm from '@/components/KLDialogConfirm.vue'

@Component({
  components: {
    LayoutDefault,
    KLDialogConfirm
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
export default class LayoutClassroomTeacher extends Vue {
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
    { text: 'Overview', to: { name: 'ClassroomOverview' } },
    { text: 'Students', to: { name: 'ClassroomStudents' } },
    { text: 'Reading exercises', to: { name: 'ClassroomExercisesReading' } },
    { text: 'Listening exercises', to: { name: 'ClassroomExercisesListening' } }
  ]

  /**
   * Delete classroom
   */
  confirmDelete = false
  deleting = false

  deleteClassroom (): void {
    if (this.deleting) return
    this.deleting = true

    this.$store.dispatch('classroom/delete', this.classroom.pk)
      .then(() => {
        this.$router.push({ name: 'ClassroomList' })
      })
      .catch(unexpectedExc)
      .finally(() => {
        this.deleting = false
      })
  }

  // @ts-expect-error: don't care
  // eslint-disable-next-line
  beforeRouteLeave (to, from, next): void {
    this.setCurrentClassroom(undefined)
    next()
  }
}
</script>

<style scoped lang="scss">
.description {
  white-space: pre-wrap;
}
</style>
