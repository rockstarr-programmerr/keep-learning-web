<template>
  <v-app id="keep-learning-app">
    <v-app-bar
      app
      color="primary"
      dark
      clipped-left
    >
      <router-link
        :to="{ name: 'Home' }"
        class="d-flex align-center white--text"
      >
        Keep learning!
      </router-link>

      <v-spacer></v-spacer>

      <div>
        <v-progress-circular
          v-if="loading"
          indeterminate
        ></v-progress-circular>
        <span v-else>
          {{ user.name }}
        </span>
      </div>
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>

    <!--  TODO: is this needed?
    <v-bottom-navigation
      app
      background-color="secondary"
      dark
      hide-on-scroll
    >
      <v-btn>
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
    </v-bottom-navigation>
    -->
  </v-app>
</template>

<script lang="ts">
import { User } from '@/interfaces/user'
import { unexpectedExc } from '@/utils'
import { Vue, Component } from 'vue-property-decorator'
import { mapGetters } from 'vuex'

@Component({
  computed: {
    ...mapGetters({
      user: 'account/loggedInUser',
      hasUserInfo: 'account/hasUserInfo'
    })
  }
})
export default class LayoutDefault extends Vue {
  user!: User
  hasUserInfo!: boolean
  loading = false
  drawer = null

  created (): void {
    this.setUserInfo()
  }

  setUserInfo (): void {
    if (!this.hasUserInfo) {
      this.loading = true
      this.$store.dispatch('account/getInfo')
        .catch(unexpectedExc)
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
