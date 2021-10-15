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
          class="mt-3"
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

        <v-btn
          color="primary"
          class="mt-5"
          :loading="saving"
          @click="save"
        >
          Save
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { AddReadingExercisesReq, RemoveReadingExercisesReq } from '@/interfaces/api/classroom'
import { Classroom } from '@/interfaces/classroom'
import { ReadingExercise } from '@/interfaces/reading-exercise'
import { unexpectedExc } from '@/utils'
import { Vue, Component } from 'vue-property-decorator'
import { mapState } from 'vuex'

declare interface _Exercise extends ReadingExercise {
  isChosen: boolean
}

@Component({
  computed: {
    ...mapState('readingExercise', {
      exercisesFromStore: 'readingExercises'
    }),
    ...mapState('classroom', {
      classroom: 'currentClassroom'
    })
  }
})
export default class ClassroomExercisesReadingTeacher extends Vue {
  loading = false
  exercisesFromStore!: ReadingExercise[]
  exercises: _Exercise[] = []
  classroom!: Classroom

  created (): void {
    this.setExercises()
  }

  setExercises (): void {
    this.loading = true
    this.$store.dispatch('readingExercise/list')
      .then(() => {
        const existingPks = this.classroom.reading_exercises.map(exercise => exercise.pk)
        this.exercises = this.exercisesFromStore.map(exercise => {
          const data = {
            ...exercise,
            isChosen: existingPks.includes(exercise.pk)
          }
          return data
        })
      })
      .catch(unexpectedExc)
      .finally(() => {
        this.loading = false
      })
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

    return this.$store.dispatch('classroom/addReadingExercises', pksToAdd)
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
