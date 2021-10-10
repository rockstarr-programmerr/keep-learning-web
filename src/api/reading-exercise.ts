import Vue from 'vue'
import { ReadingExerciseCreateReq, ReadingExerciseDetailRes, ReadingExerciseListRes } from '@/interfaces/api/reading-exercise'
import { ReadingExercise } from '@/interfaces/reading-exercise'
import { endpoints, replacePk } from './endpoints'

export const readingExercise = {
  async list (): Promise<ReadingExerciseListRes> {
    const res = await Vue.axios.get(endpoints.readingExercise.list)
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
  }
}
