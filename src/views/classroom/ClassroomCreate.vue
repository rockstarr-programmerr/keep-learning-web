<template>
  <v-container class="container-sm">
    <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>

    <v-card>
      <v-card-title>
        New classroom
      </v-card-title>

      <v-card-text>
        <v-form>
          <v-text-field
            v-model="name"
            label="Name *"
            autofocus
            :error-messages="nameErrs"
            :error-count="nameErrs.length"
          ></v-text-field>
          <v-textarea
            v-model="description"
            label="Description"
          ></v-textarea>
        </v-form>

        <div>
          <p class="font-weight-bold mt-7 mb-0">Add reading exercises</p>
          <p class="caption--text">Choose the exercises you want to use in this class.</p>

          <p v-if="exercises.length === 0">
            You haven't created any reading exercises yet.
            <router-link :to="{ name: 'ReadingExerciseCreate' }">
              Create now
            </router-link>
          </p>

          <div v-else>
            <v-btn-toggle>
              <v-btn
                small
                @click="selectAll"
              >
                Select all
              </v-btn>
              <v-btn
                small
                @click="unselectAll"
              >
                Unselect all
              </v-btn>
            </v-btn-toggle>

            <v-row
              no-gutters
              class="my-3"
            >
              <v-col
                v-for="exercise of localExercises"
                :key="exercise.pk"
                cols="3"
              >
                <v-checkbox
                  v-model="exercise.isChosen"
                  :label="exercise.identifier"
                  dense
                  hide-details
                ></v-checkbox>
              </v-col>
            </v-row>

            <div v-if="readingPagination.next !== null">
              <v-progress-circular
                v-if="loadingExercises"
                indeterminate
                color="primary"
                width="2"
                size="18"
              ></v-progress-circular>
              <a
                v-else
                href="#"
                @click="loadMoreReading"
              >
                Load more
              </a>
            </div>
          </div>
        </div>

        <div>
          <p class="font-weight-bold mt-11 mb-0">Add listening exercises</p>
          <p>Coming soon</p>
        </div>

      </v-card-text>

      <v-card-actions>
        <v-btn
          color="primary"
          @click="submit"
          :loading="loading"
          min-width="110"
        >
          Create
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { AddReadingExercisesReq, ClassroomCreateReq } from '@/interfaces/api/classroom'
import { PaginatedRes, PaginationQuery } from '@/interfaces/api/common'
import { ReadingExercise } from '@/interfaces/reading-exercise'
import { unexpectedExc } from '@/utils'
import { PAGE_SIZE } from '@/utils/constants'
import { assertErrCode, status } from '@/utils/status-codes'
import { Vue, Component } from 'vue-property-decorator'
import { mapState } from 'vuex'

declare interface LocalExercise extends ReadingExercise {
  isChosen: boolean
}

@Component({
  computed: {
    ...mapState('readingExercise', {
      exercises: 'readingExercises',
      readingPagination: 'exercisePagination'
    })
  }
})
export default class ClassroomCreate extends Vue {
  // eslint-disable-next-line no-undef
  [key: string]: unknown

  breadcrumbs = [
    { text: 'Home', to: { name: 'Home' }, exact: true },
    { text: 'Classrooms', to: { name: 'ClassroomList' }, exact: true },
    { text: 'New', to: { name: 'ClassroomCreate' }, exact: true }
  ]

  /**
   * Init
   */
  exercises!: ReadingExercise[]
  localExercises: LocalExercise[] = []
  readingPagination!: PaginatedRes
  loadingExercises = false
  page = 1

  created (): void {
    this.listExercise()
  }

  listExercise (query?: PaginationQuery): void {
    this.loadingExercises = true

    this.$store.dispatch('readingExercise/list', query)
      .then(() => {
        this.localExercises.push(...this.exercises.map(exercise => ({
          ...exercise,
          isChosen: false
        })))
        this.page++
      })
      .catch(unexpectedExc)
      .finally(() => {
        this.loadingExercises = false
      })
  }

  /**
   * Select reading exercises
   */
  loadMoreReading (): void {
    this.listExercise({
      limit: PAGE_SIZE,
      offset: (this.page - 1) * PAGE_SIZE
    })
  }

  selectAll (): void {
    this.localExercises.forEach(exercise => { exercise.isChosen = true })
  }

  unselectAll (): void {
    this.localExercises.forEach(exercise => { exercise.isChosen = false })
  }

  /**
   * Create classroom
   */

  loading = false

  name = ''
  description = ''

  nameErrs = []

  async submit (): Promise<void> {
    if (this.loading) return
    this.loading = true

    const createClassroomPayload: ClassroomCreateReq = {
      name: this.name,
      description: this.description
    }

    try {
      const classroomPk = await this.$store.dispatch('classroom/create', createClassroomPayload)

      const addExercisesPayload: AddReadingExercisesReq[] = this.localExercises
        .filter(exercise => exercise.isChosen)
        .map(exercise => ({ pk: exercise.pk }))

      await this.$store.dispatch('classroom/addReadingExercises', {
        classroomPk,
        payload: addExercisesPayload
      })

      this.$router.push({
        name: 'ClassroomOverview',
        params: { pk: classroomPk }
      })
    } catch (err) {
      if (assertErrCode(err, status.HTTP_400_BAD_REQUEST)) {
        const data = err.response.data
        Object.entries(data).forEach(([field, errMsgs]) => {
          const attr = `${field}Errs`
          this[attr] = errMsgs
        })
      } else {
        unexpectedExc(err)
      }
    } finally {
      this.loading = false
    }
  }
}
</script>

<style scoped lang="scss">

</style>
