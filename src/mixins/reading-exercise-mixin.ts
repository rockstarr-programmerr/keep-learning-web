import Vue from 'vue'
import { ReadingExercise } from '@/interfaces/reading-exercise'
import { ReadingQuestion } from '@/interfaces/reading-question'
import { unexpectedExc } from '@/utils'
import { Component, Prop } from 'vue-property-decorator'
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
export class ReadingExerciseMixin extends Vue {
  @Prop(Number) readonly pk!: number

  exercise!: ReadingExercise
  setCurrentExercise!: CallableFunction

  questions!: ReadingQuestion[]
  setCurrentQuestions!: CallableFunction

  get loading (): boolean {
    return this.exercise === undefined
  }

  created (): void {
    this.setExercise()
      .then(this.setQuestions)
      .then(this.initSuccessHook)
      .catch(unexpectedExc)
  }

  setExercise (): Promise<void> {
    return this.$store.dispatch('readingExercise/detail', this.pk)
  }

  setQuestions (): Promise<void> {
    return this.$store.dispatch('readingExercise/getQuestions')
  }

  initSuccessHook (): void {
    // Hook for when exercise and questions have been fetched from API
  }

  // @ts-expect-error: don't care
  // eslint-disable-next-line
  beforeRouteLeave (to, from, next): void {
    this.setCurrentExercise(undefined)
    this.setCurrentQuestions([])
    next()
  }
}
