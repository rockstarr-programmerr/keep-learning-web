<template>
  <div>
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
        Tango
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
          class="white--text user-info"
        >
          <v-btn
            large
            text
          >
            <KLAvatar size="40"></KLAvatar>
            <span class="ml-3">
              {{ user.name }}
            </span>
          </v-btn>
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
  </div>
</template>

<script lang="ts">
import { User } from '@/interfaces/user'
import { Vue, Component } from 'vue-property-decorator'
import { mapGetters, mapMutations, mapState } from 'vuex'
import KLAvatar from '@/components/KLAvatar.vue'

@Component({
  computed: {
    ...mapGetters({
      user: 'account/loggedInUser'
    })
  },
  components: {
    KLAvatar
  }
})
export default class LayoutDefault extends Vue {
  user!: User
}
</script>

<style lang="scss" scoped>
.user-info {
  text-decoration: none;
}
</style>
