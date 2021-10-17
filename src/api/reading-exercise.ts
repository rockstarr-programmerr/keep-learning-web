import Vue from 'vue'
import { ReadingExerciseCreateReq, ReadingExerciseDetailRes, ReadingExerciseListRes, ReadingExerciseSubmitAnswersReq, ReadingExerciseUpdateReq } from '@/interfaces/api/reading-exercise'
import { ReadingExercise } from '@/interfaces/reading-exercise'
import { endpoints, replacePk } from './endpoints'
import { PaginationQuery } from '@/interfaces/api/common'

export const readingExercise = {
  async list (query: PaginationQuery): Promise<ReadingExerciseListRes> {
    const res = await Vue.axios.get(endpoints.readingExercise.list, {
      params: query
    })
    return res.data
  },

  async detail (pk: ReadingExercise['pk']): Promise<ReadingExerciseDetailRes> {
    const endpoint = replacePk(endpoints.readingExercise.detail, pk)
    const res = await Vue.axios.get(endpoint)
    return res.data
  },

  async create (payload: ReadingExerciseCreateReq): Promise<ReadingExerciseDetailRes> {
    const res = await Vue.axios.post(endpoints.readingExercise.create, payload)
    return res.data
  },

  async update (pk: ReadingExercise['pk'], payload: ReadingExerciseUpdateReq): Promise<ReadingExerciseDetailRes> {
    const endpoint = replacePk(endpoints.readingExercise.update, pk)
    const res = await Vue.axios.patch(endpoint, payload)
    return res.data
  },

  async delete (pk: ReadingExercise['pk']): Promise<void> {
    const endpoint = replacePk(endpoints.readingExercise.delete, pk)
    await Vue.axios.delete(endpoint)
  },

  async submitAnswers (pk: ReadingExercise['pk'], payload: ReadingExerciseSubmitAnswersReq[]): Promise<void> {
    const endpoint = replacePk(endpoints.readingExercise.submitAnswers, pk)
    await Vue.axios.post(endpoint, payload)
  }
}
