<template>
  <div>
    <v-icon>
      mdi-clock-outline
    </v-icon>
    <strong>
      {{ padZero(minutes) }}:{{ padZero(seconds) }}
    </strong>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class KLTimer extends Vue {
  minutes = 0
  seconds = 0

  padZero (num: number): string {
    return num.toString().padStart(2, '0')
  }

  created (): void {
    this.startTimer()
  }

  startTimer (): void {
    const start = Date.now()
    setInterval(() => {
      const delta = Date.now() - start // Miliseconds elapsed since `start`
      this.minutes = Math.floor(delta / 1000 / 60)
      this.seconds = Math.floor((delta / 1000) - (this.minutes * 60))
    }, 500)
  }
}
</script>

<style scoped lang="scss">

</style>
