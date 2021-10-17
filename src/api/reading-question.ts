import { ReadingQuestionCreateReq, ReadingQuestionDetailRes, ReadingQuestionListRes, ReadingQuestionUpdateReq } from '@/interfaces/api/reading-question'
import { ReadingQuestion } from '@/interfaces/reading-question'
import Vue from 'vue'
import { endpoints, replacePk } from './endpoints'

export const readingQuestion = {
  async list (exercisePk: ReadingQuestion['pk']): Promise<ReadingQuestionListRes> {
    const res = await Vue.axios.get(endpoints.readingQuestion.list, {
      params: {
        exercise: exercisePk
      }
    })
    return res.data
  },

  async create (payload: ReadingQuestionCreateReq): Promise<ReadingQuestionDetailRes> {
    const res = await Vue.axios.post(endpoints.readingQuestion.create, payload)
    return res.data
  },

  async update (pk: ReadingQuestion['pk'], payload: ReadingQuestionUpdateReq): Promise<ReadingQuestionDetailRes> {
    const endpoint = replacePk(endpoints.readingQuestion.update, pk)
    const res = await Vue.axios.patch(endpoint, payload)
    return res.data
  },

  async delete (pk: ReadingQuestion['pk']): Promise<void> {
    const endpoint = replacePk(endpoints.readingQuestion.delete, pk)
    await Vue.axios.delete(endpoint)
  }
}
