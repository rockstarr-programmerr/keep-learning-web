<template>
  <div>
    <v-btn
      color="primary"
      v-text="'Add students'"
    ></v-btn>

    <v-data-table
      :headers="headers"
      :items="students"
      class="mt-3"
    ></v-data-table>
  </div>
</template>

<script lang="ts">
import { Classroom } from '@/interfaces/classroom'
import { Vue, Component } from 'vue-property-decorator'
import { mapState } from 'vuex'

@Component({
  computed: {
    ...mapState('classroom', {
      classroom: 'currentClassroom'
    })
  }
})
export default class ClassroomStudents extends Vue {
  classroom!: Classroom

  get students (): Classroom['students'] {
    return this.classroom.students
  }

  /**
   * Students table
   */
  headers = [
    { text: 'Name', value: 'name' },
    { text: 'Email', value: 'email' },
    { text: 'Phone number', value: 'phone_number' }
  ]
}
</script>

<style scoped lang="scss">

</style>
