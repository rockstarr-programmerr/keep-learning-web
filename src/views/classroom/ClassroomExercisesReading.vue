<template>
  <div>
    <p>
      Choose the exercises you want to use in this class.
    </p>

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

    <v-row v-else no-gutters>
      <v-col
        v-for="exercise of exercises"
        :key="exercise.pk"
        cols="3"
      >
        <v-checkbox
          v-model="exercise.isChosen"
          :label="exercise.identifier"
          dense
          hide-details
        ></v-checkbox>
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
</template>

<script lang="ts">
import { AddReadingExercisesReq } from '@/interfaces/api/classroom'
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
export default class ClassroomExercisesReading extends Vue {
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
        this.exercises = this.exercisesFromStore.map(exercise => {
          const data = {
            ...exercise,
            isChosen: this.classroom.reading_exercises.includes(exercise.pk)
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

    const payload: AddReadingExercisesReq[] = this.exercises
      .filter(exercise => exercise.isChosen && !this.classroom.reading_exercises.includes(exercise.pk))
      .map(exercise => ({ pk: exercise.pk }))

    this.$store.dispatch('classroom/addReadingExercises', payload)
      .catch(unexpectedExc)
      .finally(() => {
        this.saving = false
      })
  }
}
</script>

<style scoped lang="scss">

</style>
