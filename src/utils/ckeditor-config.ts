/* eslint-disable */
// @ts-nocheck

import Vue from 'vue'
import { getAuthorizationHeaderValue } from '@/utils/auth'
import { endpoints } from '@/api/endpoints'

export function CKEditorConfig (overrideConfig?) {
  let config = {
    placeholder: 'You can paste your Word document here.',
    simpleUpload: {
      axios: Vue.axios,
      uploadUrl: endpoints.readingExercise.uploadImage,
      headers: {
        Authorization: getAuthorizationHeaderValue()
      }
    },
    toolbar: {
      items: [
        'heading',
        '|',
        'fontSize',
        'fontFamily',
        '|',
        'fontColor',
        'fontBackgroundColor',
        '|',
        'bold',
        'italic',
        'underline',
        'strikethrough',
        '|',
        'alignment',
        '|',
        'numberedList',
        'bulletedList',
        '|',
        'outdent',
        'indent',
        '|',
        'todoList',
        'link',
        'blockQuote',
        'imageUpload',
        'insertTable',
        'mediaEmbed',
        '|',
        'undo',
        'redo'
      ]
    },
    image: {
      toolbar: [
        'imageTextAlternative',
        'imageStyle:inline',
        'imageStyle:block',
        'imageStyle:side'
      ]
    },
    table: {
      contentToolbar: [
        'tableColumn',
        'tableRow',
        'mergeTableCells',
        'tableCellProperties',
        'tableProperties'
      ]
    }
  }

  if (overrideConfig !== undefined) {
    config = { ...config, ...overrideConfig }
  }

  return config
}
