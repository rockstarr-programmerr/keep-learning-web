<template>
  <v-container>
    <v-progress-circular
      v-if="loading"
      indeterminate
      color="primary"
    ></v-progress-circular>

    <p v-else-if="report === undefined">
      No result found.
    </p>

    <div v-else>
      <h1>Your result</h1>
      <p>Exercise: {{ report.exercise.identifier }}</p>
      <v-divider></v-divider>

      <v-card
        v-for="(results, index) of [report.passage_1_detail, report.passage_2_detail, report.passage_3_detail]"
        :key="index"
        class="mt-5"
      >
        <v-card-title>
          Passage {{ index + 1 }}
        </v-card-title>
        <v-card-text>
          <v-simple-table class="result-table">
            <colgroup>
              <col span="1" style="width: 15%">
              <col span="1" style="width: 15%">
              <col span="1" style="width: 30%">
              <col span="1" style="width: 30%">
            </colgroup>
            <thead>
              <tr>
                <th>Question</th>
                <th>Result</th>
                <th>Your answer</th>
                <th>Correct answer</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="result of results"
                :key="result.question_number"
              >
                <td>{{ result.question_number }}</td>
                <td>
                  <div v-if="result.is_correct">
                    <v-icon class="mr-3" color="success">
                      mdi-check
                    </v-icon>
                  </div>
                  <div v-else>
                    <v-icon class="mr-3" color="error">
                      mdi-close
                    </v-icon>
                  </div>
                </td>
                <td>{{ formatAnswer(result.submitted_answer) }}</td>
                <td>{{ formatCorrectAnswer(result.possible_answers) }}</td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
      </v-card>
    </div>
  </v-container>
</template>

<script lang="ts">
import { Api } from '@/api'
import { Classroom, ReadingExerciseReport } from '@/interfaces/classroom'
import { User } from '@/interfaces/user'
import { unexpectedExc } from '@/utils'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { mapState } from 'vuex'

@Component({
  computed: {
    ...mapState('account', {
      user: 'loggedInUser'
    }),
    ...mapState('classroom', {
      classroom: 'currentClassroom'
    })
  }
})
export default class ReadingExerciseSubmitResult extends Vue {
  @Prop(Number) readonly pk!: number
  @Prop(Number) readonly exercisePk!: number

  user!: User
  classroom!: Classroom
  report: ReadingExerciseReport | null = null

  loading = false

  async created (): Promise<void> {
    this.loading = true

    try {
      await this.setClassroom()
      const reports = await this.setReport()
      if (reports.length > 0) {
        this.report = reports[0]
      }
    } catch (error) {
      unexpectedExc(error)
    } finally {
      this.loading = false
    }
  }

  setClassroom (): Promise<unknown> {
    return this.$store.dispatch('classroom/detail', this.pk)
  }

  setReport (): Promise<ReadingExerciseReport[]> {
    return Api.classroom.getStudentReport(this.classroom.pk, {
      student_pk: this.user.pk,
      exercise_pk: this.exercisePk,
      show_detail: true
    })
  }

  formatAnswer (answer: string): string {
    if (answer === 'NOT_GIVEN') {
      answer = 'NOT GIVEN'
    }
    return answer
  }

  formatCorrectAnswer (answers: string[]): string {
    answers = answers.map(answer => {
      if (answer === 'NOT_GIVEN') {
        answer = 'NOT GIVEN'
      }
      return answer
    })
    return answers.join(' / ')
  }
}
</script>

<style scoped lang="scss">
.result-table {
  table-layout: fixed;
}
</style>
