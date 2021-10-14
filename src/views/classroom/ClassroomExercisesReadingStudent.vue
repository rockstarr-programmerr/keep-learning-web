<template>
  <div>
    <v-progress-circular
      v-if="loading"
      indeterminate
      color="primary"
    ></v-progress-circular>

    <p v-else-if="reports.length === 0">
      This classroom don't have any reading exercises. Perhaps your teacher forgot to add them?
    </p>

    <div v-else>
      <v-simple-table>
        <thead>
          <tr>
            <th>Exercise</th>
            <th>Passage 1</th>
            <th>Passage 2</th>
            <th>Passage 3</th>
            <th>Total</th>
            <th>Band score</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="report of reports"
            :key="report.pk"
          >
            <td>{{ report.exercise.identifier }}</td>
            <template v-if="!report.submitted">
              <td colspan="5">
                Not submitted
              </td>
              <td class="text-center">
                <router-link
                  :to="{
                    name: 'ReadingExerciseSubmit',
                    params: { pk: report.exercise.pk }
                  }"
                >
                  Start
                </router-link>
              </td>
            </template>
            <template v-else>
              <td>{{ report.passage_1_total }}</td>
              <td>{{ report.passage_2_total }}</td>
              <td>{{ report.passage_3_total }}</td>
              <td>{{ report.total }}</td>
              <td>{{ report.band_score }}</td>
              <td class="text-center">
                Detail
              </td>
            </template>
          </tr>
        </tbody>
      </v-simple-table>
    </div>
  </div>
</template>

<script lang="ts">
import { Classroom, ReadingExerciseReport } from '@/interfaces/classroom'
import { User } from '@/interfaces/user'
import { unexpectedExc } from '@/utils'
import { Vue, Component } from 'vue-property-decorator'
import { mapState } from 'vuex'

@Component({
  computed: {
    ...mapState('account', {
      user: 'loggedInUser'
    }),
    ...mapState('classroom', {
      classroom: 'currentClassroom'
    }),
    ...mapState('readingReport', [
      'reports'
    ])
  }
})
export default class ClassroomExercisesReadingStudent extends Vue {
  user!: User
  classroom!: Classroom
  reports!: ReadingExerciseReport[]

  loading = false

  created (): void {
    this.loading = true

    const payload = {
      classroomPk: this.classroom.pk,
      studentPk: this.user.pk
    }

    this.$store.dispatch('readingReport/getReports', payload)
      .catch(unexpectedExc)
      .finally(() => {
        this.loading = false
      })
  }
}
</script>

<style scoped lang="scss">

</style>
