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
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class KLTimer extends Vue {
  @Prop({ type: Number, default: 0 }) readonly value!: number

  get secondsElapsed (): number {
    return this.value
  }

  set secondsElapsed (seconds: number) {
    this.$emit('input', seconds)
  }

  get minutes (): number {
    return Math.floor(this.secondsElapsed / 60)
  }

  get seconds (): number {
    return Math.floor(this.secondsElapsed - (this.minutes * 60))
  }

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
      this.secondsElapsed = Math.floor(delta / 1000)
    }, 100)
  }
}
</script>

<style scoped lang="scss">

</style>
