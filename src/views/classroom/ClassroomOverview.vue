<template>
  <v-card>
    <v-card-title>
      Students list
    </v-card-title>
    <v-card-subtitle>
      <span v-if="students.length > 0">
        Click to see each student's tracking sheet
      </span>
    </v-card-subtitle>
    <v-card-text>
      <span v-if="students.length === 0">
        This class doesn't have any students yet.
        <router-link
          :to="{
            name: 'ClassroomStudents',
            params: { pk: classroom.pk },
            query: { adding: 'true' }
          }"
        >
          Add students
        </router-link>
      </span>
      <v-row v-else>
        <v-col
          v-for="(students, index) of [studentsCol1, studentsCol2]"
          :key="index"
          cols="6"
        >
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
              <v-list-item-avatar>
                <KLAvatar :user="student" />
              </v-list-item-avatar>
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
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { mapState } from 'vuex'
import { Classroom } from '@/interfaces/classroom'
import KLAvatar from '@/components/KLAvatar.vue'

@Component({
  computed: {
    ...mapState('classroom', {
      classroom: 'currentClassroom'
    })
  },
  components: {
    KLAvatar
  }
})
export default class ClassroomOverview extends Vue {
  classroom!: Classroom

  get students (): Classroom['students'] {
    return this.classroom.students
  }

  get studentsCol1 (): Classroom['students'] {
    return this.students.slice(0, Math.ceil(this.students.length / 2))
  }

  get studentsCol2 (): Classroom['students'] {
    return this.students.slice(Math.ceil(this.students.length / 2))
  }
}
</script>

<style scoped lang="scss">

</style>
