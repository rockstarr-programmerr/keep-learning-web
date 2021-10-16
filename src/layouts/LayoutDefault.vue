<template>
  <v-app id="keep-learning-app">
    <v-app-bar
      app
      color="primary"
      dark
      hide-on-scroll
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
          v-if="user === undefined"
          indeterminate
          color="primary"
        ></v-progress-circular>
        <router-link
          v-else
          :to="{ name: 'MyInfo' }"
          class="white--text"
        >
          {{ user.name }}
        </router-link>
      </div>
    </v-app-bar>

    <v-main>
      <slot>
        <router-view/>
      </slot>
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
import { Vue, Component } from 'vue-property-decorator'
import { mapGetters } from 'vuex'

@Component({
  computed: {
    ...mapGetters({
      user: 'account/loggedInUser'
    })
  }
})
export default class LayoutDefault extends Vue {
  user!: User
}
</script>
