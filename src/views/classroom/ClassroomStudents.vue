<template>
  <div>
    <span
      class="cursor-pointer d-inline-flex"
      @click="showAddStudent = !showAddStudent"
    >
      <v-icon>
        mdi-plus-circle-outline
      </v-icon>
      <span
        v-text="'Add student'"
        class="ml-3"
      ></span>
    </span>

    <div v-show="showAddStudent">
      <p class="text-body-2 mt-3 mb-0">
        An email containing temporary password will be sent to your student after creating.
        Tell them to login with that password.
      </p>

      <v-form
        ref="addStudentForm"
        v-on:keyup.native.enter="addStudent"
      >
        <v-text-field
          v-model="name"
          label="Name *"
          :autofocus="showAddStudent"
          :error-messages="nameErrs"
          :error-count="nameErrs.length"
        ></v-text-field>
        <v-text-field
          v-model="email"
          label="Email *"
          :error-messages="emailErrs"
          :error-count="emailErrs.length"
        ></v-text-field>
        <v-text-field
          v-model="phoneNumber"
          label="Phone number"
          :error-messages="phoneNumberErrs"
          :error-count="phoneNumberErrs.length"
        ></v-text-field>
      </v-form>

      <v-btn
        color="primary"
        :loading="loadingAddStudent"
        @click="addStudent"
      >
        Add student
      </v-btn>
    </div>

    <v-data-table
      :headers="headers"
      :items="students"
      :items-per-page="-1"
      class="mt-3"
    >
      <!-- eslint-disable-next-line -->
      <template #item.manage>
        <v-menu
          offset-x
          left
          nudge-left="12"
        >
          <template #activator="{ on, attrs }">
            <v-icon
              v-on="on"
              v-bind="attrs"
            >
              mdi-dots-horizontal
            </v-icon>
          </template>
          <v-list dense>
            <v-list-item
              v-text="'Edit info'"
            ></v-list-item>
            <v-list-item
              v-text="'Resend password email'"
            ></v-list-item>
            <v-list-item
              v-text="'Remove from classroom'"
            ></v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { AddStudentReq } from '@/interfaces/api/classroom'
import { Classroom } from '@/interfaces/classroom'
import { VForm } from '@/interfaces/vuetify'
import { snakeCaseToCamelCase, unexpectedExc } from '@/utils'
import { assertErrCode, status } from '@/utils/status-codes'
import { Vue, Component } from 'vue-property-decorator'
import { mapState } from 'vuex'

@Component({
  computed: {
    ...mapState('classroom', {
      classroom: 'currentClassroom'
    })
  }
})
export default class ClassroomStudents extends Vue {
  // eslint-disable-next-line no-undef
  [key: string]: unknown

  classroom!: Classroom

  get students (): Classroom['students'] {
    if (this.classroom !== undefined) {
      return this.classroom.students
    }
    return []
  }

  /**
   * Students table
   */
  headers = [
    { text: 'Name', value: 'name' },
    { text: 'Email', value: 'email' },
    { text: 'Phone number', value: 'phone_number', sortable: false },
    { text: '', value: 'manage', sortable: false }
  ]

  /**
   * Add student
   */
  showAddStudent = false
  loadingAddStudent = false

  name = ''
  email = ''
  phoneNumber = ''

  nameErrs = []
  emailErrs = []
  phoneNumberErrs = []

  addStudent (): void {
    if (this.loadingAddStudent) return
    this.loadingAddStudent = true

    const payload: AddStudentReq = {
      name: this.name,
      email: this.email,
      phone_number: this.phoneNumber
    }
    this.$store.dispatch('classroom/addStudents', [payload])
      .then(() => {
        (this.$refs.addStudentForm as VForm).reset()
      })
      .catch(err => {
        if (assertErrCode(err, status.HTTP_400_BAD_REQUEST)) {
          const data = err.response.data
          if (data.length === 0) return

          Object.entries(data[0]).forEach(([field, errMsgs]) => {
            field = snakeCaseToCamelCase(field)
            const attr = `${field}Errs`
            this[attr] = errMsgs
          })
        } else {
          unexpectedExc(err)
        }
      })
      .finally(() => {
        this.loadingAddStudent = false
      })
  }
}
</script>

<style scoped lang="scss">

</style>
