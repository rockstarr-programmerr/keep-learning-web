import { Module } from 'vuex'
import { RootState } from './index'

declare interface MessageState {
  show: boolean;
  text: string;
  color: string;
}

export const message: Module<MessageState, RootState> = {
  namespaced: true,

  state: {
    show: false,
    text: '',
    color: 'success'
  },

  mutations: {
    SHOW_MESSAGE (state, text) {
      state.text = text
      state.show = true
    },

    HIDE_MESSAGE (state) {
      state.show = false
    }
  }
}
