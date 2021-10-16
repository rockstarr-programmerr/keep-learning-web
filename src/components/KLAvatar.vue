<template>
  <v-avatar
    :color="user.avatar !== null ? 'white' : backgroundColor"
    v-bind="$attrs"
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
      :style="{ fontSize }"
    >
      {{ user.name.charAt(0) }}
    </span>
  </v-avatar>
</template>

<script lang="ts">
import { User } from '@/interfaces/user'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { mapGetters } from 'vuex'

@Component({
  computed: {
    ...mapGetters({
      user: 'account/loggedInUser'
    })
  }
})
export default class KLAvatar extends Vue {
  @Prop({ type: String, default: 'secondary' }) readonly backgroundColor!: string

  user!: User

  get fontSize (): string {
    let imgSize: number | string = this.$attrs.size || '48'
    imgSize = parseInt(imgSize) * 0.5
    return imgSize.toString() + 'px'
  }
}
</script>

<style scoped lang="scss">

</style>
