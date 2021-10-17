<template>
  <v-app id="keep-learning-app">
    <component
      v-if="initDone"
      :is="layout"
      class="fill-height"
    />
    <v-progress-linear
      v-else
      indeterminate
    ></v-progress-linear>

    <v-snackbar
      :value="messageShow"
      @input="setMessage"
      :color="messageColor"
    >
      {{ messageText }}
      <template #action="{ attrs }">
        <v-btn
          color="black"
          text
          icon
          v-bind="attrs"
          @click="hideMessage"
        >
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import LayoutDefault from '@/layouts/LayoutDefault.vue'
import { mapGetters, mapMutations, mapState } from 'vuex'
import { User } from './interfaces/user'
import { unexpectedExc } from './utils'
import { assertErrCode, status } from './utils/status-codes'
import { noAuthenRoutes } from './router'

@Component({
  components: {
    LayoutDefault
  },
  computed: {
    ...mapGetters('account', {
      user: 'loggedInUser'
    }),
    ...mapState('message', {
      messageShow: 'show',
      messageText: 'text',
      messageColor: 'color'
    })
  },
  methods: {
    ...mapMutations('message', {
      showMessage: 'SHOW_MESSAGE',
      hideMessage: 'HIDE_MESSAGE'
    })
  }
})
export default class App extends Vue {
  /**
   * Init
   */
  user!: User
  loading = false
  initDone = false

  created (): void {
    this.setUserInfo()
  }

  setUserInfo (): void {
    const routeName = this.$route.name
    if (noAuthenRoutes.includes(routeName as string)) {
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

  /**
   * Layout
   */

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

  /**
   * Message
   */
  messageShow!: boolean
  messageText!: string
  messageColor!: string
  showMessage!: CallableFunction
  hideMessage!: CallableFunction

  setMessage (show: boolean): void {
    if (show) {
      this.showMessage()
    } else {
      this.hideMessage()
    }
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
