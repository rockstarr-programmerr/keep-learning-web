import { ReadingExerciseListRes } from '@/interfaces/api/reading-exercise'
import Vue from 'vue'
import { endpoints } from './endpoints'

export const readingExercise = {
  async list (): Promise<ReadingExerciseListRes> {
    const res = await Vue.axios.get(endpoints.readingExercise.list)
    return res.data
  }

  // async detail (pk: Classroom['pk']): Promise<ClassroomDetailRes> {
  //   const endpoint = replacePk(endpoints.classroom.classroomDetail, pk)
  //   const res = await Vue.axios.get(endpoint)
  //   return res.data
  // },

  // async create (payload: ClassroomCreateReq): Promise<ClassroomDetailRes> {
  //   const res = await Vue.axios.post(endpoints.classroom.classroomCreate, payload)
  //   return res.data
  // }
}
