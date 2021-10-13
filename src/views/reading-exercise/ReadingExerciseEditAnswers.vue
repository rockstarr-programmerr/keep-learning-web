<template>
  <v-container>
    <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>

    <v-progress-linear
      v-if="loading"
      indeterminate
      color="primary"
    ></v-progress-linear>

    <div v-else>
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
          <v-simple-table fixed-header>
            <thead>
              <tr>
                <th>Question No.</th>
                <th>Type</th>
                <th>Choices</th>
                <th>Possible answers</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
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
                    v-model="question.question_type"
                    label="Question type"
                    :items="questionTypes"
                    hide-details
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
                      label="Choices"
                      :items="allChoices"
                      multiple
                      hide-details
                    >
                      <template #prepend-item>
                        <v-list>
                          <v-subheader>
                            Common choices
                          </v-subheader>
                          <v-list-item
                            v-for="(value, key) in commonChoices"
                            :key="key"
                            @click="question.choices = value"
                          >
                            <v-list-item-title>
                              {{ key }}
                            </v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </template>
                    </v-select>
                  </template>
                </td>
                <td>
                  <template v-if="!question.editing">
                    {{ formatList(question.answers, ' / ') }}
                  </template>
                  <v-text-field
                    v-else
                    :value="formatList(question.answers, ' / ')"
                    @input="parseList($event, ' / ')"
                    label="Possible answers"
                    hide-details
                  ></v-text-field>
                </td>
                <td>
                  <v-menu
                    v-if="!question.editing"
                    left
                    offset-x
                    nudge-left="12"
                  >
                    <template #activator="{ on, attrs }">
                      <v-icon
                        v-on="on"
                        v-bind="attrs"
                      >
                        mdi-dots-horizontal
                      </v-icon>
                    </template>
                    <v-list dense>
                      <v-list-item @click="question.editing = true">
                        <v-list-item-title>
                          Edit
                        </v-list-item-title>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-title>
                          Delete
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                  <v-icon
                    v-else
                    @click="question.editing = false"
                  >
                    mdi-check
                  </v-icon>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
      </v-card>
    </div>
  </v-container>
</template>

<script lang="ts">
import { Mixins, Component } from 'vue-property-decorator'
import { ReadingExerciseMixin } from '@/mixins/reading-exercise-mixin'
import { ReadingQuestion } from '@/interfaces/reading-question'

declare interface LocalQuestion extends ReadingQuestion {
  editing: boolean;
}

@Component
export default class ReadingExerciseEditAnswers extends Mixins(ReadingExerciseMixin) {
  // TODO: make convenient

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
  commonChoices = { // TODO: remember user's input
    'A, B, C, D': ['A', 'B', 'C', 'D'],
    'A, B, C, D, E': ['A', 'B', 'C', 'D', 'E'],
    'A, B, C, D, E, F': ['A', 'B', 'C', 'D', 'E', 'F'],
    'A, B, C, D, E, F, G, H': ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
  }

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
      const localQuestion: LocalQuestion = { ...question, editing: false }
      this.localQuestions.push(localQuestion)
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
    return text.split(separator)
  }

  allowEditChoices (question: LocalQuestion): boolean {
    return (
      question.editing &&
      question.question_type === 'multiple_choice'
    )
  }
}
</script>

<style scoped lang="scss">

</style>
