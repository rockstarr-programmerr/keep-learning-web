<template>
  <v-container>
    <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>

    <v-card class="mx-auto">
      <v-card-title>
        New reading exercise
      </v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field
            v-model="identifier"
            label="Identifier"
            autofocus
            :error-messages="identifierErrs"
            :error-count="identifierErrs.length"
          ></v-text-field>
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
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="primary"
          :loading="loading"
          @click="save"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { ReadingExerciseCreateReq } from '@/interfaces/api/reading-exercise'
import { assertErrCode, status } from '@/utils/status-codes'
import { unexpectedExc } from '@/utils'

// 2 imports in the same line to work around some dumb vetur warning
// @ts-expect-error no need typescript for CKEditor
import CKEditor from '@ckeditor/ckeditor5-vue2'; import DecoupledEditor from '@/ckeditor5/build/ckeditor'
import { CKEditorConfig } from '@/utils/ckeditor-config'

@Component({
  components: {
    ckeditor: CKEditor.component
  }
})
export default class ReadingExerciseCreate extends Vue {
  // eslint-disable-next-line no-undef
  [key: string]: unknown

  breadcrumbs = [
    { text: 'Home', to: { name: 'Home' }, exact: true },
    { text: 'Reading exercises', to: { name: 'ReadingExerciseList' }, exact: true },
    { text: 'New', to: { name: 'ReadingExerciseCreate' }, exact: true }
  ]

  /**
   * CKEditor
   */
  editor = DecoupledEditor
  editorConfig = CKEditorConfig()

  // @ts-expect-error no need typescript for CKEditor
  // eslint-disable-next-line
  editorReady (editor): void {
    // Insert the toolbar before the editable area.
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    )
  }

  /**
   * Create
   */
  loading = false
  identifier = ''
  content = ''
  identifierErrs = []
  contentErrs = []

  save (): void {
    if (this.loading) return
    this.loading = true

    const payload: ReadingExerciseCreateReq = {
      identifier: this.identifier,
      content: this.content
    }

    this.$store.dispatch('readingExercise/create', payload)
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
        this.loading = false
      })
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
