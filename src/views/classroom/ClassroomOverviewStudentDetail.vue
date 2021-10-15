<template>
  <div>
    {{ studentPk }}
  </div>
</template>

<script lang="ts">
import { Classroom } from '@/interfaces/classroom'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { mapState } from 'vuex'

@Component({
  computed: {
    ...mapState('classroom', {
      classroom: 'currentClassroom'
    })
  }
})
export default class ClassroomOverviewStudentDetail extends Vue {
  @Prop(Number) readonly studentPk!: number

  classroom!: Classroom

  get students (): Classroom['students'] {
    return this.classroom.students
  }
}
</script>

<style scoped lang="scss">

</style>
