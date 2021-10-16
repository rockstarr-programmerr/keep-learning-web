<template>
  <v-container>
    <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>

    <v-progress-circular
      v-if="loading"
      indeterminate
      color="primary"
    ></v-progress-circular>

    <div v-if="exercise !== undefined">
      <v-row
        justify="space-between"
        align="center"
      >
        <v-col cols="auto">
          <h1>{{ exercise.identifier }}</h1>
        </v-col>
        <v-col cols="auto">
          <v-btn
            icon
            @click="confirmDelete = true"
          >
            <v-icon>mdi-delete-outline</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-divider></v-divider>

      <v-row class="mt-0">
        <v-col
          cols="6"
          class="exercise-row"
        >
          <router-link
            :to="{
              name: 'ReadingExerciseUpdate',
              params: { pk: exercise.pk }
            }"
          >
            Edit exercise
          </router-link>
          <div v-html="exercise.content"></div>
        </v-col>
        <v-col
          cols="6"
          class="exercise-row"
        >
          <span v-if="questions.length === 0">
            No answers yet.
            <router-link
              :to="{
                name: 'ReadingExerciseEditAnswers',
                params: { pk }
              }"
            >
              Add answers
            </router-link>
          </span>
          <div v-else>
            <router-link
              :to="{
                name: 'ReadingExerciseEditAnswers',
                params: { pk: exercise.pk }
              }"
            >
              Edit answers
            </router-link>
            <v-row>
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
          </div>
        </v-col>
      </v-row>

      <KLDialogConfirm
        v-model="confirmDelete"
        :loading="deleting"
        @confirm="deleteExercise"
        @cancel="confirmDelete = false"
      >
        <p>
          You are deleting exercise <strong>{{ exercise.identifier }}</strong>.
        </p>
        <div class="error--text">
          <v-icon color="error">
            mdi-alert-outline
          </v-icon>
          This cannot be undone!
        </div>
      </KLDialogConfirm>
    </div>
  </v-container>
</template>

<script lang="ts">
import { ReadingQuestion } from '@/interfaces/reading-question'
import { Mixins, Component } from 'vue-property-decorator'
import { ReadingExerciseMixin } from '@/mixins/reading-exercise-mixin'
import { unexpectedExc } from '@/utils'
import KLDialogConfirm from '@/components/KLDialogConfirm.vue'

@Component({
  components: {
    KLDialogConfirm
  }
})
export default class ReadingExerciseDetail extends Mixins(ReadingExerciseMixin) {
  get breadcrumbs (): unknown[] {
    if (this.exercise === undefined) return []
    return [
      { text: 'Home', to: { name: 'Home' }, exact: true },
      { text: 'Reading exercises', to: { name: 'ReadingExerciseList' }, exact: true },
      { text: this.exercise.identifier, disabled: true }
    ]
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

  /**
   * Delete exercise
   */
  confirmDelete = false
  deleting = false

  deleteExercise (): void {
    if (this.deleting) return
    this.deleting = true

    this.$store.dispatch('readingExercise/delete', this.exercise.pk)
      .then(() => {
        this.$router.push({ name: 'ReadingExerciseList' })
      })
      .catch(unexpectedExc)
      .finally(() => {
        this.deleting = false
      })
  }
}
</script>

<style scoped lang="scss">
.exercise-content.v-card__text {
  color: rgba(0, 0, 0, 1);
}

.exercise-row {
  height: 80vh;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
