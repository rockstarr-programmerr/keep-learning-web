<template>
  <div>
    <v-btn
      depressed
      @click="showAddStudent = !showAddStudent"
    >
      <v-icon left>
        {{ showAddStudent ? 'mdi-minus-circle-outline' : 'mdi-plus-circle-outline' }}
      </v-icon>
      Add student
    </v-btn>

    <div
      v-if="showAddStudent"
      class="mt-3"
    >
      <v-card width="50%">
        <v-card-subtitle>
          An email containing temporary password will be sent to your student after adding.
          Tell them to login with that password.
        </v-card-subtitle>
        <v-card-text>
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
        </v-card-text>

        <v-card-actions>
          <v-btn
            color="primary"
            :loading="loadingAddStudent"
            @click="addStudent"
            min-width="110"
          >
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>

    <v-data-table
      :headers="headers"
      :items="students"
      :items-per-page="-1"
      no-data-text="This class doesn't have any students yet."
      class="mt-3 elevation-2"
    >
      <!-- eslint-disable-next-line -->
      <template #item.manage="{ item }">
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
              :disabled="item.last_login !== null"
              @click="resendPasswordEmail(item)"
            >
              <v-list-item-icon>
                <v-icon>
                  mdi-email-outline
                </v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>
                  Resend password email
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item @click="prepareRemoveStudent(item)">
              <v-list-item-icon>
                 <v-icon>
                  mdi-account-remove-outline
                 </v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>
                  Remove from classroom
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-data-table>
    <KLDialogConfirm
      v-model="removeConfirm"
      :loading="loadingRemove"
      @confirm="removeStudent"
      @cancel="removeConfirm = false"
    >
      <div v-if="studentToRemove !== null">
        You are removing
        <b>{{ studentToRemove.name }} ({{ studentToRemove.email }})</b>
        from this classroom.
      </div>
    </KLDialogConfirm>
  </div>
</template>

<script lang="ts">
import { AddStudentReq, RemoveStudentReq } from '@/interfaces/api/classroom'
import { Classroom } from '@/interfaces/classroom'
import { User } from '@/interfaces/user'
import { VForm } from '@/interfaces/vuetify'
import { snakeCaseToCamelCase, unexpectedExc } from '@/utils'
import { assertErrCode, status } from '@/utils/status-codes'
import { Vue, Component } from 'vue-property-decorator'
import { mapState } from 'vuex'
import KLDialogConfirm from '@/components/KLDialogConfirm.vue'
import { Api } from '@/api'

@Component({
  computed: {
    ...mapState('classroom', {
      classroom: 'currentClassroom'
    })
  },
  components: {
    KLDialogConfirm
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

  mounted (): void {
    const adding = this.$route.query.adding
    if (adding === 'true') {
      this.showAddStudent = true
    }
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

  /**
   * Remove student
   */
  removeConfirm = false
  studentToRemove: User | null = null
  loadingRemove = false

  prepareRemoveStudent (item: User): void {
    this.studentToRemove = item
    this.removeConfirm = true
  }

  removeStudent (): void {
    if (this.loadingRemove || this.studentToRemove === null) return
    this.loadingRemove = true

    const payload: RemoveStudentReq = {
      email: this.studentToRemove.email
    }

    this.$store.dispatch('classroom/removeStudents', [payload])
      .then(() => {
        this.removeConfirm = false
      })
      .catch(unexpectedExc)
      .finally(() => {
        this.loadingRemove = false
      })
  }

  /**
   * Resend password email
   */
  resendPasswordEmail (student: User): void {
    Api.classroom.resendPasswordEmail(this.classroom.pk, {
      email: student.email
    })
      .catch(unexpectedExc)
  }
}
</script>

<style scoped lang="scss">

</style>
