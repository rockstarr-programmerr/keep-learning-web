import Vue from 'vue'
import { ClassroomListRes, ClassroomDetailRes, ClassroomCreateReq } from '@/interfaces/api/classroom'
import { Classroom } from '@/interfaces/classroom'
import { endpoints, replacePk } from './endpoints'

export const classroom = {
  async list (): Promise<ClassroomListRes> {
    const res = await Vue.axios.get(endpoints.classroom.classroomList)
    return res.data
  },

  async detail (pk: Classroom['pk']): Promise<ClassroomDetailRes> {
    const endpoint = replacePk(endpoints.classroom.classroomDetail, pk)
    const res = await Vue.axios.get(endpoint)
    return res.data
  },

  async create (payload: ClassroomCreateReq): Promise<ClassroomDetailRes> {
    const res = await Vue.axios.post(endpoints.classroom.classroomCreate, payload)
    return res.data
  }
}
