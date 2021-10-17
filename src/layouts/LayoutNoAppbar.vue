<template>
  <v-main>
    <router-view/>
  </v-main>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class LayoutNoAppbar extends Vue {

}
</script>
