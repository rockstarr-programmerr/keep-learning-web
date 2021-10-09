<template>
  <component :is="layout"/>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import LayoutDefault from '@/layouts/LayoutDefault.vue'
import { mapGetters } from 'vuex'
import { User } from './interfaces/user'

@Component({
  components: {
    LayoutDefault
  },
  computed: {
    ...mapGetters('account', {
      user: 'loggedInUser',
      hasUserInfo: 'hasUserInfo'
    })
  }
})
export default class App extends Vue {
  user!: User
  hasUserInfo!: boolean

  get layout (): typeof Vue {
    const meta = this.$route.meta

    if (meta !== undefined) {
      if (this.hasUserInfo) {
        if (
          this.user.user_type === 'teacher' &&
          meta.teacherLayout !== undefined
        ) {
          return meta.teacherLayout
        } else if (
          this.user.user_type === 'student' &&
          meta.studentLayout !== undefined
        ) {
          return meta.studentLayout
        }
      }

      if (meta.layout !== undefined) {
        return meta.layout
      }
    }

    return LayoutDefault
  }
}
</script>
