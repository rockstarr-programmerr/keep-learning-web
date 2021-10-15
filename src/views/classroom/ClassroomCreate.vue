<template>
  <v-container class="container-sm">
    <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>

    <v-card>
      <v-card-title>
        New classroom
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
          @click="submit"
          :loading="loading"
          min-width="110"
        >
          Create
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { ClassroomCreateReq } from '@/interfaces/api/classroom'
import { unexpectedExc } from '@/utils'
import { assertErrCode, status } from '@/utils/status-codes'
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class ClassroomCreate extends Vue {
  // eslint-disable-next-line no-undef
  [key: string]: unknown

  breadcrumbs = [
    { text: 'Home', to: { name: 'Home' }, exact: true },
    { text: 'Classrooms', to: { name: 'ClassroomList' }, exact: true },
    { text: 'New', to: { name: 'ClassroomCreate' }, exact: true }
  ]

  loading = false

  name = ''
  description = ''

  nameErrs = []

  submit (): void {
    if (this.loading) return
    this.loading = true

    const payload: ClassroomCreateReq = {
      name: this.name,
      description: this.description
    }

    this.$store.dispatch('classroom/create', payload)
      .then(pk => {
        this.$router.push({
          name: 'ClassroomOverview',
          params: { pk }
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
        this.loading = false
      })
  }
}
</script>

<style scoped lang="scss">

</style>
