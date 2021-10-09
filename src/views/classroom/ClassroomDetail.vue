<template>
  <v-container>
    <v-progress-circular
      v-if="loading"
      indeterminate
      color="primary"
    ></v-progress-circular>
    <div v-else>
      <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
      <h1 v-text="classroom.name"></h1>
    </div>
  </v-container>
</template>

<script lang="ts">
import { Classroom } from '@/interfaces/classroom'
import { unexpectedExc } from '@/utils'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { mapState } from 'vuex'

@Component({
  computed: {
    ...mapState('classroom', {
      classroom: 'currentClassroom'
    })
  }
})
export default class ClassroomDetail extends Vue {
  @Prop(Number) readonly pk!: number

  // eslint-disable-next-line no-undef
  [key: string]: unknown

  classroom!: Classroom | undefined

  get breadcrumbs () {
    if (this.classroom === undefined) return []
    return [
      { text: 'Home', to: { name: 'Home' }, exact: true },
      { text: 'Classrooms', to: { name: 'ClassroomList' }, exact: true },
      { text: this.classroom.name, disabled: true }
    ]
  }

  get loading (): boolean {
    return this.classroom === undefined
  }

  created (): void {
    this.setClassroom()
  }

  setClassroom (): void {
    this.$store.dispatch('classroom/detail', this.pk)
      .catch(unexpectedExc)
  }
}
</script>

<style scoped lang="scss">

</style>
