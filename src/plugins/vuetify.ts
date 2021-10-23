import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'
import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    options: {
      customProperties: true
    },
    themes: {
      light: {
        primary: {
          base: colors.pink.lighten1
        },
        secondary: {
          base: colors.purple.lighten1
        },
        anchor: colors.pink.darken2,
        success: colors.green.base,
        error: colors.red.base
      }
    }
  }
})
