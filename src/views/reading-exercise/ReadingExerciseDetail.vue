<template>
  <v-container>
    <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>

    <v-card v-if="exercise !== undefined">
      <v-card-title>
        {{ exercise.identifier }}
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <div v-html="exercise.content"></div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { ReadingExercise } from '@/interfaces/reading-exercise'
import { unexpectedExc } from '@/utils'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { mapMutations, mapState } from 'vuex'

@Component({
  computed: {
    ...mapState('readingExercise', {
      exercise: 'currentReadingExercise'
    })
  },
  methods: {
    ...mapMutations('classroom', {
      setCurrentExercise: 'SET_CURRENT_READING_EXERCISE'
    })
  }
})
export default class ReadingExerciseDetail extends Vue {
  @Prop(Number) readonly pk!: number

  // eslint-disable-next-line no-undef
  [key: string]: unknown

  exercise!: ReadingExercise
  setCurrentExercise!: CallableFunction

  get breadcrumbs (): unknown[] {
    if (this.exercise === undefined) return []
    return [
      { text: 'Home', to: { name: 'Home' }, exact: true },
      { text: 'Reading exercises', to: { name: 'ReadingExerciseList' }, exact: true },
      { text: this.exercise.identifier, disabled: true }
    ]
  }

  get loading (): boolean {
    return this.classroom === undefined
  }

  created (): void {
    this.setExercise()
  }

  setExercise (): void {
    this.$store.dispatch('readingExercise/detail', this.pk)
      .catch(unexpectedExc)
  }

  // @ts-expect-error: don't care
  // eslint-disable-next-line
  beforeRouteLeave (to, from, next): void {
    this.setCurrentExercise(undefined)
    next()
  }
}
</script>

<style scoped lang="scss">

</style>
