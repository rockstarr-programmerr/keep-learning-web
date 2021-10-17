<template>
  <component :is="component"></component>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import ClassroomExercisesReadingTeacher from './ClassroomExercisesReadingTeacher.vue'
import ClassroomExercisesReadingStudent from './ClassroomExercisesReadingStudent.vue'

@Component({
  computed: {
    ...mapGetters('account', [
      'isTeacher',
      'isStudent'
    ])
  },
  components: {
    ClassroomExercisesReadingTeacher,
    ClassroomExercisesReadingStudent
  }
})
export default class ClassroomExercisesReading extends Vue {
  isTeacher!: boolean
  isStudent!: boolean

  get component (): typeof Vue {
    if (this.isTeacher) {
      return ClassroomExercisesReadingTeacher
    } else {
      return ClassroomExercisesReadingStudent
    }
  }
}
</script>
