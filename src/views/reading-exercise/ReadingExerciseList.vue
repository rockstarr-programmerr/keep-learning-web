<template>
  <v-container class="container-sm">
    <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>

    <h1>Manage reading exercises</h1>
    <v-divider></v-divider>

    <v-btn
      class="mt-5"
      depressed
      @click="goToNewExercise"
    >
      <v-icon left>
        mdi-plus-circle-outline
      </v-icon>
      New exercise
    </v-btn>
    <br>

    <v-progress-circular
      v-if="loading"
      indeterminate
      color="primary"
    ></v-progress-circular>

    <p v-else-if="noExercises" v-text="'You don\'t have any exercises yet.'" />

    <v-card
      v-else
      class="mt-5"
    >
      <v-card-subtitle>
        <v-row
          justify="space-between"
          align="center"
        >
          <v-col cols="8">
            Your reading exercises
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model="searchText"
              placeholder="Search"
              hide-details
              dense
              prepend-icon="mdi-magnify"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-divider class="mt-3"></v-divider>
      </v-card-subtitle>

      <v-card-text>
        <v-row>
          <v-col
            v-for="(exercises, index) of [exercisesCol1, exercisesCol2]"
            :key="index"
            cols="6"
          >
            <v-list>
              <v-list-item
                v-for="exercise of exercises"
                :key="exercise.pk"
                link
                :to="{
                  name: 'ReadingExerciseDetail',
                  params: { pk: exercise.pk }
                }"
              >
                <v-list-item-content>
                  <v-list-item-title>
                    {{ exercise.identifier }}
                  </v-list-item-title>
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
import { unexpectedExc } from '@/utils'
import { Vue, Component, Watch } from 'vue-property-decorator'
import { mapState } from 'vuex'

@Component({
  computed: {
    ...mapState('readingExercise', {
      exercises: 'readingExercises'
    })
  }
})
export default class ReadingExerciseList extends Vue {
  // eslint-disable-next-line no-undef
  [key: string]: unknown

  breadcrumbs = [
    { text: 'Home', to: { name: 'Home' }, exact: true },
    { text: 'Reading exercises', to: { name: 'ReadingExerciseList' }, exact: true }
  ]

  /**
   * Init exercises
   */
  exercises!: ReadingExercise[]
  localExercises: ReadingExercise[] = []

  get noExercises (): boolean {
    return this.exercises.length === 0
  }

  created (): void {
    this.listExercise()
  }

  get exercisesCol1 (): ReadingExercise[] {
    return this.localExercises.slice(0, Math.ceil(this.localExercises.length / 2))
  }

  get exercisesCol2 (): ReadingExercise[] {
    return this.localExercises.slice(Math.ceil(this.localExercises.length / 2))
  }

  /**
   * List
   */
  loading = false

  listExercise (): void {
    this.loading = true

    this.$store.dispatch('readingExercise/list')
      .then(() => {
        this.localExercises = this.exercises
      })
      .catch(unexpectedExc)
      .finally(() => {
        this.loading = false
      })
  }

  /**
   * Create
   */
  goToNewExercise (): void {
    this.$router.push({ name: 'ReadingExerciseCreate' })
  }

  /**
   * Search
   */
  searchText = ''

  @Watch('searchText')
  onSearch (text: string): void {
    text = text.toLowerCase()
    this.localExercises = this.exercises.filter(
      ex => ex.identifier.toLowerCase().indexOf(text) !== -1
    )
  }
}
</script>

<style scoped lang="scss">

</style>
