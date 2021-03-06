<template>
  <v-container>
    <v-progress-circular
      v-if="loading"
      indeterminate
      color="primary"
    ></v-progress-circular>

    <p v-else-if="report === null">
      No result found.
    </p>

    <div v-else>
      <v-row
        justify="space-between"
        align="center"
      >
        <v-col cols="auto">
          <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
        </v-col>
        <v-col
          v-if="isTeacher && student !== null"
          cols="auto"
        >
          <v-list-item>
            <v-list-item-avatar>
              <KLAvatar :user="student"></KLAvatar>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="font-weight-bold">
                {{ student.name }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-col>
      </v-row>
      <v-divider></v-divider>

      <v-row class="mt-0">
        <v-col cols="6" class="result-col">
          <div v-html="exercise.content"></div>
        </v-col>
        <v-col cols="6" class="result-col">
          <p v-if="!report.submitted">
            Not submitted yet.
          </p>
          <div v-else>
            <v-card class="mb-5">
              <v-card-title>
                Overall
              </v-card-title>
              <v-card-text>
                <v-row class="font-weight-bold">
                  <v-col cols="6">
                    Time taken: {{ report.time_taken }}
                  </v-col>
                  <v-col cols="6">
                    Submitted at: {{ formatDatetime(report.submit_datetime) }}
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="6">
                    <v-row>
                      <v-col cols="auto">
                        <p>Passage 1:</p>
                        <p>Passage 2:</p>
                        <p>Passage 3:</p>
                      </v-col>
                      <v-col cols="auto" class="font-weight-bold">
                        <p>{{ report.passage_1_total }}</p>
                        <p>{{ report.passage_2_total }}</p>
                        <p>{{ report.passage_3_total }}</p>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="6">
                    <v-row>
                      <v-col cols="auto">
                        <p>Total:</p>
                        <p>Band score:</p>
                      </v-col>
                      <v-col cols="auto" class="font-weight-bold">
                        <p>{{ report.total }}</p>
                        <p>{{ report.band_score }}</p>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <v-card
              v-for="(results, index) of [report.passage_1_detail, report.passage_2_detail, report.passage_3_detail]"
              :key="index"
              class="mb-5"
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
                      <th>
                        {{ isTeacher ? "Student's answer" : "Your answer" }}
                      </th>
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

          <v-btn
            color="primary"
            link
            :to="goBackLink"
          >
            Back to classroom
          </v-btn>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script lang="ts">
import { Api } from '@/api'
import { Classroom, ReadingExerciseReport } from '@/interfaces/classroom'
import { ReadingExercise } from '@/interfaces/reading-exercise'
import { User } from '@/interfaces/user'
import { unexpectedExc } from '@/utils'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Location } from 'vue-router'
import { mapGetters, mapState } from 'vuex'
import KLAvatar from '@/components/KLAvatar.vue'

@Component({
  computed: {
    ...mapState('readingExercise', {
      exercise: 'currentReadingExercise'
    }),
    ...mapState('classroom', {
      classroom: 'currentClassroom'
    }),
    ...mapGetters('account', [
      'isTeacher'
    ])
  },
  components: {
    KLAvatar
  }
})
export default class ReadingExerciseSubmitResult extends Vue {
  @Prop(Number) readonly pk!: number
  @Prop(Number) readonly exercisePk!: number
  @Prop(Number) readonly studentPk!: number

  get breadcrumbs (): unknown[] {
    if (this.exercise === undefined) return []

    let classroomLink
    if (this.isTeacher) {
      classroomLink = {
        text: this.classroomName,
        to: {
          name: 'ClassroomOverviewStudentReport',
          params: {
            pk: this.pk,
            studentPk: this.studentPk
          }
        },
        exact: true
      }
    } else {
      classroomLink = {
        text: this.classroomName,
        to: {
          name: 'ClassroomExercisesReading',
          params: { pk: this.pk }
        },
        exact: true
      }
    }

    return [
      { text: 'Home', to: { name: 'Home' }, exact: true },
      { text: 'Classrooms', to: { name: 'ClassroomList' }, exact: true },
      classroomLink,
      { text: this.exercise.identifier, disabled: true }
    ]
  }

  /**
   * Init
   */
  loading = false
  isTeacher!: boolean

  async created (): Promise<void> {
    this.loading = true

    try {
      this.setStudent()

      await this.setExercise()
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

  /**
   * Classroom
   */
  classroom!: Classroom

  setClassroom (): void {
    if (this.classroom !== undefined) {
      this.$store.dispatch('classroom/detail', this.pk)
    }
  }

  get classroomName (): string {
    if (this.classroom !== undefined) {
      return this.classroom.name
    } else {
      return 'Classroom'
    }
  }

  /**
   * Exercise
   */
  exercise!: ReadingExercise

  setExercise (): Promise<unknown> {
    return this.$store.dispatch('readingExercise/detail', this.exercisePk)
  }

  /**
   * Report
   */
  report: ReadingExerciseReport | null = null

  setReport (): Promise<ReadingExerciseReport[]> {
    return Api.classroom.getStudentReport(this.pk, {
      student_pk: this.studentPk,
      exercise_pk: this.exercisePk,
      show_detail: true
    })
  }

  /**
   * Student
   */
  student: User | null = null

  setStudent (): void {
    Api.account.userDetail(this.studentPk)
      .then(data => {
        this.student = data
      })
      .catch(unexpectedExc)
  }

  /**
   * Utils
   */
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

  formatDatetime (dt: string): string {
    const datetime = new Date(dt)
    return datetime.toLocaleString()
  }

  get goBackLink (): Location {
    if (this.isTeacher) {
      return {
        name: 'ClassroomOverviewStudentReport',
        params: {
          pk: this.pk.toString(),
          studentPk: this.studentPk.toString()
        }
      }
    } else {
      return {
        name: 'ClassroomExercisesReading',
        params: {
          pk: this.pk.toString()
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.result-table {
  table-layout: fixed;
}

.result-col {
  height: 80vh;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
