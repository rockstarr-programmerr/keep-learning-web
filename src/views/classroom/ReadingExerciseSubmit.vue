<template>
  <v-container>
    <v-progress-circular
      v-if="loading"
      indeterminate
      color="primary"
    ></v-progress-circular>

    <div v-else>
      <v-row
        justify="space-between"
        align="center"
      >
        <v-col cols="auto">
          <h1>{{ exercise.identifier }}</h1>
        </v-col>
        <v-col cols="auto">
          <v-row
            no-gutters
            align="center"
          >
            <v-col cols="auto">
              Time taken:
            </v-col>
            <v-col cols="auto" class="ml-3 mr-5">
              <KLTimer></KLTimer>
            </v-col>
            <v-divider vertical></v-divider>
            <v-col cols="auto" class="ml-5">
              <v-btn
                link
                text
                :to="{
                  name: 'ClassroomExercisesReading',
                  params: { pk }
                }"
              >
                Back
              </v-btn>
              <v-btn
                class="ml-3"
                color="primary"
                @click="confirmSubmit = true"
              >
                Submit
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-divider></v-divider>

      <v-row class="my-0">
        <v-col cols="6" class="exercise-col">
          <div v-html="exercise.content"></div>
        </v-col>
        <v-col cols="6" class="exercise-col">
          <p class="font-weight-bold mb-0">
            Passage {{ currentPassage }}:
            questions {{ firstQuestionNum }}-{{ lastQuestionNum }}
          </p>
          <v-row>
            <v-col
              v-for="(answers, index) of [answersCol1, answersCol2]"
              :key="index"
              cols="6"
            >
              <v-simple-table>
                <tbody>
                  <tr
                    v-for="answer of answers"
                    :key="answer.question_number"
                  >
                    <th>{{ answer.question_number }}</th>
                    <td>
                      <v-select
                        v-if="answer.question_type !== 'fill_blank'"
                        v-model="answer.content"
                        :items="answer.choices"
                        hide-details
                      ></v-select>
                      <v-text-field
                        v-else
                        v-model="answer.content"
                        hide-details
                      ></v-text-field>
                    </td>
                  </tr>
                  <tr></tr>  <!-- Work around to show last row's input entirely -->
                </tbody>
              </v-simple-table>
            </v-col>
          </v-row>

          <v-stepper
            v-model="currentPassage"
            non-linear
            class="mt-7"
          >
            <v-stepper-header>
              <v-stepper-step
                step="1"
                editable
                :complete="passage1Completed"
                :color="passage1Completed ? 'secondary' : 'primary'"
                edit-icon="mdi-check"
              >
                Passage 1
              </v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step
                step="2"
                editable
                :complete="passage2Completed"
                :color="passage2Completed ? 'secondary' : 'primary'"
                edit-icon="mdi-check"
              >
                Passage 2
              </v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step
                step="3"
                editable
                :complete="passage3Completed"
                :color="passage3Completed ? 'secondary' : 'primary'"
                edit-icon="mdi-check"
              >
                Passage 3
              </v-stepper-step>
            </v-stepper-header>
          </v-stepper>
        </v-col>
      </v-row>
      <v-divider></v-divider>
    </div>

    <KLDialogConfirm
      v-model="confirmSubmit"
      :loading="loadingSubmit"
      @confirm="submitAnswers"
      @cancel="confirmSubmit = false"
    >
      <div
        v-if="!allAnswered"
        class="mb-3 d-flex error--text font-weight-bold"
      >
        <v-icon color="error">
          mdi-alert-outline
        </v-icon>
        <span class="ml-3">
          You haven't answered all questions!
        </span>
      </div>
      Are you sure to submit?
      You cannot edit your answers after this.
    </KLDialogConfirm>

    <KLDialogConfirm
      v-model="confirmLeave"
      @confirm="nextRoute"
      @cancel="confirmLeave = false"
    >
      Are you sure to leave this page?
      <strong>Your current progress will be lost!</strong>
    </KLDialogConfirm>
  </v-container>
</template>

<script lang="ts">
import { Api } from '@/api'
import { ReadingExerciseSubmitAnswersReq } from '@/interfaces/api/reading-exercise'
import { ReadingExercise } from '@/interfaces/reading-exercise'
import { ReadingAnswer, ReadingQuestion } from '@/interfaces/reading-question'
import { User } from '@/interfaces/user'
import { unexpectedExc } from '@/utils'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { mapState } from 'vuex'
import KLDialogConfirm from '@/components/KLDialogConfirm.vue'
import KLTimer from '@/components/KLTimer.vue'

@Component({
  computed: {
    ...mapState('readingExercise', {
      exercise: 'currentReadingExercise'
    }),
    ...mapState('readingExercise', {
      questions: 'currentQuestions'
    }),
    ...mapState('account', {
      user: 'loggedInUser'
    })
  },
  components: {
    KLDialogConfirm,
    KLTimer
  }
})
export default class ReadingExerciseSubmit extends Vue {
  @Prop(Number) readonly pk!: number
  @Prop(Number) readonly exercisePk!: number

  async created (): Promise<void> {
    this.preventLeavePage()
    await this.setQuestions()
    this.setAnswers()
  }

  /**
   * Questions
   */
  exercise!: ReadingExercise
  questions!: ReadingQuestion[]
  loading = false

  async setQuestions (): Promise<void> {
    this.loading = true

    try {
      await this.$store.dispatch('readingExercise/detail', this.exercisePk)
      await this.$store.dispatch('readingExercise/getQuestions')
    } catch (error) {
      unexpectedExc(error)
    } finally {
      this.loading = false
    }
  }

  /**
   * Answers
   */
  answers: ReadingAnswer[] = []
  currentPassage = '1'

  setAnswers (): void {
    this.answers = this.questions.map(question => {
      let choices: ReadingAnswer['choices'] = []

      if (question.question_type === 'true_false') {
        choices = [
          { text: 'TRUE', value: 'TRUE' },
          { text: 'FALSE', value: 'FALSE' },
          { text: 'NOT GIVEN', value: 'NOT_GIVEN' }
        ]
      } else if (question.question_type === 'yes_no') {
        choices = [
          { text: 'YES', value: 'YES' },
          { text: 'NO', value: 'NO' },
          { text: 'NOT GIVEN', value: 'NOT_GIVEN' }
        ]
      } else {
        choices = question.choices.map(choice => (
          { text: choice, value: choice }
        ))
      }

      return {
        question_number: question.number,
        content: '',
        question_type: question.question_type,
        choices,
        passage: question.passage
      }
    })
  }

  get currentPassageAnswers (): ReadingAnswer[] {
    return this.answers.filter(answer => answer.passage?.toString() === this.currentPassage)
  }

  get firstQuestionNum (): string {
    const firstQuestion = this.currentPassageAnswers[0]
    if (firstQuestion !== undefined) {
      return firstQuestion.question_number.toString()
    } else {
      return ''
    }
  }

  get lastQuestionNum (): string {
    const lastQuestion = this.currentPassageAnswers[this.currentPassageAnswers.length - 1]
    if (lastQuestion !== undefined) {
      return lastQuestion.question_number.toString()
    } else {
      return ''
    }
  }

  get answersCol1 (): ReadingAnswer[] {
    return this.currentPassageAnswers.slice(0, Math.ceil(this.currentPassageAnswers.length / 2))
  }

  get answersCol2 (): ReadingAnswer[] {
    return this.currentPassageAnswers.slice(Math.ceil(this.currentPassageAnswers.length / 2))
  }

  get allAnswered (): boolean {
    return this.answers.every(answer => answer.content !== '')
  }

  get passage1Completed (): boolean {
    return this.answers
      .filter(answer => answer.passage === 1)
      .every(answer => answer.content !== '')
  }

  get passage2Completed (): boolean {
    return this.answers
      .filter(answer => answer.passage === 2)
      .every(answer => answer.content !== '')
  }

  get passage3Completed (): boolean {
    return this.answers
      .filter(answer => answer.passage === 3)
      .every(answer => answer.content !== '')
  }

  /**
   * Submit
   */

  confirmSubmit = false
  loadingSubmit = false
  user!: User

  submitAnswers (): void {
    if (this.loadingSubmit) return
    this.loadingSubmit = true

    const payload: ReadingExerciseSubmitAnswersReq[] = this.answers
      .filter(answer => answer.content !== '')
      .map(answer => {
        delete answer.question_type
        delete answer.choices
        delete answer.passage
        return answer
      })

    Api.readingExercise.submitAnswers(this.exercise.pk, payload)
      .catch(unexpectedExc)
      .finally(() => {
        this.confirmSubmit = false
        this.loadingSubmit = false
        this.$router.push({
          name: 'ReadingExerciseSubmitResult',
          params: {
            pk: this.pk.toString(),
            exercisePk: this.exercisePk.toString(),
            studentPk: this.user.pk.toString()
          }
        })
      })
  }

  /**
   * Make sure student don't accidentally leave route when they haven't finished
   */
  confirmLeave = false
  nextRoute: CallableFunction | null = null

  // @ts-expect-error: don't care
  // eslint-disable-next-line
  beforeRouteLeave (to, from, next): void {
    if (!this.confirmLeave) {
      this.confirmLeave = true
      this.nextRoute = next
    } else {
      next()
    }
  }

  preventLeavePage (): void {
    window.onbeforeunload = () => ''
  }
}
</script>

<style scoped lang="scss">
.exercise-col {
  height: 84vh;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
