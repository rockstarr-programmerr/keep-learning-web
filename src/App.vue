<template>
  <v-app id="keep-learning-app">
    <component v-if="initDone" :is="layout"/>
    <v-progress-linear
      v-else
      indeterminate
    ></v-progress-linear>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import LayoutDefault from '@/layouts/LayoutDefault.vue'
import { mapGetters } from 'vuex'
import { User } from './interfaces/user'
import { unexpectedExc } from './utils'
import { assertErrCode, status } from './utils/status-codes'

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
  loading = false
  initDone = false

  noAuthenRoutes = [
    'Login',
    'Register',
    'ResetPassword',
    'NewPassword'
  ]

  created (): void {
    this.setUserInfo()
  }

  setUserInfo (): void {
    const routeName = this.$route.name
    if (this.noAuthenRoutes.includes(routeName as string)) {
      this.initDone = true
      return
    }

    this.loading = true
    this.$store.dispatch('account/getInfo')
      .catch(err => {
        if (assertErrCode(err, status.HTTP_401_UNAUTHORIZED)) {
          this.$router.push({ name: 'Login' })
        } else {
          unexpectedExc(err)
        }
      })
      .finally(() => {
        this.loading = false
        this.initDone = true
      })
  }

  get layout (): typeof Vue {
    const meta = this.$route.meta

    if (meta !== undefined) {
      if (this.user !== undefined) {
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

.container-sm {
  width: 1140px;
}

.container-xs {
  width: 720px;
}
</style>
