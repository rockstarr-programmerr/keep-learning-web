<template>
  <v-container class="container-sm">
    <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>

    <v-progress-circular
      v-if="loading"
      indeterminate
      color="primary"
    ></v-progress-circular>

    <v-card v-else>
      <v-card-title>
        Edit classroom
      </v-card-title>

      <v-card-text>
        <v-form>
          <v-text-field
            v-model="name"
            label="Name *"
            autofocus
            :error-messages="nameErrs"
            :error-count="nameErrs.length"
          ></v-text-field>
          <v-textarea
            v-model="description"
            label="Description"
          ></v-textarea>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-btn
          color="primary"
          @click="save"
          :loading="loading"
          min-width="110"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { ClassroomCreateReq } from '@/interfaces/api/classroom'
import { Classroom } from '@/interfaces/classroom'
import { unexpectedExc } from '@/utils'
import { assertErrCode, status } from '@/utils/status-codes'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { mapState } from 'vuex'

@Component({
  computed: {
    ...mapState('classroom', {
      classroom: 'currentClassroom'
    })
  }
})
export default class ClassroomUpdate extends Vue {
  @Prop(Number) readonly pk!: number

  // eslint-disable-next-line no-undef
  [key: string]: unknown

  breadcrumbs = [
    { text: 'Home', to: { name: 'Home' }, exact: true },
    { text: 'Classrooms', to: { name: 'ClassroomList' }, exact: true },
    { text: 'Edit', disabled: true }
  ]

  /**
   * Init
   */
  classroom!: Classroom
  loading = false
  name = ''
  description = ''
  nameErrs = []

  created (): void {
    this.setUp()
  }

  setUp (): void {
    this.$store.dispatch('classroom/detail', this.pk)
      .then(() => {
        this.name = this.classroom.name
        this.description = this.classroom.description
      })
  }

  /**
   * Save
   */
  saving = false

  save (): void {
    if (this.saving) return
    this.saving = true

    const payload: ClassroomCreateReq = {
      name: this.name,
      description: this.description
    }

    this.$store.dispatch('classroom/update', {
      pk: this.classroom.pk,
      payload
    })
      .then(() => {
        this.$router.push({
          name: 'ClassroomOverview',
          params: { pk: this.classroom.pk.toString() }
        })
      })
      .catch(err => {
        if (assertErrCode(err, status.HTTP_400_BAD_REQUEST)) {
          const data = err.response.data
          Object.entries(data).forEach(([field, errMsgs]) => {
            const attr = `${field}Errs`
            this[attr] = errMsgs
          })
        } else {
          unexpectedExc(err)
        }
      })
      .finally(() => {
        this.saving = false
      })
  }
}
</script>

<style scoped lang="scss">

</style>
