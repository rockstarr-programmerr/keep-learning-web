<template>
  <div>
    <p v-if="exercises.length === 0">
      This classroom don't have any reading exercises. Perhaps your teacher forgot to add them?
    </p>

    <div v-else>
      <p>Click on an exercise to start doing.</p>

      <v-simple-table>
        <thead>
          <tr>
            <td>Exercise</td>
            <td>Passage 1</td>
            <td>Passage 2</td>
            <td>Passage 3</td>
            <td>Total</td>
            <td>Band score</td>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="exercise of exercises"
            :key="exercise.pk"
          >
            <td>{{ exercise.identifier }}</td>
          </tr>
        </tbody>
      </v-simple-table>
    </div>
  </div>
</template>

<script lang="ts">
import { Classroom } from '@/interfaces/classroom'
import { ClassroomReadingExercise } from '@/interfaces/reading-exercise'
import { Vue, Component } from 'vue-property-decorator'
import { mapState } from 'vuex'

@Component({
  computed: {
    ...mapState('classroom', {
      classroom: 'currentClassroom'
    })
  }
})
export default class ClassroomExercisesReadingStudent extends Vue {
  classroom!: Classroom

  get exercises (): ClassroomReadingExercise[] {
    if (this.classroom === undefined) return []
    return this.classroom.reading_exercises
  }
}
</script>

<style scoped lang="scss">

</style>
