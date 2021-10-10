import { ReadingExerciseCreateReq, ReadingExerciseDetailRes, ReadingExerciseListRes } from '@/interfaces/api/reading-exercise'
import Vue from 'vue'
import { endpoints } from './endpoints'

export const readingExercise = {
  async list (): Promise<ReadingExerciseListRes> {
    const res = await Vue.axios.get(endpoints.readingExercise.list)
    return res.data
  },

  // async detail (pk: Classroom['pk']): Promise<ClassroomDetailRes> {
  //   const endpoint = replacePk(endpoints.readingExercise.detail, pk)
  //   const res = await Vue.axios.get(endpoint)
  //   return res.data
  // },

  async create (payload: ReadingExerciseCreateReq): Promise<ReadingExerciseDetailRes> {
    const res = await Vue.axios.post(endpoints.readingExercise.create, payload)
    return res.data
  }
}
