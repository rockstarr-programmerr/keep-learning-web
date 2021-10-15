<template>
  <div>
    <v-progress-circular
      v-if="loading"
      indeterminate
      color="primary"
    ></v-progress-circular>

    <p v-else-if="reports.length === 0">
      No reports for this student.
    </p>

    <div v-else>
      <v-card>
        <v-card-title>
          <span v-if="student !== null">{{ student.name }}</span>
        </v-card-title>
        <v-card-subtitle>
          <span v-if="student !== null">{{ student.email }}</span>
        </v-card-subtitle>
        <v-card-text>
          <v-simple-table>
            <thead>
              <tr>
                <th>Reading</th>
                <th>Passage 1</th>
                <th>Passage 2</th>
                <th>Passage 3</th>
                <th>Total</th>
                <th>Band score</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="report of reports"
                :key="report.pk"
                class="cursor-pointer"
                @click="$router.push({
                  name: 'ReadingExerciseSubmitResult',
                  params: {
                    pk: classroom.pk,
                    exercisePk: report.exercise.pk,
                    studentPk
                  }
                })"
              >
                <td>{{ report.exercise.identifier }}</td>
                <template v-if="!report.submitted">
                  <td colspan="6">
                    Not submitted
                  </td>
                </template>
                <template v-else>
                  <td>{{ report.passage_1_total }}</td>
                  <td>{{ report.passage_2_total }}</td>
                  <td>{{ report.passage_3_total }}</td>
                  <td>{{ report.total }}</td>
                  <td>{{ report.band_score }}</td>
                </template>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script lang="ts">
import { Api } from '@/api'
import { GetStudentReportReq } from '@/interfaces/api/classroom'
import { Classroom, ReadingExerciseReport } from '@/interfaces/classroom'
import { User } from '@/interfaces/user'
import { unexpectedExc } from '@/utils'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { mapState } from 'vuex'

@Component({
  computed: {
    ...mapState('classroom', {
      classroom: 'currentClassroom'
    })
  }
})
export default class ClassroomOverviewStudentReport extends Vue {
  @Prop(Number) readonly pk!: number
  @Prop(Number) readonly studentPk!: number

  classroom!: Classroom
  reports: ReadingExerciseReport[] = []
  student: User | null = null
  loading = false

  created (): void {
    this.setReports()
    this.setStudent()
  }

  setReports (): void {
    this.loading = true

    const params: GetStudentReportReq = {
      student_pk: this.studentPk,
      show_detail: false
    }

    Api.classroom.getStudentReport(this.classroom.pk, params)
      .then(data => {
        this.reports = data
      })
      .catch(unexpectedExc)
      .finally(() => {
        this.loading = false
      })
  }

  setStudent (): void {
    Api.account.userDetail(this.studentPk)
      .then(data => {
        this.student = data
      })
      .catch(unexpectedExc)
  }
}
</script>

<style scoped lang="scss">

</style>
