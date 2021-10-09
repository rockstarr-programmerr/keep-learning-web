<template>
  <LayoutDefault>
    <v-container>
      <v-progress-circular
        v-if="loading"
        indeterminate
        color="primary"
      ></v-progress-circular>
      <div v-else>
        <!-- <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs> -->
        <h1 v-text="classroom.name"></h1>
        <p v-text="classroom.description"></p>  <!-- TODO: multiline -->
        <router-view></router-view>
      </div>
    </v-container>
  </LayoutDefault>
</template>

<script lang="ts">
import { Classroom } from '@/interfaces/classroom'
import { unexpectedExc } from '@/utils'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { mapMutations, mapState } from 'vuex'
import LayoutDefault from './LayoutDefault.vue'

@Component({
  components: {
    LayoutDefault
  },
  computed: {
    ...mapState('classroom', {
      classroom: 'currentClassroom'
    })
  },
  methods: {
    ...mapMutations('classroom', {
      setCurrentClassroom: 'SET_CURRENT_CLASSROOM'
    })
  }
})
export default class LayoutClassroomTeacher extends Vue {
  // eslint-disable-next-line no-undef
  [key: string]: unknown

  classroom!: Classroom
  setCurrentClassroom!: CallableFunction

  get pk (): string {
    return this.$route.params.pk
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

  // @ts-expect-error: don't care
  // eslint-disable-next-line
  beforeRouteLeave (to, from, next): void {
    this.setCurrentClassroom(undefined)
    next()
  }
}
</script>

<style scoped lang="scss">

</style>
