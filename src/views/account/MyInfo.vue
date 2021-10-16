<template>
  <v-container class="container-sm">
    <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>

    <h1>Profile</h1>
    <v-divider></v-divider>

    <div class="mt-5">
      <v-row>
        <v-col cols="auto">
          <v-avatar
            :color="user.avatar !== null ? 'white' : 'primary'"
            size="256"
            tile
          >
            <v-img
              v-if="user.avatar !== null"
              :src="user.avatar"
              :alt="user.name"
            >
              <template #placeholder>
                <v-row
                  class="fill-height ma-0"
                  justify="center"
                  align="center"
                >
                  <v-progress-circular
                    indeterminate
                    color="primary"
                  ></v-progress-circular>
                </v-row>
              </template>
            </v-img>
            <span
              v-else
              class="white--text"
            >
              {{ user.name.charAt(0) }}
            </span>
          </v-avatar>
        </v-col>
        <v-col cols="auto">
          <div>
            <h2>{{ user.name }}</h2>
            <p class="caption">{{ user.email }}</p>
          </div>
          <div>
            <v-row>
              <v-col cols="auto">
                <p>Account</p>
                <p>Phone number</p>
              </v-col>
              <v-col cols="auto" class="font-weight-bold">
                <p>{{ account }}</p>
                <p>{{ user.phone_number }}</p>
              </v-col>
            </v-row>
          </div>
          <div>
            <p>
              <router-link :to="{ name: 'ProfileUpdate' }">
                Edit profile
              </router-link>
            </p>
            <p>
              <router-link :to="{ name: 'ChangePassword' }">
                Change password
              </router-link>
            </p>
          </div>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script lang="ts">
import { User } from '@/interfaces/user'
import { Vue, Component } from 'vue-property-decorator'
import { mapGetters, mapState } from 'vuex'

@Component({
  computed: {
    ...mapState('account', {
      user: 'loggedInUser'
    }),
    ...mapGetters('account', [
      'isTeacher'
    ])
  }
})
export default class MyInfo extends Vue {
  breadcrumbs = [
    { text: 'Home', to: { name: 'Home' }, exact: true },
    { text: 'Profile', to: { name: 'MyInfo' }, exact: true }
  ]

  user!: User
  isTeacher!: boolean

  get account (): string {
    return this.isTeacher ? 'Teacher' : 'Student'
  }
}
</script>

<style scoped lang="scss">

</style>
