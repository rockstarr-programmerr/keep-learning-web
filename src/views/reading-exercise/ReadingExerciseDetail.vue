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
    ...mapMutations('readingExercise', {
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
    return this.exercise === undefined
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
.exercise-content.v-card__text {
  color: rgba(0, 0, 0, 1);
}
</style>
