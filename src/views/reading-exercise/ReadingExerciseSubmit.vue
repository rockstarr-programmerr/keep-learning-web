<template>
  <v-container>
    <v-progress-circular
      v-if="loading"
      indeterminate
      color="primary"
    ></v-progress-circular>

    <div v-else>
      <h1>{{ exercise.identifier }}</h1>
      <v-divider></v-divider>

      <v-row class="mt-0">
        <v-col cols="6" class="exercise-col">
          <div v-html="exercise.content"></div>
        </v-col>
        <v-col cols="6" class="exercise-col">
          <p class="mb-0">Your answers</p>
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
                </tbody>
              </v-simple-table>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script lang="ts">
import { ReadingExercise } from '@/interfaces/reading-exercise'
import { ReadingAnswer, ReadingQuestion } from '@/interfaces/reading-question'
import { unexpectedExc } from '@/utils'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { mapState } from 'vuex'

@Component({
  computed: {
    ...mapState('readingExercise', {
      exercise: 'currentReadingExercise'
    }),
    ...mapState('readingExercise', {
      questions: 'currentQuestions'
    })
  }
})
export default class ReadingExerciseSubmit extends Vue {
  @Prop(Number) readonly pk!: number

  async created (): Promise<void> {
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
      await this.$store.dispatch('readingExercise/detail', this.pk)
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
        choices
      }
    })
  }

  get answersCol1 (): ReadingAnswer[] {
    return this.answers.filter(answer => answer.question_number <= 20)
  }

  get answersCol2 (): ReadingAnswer[] {
    return this.answers.filter(answer => answer.question_number > 20)
  }
}
</script>

<style scoped lang="scss">
.exercise-col {
  height: 80vh;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
