<template>
  <v-container>
    <p>404 Not Found</p>
    <router-link :to="{ name: 'Home' }">
      Home
    </router-link>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class Http404 extends Vue {

}
</script>

<style scoped lang="scss">

</style>
