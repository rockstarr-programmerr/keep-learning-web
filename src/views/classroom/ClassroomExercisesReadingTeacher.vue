<template>
  <v-card>
    <v-card-title>
      Reading exercises
    </v-card-title>
    <v-card-subtitle>
      Choose the exercises you want to use in this class.
    </v-card-subtitle>

    <v-card-text>
      <v-progress-circular
        v-if="loading"
        color="primary"
        indeterminate
      ></v-progress-circular>

      <p v-else-if="exercises.length === 0">
        You haven't created any exercise yet.
        <router-link :to="{ name: 'ReadingExerciseCreate' }">
          Create exercise
        </router-link>
      </p>

      <div v-else>
        <v-btn-toggle>
          <v-btn
            small
            @click="selectAll"
          >
            Select all
          </v-btn>
          <v-btn
            small
            @click="unselectAll"
          >
            Unselect all
          </v-btn>
        </v-btn-toggle>

        <v-row
          no-gutters
          class="my-3"
        >
          <v-col
            v-for="exercise of exercises"
            :key="exercise.pk"
            cols="3"
          >
            <v-checkbox
              v-model="exercise.isChosen"
              dense
              hide-details
            >
              <template #label>
                <router-link
                  :to="{
                    name: 'ReadingExerciseDetail',
                    params: { pk: exercise.pk }
                  }"
                >
                  {{ exercise.identifier }}
                </router-link>
              </template>
            </v-checkbox>
          </v-col>
        </v-row>

        <div v-if="pagination.next !== null">
          <v-progress-circular
            v-if="loadingMore"
            indeterminate
            color="primary"
            width="2"
            size="18"
          ></v-progress-circular>
          <a
            v-else
            href="#"
            @click="loadMoreReading"
          >
            Load more
          </a>
        </div>
      </div>
    </v-card-text>

    <v-card-actions>
      <v-btn
        color="primary"
        :loading="saving"
        @click="save"
        min-width="110"
      >
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { AddReadingExercisesReq, RemoveReadingExercisesReq } from '@/interfaces/api/classroom'
import { PaginatedRes, PaginationQuery } from '@/interfaces/api/common'
import { Classroom } from '@/interfaces/classroom'
import { ReadingExercise } from '@/interfaces/reading-exercise'
import { unexpectedExc } from '@/utils'
import { PAGE_SIZE } from '@/utils/constants'
import { Vue, Component } from 'vue-property-decorator'
import { mapMutations, mapState } from 'vuex'

declare interface _Exercise extends ReadingExercise {
  isChosen: boolean
}

@Component({
  computed: {
    ...mapState('readingExercise', {
      exercisesFromStore: 'readingExercises',
      pagination: 'exercisePagination'
    }),
    ...mapState('classroom', {
      classroom: 'currentClassroom'
    })
  },
  methods: {
    ...mapMutations('message', {
      showMessage: 'SHOW_MESSAGE'
    })
  }
})
export default class ClassroomExercisesReadingTeacher extends Vue {
  // eslint-disable-next-line no-undef
  [index: string]: unknown

  loading = false
  loadingMore = false
  exercisesFromStore!: ReadingExercise[]
  exercises: _Exercise[] = []
  pagination!: PaginatedRes
  classroom!: Classroom
  page = 1
  showMessage!: CallableFunction

  created (): void {
    this.setExercises()
  }

  setExercises (query?: PaginationQuery, loadingProp?: string): void {
    if (loadingProp === undefined) loadingProp = 'loading'

    this[loadingProp] = true
    this.$store.dispatch('readingExercise/list', query)
      .then(() => {
        const existingPks = this.classroom.reading_exercises.map(exercise => exercise.pk)
        this.exercises.push(...this.exercisesFromStore.map(exercise => {
          const data = {
            ...exercise,
            isChosen: existingPks.includes(exercise.pk)
          }
          return data
        }))
        this.page++
      })
      .catch(unexpectedExc)
      .finally(() => {
        this[loadingProp as string] = false
      })
  }

  loadMoreReading (): void {
    this.setExercises({
      limit: PAGE_SIZE,
      offset: (this.page - 1) * PAGE_SIZE
    }, 'loadingMore')
  }

  saving = false

  save (): void {
    if (this.saving) return
    this.saving = true

    let promises = [
      this.addReadingExercise(),
      this.removeReadingExercise()
    ]
    promises = promises.filter(promise => promise !== null)

    Promise.all(promises)
      .then(() => {
        this.showMessage('Exercises saved.')
      })
      .catch(unexpectedExc)
      .finally(() => {
        this.saving = false
      })
  }

  addReadingExercise (): Promise<unknown> | null {
    const existingPks = this.classroom.reading_exercises.map(exercise => exercise.pk)

    const pksToAdd: AddReadingExercisesReq[] = this.exercises
      .filter(exercise => exercise.isChosen && !existingPks.includes(exercise.pk))
      .map(exercise => ({ pk: exercise.pk }))

    if (pksToAdd.length === 0) return null

    return this.$store.dispatch('classroom/addReadingExercises', {
      payload: pksToAdd
    })
  }

  removeReadingExercise (): Promise<unknown> | null {
    const existingPks = this.classroom.reading_exercises.map(exercise => exercise.pk)

    const pksToRemove: RemoveReadingExercisesReq[] = this.exercises
      .filter(exercise => !exercise.isChosen && existingPks.includes(exercise.pk))
      .map(exercise => ({ pk: exercise.pk }))

    if (pksToRemove.length === 0) return null

    return this.$store.dispatch('classroom/removeReadingExercises', pksToRemove)
  }

  selectAll (): void {
    this.exercises.forEach(exercise => {
      exercise.isChosen = true
    })
  }

  unselectAll (): void {
    this.exercises.forEach(exercise => {
      exercise.isChosen = false
    })
  }
}
</script>

<style scoped lang="scss">

</style>
