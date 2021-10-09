<template>
  <v-container>
    <v-list v-if="!loadingList">
      <v-list-item
        v-for="classroom of classrooms"
        :key="classroom.pk"
      >
        <v-list-item-content v-text="classroom.name" />
      </v-list-item>
    </v-list>
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
  loadingList = true

  listClassroom (): void {
    this.loadingList = true

    this.$store.dispatch('classroom/list')
      .catch(unexpectedExc)
      .finally(() => {
        this.loadingList = false
      })
  }
}
</script>

<style scoped lang="scss">

</style>
