<template>
  <v-container>
    <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>

    <v-progress-circular
      v-if="loading"
      indeterminate
      color="primary"
    ></v-progress-circular>

    <v-card v-if="exercise !== undefined">
      <v-card-title>
        <v-text-field
          v-model="identifier"
          label="Identifier"
          :error-messages="identifierErrs"
          :error-count="identifierErrs.length"
        ></v-text-field>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="exercise-content">
        <v-input
          :error-messages="contentErrs"
          :error-count="contentErrs.length"
          class="ckeditor-input"
        >
          <ckeditor
            v-model="content"
            :editor="editor"
            :config="editorConfig"
            @ready="editorReady"
          ></ckeditor>
        </v-input>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="primary"
          :loading="loadingUpdate"
          @click="save"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>

    <!--
    <v-btn
      fab
      color="primary"
      bottom
      right
      fixed
      large
    >
      <v-icon>
        mdi-content-save-outline
      </v-icon>
    </v-btn>
    -->
  </v-container>
</template>

<script lang="ts">
import { ReadingExercise } from '@/interfaces/reading-exercise'
import { unexpectedExc } from '@/utils'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { mapMutations, mapState } from 'vuex'

// 2 imports in the same line to work around some dumb vetur warning
// @ts-expect-error no need typescript for CKEditor
import CKEditor from '@ckeditor/ckeditor5-vue2'; import DecoupledEditor from '@/ckeditor5/build/ckeditor'
import { CKEditorConfig } from '@/utils/ckeditor-config'
import { ReadingExerciseUpdateReq } from '@/interfaces/api/reading-exercise'
import { assertErrCode, status } from '@/utils/status-codes'

@Component({
  computed: {
    ...mapState('readingExercise', {
      exercise: 'currentReadingExercise'
    })
  },
  methods: {
    ...mapMutations('readingExercise', {
      setCurrentExercise: 'SET_CURRENT_READING_EXERCISE'
    })
  },
  components: {
    ckeditor: CKEditor.component
  }
})
export default class ReadingExerciseUpdate extends Vue {
  @Prop(Number) readonly pk!: number

  // eslint-disable-next-line no-undef
  [key: string]: unknown

  exercise!: ReadingExercise
  setCurrentExercise!: CallableFunction

  get breadcrumbs (): unknown[] {
    if (this.exercise === undefined) return []
    return [
      { text: 'Home', to: { name: 'Home' }, exact: true },
      { text: 'Reading exercises', to: { name: 'ReadingExerciseList' }, exact: true },
      { text: this.exercise.identifier, to: { name: 'ReadingExerciseDetail', params: { pk: this.pk } }, exact: true },
      { text: 'Edit', disabled: true }
    ]
  }

  get loading (): boolean {
    return this.exercise === undefined
  }

  created (): void {
    this.setExercise()
  }

  setExercise (): void {
    this.$store.dispatch('readingExercise/detail', this.pk)
      .then(() => {
        this.identifier = this.exercise.identifier
        // this.content = this.exercise.content // NOTE: don't set content, it will be set when CKEditor is ready
      })
      .catch(unexpectedExc)
  }

  /**
   * CKEditor
   */
  editor = DecoupledEditor

  get editorConfig (): unknown {
    if (this.exercise === undefined) return {}
    const initialData = this.exercise.content
    return CKEditorConfig({ initialData })
  }

  // @ts-expect-error no need typescript for CKEditor
  // eslint-disable-next-line
  editorReady (editor): void {
    // Insert the toolbar before the editable area.
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    )

    this.content = editor.config.get('initialData')
  }

  /**
   * Edit
   */
  loadingUpdate = false
  identifier = ''
  content = ''
  identifierErrs = []
  contentErrs = []

  save (): void {
    if (this.loadingUpdate) return
    this.loadingUpdate = true

    const payload: ReadingExerciseUpdateReq = {
      identifier: this.identifier,
      content: this.content
    }

    this.$store.dispatch('readingExercise/update', {
      pk: this.pk,
      payload
    })
      .then(pk => {
        this.$router.push({
          name: 'ReadingExerciseDetail',
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
        this.loadingUpdate = false
      })
  }

  // @ts-expect-error: don't care
  // eslint-disable-next-line
  beforeRouteLeave (to, from, next): void {
    this.setCurrentExercise(undefined)
    next()
  }
}
</script>

<style scoped lang="scss">
.ckeditor-input ::v-deep .v-input__slot {
  display: block;
}

.ck-content {
  border-bottom: 1px solid rgb(196, 196, 196);
  border-left: 1px solid rgb(196, 196, 196);
  border-right: 1px solid rgb(196, 196, 196);
  min-height: 300px;
}

.ckeditor-input ::v-deep .ck-toolbar {
  position: sticky;
  top: 0;
}
</style>
