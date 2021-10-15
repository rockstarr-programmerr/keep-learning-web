<template>
  <v-card>
    <v-card-title>
      Students list
    </v-card-title>
    <v-card-subtitle>
      Click to see each student's tracking sheet
    </v-card-subtitle>
    <v-card-text>
      <v-list>
        <v-list-item
          v-for="student of students"
          :key="student.pk"
          link
          :to="{
            name: 'ClassroomOverviewStudentReport',
            params: {
              pk: classroom.pk,
              studentPk: student.pk
            }
          }"
        >
          <v-list-item-content>
            <v-list-item-title>
              {{ student.name }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ student.email }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { mapState } from 'vuex'
import { Classroom } from '@/interfaces/classroom'

@Component({
  computed: {
    ...mapState('classroom', {
      classroom: 'currentClassroom'
    })
  }
})
export default class ClassroomOverview extends Vue {
  classroom!: Classroom

  get students (): Classroom['students'] {
    return this.classroom.students
  }
}
</script>

<style scoped lang="scss">

</style>
