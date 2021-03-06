<template>
  <v-container class="container-sm">
    <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>

    <v-progress-linear
      v-if="loading"
      indeterminate
      color="primary"
    ></v-progress-linear>

    <div
      v-else
      class="mb-15"
    >
      <h1>
        {{ exercise.identifier }}
      </h1>
      <v-divider></v-divider>

      <v-card
        v-for="(passageQuestions, index) of [passage1Questions, passage2Questions, passage3Questions]"
        :key="index"
        class="mt-5"
      >
        <v-card-title>
          Passage {{ index + 1 }}
        </v-card-title>

        <v-card-text>
          <v-simple-table class="passage-table">
            <colgroup>
              <col span="1" style="width: 10%">
              <col span="1" style="width: 20%">
              <col span="1" style="width: 20%">
              <col span="1" style="width: 35%">
              <col span="1" style="width: 15%">
            </colgroup>
            <thead>
              <tr>
                <th>No.</th>
                <th>Type</th>
                <th>Choices</th>
                <th>Possible answers</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="passageQuestions.length === 0">
                <td colspan="5" class="text-center">No answer yet</td>
              </tr>
              <tr
                v-for="question of passageQuestions"
                :key="question.pk"
              >
                <td>{{ question.number }}</td>
                <td>
                  <template v-if="!question.editing">
                    {{ formatQuestionType(question.question_type) }}
                  </template>
                  <v-select
                    v-else
                    :value="question.question_type"
                    @change="onChangeQuestionType(question, $event)"
                    :items="questionTypes"
                    hide-details
                    outlined
                    dense
                  ></v-select>
                </td>
                <td>
                  <template v-if="question.question_type === 'multiple_choice'">
                    <template v-if="!question.editing">
                      {{ formatList(question.choices, ', ') }}
                    </template>
                    <v-select
                      v-else
                      v-model="question.choices"
                      :items="allChoices"
                      multiple
                      hide-details
                      outlined
                      dense
                    ></v-select>
                  </template>
                </td>
                <td>
                  <template v-if="!question.editing">
                    <span v-if="question.question_type === 'true_false' || question.question_type === 'yes_no'">
                      {{ toTitleCase(question.answers[0], '_') }}
                    </span>
                    <span v-else>
                      {{ formatList(question.answers, ' / ') }}
                    </span>
                  </template>
                  <v-select
                    v-else-if="question.question_type === 'multiple_choice'"
                    v-model="question.answers"
                    :items="getChoicesItems(question)"
                    multiple
                    hide-details
                    outlined
                    dense
                  ></v-select>
                  <v-select
                    v-else-if="question.question_type === 'true_false' || question.question_type === 'yes_no'"
                    :value="question.answers[0]"
                    @input="question.answers = [$event]"
                    :items="getChoicesItems(question)"
                    hide-details
                    outlined
                    dense
                  ></v-select>
                  <v-text-field
                    v-else
                    :value="formatList(question.answers, ' / ')"
                    @input="question.answers = parseList($event, '/')"
                    hide-details
                    outlined
                    dense
                  ></v-text-field>
                </td>
                <td>
                  <v-icon
                    v-if="!question.editing"
                    @click="question.editing = true"
                  >
                    mdi-pencil-outline
                  </v-icon>
                  <template v-else>
                    <v-icon @click="saveQuestion(question)">
                      mdi-check
                    </v-icon>
                    <v-icon
                      v-if="!question.saved"
                      @click="removeQuestion(question)"
                      class="ml-5"
                    >
                      mdi-close
                    </v-icon>
                  </template>
                  <v-icon
                    v-if="isLastQuestion(question) && question.saved"
                    class="ml-5"
                    @click="prepareDelete(question)"
                  >
                    mdi-delete-outline
                  </v-icon>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
        <v-card-actions v-if="allNextPassageIsEmpty(index + 1)">
          <v-btn
            @click="addQuestion(index + 1)"
            depressed
            :disabled="cannotAddQuestion"
          >
            <v-icon left>
              mdi-plus-circle-outline
            </v-icon>
            Add question
          </v-btn>
        </v-card-actions>
      </v-card>

      <KLDialogConfirm
        v-model="deleteConfirm"
        :loading="deleting"
        @confirm="deleteQuestion"
        @cancel="deleteConfirm = false"
      >
        <div v-if="questionToDelete !== null">
          You are removing
          <b>question number {{ questionToDelete.number }}</b>
          from this exercise.
        </div>
      </KLDialogConfirm>
    </div>
  </v-container>
</template>

<script lang="ts">
import { Mixins, Component } from 'vue-property-decorator'
import { ReadingExerciseMixin } from '@/mixins/reading-exercise-mixin'
import { ReadingQuestion } from '@/interfaces/reading-question'
import { ReadingQuestionCreateReq, ReadingQuestionUpdateReq } from '@/interfaces/api/reading-question'
import { toTitleCase, unexpectedExc } from '@/utils'
import KLDialogConfirm from '@/components/KLDialogConfirm.vue'

declare interface LocalQuestion extends ReadingQuestion {
  editing: boolean;
  isNew: boolean;
  saved: boolean;
}

@Component({
  components: {
    KLDialogConfirm
  }
})
export default class ReadingExerciseEditAnswers extends Mixins(ReadingExerciseMixin) {
  // eslint-disable-next-line no-undef
  [key: string]: unknown

  get breadcrumbs (): unknown[] {
    if (this.exercise === undefined) return []
    return [
      { text: 'Home', to: { name: 'Home' }, exact: true },
      { text: 'Reading exercises', to: { name: 'ReadingExerciseList' }, exact: true },
      { text: this.exercise.identifier, to: { name: 'ReadingExerciseDetail', params: { pk: this.pk } }, exact: true },
      { text: 'Edit answers', disabled: true }
    ]
  }

  questionTypes = [
    { text: 'Multiple choice', value: 'multiple_choice' },
    { text: 'True / False / Not given', value: 'true_false' },
    { text: 'Yes / No / Not given', value: 'yes_no' },
    { text: 'Fill in the blank', value: 'fill_blank' }
  ]

  allChoices = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

  localQuestions: LocalQuestion[] = []

  get passage1Questions (): LocalQuestion[] {
    return this.localQuestions.filter(question => question.passage === 1)
  }

  get passage2Questions (): LocalQuestion[] {
    return this.localQuestions.filter(question => question.passage === 2)
  }

  get passage3Questions (): LocalQuestion[] {
    return this.localQuestions.filter(question => question.passage === 3)
  }

  initSuccessHook (): void {
    this.questions.forEach(question => {
      const localQuestion: LocalQuestion = { ...question, editing: false, isNew: false, saved: true }
      this.localQuestions.push(localQuestion)
    })
  }

  newQuestion (passage: LocalQuestion['passage']): LocalQuestion {
    let lastQuestion: LocalQuestion | null = null

    const passageQuestions = (this[`passage${passage}Questions`] as LocalQuestion[])
    if (passageQuestions.length === 0) {
      if (this.localQuestions.length > 0) {
        lastQuestion = this.localQuestions[this.localQuestions.length - 1]
      }
    } else {
      lastQuestion = passageQuestions[passageQuestions.length - 1]
    }

    return {
      pk: lastQuestion !== null ? (lastQuestion.pk + 1) : 1,
      url: '',
      exercise: this.exercise.url,
      passage,
      number: lastQuestion !== null ? (lastQuestion.number + 1) : 1,
      question_type: lastQuestion !== null ? lastQuestion.question_type : 'multiple_choice',
      choices: lastQuestion !== null ? lastQuestion.choices : [],
      answers: [],
      editing: true,
      isNew: true,
      saved: false
    }
  }

  get cannotAddQuestion (): boolean {
    return this.localQuestions.some(q => q.isNew)
  }

  addQuestion (passage: LocalQuestion['passage']): void {
    if (this.localQuestions.some(q => q.isNew)) {
      return
    }
    this.localQuestions.forEach(q => {
      if (q.saved) {
        q.isNew = false
      }
    })
    this.localQuestions.push(this.newQuestion(passage))
  }

  removeQuestion (question: ReadingQuestion): void {
    this.localQuestions = this.localQuestions.filter(q => q.pk !== question.pk)
    this.resetNumbers()
  }

  resetNumbers (): void {
    let number = 1
    this.localQuestions.forEach(q => {
      q.number = number
      number++
    })
  }

  formatQuestionType (type: ReadingQuestion['question_type']): string {
    const mapper = {
      multiple_choice: 'Multiple choice',
      true_false: 'True / False / Not given',
      yes_no: 'Yes / No / Not given',
      fill_blank: 'Fill in the blank'
    }
    return mapper[type]
  }

  formatList (elements: string[], separator: string): string {
    return elements.join(separator)
  }

  parseList (text: string, separator: string): string[] {
    return text.split(separator).map(word => word.trim())
  }

  allowEditChoices (question: LocalQuestion): boolean {
    return (
      question.editing &&
      question.question_type === 'multiple_choice'
    )
  }

  isLastQuestion (question: LocalQuestion): boolean {
    const questions = this.localQuestions.filter(q => !q.isNew)
    const lastNumber = Math.max(...questions.map(q => q.number))
    return question.number === lastNumber
  }

  allNextPassageIsEmpty (passage: LocalQuestion['passage']): boolean {
    if (passage === 3) return true
    for (let i = passage + 1; i <= 3; i++) {
      const questions = (this[`passage${i}Questions`] as LocalQuestion[])
      if (questions.length > 0) {
        return false
      }
    }
    return true
  }

  getChoicesItems (question: LocalQuestion): { text: string; value: string }[] | string[] {
    if (question.question_type === 'true_false') {
      return [
        { text: 'True', value: 'TRUE' },
        { text: 'False', value: 'FALSE' },
        { text: 'Not Given', value: 'NOT_GIVEN' }
      ]
    } else if (question.question_type === 'yes_no') {
      return [
        { text: 'Yes', value: 'YES' },
        { text: 'No', value: 'NO' },
        { text: 'Not Given', value: 'NOT_GIVEN' }
      ]
    } else {
      return question.choices
    }
  }

  toTitleCase = toTitleCase

  onChangeQuestionType (question: LocalQuestion, value: LocalQuestion['question_type']): void {
    question.question_type = value
    question.choices = []
    question.answers = []
  }

  /**
   * Call API
   */

  saveQuestion (question: LocalQuestion): void {
    if (question.isNew) {
      this.createQuestion(question)
    } else {
      this.updateQuestion(question)
    }
    question.saved = true
  }

  createQuestion (question: LocalQuestion): void {
    const payload: ReadingQuestionCreateReq = {
      exercise: question.exercise,
      passage: question.passage,
      number: question.number,
      question_type: question.question_type,
      choices: question.choices,
      answers: question.answers
    }

    this.$store.dispatch('readingExercise/createQuestion', payload)
      .then(pk => {
        if (pk !== null) {
          question.pk = pk
          question.editing = false
          question.isNew = false

          if (!this.localQuestions.some(q => q.isNew)) {
            this.addQuestion(question.passage)
          }
        }
      })
      .catch(unexpectedExc)
  }

  updateQuestion (question: LocalQuestion): void {
    const pk = question.pk
    const payload: ReadingQuestionUpdateReq = {
      exercise: question.exercise,
      passage: question.passage,
      number: question.number,
      question_type: question.question_type,
      choices: question.choices,
      answers: question.answers
    }
    this.$store.dispatch('readingExercise/updateQuestion', { pk, payload })
      .then(() => {
        question.editing = false
      })
      .catch(unexpectedExc)
  }

  deleteConfirm = false
  deleting = false
  questionToDelete: LocalQuestion | null = null

  prepareDelete (question: LocalQuestion): void {
    this.questionToDelete = { ...question }
    this.deleteConfirm = true
  }

  deleteQuestion (): void {
    if (this.deleting || this.questionToDelete === null) return
    this.deleting = true

    this.$store.dispatch('readingExercise/deleteQuestion', this.questionToDelete.pk)
      .then(() => {
        let index = 0
        for (const q of this.localQuestions) {
          // @ts-expect-error `questionToDelete` will not be null here
          if (q.pk === this.questionToDelete.pk) break
          index++
        }
        this.localQuestions.splice(index, 1)

        this.resetNumbers()
        this.deleteConfirm = false
      })
      .catch(unexpectedExc)
      .finally(() => {
        this.deleting = false
      })
  }
}
</script>

<style scoped lang="scss">
.passage-table {
  table-layout: fixed;
}
</style>
