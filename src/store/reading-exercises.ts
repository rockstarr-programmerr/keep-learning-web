import { Api } from '@/api'
import { PaginatedRes } from '@/interfaces/api/common'
import { ReadingExerciseCreateReq, ReadingExerciseUpdateReq } from '@/interfaces/api/reading-exercise'
import { ReadingExercise } from '@/interfaces/reading-exercise'
import { ReadingQuestion } from '@/interfaces/reading-question'
import { Module } from 'vuex'
import { RootState } from './index'

declare interface ReadingExerciseState {
  readingExercises: ReadingExercise[],
  currentReadingExercise?: ReadingExercise,
  exercisePagination?: PaginatedRes,
  currentQuestions: ReadingQuestion[],
  questionPagination?: PaginatedRes
}

export const readingExercise: Module<ReadingExerciseState, RootState> = {
  namespaced: true,

  state: {
    readingExercises: [],
    currentReadingExercise: undefined,
    exercisePagination: undefined,
    currentQuestions: [],
    questionPagination: undefined
  },

  mutations: {
    SET_READING_EXERCISES (state, readingExercises) {
      state.readingExercises = readingExercises
    },

    SET_EXERCISE_PAGINATION (state, pagination) {
      state.exercisePagination = pagination
    },

    SET_CURRENT_READING_EXERCISE (state, readingExercise) {
      state.currentReadingExercise = readingExercise
    },

    ADD_READING_EXERCISE (state, readingExercise) {
      state.readingExercises.splice(0, 0, readingExercise)
    },

    SET_CURRENT_QUESTIONS (state, questions) {
      state.currentQuestions = questions
    },

    SET_QUESTION_PAGINATION (state, pagination) {
      state.questionPagination = pagination
    }
  },

  actions: {
    async list ({ commit }): Promise<void> {
      const data = await Api.readingExercise.list()
      const readingExercises = data.results
      const pagination: PaginatedRes = { ...data }
      delete pagination.results
      commit('SET_READING_EXERCISES', readingExercises)
      commit('SET_EXERCISE_PAGINATION', pagination)
    },

    async detail ({ commit }, pk: ReadingExercise['pk']) {
      const data = await Api.readingExercise.detail(pk)
      commit('SET_CURRENT_READING_EXERCISE', data)
    },

    async create ({ commit }, payload: ReadingExerciseCreateReq): Promise<ReadingExercise['pk']> {
      const data = await Api.readingExercise.create(payload)
      commit('ADD_READING_EXERCISE', data)
      return data.pk
    },

    async update (
      { commit },
      { pk, payload }: { pk: ReadingExercise['pk']; payload: ReadingExerciseUpdateReq }
    ): Promise<ReadingExercise['pk']> {
      const data = await Api.readingExercise.update(pk, payload)
      commit('ADD_READING_EXERCISE', data)
      return data.pk
    },

    async getQuestions ({ state, commit }): Promise<void> {
      if (state.currentReadingExercise === undefined) return
      const exercisePk = state.currentReadingExercise.pk
      const data = await Api.readingQuestion.list(exercisePk)
      const questions = data.results
      const pagination: PaginatedRes = { ...data }
      delete pagination.results
      commit('SET_CURRENT_QUESTIONS', questions)
      commit('SET_QUESTION_PAGINATION', pagination)
    }
  }
}
