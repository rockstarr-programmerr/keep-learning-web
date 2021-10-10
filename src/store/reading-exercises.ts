import { Api } from '@/api'
import { PaginatedRes } from '@/interfaces/api/common'
import { ReadingExerciseCreateReq } from '@/interfaces/api/reading-exercise'
import { ReadingExercise } from '@/interfaces/reading-exercise'
import { Module } from 'vuex'
import { RootState } from './index'

declare interface ReadingExerciseState {
  readingExercises: ReadingExercise[],
  currentReadingExercise?: ReadingExercise,
  pagination?: PaginatedRes
}

export const readingExercise: Module<ReadingExerciseState, RootState> = {
  namespaced: true,

  state: {
    readingExercises: [],
    currentReadingExercise: undefined,
    pagination: undefined
  },

  mutations: {
    SET_READING_EXERCISES (state, readingExercises) {
      state.readingExercises = readingExercises
    },

    SET_PAGINATION (state, pagination) {
      state.pagination = pagination
    },

    SET_CURRENT_READING_EXERCISE (state, readingExercise) {
      state.currentReadingExercise = readingExercise
    },

    ADD_READING_EXERCISE (state, readingExercise) {
      state.readingExercises.splice(0, 0, readingExercise)
    }
  },

  actions: {
    async list ({ commit }): Promise<void> {
      const data = await Api.readingExercise.list()
      const readingExercises = data.results
      const pagination: PaginatedRes = { ...data }
      delete pagination.results
      commit('SET_READING_EXERCISES', readingExercises)
      commit('SET_PAGINATION', pagination)
    },

    // async detail ({ commit }, pk: ReadingExercise['pk']) {
    //   const data = await Api.readingExercise.detail(pk)
    //   commit('SET_CURRENT_READING_EXERCISE', data)
    // },

    async create ({ commit }, payload: ReadingExerciseCreateReq): Promise<ReadingExercise['pk']> {
      const data = await Api.readingExercise.create(payload)
      commit('ADD_READING_EXERCISE', data)
      return data.pk
    }
  }
}
