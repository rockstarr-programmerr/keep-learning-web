<template>
  <v-container>
    <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>

    <v-progress-circular
      v-if="loading"
      indeterminate
      color="primary"
    ></v-progress-circular>

    <v-card v-if="exercise !== undefined">
      <v-card-title>
        {{ exercise.identifier }}
        <v-spacer></v-spacer>
        <v-menu
          offset-x
          left
          nudge-left="12"
        >
          <template #activator="{ on, attrs }">
            <v-icon
              v-on="on"
              v-bind="attrs"
            >
              mdi-dots-vertical
            </v-icon>
          </template>
          <v-list dense>
            <v-list-item
              link
              :to="{
                name: 'ReadingExerciseUpdate',
                params: { pk }
              }"
            >
              <v-list-item-icon class="mr-5">
                <v-icon>
                  mdi-pencil-outline
                </v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                Edit
              </v-list-item-title>
            </v-list-item>
            <v-list-item
              link
              :to="{
                name: 'ReadingExerciseUpdate',
                params: { pk }
              }"
            >
              <v-list-item-icon class="mr-5">
                <v-icon>
                  mdi-checkbox-marked-outline
                </v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                Add answers
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-icon class="mr-5">
                <v-icon>
                  mdi-delete-outline
                </v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                Delete
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="exercise-content">
        <div
          v-html="exercise.content"
          :style="{ maxHeight: exerciseContentHeight, overflow: 'hidden' }"
        ></div>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="pa-0">
        <v-btn
          block
          depressed
          text
          tile
          @click="expand = !expand"
        >
          {{ expand ? 'Collapse' : 'Expand' }}
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-card class="mt-5">
      <v-card-title>
        Answers
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <span v-if="questions.length === 0">
          No answers yet.
          <router-link :to="{ name: 'Home' }">
            Add answers
          </router-link>
        </span>
        <v-row v-else>
          <v-col cols="4">
            <v-list dense>
              <v-subheader>Passage 1</v-subheader>
              <v-list-item
                v-for="question of passage1Questions"
                :key="question.pk"
              >
                <v-list-item-content>
                  {{ question.number }}. {{ formatAnswers(question.answers) }}
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-col>
          <v-col cols="4">
            <v-list dense>
              <v-subheader>Passage 2</v-subheader>
              <v-list-item
                v-for="question of passage2Questions"
                :key="question.pk"
              >
                <v-list-item-content>
                  {{ question.number }}. {{ formatAnswers(question.answers) }}
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-col>
          <v-col cols="4">
            <v-list dense>
              <v-subheader>Passage 3</v-subheader>
              <v-list-item
                v-for="question of passage3Questions"
                :key="question.pk"
              >
                <v-list-item-content>
                  {{ question.number }}. {{ formatAnswers(question.answers) }}
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { ReadingExercise } from '@/interfaces/reading-exercise'
import { ReadingQuestion } from '@/interfaces/reading-question'
import { unexpectedExc } from '@/utils'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { mapMutations, mapState } from 'vuex'

@Component({
  computed: {
    ...mapState('readingExercise', {
      exercise: 'currentReadingExercise',
      questions: 'currentQuestions'
    })
  },
  methods: {
    ...mapMutations('readingExercise', {
      setCurrentExercise: 'SET_CURRENT_READING_EXERCISE',
      setCurrentQuestions: 'SET_CURRENT_QUESTIONS'
    })
  }
})
export default class ReadingExerciseDetail extends Vue {
  @Prop(Number) readonly pk!: number

  // eslint-disable-next-line no-undef
  [key: string]: unknown

  get breadcrumbs (): unknown[] {
    if (this.exercise === undefined) return []
    return [
      { text: 'Home', to: { name: 'Home' }, exact: true },
      { text: 'Reading exercises', to: { name: 'ReadingExerciseList' }, exact: true },
      { text: this.exercise.identifier, disabled: true }
    ]
  }

  /**
   * Exercise detail
   */
  exercise!: ReadingExercise
  setCurrentExercise!: CallableFunction

  get loading (): boolean {
    return this.exercise === undefined
  }

  created (): void {
    this.setExercise()
      .then(this.setQuestions)
      .catch(unexpectedExc)
  }

  setExercise (): Promise<void> {
    return this.$store.dispatch('readingExercise/detail', this.pk)
  }

  expand = false

  get exerciseContentHeight (): string {
    if (!this.expand) {
      return '50vh'
    } else {
      return 'unset'
    }
  }

  /**
   * Questions list
   */
  questions!: ReadingQuestion[]
  setCurrentQuestions!: CallableFunction

  setQuestions (): Promise<void> {
    return this.$store.dispatch('readingExercise/getQuestions')
  }

  get passage1Questions (): ReadingQuestion[] {
    return this.questions.filter(question => question.passage === 1)
  }

  get passage2Questions (): ReadingQuestion[] {
    return this.questions.filter(question => question.passage === 2)
  }

  get passage3Questions (): ReadingQuestion[] {
    return this.questions.filter(question => question.passage === 3)
  }

  formatAnswers (answers: ReadingQuestion['answers']): string {
    return answers.join(' / ')
  }

  // @ts-expect-error: don't care
  // eslint-disable-next-line
  beforeRouteLeave (to, from, next): void {
    this.setCurrentExercise(undefined)
    this.setCurrentQuestions([])
    next()
  }
}
</script>

<style scoped lang="scss">
.exercise-content.v-card__text {
  color: rgba(0, 0, 0, 1);
}
</style>
