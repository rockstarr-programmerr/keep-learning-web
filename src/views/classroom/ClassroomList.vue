<template>
  <v-container class="container-sm">
    <v-breadcrumbs :items="breadcrumbs" />

    <h1>Classrooms</h1>
    <v-divider></v-divider>

    <v-btn
      v-if="isTeacher"
      class="mt-5"
      depressed
      @click="$router.push({ name: 'ClassroomCreate' })"
    >
      <v-icon left>
        mdi-plus-circle-outline
      </v-icon>
      New classroom
    </v-btn>

    <v-progress-circular
      v-if="loading"
      indeterminate
      color="primary"
      class="mt-5"
    ></v-progress-circular>

    <p
      v-else-if="noClassrooms"
      class="mt-3"
      v-text="'You don\'t have any classroom yet.'"
    />

    <v-card
      v-else
      class="mt-5"
    >
      <v-card-subtitle>
        <v-row align="center">
          <v-col cols="8">
            Your classrooms
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model="searchText"
              placeholder="Search"
              dense
              hide-details
              prepend-icon="mdi-magnify"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-divider class="mt-3"></v-divider>
      </v-card-subtitle>

      <v-card-text>
        <v-row>
          <v-col
            v-for="(classrooms, index) of [classroomsCol1, classroomsCol2]"
            :key="index"
            cols="6"
          >
            <v-list>
              <v-list-item
                v-for="classroom of classrooms"
                :key="classroom.pk"
                link
                :to="getClassroomLink(classroom)"
              >
                <v-list-item-content v-text="classroom.name" />
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions v-if="!noPagination">
        <v-spacer></v-spacer>
        <v-pagination
          v-model="page"
          :length="paginationLength"
          total-visible="7"
        ></v-pagination>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { PaginationQuery } from '@/interfaces/api/common'
import { Classroom } from '@/interfaces/classroom'
import { unexpectedExc } from '@/utils'
import { Mixins, Component, Watch } from 'vue-property-decorator'
import { Location } from 'vue-router'
import { mapGetters, mapState } from 'vuex'
import { PaginationMixin } from '@/mixins/pagination-mixin'

@Component({
  computed: {
    ...mapState('classroom', [
      'classrooms',
      'pagination'
    ]),
    ...mapGetters('account', [
      'isTeacher'
    ])
  }
})
export default class ClassroomList extends Mixins(PaginationMixin) {
  // eslint-disable-next-line no-undef
  [key: string]: unknown

  breadcrumbs = [
    { text: 'Home', to: { name: 'Home' }, exact: true },
    { text: 'Classrooms', to: { name: 'ClassroomList' }, exact: true }
  ]

  /**
   * Init
   */
  isTeacher!: boolean
  classrooms!: Classroom[]
  localClassrooms: Classroom[] = []

  get noClassrooms (): boolean {
    return this.classrooms.length === 0
  }

  get classroomsCol1 (): Classroom[] {
    return this.localClassrooms.slice(0, Math.ceil(this.localClassrooms.length / 2))
  }

  get classroomsCol2 (): Classroom[] {
    return this.localClassrooms.slice(Math.ceil(this.localClassrooms.length / 2))
  }

  created (): void {
    this.getList()
  }

  getClassroomLink (classroom: Classroom): Location {
    if (this.isTeacher) {
      return {
        name: 'ClassroomOverview',
        params: {
          pk: classroom.pk.toString()
        }
      }
    } else {
      return {
        name: 'ClassroomExercisesReading',
        params: {
          pk: classroom.pk.toString()
        }
      }
    }
  }

  /**
   * List
   */
  loading = true

  getList (query?: PaginationQuery): void {
    this.loading = true

    this.$store.dispatch('classroom/list', query)
      .then(() => {
        this.localClassrooms = this.classrooms
      })
      .catch(unexpectedExc)
      .finally(() => {
        this.loading = false
      })
  }

  /**
   * Search
   */
  searchText = ''

  @Watch('searchText')
  onSearch (text: string): void {
    text = text.toLowerCase()
    this.localClassrooms = this.classrooms.filter(
      classroom => classroom.name.toLowerCase().indexOf(text) !== -1
    )
  }
}
</script>

<style scoped lang="scss">

</style>
