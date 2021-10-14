import Vue from 'vue'
import { ClassroomListRes, ClassroomDetailRes, ClassroomCreateReq, AddStudentReq, RemoveStudentReq, AddReadingExercisesReq, RemoveReadingExercisesReq, ReadingExerciseReportRes, GetStudentReportReq } from '@/interfaces/api/classroom'
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
  },

  async addStudents (pk: Classroom['pk'], payload: AddStudentReq[]): Promise<void> {
    const endpoint = replacePk(endpoints.classroom.addStudents, pk)
    await Vue.axios.post(endpoint, payload)
  },

  async removeStudents (pk: Classroom['pk'], payload: RemoveStudentReq[]): Promise<void> {
    const endpoint = replacePk(endpoints.classroom.removeStudents, pk)
    await Vue.axios.post(endpoint, payload)
  },

  async addReadingExercises (pk: Classroom['pk'], payload: AddReadingExercisesReq[]): Promise<void> {
    const endpoint = replacePk(endpoints.classroom.addReadingExercises, pk)
    await Vue.axios.post(endpoint, payload)
  },

  async removeReadingExercises (pk: Classroom['pk'], payload: RemoveReadingExercisesReq[]): Promise<void> {
    const endpoint = replacePk(endpoints.classroom.removeReadingExercises, pk)
    await Vue.axios.post(endpoint, payload)
  },

  async getStudentReport (classroomPk: Classroom['pk'], params: GetStudentReportReq): Promise<ReadingExerciseReportRes[]> {
    const endpoint = replacePk(endpoints.classroom.studentReadingReport, classroomPk)
    const res = await Vue.axios.get(endpoint, { params })
    return res.data
  }
}
