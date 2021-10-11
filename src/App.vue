<template>
  <div>
    <component v-if="initDone" :is="layout"/>
    <v-app v-else>
      <v-progress-linear indeterminate></v-progress-linear>
    </v-app>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import LayoutDefault from '@/layouts/LayoutDefault.vue'
import { mapGetters } from 'vuex'
import { User } from './interfaces/user'
import { unexpectedExc } from './utils'

@Component({
  components: {
    LayoutDefault
  },
  computed: {
    ...mapGetters('account', {
      user: 'loggedInUser'
    })
  }
})
export default class App extends Vue {
  user!: User
  isAuthenticatedUser = false
  loading = false
  initDone = false

  created (): void {
    this.setUserInfo()
  }

  setUserInfo (): void {
    this.loading = true
    this.$store.dispatch('account/getInfo')
      .then(() => {
        this.isAuthenticatedUser = true
      })
      .catch(unexpectedExc)
      .finally(() => {
        this.loading = false
        this.initDone = true
      })
  }

  get layout (): typeof Vue {
    const meta = this.$route.meta

    if (meta !== undefined) {
      if (this.isAuthenticatedUser) {
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

<style lang="scss">
.cursor-pointer {
  cursor: pointer;
}
</style>
