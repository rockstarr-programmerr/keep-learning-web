<template>
  <div>
    <v-list>
      <v-list-item
        v-for="student of students"
        :key="student.pk"
        @click="$emit('detail', student.pk)"
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
export default class ClassroomOverviewStudentList extends Vue {
  classroom!: Classroom

  get students (): Classroom['students'] {
    return this.classroom.students
  }
}
</script>

<style scoped lang="scss">

</style>
