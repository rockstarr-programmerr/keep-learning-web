<template>
  <v-container>
    <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>

    <h1>Manage reading exercises</h1>
    <v-divider></v-divider>

    <span
      class="cursor-pointer d-inline-flex mt-5"
      @click="goToNewExercise"
    >
      <v-icon>
        mdi-plus-circle-outline
      </v-icon>
      <span
        v-text="'Add exercise'"
        class="ml-3"
      ></span>
    </span>
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
        Your reading exercises
        <v-divider class="mt-3"></v-divider>
      </v-card-subtitle>
      <v-card-text>
        <v-list dense>
          <v-list-item
            v-for="exercise of exercises"
            :key="exercise.pk"
            link
            :to="{
              name: 'ReadingExerciseDetail',
              params: { pk: exercise.pk }
            }"
          >
            <v-list-item-content v-text="exercise.identifier" />
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { ReadingExercise } from '@/interfaces/reading-exercise'
import { unexpectedExc } from '@/utils'
import { Vue, Component } from 'vue-property-decorator'
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

  get noExercises (): boolean {
    return this.exercises.length === 0
  }

  created (): void {
    this.listExercise()
  }

  /**
   * List
   */
  loading = false

  listExercise (): void {
    this.loading = true

    this.$store.dispatch('readingExercise/list')
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
}
</script>

<style scoped lang="scss">

</style>
