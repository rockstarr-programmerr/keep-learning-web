<template>
  <v-card outlined>
    <v-card-title>
      Keep learning
    </v-card-title>

    <v-card-subtitle>
      Login
    </v-card-subtitle>

    <v-card-text>
      <v-form v-on:keyup.enter.native="login">
        <v-text-field
          v-model="email"
          label="Email"
        ></v-text-field>
        <v-text-field
          v-model="password"
          label="Password"
          :type="showPassword ? 'text' : 'password'"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="showPassword = !showPassword"
        ></v-text-field>
      </v-form>

      <div
        v-if="errorMsg !== ''"
        class="error--text mb-3"
      >
        {{ errorMsg }}
      </div>

      <div>
        <span>Want to register as a teacher?</span>
        <a
          href="#"
          @click="changePage"
        >
          Register
        </a>
      </div>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        @click="login"
        color="primary"
        depressed
        :loading="loading"
      >
        Login
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Emit } from 'vue-property-decorator'
import { LoginReq } from '@/interfaces/api/account'
import { unexpectedExc } from '@/utils'
import { assertErrCode, status } from '@/utils/status-codes'

@Component
export default class Login extends Vue {
  email = ''
  password = ''
  showPassword = false
  loading = false
  errorMsg = ''

  login (): void {
    this.errorMsg = ''
    if (this.loading) return
    this.loading = true

    const payload: LoginReq = {
      email: this.email,
      password: this.password
    }

    this.$store.dispatch('account/login', payload)
      .then(() => {
        // TODO: implement ?next
        this.$router.push({ name: 'GroupList' })
      })
      .catch(error => {
        if (assertErrCode(error, status.HTTP_401_UNAUTHORIZED)) {
          this.errorMsg = error.response.data.detail
        } else {
          unexpectedExc(error)
        }
      })
      .finally(() => {
        this.loading = false
      })
  }

  @Emit('change-page')
  changePage (e: Event): Event { return e }
}
</script>

<style scoped lang="scss">

</style>
