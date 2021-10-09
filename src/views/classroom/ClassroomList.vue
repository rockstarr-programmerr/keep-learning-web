<template>
  <v-container>
    <v-breadcrumbs :items="breadcrumbs" />

    <v-list v-if="!loading">
      <v-list-item
        v-for="classroom of classrooms"
        :key="classroom.pk"
      >
        <v-list-item-content v-text="classroom.name" />
      </v-list-item>
    </v-list>
    <p v-if="!loading & noClassrooms" v-text="'You don\'t have any classroom yet.'" />

    <v-btn
      v-text="'New classroom'"
      color="primary"
      link
      :to="{ name: 'ClassroomCreate' }"
    />
  </v-container>
</template>

<script lang="ts">
import { Classroom } from '@/interfaces/classroom'
import { unexpectedExc } from '@/utils'
import { Vue, Component } from 'vue-property-decorator'
import { mapState } from 'vuex'

@Component({
  computed: {
    ...mapState('classroom', [
      'classrooms'
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
   * Init classrooms
   */
  classrooms!: Classroom[]

  get noClassrooms (): boolean {
    return this.classrooms.length === 0
  }

  created (): void {
    this.listClassroom()
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
