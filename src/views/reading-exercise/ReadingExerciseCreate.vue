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
            label="Identifier"
          ></v-text-field>
          <ckeditor :editor="editor" v-model="editorData" :config="editorConfig"></ckeditor>
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
// @ts-expect-error no need typescript for CKEditor
import CKEditor from '@ckeditor/ckeditor5-vue2'
// @ts-expect-error no need typescript for CKEditor
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

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
  editor = ClassicEditor
  editorData = ''
  editorConfig = {}

  /**
   * Create
   */
  loading = false

  save (): void {
    console.log('save')
  }
}
</script>

<style scoped lang="scss">

</style>
