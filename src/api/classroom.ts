import { ClassroomListRes } from '@/interfaces/api/classroom'
import Vue from 'vue'
import { endpoints } from './endpoints'

export const classroom = {
  async list (): Promise<ClassroomListRes> {
    const res = await Vue.axios.get(endpoints.classroom.classroomList)
    return res.data
  }
}
