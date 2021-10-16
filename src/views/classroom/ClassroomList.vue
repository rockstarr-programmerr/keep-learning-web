<template>
  <v-container class="container-sm">
    <v-breadcrumbs :items="breadcrumbs" />

    <h1>Classrooms</h1>
    <v-divider></v-divider>

    <span
      v-if="isTeacher"
      class="cursor-pointer d-inline-flex mt-5"
      @click="$router.push({ name: 'ClassroomCreate' })"
    >
      <v-icon>
        mdi-plus-circle-outline
      </v-icon>
      <span
        v-text="'New classroom'"
        class="ml-3"
      ></span>
    </span>

    <v-progress-circular
      v-if="loading"
      indeterminate
      color="primary"
    ></v-progress-circular>

    <p v-else-if="noClassrooms" v-text="'You don\'t have any classroom yet.'" />

    <v-card
      v-else
      class="mt-5"
    >
      <v-card-subtitle>
        Your classrooms
        <v-divider class="mt-3"></v-divider>
      </v-card-subtitle>
      <v-card-text>
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
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Classroom } from '@/interfaces/classroom'
import { unexpectedExc } from '@/utils'
import { Vue, Component } from 'vue-property-decorator'
import { Location } from 'vue-router'
import { mapGetters, mapState } from 'vuex'

@Component({
  computed: {
    ...mapState('classroom', [
      'classrooms'
    ]),
    ...mapGetters('account', [
      'isTeacher'
    ])
  }
})
export default class ClassroomList extends Vue {
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

  get noClassrooms (): boolean {
    return this.classrooms.length === 0
  }

  created (): void {
    this.listClassroom()
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

  listClassroom (): void {
    this.loading = true

    this.$store.dispatch('classroom/list')
      .catch(unexpectedExc)
      .finally(() => {
        this.loading = false
      })
  }
}
</script>

<style scoped lang="scss">

</style>
