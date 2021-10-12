<template>
  <v-container>
    <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>

    <v-progress-linear
      v-if="loading"
      indeterminate
      color="primary"
    ></v-progress-linear>

    <v-card v-else>
      <v-card-title>
        {{ exercise.identifier }}
      </v-card-title>
      <v-divider></v-divider>

      <v-card-text>
        <p>
          This exercise has <strong>{{ questions.length }}</strong> answers.
        </p>

        <v-list>
          <v-list-item
            v-for="(question, index) of overrideQuestions"
            :key="index"
          >
            <v-list-item-content>
              <v-list-item-title>
                <span class="font-weight-bold mr-3">
                  <span v-if="index === overrideQuestions.length - 1">
                    New question:
                  </span>
                  <span v-else>
                    Question: {{ question.number }}
                  </span>
                </span>
                <v-icon
                  v-if="index === overrideQuestions.length - 1"
                  @click="deleteQuestion(question)"
                >
                  mdi-close-circle-outline
                </v-icon>
              </v-list-item-title>
              <v-form>
                <v-row no-gutters>
                  <v-col cols="6" class="pr-5 mt-2">
                    <v-text-field
                      v-model="question.passage"
                      label="Passage"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6" class="mt-2">
                    <v-select
                      v-model="question.question_type"
                      label="Question type"
                      :items="questionTypes"
                      hide-details
                    ></v-select>
                  </v-col>
                  <v-col cols="6" class="pr-5 mt-2">
                    <v-combobox
                      v-model="question.answers"
                      label="Possible answers"
                      multiple
                      chips
                      append-icon=""
                      messages="Student's answer is correct if it matches any of these."
                    ></v-combobox>
                  </v-col>
                  <v-col cols="6" class="mt-2">
                    <v-combobox
                      v-model="question.choices"
                      label="Choices"
                      :items="commonChoices"
                      multiple
                      chips
                      messages="Only apply for multiple choice question"
                    ></v-combobox>
                  </v-col>
                </v-row>
              </v-form>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn
                v-if="showSaveBtn(question)"
                fab
                depressed
                @click="saveQuestion(question)"
              >
                Save
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { ReadingQuestionCreateReq, ReadingQuestionUpdateReq } from '@/interfaces/api/reading-question'
import { ReadingQuestion } from '@/interfaces/reading-question'
import { ReadingExerciseMixin } from '@/mixins/reading-exercise-mixin'
import { unexpectedExc } from '@/utils'
import { Mixins, Component } from 'vue-property-decorator'

@Component
export default class ReadingExerciseAddAnswers extends Mixins(ReadingExerciseMixin) {
  // TODO: make convenient

  // eslint-disable-next-line no-undef
  [key: string]: unknown

  get breadcrumbs (): unknown[] {
    if (this.exercise === undefined) return []
    return [
      { text: 'Home', to: { name: 'Home' }, exact: true },
      { text: 'Reading exercises', to: { name: 'ReadingExerciseList' }, exact: true },
      { text: this.exercise.identifier, to: { name: 'ReadingExerciseDetail', params: { pk: this.pk } }, exact: true },
      { text: 'Add answers', disabled: true }
    ]
  }

  overrideQuestions: ReadingQuestionCreateReq[] = []

  questionTypes = [
    { text: 'Multiple choice', value: 'multiple_choice' },
    { text: 'True / False / Not given', value: 'true_false' },
    { text: 'Yes / No / Not given', value: 'yes_no' },
    { text: 'Fill in the blank', value: 'fill_blank' }
  ]

  commonChoices = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'K', 'L', 'M', 'N']

  initSuccessHook (): void {
    this.overrideQuestions = this.questions.map(question => this.newQuestion(question))
    this.addEmptyQuestion()
  }

  newQuestion (question?: ReadingQuestion): ReadingQuestionCreateReq {
    const number = Math.max(...this.overrideQuestions.map(question => question.number), 0)
    const passage = Math.max(...this.overrideQuestions.map(question => question.passage), 1)

    return {
      exercise: question !== undefined ? question.exercise : '',
      passage: question !== undefined ? question.passage : passage,
      number: question !== undefined ? question.number : number + 1,
      question_type: question !== undefined ? question.question_type : 'multiple_choice',
      choices: question !== undefined ? question.choices : [],
      answers: question !== undefined ? question.answers : []
    }
  }

  addEmptyQuestion (): void {
    this.overrideQuestions.push(this.newQuestion())
  }

  showSaveBtn (question: ReadingQuestionCreateReq): boolean {
    const maxNumber = Math.max(...this.overrideQuestions.map(question => question.number))
    const isEmptyQuestion = question.number === maxNumber
    return isEmptyQuestion
  }

  /**
   * Call API
   */
  saveQuestion (question: ReadingQuestionCreateReq): void {
    // TODO: loading
    const existingQuestion = this.questions.find(q => q.number === question.number)
    if (existingQuestion === undefined) {
      this.createQuestion(question)
      this.addEmptyQuestion()
    } else {
      this.updateQuestion(question, existingQuestion)
    }
  }

  createQuestion (question: ReadingQuestionCreateReq): void {
    this.$store.dispatch('readingExercise/createQuestion', question)
      .catch(unexpectedExc)
  }

  updateQuestion (question: ReadingQuestionUpdateReq, existingQuestion: ReadingQuestion): void {
    this.$store.dispatch('readingExercise/updateQuestion', {
      pk: existingQuestion.pk,
      payload: question
    })
      .catch(unexpectedExc)
  }

  deleteQuestion (question: ReadingQuestionCreateReq): void {
    const existingQuestion = this.questions.find(q => q.number === question.number)
    if (existingQuestion !== undefined) {
      this.$store.dispatch('readingExercise/deleteQuestion', existingQuestion.pk)
        .catch(unexpectedExc)
    }
    this.overrideQuestions = this.overrideQuestions.filter(q => q.number !== question.number)
  }
}
</script>

<style scoped lang="scss">

</style>
