<template>
  <div>
    <component
      :is="component"
      :student-pk="studentPk"
      @detail="goToDetail($event)"
    ></component>
  </div>
</template>

<script lang="ts">
import { User } from '@/interfaces/user'
import { Vue, Component } from 'vue-property-decorator'
import ClassroomOverviewStudentList from './ClassroomOverviewStudentList.vue'
import ClassroomOverviewStudentDetail from './ClassroomOverviewStudentDetail.vue'

@Component({
  components: {
    ClassroomOverviewStudentList,
    ClassroomOverviewStudentDetail
  }
})
export default class ClassroomOverview extends Vue {
  component = ClassroomOverviewStudentList

  studentPk: User['pk'] | null = null

  goToDetail (studentPk: User['pk']): void {
    this.studentPk = studentPk
    this.component = ClassroomOverviewStudentDetail
  }
}
</script>

<style scoped lang="scss">

</style>
