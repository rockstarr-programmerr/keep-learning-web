import Vue from 'vue'
import Vuex from 'vuex'
import { account } from './account'
import { classroom } from './classroom'
import { readingExercise } from './reading-exercises'
import { readingReport } from './reading-reports'

Vue.use(Vuex)

export declare interface RootState {
  dummy?: string; // Just a dummy interface because we don't have root state yet
}

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    account,
    classroom,
    readingExercise,
    readingReport
  }
})
