<template>
  <BaseAuth>
    <v-card class="mt-5">
      <v-card-title>
        Login
      </v-card-title>

      <v-card-text>
        <v-form v-on:keydown.enter.native="login">
          <v-text-field
            v-model="email"
            label="Email"
            autofocus
            :error-messages="emailErrs"
            :error-count="emailErrs.length"
          ></v-text-field>
          <v-text-field
            v-model="password"
            label="Password"
            :type="showPassword ? 'text' : 'password'"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword = !showPassword"
            :error-messages="passwordErrs"
            :error-count="passwordErrs.length"
          ></v-text-field>
        </v-form>

        <div
          v-if="errorMsg !== ''"
          class="error--text mb-3"
        >
          {{ errorMsg }}
        </div>

        <div>
          Want to register teacher account?
          <router-link :to="{ name: 'Register' }">
            Register
          </router-link>
        </div>

        <div class="mt-3">
          Forgot password?
          <router-link :to="{ name: 'ResetPassword' }">
            Reset
          </router-link>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          @click="login"
          color="primary"
          min-width="110"
          :loading="loading"
        >
          Login
        </v-btn>
      </v-card-actions>
    </v-card>
  </BaseAuth>
</template>

<script lang="ts">
import { Vue, Component, Emit } from 'vue-property-decorator'
import { LoginReq } from '@/interfaces/api/account'
import { snakeCaseToCamelCase, unexpectedExc } from '@/utils'
import { assertErrCode, status } from '@/utils/status-codes'
import { mapState } from 'vuex'
import BaseAuth from './BaseAuth.vue'

@Component({
  computed: {
    ...mapState('account', [
      'isTeacher'
    ])
  },
  components: {
    BaseAuth
  }
})
export default class Login extends Vue {
  // eslint-disable-next-line no-undef
  [index: string]: unknown

  email = ''
  password = ''
  emailErrs: string[] = []
  passwordErrs: string[] = []
  showPassword = false
  loading = false
  errorMsg = ''
  isTeacher!: boolean

  async login (): Promise<void> {
    this.errorMsg = ''
    if (this.loading) return
    this.loading = true

    const payload: LoginReq = {
      email: this.email,
      password: this.password
    }

    try {
      await this.$store.dispatch('account/login', payload)
      await this.$store.dispatch('account/getInfo')
      // TODO: implement ?next
      if (this.isTeacher) {
        this.$router.push({ name: 'Home' })
      } else {
        this.$router.push({ name: 'ClassroomList' })
      }
    } catch (error) {
      if (assertErrCode(error, status.HTTP_401_UNAUTHORIZED)) {
        this.errorMsg = error.response.data.detail
      } else if (assertErrCode(error, status.HTTP_400_BAD_REQUEST)) {
        const data = error.response.data
        Object.entries(data).forEach(([field, errMsgs]) => {
          const attr = `${snakeCaseToCamelCase(field)}Errs`
          this[attr] = errMsgs
        })
      } else {
        unexpectedExc(error)
      }
    } finally {
      this.loading = false
    }
  }

  @Emit('change-page')
  changePage (e: Event): Event { return e }
}
</script>

<style scoped lang="scss">

</style>
